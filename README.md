# rain

A wallpaper engine.

## Drawing Trails

The application uses an HTML `canvas`'s 2D content to draw graphics to the screen. This important because of the way that the canvas renders content. The HTML canvas will draw whatever you tell it to draw, but will not reset itself, so each draw call will draw content _over_ what is already on the canvas.

The animation is achived with the drawing algorithm, which draws characters onto the screen. This function uses an array of columns, where each position in this array represents a column of the screen (_`columns = cavnas.width / fontSize`_). A _trail_ is the set of visible characters in a column, each trail has a _head_, which is the lowest (bottom-most) character of the trail. Because of how trails are drawn, the head of the trail is the youngest character (time-wise).

Each element of the array used by the drawing algorithm represents the position of the head of the trail for that column. For example, `columns = [1, 3, 5]` shows a set of three columns, where the first column's trail's head is at row 1, the second trail's head is at row 3 and the third trail's head is at row 5. The drawing algorithm iterates over each head position, picks a random character and displays that character in the corresponding position on the screen. The cooridinates of this position are found by `(columnIndex, head)`. After displaying the character, the algorihtm then moves the head by some amount by updating the value held in the array. If any of the heads represent off-screen positions, they are reset to the top. Repeated calls to the drawing algorithm will cause the heads to move down the screen, diplaying characters as they go and resetting to the top if they reach the bottom of the screen.

This means that the drawing algorithm can draw columns of characters onto the screen. Rememeber how the application uses a `canvas` to draw graphics? Because of this, the drawing algorihtm will fill the canvas with characters by the time it reaches the bottom (because the canvas is never reset), which also means that when the heads reset, they'll draw the new characters _on top_ of the old trails. This is not ideal, so the beginning of the algorithm will draw a transparent black rectangle on the canvas that covers the canvas' size. If we step through the process, you can see how this fixes our problem.

On the very first call to the algorithm, we draw the transparent black rectangle. This has no effect since the canvas doesn't contain anything yet. then we draw the first row of characters using the technique described above and now the canvas has one row of characters on it, completing the first call. On the second call to the algorihtm, we draw the transparent black rectangle. Remember, the row drawn by the last call is _still_ on the canvas. The transparent recangle is drawn _over_ the existing content meaning that after the rectangle has been drawn, everything on the canvas has 50% opacity (if the rectangle was 50% opaque). This basically applies a transparency filter to the existing content of the canvas. After this, we draw our next row and complete the second call. Now, for the third call, we apply our transparency filter again. Considering the content of the first row was already 50% opaque, reapplying the filter to this row will result in a 25% opacity for the row. The second row was completely opaque, so will become 50% opaque. Then we draw the third row, completing the third call.

As you can see, repeated calls to the drawing algorihtm will re-apply our transparency filter, creating a fade-out effect on older content of the canvas. But what about trails? The transparency filter will fade out old rows, but each trail will move uniformly from the top to the bottom, at the same time. To make each trail move independetly of the group, when they reach the bottom, we'll reset their position to the top **depending on some chance factor**. This means that No head is _guaranteed_ to reset on in the same frame it moved off the screen. For the first traversal from the top to the bottom of the screen, all the trails will move together, but when they reach the bottom, only _some_ of them will be reset to the top, and the other will be reset later. This means that they will re-appear at the top at different times, making each column act individually.

## Update Regulation

When creating animations, it is important to manage how often calculations are performed in the program. Draw calls are invoked by the web engine's `requestAnimationFrame()` function. This function takes a callback as a parameter, which gets invoked on the browser's next frame update. To repeatedly invoke a function, `requestAnimationFrame()` has to be used recursively inside the function being invoked. For example on a 60Hz system, the follwing code:

```js
function log() {
  console.log("hello");
  requestAnimationFrame(log);
}

requestAnimationFrame(log);
```

Will invoke the `log` function once every 16 (ish) milliseconds. This can be become an issue for our animation, since we move the heads of the trails on each update. Considering the fact that `requestAnimationFrame()` per frame update, **systems running higher refresh rates would run the animation faster**, because the head positions would get updated more often. To circumvent this, `requestAnimationFrame()` passes a single argument into its callback, can be used to calculate the time elapsed since the last frame update. First we move the next frame request to the start of the function. This is so that in slower environments, we get updates as fast as possible. We also want to accpet this timing parameter in the signature of the callback:

```js
function log(currentTime) {
  requestAnimationFrame(log);
  console.log("hello");
}
```

Now we can calculate the difference in time between the last time and the current time:

```js
var lastTime = Date.now();

function log(currentTime) {
  requestAnimationFrame(log);

  dt = currentTime - lastTime;

  console.log("hello");
}
```

> _Where `dt` stands for "delta time"._

Okay, but how do we limit the update rate of faster systems? Well if we calculate our _desired_ interval between `log()` calls, we can compare this to the interval we actually have, and use this comaprison to decide if we log to the console or not:

```js
const interval = 1000 / fps;
var lastTime = performance.now();

function log(currentTime) {
  requestAnimationFrame(log);

  dt = currentTime - lastTime;
  if (dt >= interval) {
    lastTime = currentTime - (dt % interval);
    console.log("hello");
  }
}
```

Notice how, we also have to update the `lastTime` variable. This allows subsequent calls can have accurate comparisons to the time of the last call. We subtract `(dt % interval)` from `currentTime` before assigning `currentTime` to `lastTime`, which is a **very important step**. This technique only has the capability to decide if it should skip a frame when it is called. Consider a 60Hz display on which we want to call `log()` at 50 updates per second (every 20 milliseconds). `requestAnimationFrame()` will be called every 16 milliseconds and for this example, we'll ignore the subtraction of the modulo result.

Going from the start, when `log()` invoked, only 16ms has passed so we skip the first update. Then, by the second time `log()` is invoked again, 32ms has passed (since the start) so we continue the update and set `lastTime` to `currentTime`. However, we missed our target by 12ms, and will continue to do so for as long as we use the same method. In this case we end up skipping every other update so actually run at 30 updates per second!

To fix this, when we reset `lastTime`, we remember that we waited 12ms too long by subtracting the amount we ran over by from `currentTime`. This means that `lastTime` holds the time where the update _should_ have happened instead of the time it actually happened, since the time it actually happened was too late so if we make calculations from that, we'll assume that we updated when we actually didn't.

Now we can regulate updates across different system, without needing to worry about faster systems having more updates. **However**, remember that _"this technique only has the capability to decide if it should skip a frame when it is called"_, there's nothing we can do to run _extra_ updates if `requestAnimationFrame()` invokes its callback _slower_ than our desired interval. In this case every update will be processed, as if there were no limits on them at all.

> Note, if your're wondering _"why use `requestAnimationFrame()` at all if it makes everything so complex? just use `setInterval()`."_ The answer is that `requestAnimationFrame()` is optimised for performing frame updates, so has many performance benefits over a plan javascript interval.
