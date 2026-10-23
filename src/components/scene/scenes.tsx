import type { CSSProperties, ReactNode } from "react";
import type { SceneId } from "@/data/destinations";
import { curtainWall, dune, eagle, poly, ridge, ridgeLine, smooth, waterfall, watchtower, type Pt } from "./art";

const H = 600;

const fill = (name: string): CSSProperties => ({ fill: `var(--${name})` });

function line(d: string, opacity = 0.28) {
  return <path d={d} fill="none" stroke="var(--hl)" strokeWidth={1.15} opacity={opacity} />;
}

function strata(seed: number, base: number, from: number, to: number, amp = 8) {
  return ridgeLine({ seed, base, amp, wavelength: 180, octaves: 2, from, to, step: 16 });
}

/* ------------------------------------------------------------------ Sulak */
/* Gorge from the rim. Walls overlap under a narrow river, so the cut reads as water, not sky. */

function banks(pts: Pt[], widths: number[]) {
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    let dx = next[0] - prev[0];
    let dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const w = widths[i];
    left.push([pts[i][0] - dy * w, pts[i][1] + dx * w] as Pt);
    right.push([pts[i][0] + dy * w, pts[i][1] - dx * w] as Pt);
  }
  return { left, right };
}

const sulak = (() => {
  const y0 = 250;
  const y1 = 1040;
  const center: Pt[] = [];
  for (let y = y0; y <= y1; y += 14) {
    const t = (y - y0) / (y1 - y0);
    const x = 1012 + Math.sin(t * Math.PI * 1.55) * 30 + Math.sin(t * Math.PI * 3.1) * 10;
    center.push([Math.round(x * 10) / 10, y]);
  }
  const widths = center.map(([, y]) => {
    const t = (y - y0) / (y1 - y0);
    return 8 + t * 20;
  });
  const { left, right } = banks(center, widths);
  const bedW = widths.map((w) => w + 70);
  const bedBanks = banks(center, bedW);
  const tuck = (bank: Pt[], toward: Pt[], dist: number): Pt[] =>
    bank.map((p, i) => {
      const dx = toward[i][0] - p[0];
      const dy = toward[i][1] - p[1];
      const len = Math.hypot(dx, dy) || 1;
      return [p[0] + (dx / len) * dist, p[1] + (dy / len) * dist] as Pt;
    });
  const leftEdge = tuck(left, center, 16);
  const rightEdge = tuck(right, center, 16);
  const leftWall = poly([
    [-80, 1040],
    [-80, 500],
    [140, 450],
    [380, 350],
    [620, 268],
    [820, 214],
    [940, 206],
    [990, 232],
    ...leftEdge,
  ]);
  const rightWall = poly([
    ...rightEdge,
    [1700, 1040],
    [1700, 520],
    [1580, 430],
    [1420, 280],
    [1260, 176],
    [1120, 188],
    [1048, 230],
  ]);
  const rightLedge = poly([
    [1200, 470],
    [1680, 430],
    [1680, 500],
    [1260, 545],
  ]);
  const rightLedge2 = poly([
    [1240, 620],
    [1680, 590],
    [1680, 655],
    [1300, 690],
  ]);
  const leftNear = poly([
    [-80, 1040],
    [40, 1040],
    [300, 760],
    [520, 640],
    [680, 670],
    [620, 860],
    [740, 1040],
  ]);
  return {
    leftWall,
    rightWall,
    rightLedge,
    rightLedge2,
    leftNear,
    bed: smooth([...bedBanks.left, ...bedBanks.right.reverse()], true, 0.35),
    river: smooth([...left, ...right.reverse()], true, 0.35),
    wake: smooth(center, false, 0.35),
    dune: dune(1460, 1760, 660, 1630, 470),
  };
})();

function SulakScene() {
  return (
    <g>
      <path d={sulak.bed} style={fill("l3")} />
      <path d={sulak.leftWall} style={fill("l3")} />
      <path d={sulak.rightWall} style={fill("l2")} />
      <path d={sulak.rightLedge} style={fill("l3")} />
      <path d={sulak.rightLedge2} style={fill("l4")} />
      {line(strata(3, 250, 1160, 1560, 3), 0.45)}
      {line(strata(4, 310, 1180, 1600, 3), 0.36)}
      {line(strata(6, 375, 1200, 1620, 3), 0.3)}
      {line(strata(8, 560, 1280, 1640, 3), 0.28)}
      <path d={sulak.leftNear} style={fill("l4")} />
      {line(strata(12, 280, 180, 860, 3), 0.2)}
      {line(strata(13, 360, 140, 800, 3), 0.16)}
      <path d={sulak.river} fill="url(#sea-grad)" />
      <path d={sulak.wake} fill="none" stroke="var(--hl)" strokeWidth={1.25} opacity={0.7} />
      <path d={sulak.dune} style={fill("l0")} />
    </g>
  );
}

/* ---------------------------------------------------------------- Derbent */
/* Naryn-Kala: a long crenellated wall on a ridge, square towers, a thin Caspian band. */

