import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync, mkdirSync } from "node:fs";
const root = "public/assets";
const kinds = [
  "ruby",
  "amber",
  "citrine",
  "jade",
  "beryl",
  "sapphire",
  "amethyst",
];
const hues = [352, 28, 49, 139, 179, 218, 277];
const sides = [8, 6, 10, 4, 7, 5, 9];
function poly(c, pts, fill, stroke = "#091626", width = 2) {
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.fillStyle = fill;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke();
  }
}
function gem(kind, strain, turn = 0) {
  let cv = createCanvas(64, 64),
    c = cv.getContext("2d");
  let i = kinds.indexOf(kind),
    h = i < 0 ? 0 : hues[i],
    n = i < 0 ? 6 : sides[i],
    r = 27;
  let p = Array.from({ length: n }, (_, j) => {
    let a = -Math.PI / 2 + (j * 2 * Math.PI) / n + turn;
    return [32 + Math.cos(a) * r, 32 + Math.sin(a) * r];
  });
  c.shadowColor = i < 0 ? "#bff9ff" : `hsl(${h} 95% 62%)`;
  c.shadowBlur = 7;
  poly(c, p, i < 0 ? "#c5ebf0" : `hsl(${h} 70% 38%)`);
  c.shadowBlur = 0;
  poly(c, p, null, "#d8f9ff", 1.5);
  let center = [32, 32];
  for (let j = 0; j < n; j++) {
    let a = p[j],
      b = p[(j + 1) % n];
    poly(
      c,
      [a, b, center],
      i < 0
        ? `hsla(${j * 48} 95% ${j % 2 ? 70 : 48}% / .85)`
        : `hsl(${h + (j % 2 ? 7 : -7)} ${j % 2 ? 82 : 68}% ${j % 3 === 0 ? 62 : 42}%)`,
      null,
    );
    c.beginPath();
    c.moveTo(32, 32);
    c.lineTo(...a);
    c.strokeStyle = "rgba(230,255,255,.35)";
    c.lineWidth = 1;
    c.stroke();
  }
  poly(
    c,
    [
      [24, 22],
      [32, 13],
      [40, 22],
      [32, 31],
    ],
    "rgba(255,255,255,.36)",
    null,
  );
  if (strain) {
    c.strokeStyle = strain === 3 ? "#fff4c5" : "#182037";
    c.lineWidth = strain === 3 ? 2.5 : 1.6;
    c.beginPath();
    c.moveTo(17, 15);
    c.lineTo(27, 27);
    c.lineTo(22, 38);
    if (strain >= 2) {
      c.lineTo(38, 42);
      c.moveTo(27, 27);
      c.lineTo(45, 19);
    }
    if (strain >= 3) {
      c.moveTo(22, 38);
      c.lineTo(14, 47);
      c.moveTo(38, 42);
      c.lineTo(47, 52);
      c.beginPath();
      c.arc(32, 32, 27, 0, Math.PI * 2);
      c.strokeStyle = "rgba(255,226,149,.8)";
      c.stroke();
    } else c.stroke();
  }
  return cv.toBuffer("image/png");
}
for (let i = 0; i < 7; i++) {
  for (let s = 0; s < 4; s++)
    writeFileSync(`${root}/gems/${kinds[i]}-${s}.png`, gem(kinds[i], s));
  mkdirSync(`${root}/gems/break/${kinds[i]}`, { recursive: true });
  for (let f = 0; f < 6; f++) {
    let cv = createCanvas(64, 64),
      c = cv.getContext("2d");
    let base = gem(kinds[i], Math.min(f, 3));
    const { Image } = await import("@napi-rs/canvas");
    let im = new Image();
    im.src = base;
    c.globalAlpha = 1 - f / 7;
    for (let q = 0; q < 4; q++) {
      c.save();
      c.translate(
        32 + (q % 2 ? 1 : -1) * f * 2.4,
        32 + (q < 2 ? -1 : 1) * f * 2.4,
      );
      c.rotate((q - 1.5) * f * 0.08);
      c.beginPath();
      c.rect(q % 2 ? -0 : -32, q < 2 ? -32 : 0, 32, 32);
      c.clip();
      c.drawImage(im, -32, -32);
      c.restore();
    }
    writeFileSync(
      `${root}/gems/break/${kinds[i]}/${f}.png`,
      cv.toBuffer("image/png"),
    );
  }
}
for (let s = 0; s < 4; s++)
  writeFileSync(`${root}/gems/prism-${s}.png`, gem("prism", s));
