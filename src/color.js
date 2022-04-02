export default class Color {
  values = [0, 0, 0, 1];

  fromHex(hex) {
    if (hex.length == 3) {
      const arr = [...hex];
      for (let i = 0; i < arr.length; i += 2) arr.splice(i, 0, arr[i]);
      hex = arr.join("");
    }

    if (hex.length == 6) hex += "ff";

    const components = hex.match(/([a-f\d]{2})/gi);
    this.values = components
      .slice(0, 3)
      .map((c) => parseInt(c, 16))
      .map((i) => i);
    this.values.push(parseInt(components[3], 16) / 255);

    return this;
  }

  fromRGB(r, g, b) {
    this.values = [r, g, b, 1];
    return this;
  }

  withOpacity(a) {
    this.values[3] = a;
    return this;
  }

  multiply(value) {
    this.values.map((c) => c * value);
    return this;
  }
}

Color.prototype.toString = function () {
  var str = "rgba(";
  for (let i = 0; i < this.values.length - 1; i++)
    str += `${this.values[i] * 255}, `;
  return str + `${this.values[3]})`;
};

export function loadColorset(colors) {
  const set = [];
  for (const entry of colors) {
    const count = entry.count ? entry.count : 1;
    for (let i = 0; i < count; i++) set.push(new Color().fromHex(entry.color));
  }

  return set;
}
