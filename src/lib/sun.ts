import { clamp, css, hex, mix, smoothstep, type RGB } from "./color";
import type { Destination } from "@/data/destinations";

const RAD = Math.PI / 180;

export const HORIZON_Y = 600;

export function dayOfYear(date: Date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86_400_000);
}

/** Reference day used for the first (server) render: 23 October. */
export const DEFAULT_DOY = 296;

export function wrapHour(h: number) {
  return ((h % 24) + 24) % 24;
}

/** Sun altitude (deg) and hour angle (deg, negative = morning) for a local clock hour. */
export function solar(d: Pick<Destination, "lat" | "lon" | "tz">, doy: number, localHour: number) {
  const decl = 23.44 * Math.sin(((2 * Math.PI) / 365) * (284 + doy)) * RAD;
  const solarTime = localHour - d.tz + d.lon / 15;
  const H = ((((solarTime - 12) * 15 + 180) % 360) + 360) % 360 - 180;
  const lat = d.lat * RAD;
  const sinAlt = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(H * RAD);
  return { alt: Math.asin(clamp(sinAlt, -1, 1)) / RAD, H };
}

export function sunTimes(d: Pick<Destination, "lat" | "lon" | "tz">, doy: number) {
  let rise: number | null = null;
  let set: number | null = null;
  const step = 1 / 12;
  let prev = solar(d, doy, 0).alt;
  for (let h = step; h <= 24 + 1e-9; h += step) {
    const cur = solar(d, doy, h).alt;
    if (prev < -0.833 && cur >= -0.833 && rise === null) {
      rise = h - step + (step * (-0.833 - prev)) / (cur - prev);
    }
    if (prev >= -0.833 && cur < -0.833 && set === null) {
      set = h - step + (step * (prev + 0.833)) / (prev - cur);
    }
    prev = cur;
  }
  return { rise, set };
}

/** Local hour at which the evening (or morning) sun crosses the given altitude. */
export function hourForAltitude(
  d: Pick<Destination, "lat" | "lon" | "tz">,
  doy: number,
  alt: number,
  evening: boolean,
) {
  const step = 1 / 30;
  if (evening) {
    for (let h = 12; h <= 24; h += step) {
      if (solar(d, doy, h).alt <= alt) return h;
    }
    return 18;
  }
  for (let h = 0; h <= 12; h += step) {
    if (solar(d, doy, h).alt >= alt) return h;
  }
  return 6;
}