const derbent = (() => {
  const rock = poly([
    [-60, H],
    [-60, 560],
    [180, 530],
    [460, 470],
    [760, 390],
    [1040, 330],
    [1280, 360],
    [1500, 430],
    [1660, 480],
    [1660, H],
  ]);
  const base = 392;
  const towers = [760, 900, 1220, 1360]
    .map((x, i) => watchtower(x, base + 12, 64 + (i % 2) * 28, 36 + (i % 2) * 8))
    .join("");
  const keep = watchtower(1060, base - 2, 132, 78);
  const wall = curtainWall(740, 1420, base + 14, 28);
  return { rock, walls: wall + towers + keep };
})();

function DerbentScene() {
  return (
    <g>
      <path d={ridge({ seed: 31, base: 575, amp: 14, wavelength: 640, octaves: 2, bottom: H })} style={fill("l0")} />
      <path d={derbent.rock} style={fill("l2")} />
      {line(strata(33, 430, 700, 1480, 5))}
      <path d={derbent.walls} style={fill("l4")} />
      <rect x={-60} y={H - 8} width={1720} height={52} fill="url(#sea-grad)" />
    </g>
  );
}

/* ------------------------------------------------------------------ Gunib */
/* Table plateau, a sheer drop into the gorge, one eagle. */

const gunib = (() => {
  const plateau = poly([
    [680, 1040],
    [700, 430],
    [760, 318],
    [1040, 300],
    [1180, 328],
    [1210, 470],
    [1235, 1040],
  ]);
  const farSide = poly([
    [1360, 1040],
    [1325, 560],
    [1400, 390],
    [1560, 340],
    [1660, 360],
    [1660, 1040],
  ]);
  return { plateau, farSide };
})();

function GunibScene() {
  return (
    <g>
      <path d={ridge({ seed: 41, base: 575, amp: 18, wavelength: 520, octaves: 2, bottom: H })} style={fill("l0")} />
      <path d={gunib.farSide} style={fill("l2")} />
      <path d={gunib.plateau} style={fill("l3")} />
      {line(strata(44, 330, 760, 1160, 4))}
      {line(strata(45, 520, 760, 1160, 8), 0.18)}
      <path d={eagle(1040, 228, 1.15)} style={fill("l4")} />
    </g>
  );
}

/* --------------------------------------------------------------- Khunzakh */
/* Empty sky, a plateau lip, Tobot as one narrow fall. */

const khunzakh = (() => {
  const lip = poly([
    [700, 1040],
    [720, 500],
    [860, 390],
    [1000, 348],
    [1048, 372],
    [1072, 1040],
  ]);
  const farRim = poly([
    [1210, 1040],
    [1184, 530],
    [1260, 410],
    [1400, 370],
    [1460, 1040],
  ]);
  return { lip, farRim, fall: waterfall(1128, 358, 700, 28) };
})();

function KhunzakhScene() {
  return (
    <g>
      <path d={ridge({ seed: 51, base: 586, amp: 10, wavelength: 760, octaves: 2, bottom: H })} style={fill("l0")} />
      <path d={khunzakh.farRim} style={fill("l1")} />
      <path d={khunzakh.lip} style={fill("l3")} />
      {line(strata(52, 360, 900, 1140, 3))}
      <path d={khunzakh.fall} style={fill("hl")} />
      <ellipse cx={1140} cy={688} rx={78} ry={16} style={{ ...fill("mist"), opacity: "calc(var(--mist-o) * 0.55)" }} />
      <g fill="none" stroke="var(--hl)" strokeWidth={1.2} opacity={0.32} strokeLinecap="round">
        <path d="M220 240h80M280 268h46" />
        <path d="M470 190h60" />
      </g>
    </g>
  );
}

/* -------------------------------------------------------------------- Goor */
/* Watchtowers on the lip, a tight gorge beside them. */

const goor = (() => {
  const lipY = 458;
  const cliff = poly([
    [-40, 1040],
    [40, 640],
    [260, 560],
    [500, lipY + 48],
    [680, lipY],
    [1160, lipY],
    [1210, 720],
    [1240, 1040],
  ]);
  const wall = poly([
    [1340, 1040],
    [1310, 540],
    [1360, 320],
    [1460, 240],
    [1540, 300],
    [1540, 1040],
  ]);
  const sunk = lipY + 14;
  const towers = [
    watchtower(760, sunk, 112, 50),
    watchtower(860, sunk, 158, 58),
    watchtower(980, sunk, 186, 66),
    watchtower(1090, sunk, 128, 52),
  ].join("");
  return { cliff, wall, towers };
})();

function GoorScene() {
  return (
    <g>
      <path d={ridge({ seed: 61, base: 568, amp: 16, wavelength: 480, octaves: 2, bottom: H })} style={fill("l0")} />
      <path d={goor.wall} style={fill("l2")} />
      {line(strata(62, 340, 1220, 1400, 8))}
      <g style={fill("l3")}>
        <path d={goor.cliff} />
        <path d={goor.towers} />
      </g>
    </g>
  );
}

export const scenes: Record<SceneId, () => ReactNode> = {
  sulak: SulakScene,
  derbent: DerbentScene,
  gunib: GunibScene,
  khunzakh: KhunzakhScene,
  goor: GoorScene,
};
