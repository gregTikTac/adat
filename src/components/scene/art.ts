export type Pt = [number, number];

export const r1 = (n: number) => Math.round(n * 10) / 10;

export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n1 = (n: number) => Math.round(n * 10) / 10;
const p = (x: number, y: number) => `${n1(x)} ${n1(y)}`;

export function poly(points: Pt[], close = true) {
  return `M${points.map(([x, y]) => p(x, y)).join("L")}${close ? "Z" : ""}`;
}

/** Smooth closed or open curve through the points (Catmull-Rom to cubic Bézier). */
export function smooth(points: Pt[], closed = true, tension = 0.5) {
  const n = points.length;
  const at = (i: number): Pt =>
    closed ? points[(i + n) % n] : points[Math.min(n - 1, Math.max(0, i))];
  let d = `M${p(...points[0])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    d += `C${p(...c1)} ${p(...c2)} ${p(...p2)}`;
  }
  return closed ? `${d}Z` : d;
}

type RidgeOpts = {
  seed: number;
  base: number;
  amp: number;
  /** Base wavelength in px. */
  wavelength?: number;
  octaves?: number;
  gain?: number;
  from?: number;
  to?: number;
  step?: number;
  bottom?: number;
  shape?: (x: number) => number;
};

export function ridgeY(o: RidgeOpts) {
  const r = rng(o.seed);
  const octaves = o.octaves ?? 4;
  const gain = o.gain ?? 0.5;
  const wl = o.wavelength ?? 420;
  const phases = Array.from({ length: octaves }, () => r() * Math.PI * 2);
  const weights = Array.from({ length: octaves }, (_, i) => gain ** i);
  const total = weights.reduce((a, b) => a + b, 0);
  return (x: number) => {
    let v = 0;
    for (let i = 0; i < octaves; i++) {
      v += weights[i] * Math.sin((x / wl) * Math.PI * 2 * 2 ** i + phases[i]);
    }
    const noise = (v / total) * 0.5 + 0.5;
    return o.base - o.amp * noise - (o.shape ? o.shape(x) : 0);
  };
}

export function ridge(o: RidgeOpts) {
  const f = ridgeY(o);
  const from = o.from ?? -40;
  const to = o.to ?? 1640;
  const step = o.step ?? 10;
  const bottom = o.bottom ?? 1040;
  const pts: Pt[] = [];
  for (let x = from; x <= to; x += step) pts.push([x, f(x)]);
  return `M${p(from, bottom)}L${pts.map(([x, y]) => p(x, y)).join("L")}L${p(to, bottom)}Z`;
}

export function ridgeLine(o: RidgeOpts) {
  const f = ridgeY(o);
  const from = o.from ?? -40;
  const to = o.to ?? 1640;
  const step = o.step ?? 10;
  const pts: Pt[] = [];
  for (let x = from; x <= to; x += step) pts.push([x, f(x)]);
  return `M${pts.map(([x, y]) => p(x, y)).join("L")}`;
}

/** Palm tree: tapered curved trunk plus drooping fronds. */
export function palm(x: number, y: number, h: number, lean: number, seed: number) {
  const r = rng(seed);
  const c: Pt = [x + lean * 0.15, y - h * 0.55];
  const top: Pt = [x + lean, y - h];
  const bez = (t: number): Pt => {
    const u = 1 - t;
    return [u * u * x + 2 * u * t * c[0] + t * t * top[0], u * u * y + 2 * u * t * c[1] + t * t * top[1]];
  };
  const w0 = h * 0.034;
  const w1 = h * 0.013;
  const left: Pt[] = [];
  const right: Pt[] = [];
  const N = 14;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const pt = bez(t);
    const nxt = bez(Math.min(1, t + 0.02));
    const prv = bez(Math.max(0, t - 0.02));
    const dx = nxt[0] - prv[0];
    const dy = nxt[1] - prv[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = w0 + (w1 - w0) * t;
    left.push([pt[0] + nx * w, pt[1] + ny * w]);
    right.push([pt[0] - nx * w, pt[1] - ny * w]);
  }
  const trunk = poly([...left, ...right.reverse()]);

  const fronds: string[] = [];
  const count = 10;
  for (let i = 0; i < count; i++) {
    const a = (-175 + (i / (count - 1)) * 170 + (r() - 0.5) * 12) * (Math.PI / 180);
    const L = h * (0.34 + r() * 0.16);
    const dir: Pt = [Math.cos(a), Math.sin(a)];
    const lift = h * 0.1 * (1 - Math.abs(dir[0]));
    const droop = L * (0.28 + 0.34 * Math.abs(dir[0]));
    const end: Pt = [top[0] + dir[0] * L, top[1] + dir[1] * L * 0.55 + droop];
    const c1: Pt = [top[0] + dir[0] * L * 0.55, top[1] + dir[1] * L * 0.55 - lift];
    const th = L * 0.09;
    const c2: Pt = [c1[0], c1[1] + th * 1.6];
    fronds.push(`M${p(...top)}Q${p(...c1)} ${p(...end)}Q${p(...c2)} ${p(...top)}Z`);
  }
  const nuts = [
    [top[0] - h * 0.012, top[1] + h * 0.018, h * 0.016],
    [top[0] + h * 0.016, top[1] + h * 0.026, h * 0.016],
  ] as const;
  return { trunk, fronds: fronds.join(""), nuts };
}

/** Overwater bungalow with thatched roof on stilts. s = scale, (x, y) = waterline. */
export function villa(x: number, y: number, s: number) {
  const deck = `M${p(x - 40 * s, y - 15 * s)}H${n1(x + 40 * s)}V${n1(y - 11 * s)}H${n1(x - 40 * s)}Z`;
  const body = `M${p(x - 28 * s, y - 15 * s)}V${n1(y - 33 * s)}H${n1(x + 28 * s)}V${n1(y - 15 * s)}Z`;
  const roof = `M${p(x - 42 * s, y - 31 * s)}Q${p(x - 18 * s, y - 40 * s)} ${p(x, y - 66 * s)}Q${p(x + 18 * s, y - 40 * s)} ${p(x + 42 * s, y - 31 * s)}Z`;
  const stilts = [-34, -22, -10, 10, 22, 34]
    .map((dx) => `M${p(x + dx * s - 1.2 * s, y - 11 * s)}H${n1(x + dx * s + 1.2 * s)}V${n1(y + 3 * s)}H${n1(x + dx * s - 1.2 * s)}Z`)
    .join("");
  return `${deck}${body}${roof}${stilts}`;
}

export function dome(cx: number, base: number, rx: number, ry: number) {
  return `M${p(cx - rx, base)}C${p(cx - rx, base - ry * 0.75)} ${p(cx - rx * 0.55, base - ry)} ${p(cx, base - ry)}C${p(cx + rx * 0.55, base - ry)} ${p(cx + rx, base - ry * 0.75)} ${p(cx + rx, base)}Z`;
}

export function minaret(x: number, base: number, h: number, w: number) {
  const top = base - h;
  const shaft = `M${p(x - w / 2, base)}V${n1(top + w * 3)}H${n1(x + w / 2)}V${n1(base)}Z`;
  const balcony = `M${p(x - w * 0.95, top + w * 3.4)}H${n1(x + w * 0.95)}V${n1(top + w * 3)}H${n1(x - w * 0.95)}Z`;
  const upper = `M${p(x - w * 0.36, top + w * 3)}V${n1(top + w * 1.4)}H${n1(x + w * 0.36)}V${n1(top + w * 3)}Z`;
  const cap = `M${p(x - w * 0.62, top + w * 1.4)}L${p(x, top - w * 1.6)}L${p(x + w * 0.62, top + w * 1.4)}Z`;
  return `${shaft}${balcony}${upper}${cap}`;
}

export function karst(x: number, baseY: number, w: number, h: number, seed: number) {
  const r = rng(seed);
  const j = () => (r() - 0.5) * 0.08;
  const pts: Pt[] = [
    [x - w * 0.5, baseY + 6],
    [x - w * (0.5 + j()), baseY - h * 0.3],
    [x - w * (0.57 + j()), baseY - h * 0.5],
    [x - w * (0.44 + j()), baseY - h * 0.8],
    [x - w * (0.2 + j()), baseY - h * 0.97],
    [x + w * (0.08 + j()), baseY - h],
    [x + w * (0.3 + j()), baseY - h * 0.9],
    [x + w * (0.46 + j()), baseY - h * 0.62],
    [x + w * (0.52 + j()), baseY - h * 0.3],
    [x + w * 0.5, baseY + 6],
  ];
  return smooth(pts, true, 0.9);
}

export function boat(kind: "dhoni" | "longtail" | "ferry", x: number, y: number, s: number) {
  if (kind === "longtail") {
    const hull = `M${p(x - 60 * s, y - 10 * s)}Q${p(x - 20 * s, y + 4 * s)} ${p(x + 40 * s, y + 2 * s)}Q${p(x + 62 * s, y - 2 * s)} ${p(x + 72 * s, y - 16 * s)}Q${p(x + 40 * s, y - 8 * s)} ${p(x - 60 * s, y - 10 * s)}Z`;
    const canopy = `M${p(x - 34 * s, y - 12 * s)}L${p(x - 26 * s, y - 27 * s)}H${n1(x + 14 * s)}L${p(x + 20 * s, y - 11 * s)}Z`;
    const pole = `M${p(x - 62 * s, y - 10 * s)}L${p(x - 108 * s, y - 24 * s)}L${p(x - 108 * s, y - 22.4 * s)}L${p(x - 62 * s, y - 7.6 * s)}Z`;
    return `${hull}${canopy}${pole}`;
  }
  if (kind === "dhoni") {
    const hull = `M${p(x - 50 * s, y - 14 * s)}Q${p(x - 24 * s, y + 5 * s)} ${p(x + 6 * s, y + 4 * s)}Q${p(x + 40 * s, y + 2 * s)} ${p(x + 54 * s, y - 20 * s)}Q${p(x + 6 * s, y - 10 * s)} ${p(x - 50 * s, y - 14 * s)}Z`;
    const mast = `M${p(x - 1.2 * s, y - 10 * s)}H${n1(x + 1.2 * s)}V${n1(y - 78 * s)}H${n1(x - 1.2 * s)}Z`;
    const sail = `M${p(x + 2 * s, y - 76 * s)}Q${p(x + 26 * s, y - 50 * s)} ${p(x + 34 * s, y - 16 * s)}L${p(x + 2 * s, y - 14 * s)}Z`;
    return `${hull}${mast}${sail}`;
  }
  const hull = `M${p(x - 70 * s, y - 18 * s)}H${n1(x + 78 * s)}L${p(x + 62 * s, y)}H${n1(x - 58 * s)}Z`;
  const deck1 = `M${p(x - 54 * s, y - 18 * s)}V${n1(y - 34 * s)}H${n1(x + 54 * s)}V${n1(y - 18 * s)}Z`;
  const deck2 = `M${p(x - 34 * s, y - 34 * s)}V${n1(y - 48 * s)}H${n1(x + 36 * s)}V${n1(y - 34 * s)}Z`;
  const funnel = `M${p(x + 4 * s, y - 48 * s)}V${n1(y - 66 * s)}H${n1(x + 14 * s)}V${n1(y - 48 * s)}Z`;
  return `${hull}${deck1}${deck2}${funnel}`;
}

/** Battered stone tower with a flat crenellated crown. Wide shaft, not a spire. */
export function watchtower(x: number, base: number, h: number, w: number) {
  const crown = base - h;
  const inset = w * 0.06;
  const shaft = `M${p(x - w / 2, base)}L${p(x - w / 2 + inset, crown)}H${n1(x + w / 2 - inset)}L${p(x + w / 2, base)}Z`;
  const span = w - inset * 2;
  const n = w > 46 ? 5 : 3;
  const slot = span / n;
  const merlonH = Math.max(14, w * 0.42);
  let merlons = "";
  for (let i = 0; i < n; i += 2) {
    const mx = x - w / 2 + inset + i * slot;
    merlons += `M${p(mx, crown)}V${n1(crown - merlonH)}H${n1(mx + slot * 0.78)}V${n1(crown)}Z`;
  }
  return shaft + merlons;
}

/** Long curtain wall between two points. */
export function curtainWall(x0: number, x1: number, base: number, h: number) {
  return `M${p(x0, base)}V${n1(base - h)}H${n1(x1)}V${n1(base)}Z`;
}

/** Smooth sand dune. Crest is the high point; the shape closes along the foot. */
export function dune(x0: number, x1: number, foot: number, crestX: number, crestY: number) {
  const rise = foot - crestY;
  const pts: Pt[] = [
    [x0, foot],
    [x0 + (crestX - x0) * 0.42, foot - rise * 0.22],
    [crestX - (crestX - x0) * 0.12, crestY + rise * 0.08],
    [crestX, crestY],
    [crestX + (x1 - crestX) * 0.28, crestY + rise * 0.42],
    [x1, foot],
  ];
  return `${smooth(pts, false, 0.55)}Z`;
}

/** Narrow falling ribbon, wider at the lip and at the plunge pool. */
export function waterfall(x: number, y0: number, y1: number, w: number) {
  return `M${p(x - w * 0.55, y0)}L${p(x - w * 0.28, y0 + (y1 - y0) * 0.45)}L${p(x - w * 0.7, y1)}H${n1(x + w * 0.55)}L${p(x + w * 0.22, y0 + (y1 - y0) * 0.45)}L${p(x + w * 0.45, y0)}Z`;
}

/** One soaring eagle: shallow chevron wings, the vignette from the brand book. (x, y) is the body. */
export function eagle(x: number, y: number, s: number) {
  const wingL = `M${p(x - 2 * s, y)}C${p(x - 22 * s, y - 14 * s)} ${p(x - 52 * s, y - 26 * s)} ${p(x - 86 * s, y - 6 * s)}C${p(x - 52 * s, y + 2 * s)} ${p(x - 20 * s, y + 4 * s)} ${p(x, y + 2 * s)}Z`;
  const wingR = `M${p(x + 2 * s, y - 1 * s)}C${p(x + 28 * s, y - 18 * s)} ${p(x + 58 * s, y - 16 * s)} ${p(x + 92 * s, y + 2 * s)}C${p(x + 58 * s, y + 8 * s)} ${p(x + 26 * s, y + 6 * s)} ${p(x + 2 * s, y + 2 * s)}Z`;
  const body = `M${p(x - 8 * s, y + 1 * s)}Q${p(x + 4 * s, y - 7 * s)} ${p(x + 20 * s, y)}Q${p(x + 6 * s, y + 6 * s)} ${p(x - 8 * s, y + 1 * s)}Z`;
  const tail = `M${p(x - 6 * s, y + 2 * s)}L${p(x - 18 * s, y + 14 * s)}L${p(x - 4 * s, y + 6 * s)}L${p(x + 6 * s, y + 13 * s)}L${p(x + 4 * s, y + 2 * s)}Z`;
  const head = `M${p(x + 16 * s, y - 1 * s)}L${p(x + 30 * s, y - 3 * s)}L${p(x + 18 * s, y + 3 * s)}Z`;
  return `${wingL}${wingR}${body}${tail}${head}`;
}