export function formatHour(h: number | null) {
  if (h === null) return "—";
  const total = Math.round(wrapHour(h) * 60) % 1440;
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

type Key = {
  alt: number;
  top: RGB;
  mid: RGB;
  hor: RGB;
  glow: RGB;
  deep: RGB;
};

const keys: Key[] = [
  { alt: -20, top: "#040815", mid: "#0a1330", hor: "#162248", glow: "#1f3270", deep: "#02040c" },
  { alt: -10, top: "#070d2a", mid: "#141d4c", hor: "#2e2f66", glow: "#3a3a86", deep: "#03040e" },
  { alt: -5, top: "#0d1538", mid: "#2a2a63", hor: "#7a4a74", glow: "#c0586a", deep: "#0a0814" },
  { alt: -1, top: "#17265c", mid: "#51467f", hor: "#e98a5c", glow: "#ff7a3c", deep: "#190f1c" },
  { alt: 3, top: "#20387a", mid: "#7a6a93", hor: "#ffb070", glow: "#ff9a4a", deep: "#20141c" },
  { alt: 8, top: "#2b4f90", mid: "#7a9bbf", hor: "#f9d3a0", glow: "#ffcf8a", deep: "#1c2a36" },
  { alt: 20, top: "#235f9f", mid: "#5b9ccb", hor: "#bcdcec", glow: "#fff0c8", deep: "#10303f" },
  { alt: 45, top: "#1b5594", mid: "#4b92c4", hor: "#a9d3e4", glow: "#ffffff", deep: "#0d2c3c" },
].map((k) => ({
  alt: k.alt,
  top: hex(k.top),
  mid: hex(k.mid),
  hor: hex(k.hor),
  glow: hex(k.glow),
  deep: hex(k.deep),
}));

const DAWN_ROSE = hex("#f4a3b4");
const MOON = hex("#dfe6ff");
const SUN_LOW = hex("#ff6a2a");
const SUN_HIGH = hex("#fff3d6");

function sampleKeys(alt: number): Key {
  const a = clamp(alt, keys[0].alt, keys[keys.length - 1].alt);
  for (let i = 0; i < keys.length - 1; i++) {
    const k0 = keys[i];
    const k1 = keys[i + 1];
    if (a >= k0.alt && a <= k1.alt) {
      const t = (a - k0.alt) / (k1.alt - k0.alt);
      const e = t * t * (3 - 2 * t);
      return {
        alt: a,
        top: mix(k0.top, k1.top, e),
        mid: mix(k0.mid, k1.mid, e),
        hor: mix(k0.hor, k1.hor, e),
        glow: mix(k0.glow, k1.glow, e),
        deep: mix(k0.deep, k1.deep, e),
      };
    }
  }
  return keys[keys.length - 1];
}

export type SkyState = {
  vars: Record<string, string>;
  alt: number;
  isNight: boolean;
};

/**
 * Turns a moment of the day at a destination into the CSS custom properties
 * that drive the whole scene (sky, silhouettes, water, sun, moon, stars).
 * `halfWidth` is the half of the SVG viewBox that is actually visible.
 */
export function skyState(
  d: Pick<Destination, "lat" | "lon" | "tz">,
  doy: number,
  localHour: number,
  halfWidth: number,
): SkyState {
  const { alt, H } = solar(d, doy, localHour);
  const k = sampleKeys(alt);

  const twilight = 1 - clamp(Math.abs(alt - 1) / 12, 0, 1);
  const morning = H < 0 ? 1 : 0;
  const hor = mix(k.hor, DAWN_ROSE, morning * twilight * 0.38);
  const glow = mix(k.glow, DAWN_ROSE, morning * twilight * 0.3);

  const sunO = smoothstep(-4, 0.6, alt);
  const moonAlt = -alt;
  const moonO = smoothstep(0, 9, moonAlt) * (1 - smoothstep(-2, 3, alt));

  const spread = halfWidth * 0.52;
  const sunX = 800 + Math.sin(H * RAD) * spread;
  const sunY = HORIZON_Y - (clamp(alt, -20, 45) / 45) * 430;
  const moonX = 800 - Math.sin(H * RAD) * spread;
  const moonY = HORIZON_Y - (clamp(moonAlt, 0, 45) / 45) * 400;

  const sunColor = mix(SUN_LOW, SUN_HIGH, smoothstep(0, 22, alt));
  const sunR = 46 - 16 * smoothstep(0, 30, alt);

  const glowO =
    (alt < 8 ? 0.95 * smoothstep(-9, 1.5, alt) : 0.95 - 0.5 * smoothstep(8, 40, alt)) * (0.25 + 0.75 * Math.max(sunO, 0));
  const nightGlow = (1 - smoothstep(-12, -4, alt)) * moonO * 0.35;

  const starsO = 1 - smoothstep(-15, -5, alt);
  const lightsO = 1 - smoothstep(-8, 1.5, alt);

  const reflSun = sunO * (0.95 - 0.55 * smoothstep(10, 38, alt));
  const reflMoon = moonO * 0.55;
  const reflUseSun = reflSun >= reflMoon;
  const reflX = reflUseSun ? sunX : moonX;
  const reflO = Math.max(reflSun, reflMoon);
  const reflColor = reflUseSun ? sunColor : MOON;

  const farHaze = mix(hor, glow, 0.25 * twilight);
  const layers = [0.12, 0.34, 0.56, 0.78, 0.94].map((t) => mix(farHaze, k.deep, t));

  const seaTop = mix(hor, k.top, 0.42);
  const seaBottom = mix(k.deep, k.top, 0.22);
  const windowColor = mix(hex("#ffd9a0"), hex("#fff4de"), 0.4);

  const vars: Record<string, string> = {
    "--sky-top": css(k.top),
    "--sky-mid": css(k.mid),
    "--sky-hor": css(hor),
    "--glow": css(glow),
    "--glow-o": String(clamp(glowO + nightGlow, 0, 1)),
    "--deep": css(k.deep),
    "--l0": css(layers[0]),
    "--l1": css(layers[1]),
    "--l2": css(layers[2]),
    "--l3": css(layers[3]),
    "--l4": css(layers[4]),
    "--hl": css(mix(hor, hex("#ffffff"), 0.25)),
    "--mist": css(hor),
    "--mist-o": String(0.35 + 0.35 * twilight),
    "--sea-top": css(seaTop),
    "--sea-bot": css(seaBottom),
    "--sun-x": `${sunX.toFixed(1)}px`,
    "--sun-y": `${sunY.toFixed(1)}px`,
    "--sun-o": sunO.toFixed(3),
    "--sun-color": css(sunColor),
    "--sun-s": (sunR / 40).toFixed(3),
    "--moon-x": `${moonX.toFixed(1)}px`,
    "--moon-y": `${moonY.toFixed(1)}px`,
    "--moon-o": moonO.toFixed(3),
    "--stars-o": starsO.toFixed(3),
    "--lights-o": lightsO.toFixed(3),
    "--window": css(windowColor),
    "--refl-x": `${reflX.toFixed(1)}px`,
    "--refl-o": reflO.toFixed(3),
    "--refl-color": css(reflColor),
  };

  return { vars, alt, isNight: alt < -4 };
}

/** Samples a CSS gradient that shows the colour of the sky through the whole day. */
export function dayGradient(d: Pick<Destination, "lat" | "lon" | "tz">, doy: number) {
  const stops: string[] = [];
  const n = 48;
  for (let i = 0; i <= n; i++) {
    const h = (i / n) * 24;
    const { alt, H } = solar(d, doy, h);
    const k = sampleKeys(alt);
    const twilight = 1 - clamp(Math.abs(alt - 1) / 12, 0, 1);
    const hor = mix(k.hor, DAWN_ROSE, (H < 0 ? 1 : 0) * twilight * 0.38);
    const c = mix(mix(k.top, k.mid, 0.55), hor, 0.35 + 0.4 * twilight);
    stops.push(`${css(c)} ${((i / n) * 100).toFixed(2)}%`);
  }
  return `linear-gradient(90deg, ${stops.join(", ")})`;
}
