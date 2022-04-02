import Color from "./color.js";

export const alphabets = {
  katakanas:
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン",
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  dot: ".",
  quaterFill: "░",
  halfFill: "▒",
  fill: "▓",
  binary: "10",
  lem: "lem",
};

export const colorSets = {
  green: [{ color: "FFF" }, { color: "0000007F" }, { color: "0F0" }],
  white: [{ color: "FFF" }],
  rainbow: [
    { color: "F00" },
    { color: "F00" },
    { color: "FF7F00" },
    { color: "FF7F00" },
    { color: "FFFF00" },
    { color: "FFFF00" },
    { color: "0F0" },
    { color: "0F0" },
    { color: "00F" },
    { color: "0000FF" },
    { color: "2E2B5F" },
    { color: "2E2B5F" },
    { color: "8B00FF" },
    { color: "8B00FF" },
  ],
  zeinitsu: [
    { color: "FFBD19" },
    { color: "FFC414" },
    { color: "FFD930" },
    { color: "FFE856" },
    { color: "FFEA68" },
  ],
};

export const layers = [
  {
    fontSize: 16,
    speed: 1,
    brightness: 1,
    filter: "none",
  },
  {
    fontSize: 16,
    speed: 1,
    brightness: 1,
    filter: "blur(5px)",
  },
];
