// TODO: for some reason the app can start with canvas size 0, 0 but this can be fixed with force reload.
// This issue only occurs when trying to use katakanas

// TODO: create detph layers
// stack canvases
// everything on a layer has the same
// - size
// - speed
// - brightness
// - blur

// TODO: random range is broken
// TODO: clear trails (atm they leave marks cos transparency filter can't completely wipe them out)
// TODO: clear trails is optional
// TODO: head glow
// TODO: add blur
// TODO: super small font size
// TODO: gradient background
// TODO: variable alphabet
// TODO: color map
// TODO: no tail color map?
// TODO: words instead of characters
// TODO: add text overlap (instead of re-writing the exact one)
// TODO: remove start fade
// TODO: add gretting pulse
// TODO: window scaling
// TODO: add pause
// TODO: draw shapes
// TODO: container styling

import Color from "./color";
import { layers } from "./config";
import Trail from "./trail";

const fontSize = 16;

const background = new Color().fromRGB(0, 0, 0);
const backgroundOpacity = 0.05;
const respawn = 0.975; // chance of a drop index getting reset after it falls off screen
const fps = 40;
const interval = 1000 / fps;
const minSpeed = fontSize;
const maxSpeed = fontSize;
var last: number;
const width = window.innerWidth;
const height = window.innerHeight;

const columns: Trail[] = [];
for (let i = 0; i < width / fontSize; i++) {
  columns.push(
    new Trail(
      i * fontSize,
      0, // TODO variate
      fontSize,
      height,
      minSpeed,
      maxSpeed,
      Math.floor(Math.random() * layers.length),
      respawn,
      background.withOpacity(backgroundOpacity)
    )
  );
}

function createCanvas(layer: number) {
  const canvas = document.createElement("canvas");
  canvas.id = layer.toString();
  canvas.width = width;
  canvas.height = height;
  canvas.style.zIndex = layer.toString();
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.position = "absolute";

  const ctx = canvas.getContext("2d");
  ctx.font = fontSize + "px monospace";

  document.getElementById("container")!.appendChild(canvas);
}

function draw() { 
  for (let layer = 0; layer < layers.length; layer++) {
    const ctx = (<HTMLCanvasElement>document.getElementById(layer.toString())).getContext("2d");
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].layerIndex != layer) continue;

      columns[i].write(ctx);
      columns[i].move();
    }
  }
}

function update(current: number) {
  if (!last) last = performance.now();
  requestAnimationFrame(update);
  const dt = current - last;
  if (dt >= interval) {
    last = current - (dt % interval);
    draw();
  }
}

function main() {
  for (let i = 0; i < layers.length; i++) createCanvas(i);
  requestAnimationFrame(update);
}

main();