mkdirSync(`${root}/gems/prism-turn`, { recursive: true });
for (let f = 0; f < 8; f++)
  writeFileSync(
    `${root}/gems/prism-turn/${f}.png`,
    gem("prism", 0, (f * Math.PI) / 16),
  );
for (const cut of ["brilliant", "star"]) {
  let cv = createCanvas(64, 64),
    c = cv.getContext("2d");
  c.strokeStyle = cut === "star" ? "#fff6bf" : "#ecffff";
  c.lineWidth = 2;
  c.shadowColor = c.strokeStyle;
  c.shadowBlur = 7;
  c.beginPath();
  if (cut === "star") {
    for (let j = 0; j < 8; j++) {
      let a = (j * Math.PI) / 4,
        r = j % 2 ? 10 : 29;
      c.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r);
    }
  } else {
    for (let j = 0; j < 16; j++) {
      let a = (j * Math.PI) / 8,
        r = j % 2 ? 24 : 29;
      c.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r);
    }
  }
  c.closePath();
  c.stroke();
  writeFileSync(`${root}/gems/${cut}.png`, cv.toBuffer("image/png"));
}
{
  let cv = createCanvas(640, 640),
    c = cv.getContext("2d");
  let g = c.createLinearGradient(0, 0, 640, 640);
  g.addColorStop(0, "#29445b");
  g.addColorStop(0.5, "#0b2034");
  g.addColorStop(1, "#52788a");
  c.fillStyle = g;
  c.fillRect(0, 0, 640, 640);
  c.strokeStyle = "#bfddda";
  c.lineWidth = 3;
  c.strokeRect(12, 12, 616, 616);
  c.strokeStyle = "#527d8e";
  c.lineWidth = 8;
  c.strokeRect(25, 25, 590, 590);
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++) {
      c.fillStyle = (i + j) % 2 ? "#10273b" : "#122d42";
      c.fillRect(32 + i * 72, 32 + j * 72, 72, 72);
      c.strokeStyle = "#30546a";
      c.lineWidth = 1;
      c.strokeRect(32 + i * 72, 32 + j * 72, 72, 72);
      c.fillStyle = "#5f91a2";
      for (let a of [
        [9, 9],
        [63, 9],
        [9, 63],
        [63, 63],
      ]) {
        c.beginPath();
        c.arc(32 + i * 72 + a[0], 32 + j * 72 + a[1], 1.5, 0, 7);
        c.fill();
      }
    }
  writeFileSync(`${root}/gems/frame.png`, cv.toBuffer("image/png"));
}
for (const [name, count, loop, color] of [
  ["clear", 16, false, "#bdefff"],
  ["flawed", 38, false, "#ffe19d"],
  ["cut-flash", 24, false, "#ffffff"],
  ["cut-aura", 4, true, "#bdefff"],
]) {
  const sys = {
    dimensions: 2,
    field: { width: 128, height: 128 },
    durationMs: loop ? 1000 : 600,
    fps: 60,
    loop,
    emitters: [
      {
        name: "sparks",
        shape: "point",
        position: [64, 64, 0],
        extent: { radius: 0, size: [0, 0, 0] },
        emission: loop
          ? { mode: "rate", rate: 8 }
          : { mode: "burst", count, atMs: 0 },
        lifetimeMs: loop ? 500 : 400,
        lifetimeSpread: 100,
        speed: loop ? 12 : name === "flawed" ? 105 : 65,
        speedSpread: 20,
        direction: [0, 1, 0],
        coneAngle: 360,
        particle: {
          sizeCurve: { interp: "linear", from: loop ? 0.6 : 1.2, to: 0 },
          opacityCurve: { interp: "linear", from: 0.95, to: 0 },
          colorGradient: [
            { at: 0, color },
            { at: 1, color: "#5b8fa6" },
          ],
        },
      },
    ],
    forces: { gravity: loop ? 0 : 60, drag: 1.5 },
  };
  writeFileSync(`${root}/fx/${name}.json`, JSON.stringify(sys));
}
