import type { CSSProperties, ReactNode } from "react";
import type { SceneId } from "@/data/destinations";
import {
  r1,
  boat,
  dome,
  karst,
  minaret,
  palm,
  poly,
  ridge,
  ridgeLine,
  ridgeY,
  rng,
  villa,
} from "./art";

const H = 600;

const fill = (name: string): CSSProperties => ({ fill: `var(--${name})` });

function Sea({ children }: { children?: ReactNode }) {
  const r = rng(77);
  const lines: ReactNode[] = [];
  for (let i = 0; i < 46; i++) {
    const t = i / 45;
    const y = r1(H + 6 + t ** 1.6 * 380);
    const len = r1(40 + r() * 220 * (0.4 + t));
    const x = r1(r() * 1600 - 60);
    lines.push(
      <rect
        key={i}
        x={x}
        y={y}
        width={len}
        height={r1(0.8 + t * 1.4)}
        rx={1}
        style={{ ...fill("hl"), opacity: r1((0.05 + r() * 0.12) * 10) / 10 }}
      />,
    );
  }
  return (
    <g>
      <rect x={-40} y={H} width={1680} height={500} fill="url(#sea-grad)" />
      {children}
      <g>{lines}</g>
    </g>
  );
}

function Glitter() {
  const r = rng(5);
  const bars: ReactNode[] = [];
  for (let i = 0; i < 34; i++) {
    const t = i / 33;
    const y = r1(H + 5 + t ** 1.5 * 340);
    const w = r1((10 + t * 190) * (0.45 + r() * 0.75));
    bars.push(
      <rect
        key={i}
        className="shimmer"
        x={-w / 2}
        y={y}
        width={w}
        height={r1(1.4 + t * 2.4)}
        rx={1.5}
        style={{ animationDelay: `${(r() * 4).toFixed(1)}s`, animationDuration: `${(2.6 + r() * 2.6).toFixed(1)}s` }}
      />,
    );
  }
  return (
    <g style={{ transform: "translateX(var(--refl-x))", opacity: "var(--refl-o)", fill: "var(--refl-color)", mixBlendMode: "screen" }}>
      <rect x={-3} y={H} width={6} height={400} fill="url(#refl-core)" />
      {bars}
    </g>
  );
}

function Reflection({ href }: { href: string }) {
  return (
    <g mask="url(#refl-mask)" filter="url(#blur-soft)" opacity={0.42}>
      <use href={href} transform={`translate(0 ${H * 2}) scale(1 -1)`} />
    </g>
  );
}

function Foreground({ side, seed }: { side: "left" | "right"; seed: number }) {
  const g = side === "left" ? palm(10, 1000, 880, 230, seed) : palm(1600, 1020, 760, -250, seed);
  return (
    <g style={fill("l4")}>
      <path d={g.trunk} />
      <path d={g.fronds} />
    </g>
  );
}

/* ----------------------------------------------------------------- Maldives */

const mal = (() => {
  const islet = (x0: number, x1: number, hgt: number) => {
    const xm = (x0 + x1) / 2;
    return `M${x0} ${H + 6}Q${xm} ${H - hgt} ${x1} ${H + 6}Z`;
  };
  const far = [islet(190, 360, 9), islet(520, 610, 6), islet(1180, 1330, 10), islet(1420, 1520, 7)].join("");
  const farPalms = [
    ...[250, 270, 300, 326].map((x, i) => palm(x, H - 4, 34 + i * 6, (i % 2 ? 1 : -1) * 5, 10 + i)),
    ...[1230, 1255, 1290].map((x, i) => palm(x, H - 5, 40 + i * 5, (i % 2 ? 1 : -1) * 6, 30 + i)),
  ];

  const nearIslet = `M-40 ${H + 36}Q120 ${H + 10} 260 ${H + 24}Q380 ${H + 30} 470 ${H + 40}V${H + 60}H-40Z`;
  const nearPalms = [
    palm(80, H + 24, 190, 28, 51),
    palm(150, H + 20, 150, -22, 52),
    palm(220, H + 26, 210, 34, 53),
    palm(300, H + 30, 120, -18, 54),
  ];

  const p1 = { x: 780, y: 616 };
  const p0 = { x: 1640, y: 760 };
  const ts = [0.04, 0.13, 0.24, 0.37, 0.52, 0.69, 0.88];
  let villas = "";
  for (const t of ts) {
    const e = t ** 1.15;
    const x = p1.x + (p0.x - p1.x) * e;
    const y = p1.y + (p0.y - p1.y) * e;
    villas += villa(x, y, 0.16 + e * 1.0);
  }
  const jetty = poly([
    [p1.x, p1.y - 1],
    [p0.x, p0.y - 14],
    [p0.x, p0.y - 6],
    [p1.x, p1.y + 0.5],
  ]);
  return { far, farPalms, nearIslet, nearPalms, villas, jetty };
})();

export function MaldivesScene() {
  return (
    <g>
      <g id="mal-far" style={fill("l0")}>
        <path d={mal.far} />
        {mal.farPalms.map((p, i) => (
          <g key={i}>
            <path d={p.trunk} />
            <path d={p.fronds} />
          </g>
        ))}
      </g>
      <rect x={-40} y={H - 150} width={1680} height={170} fill="url(#mist-grad)" style={{ opacity: "var(--mist-o)" }} />
      <Sea>
        <Glitter />
      </Sea>
      <g style={fill("l2")}>
        <path d={mal.nearIslet} />
        {mal.nearPalms.map((p, i) => (
          <g key={i}>
            <path d={p.trunk} />
            <path d={p.fronds} />
          </g>
        ))}
      </g>
      <g style={fill("l3")}>
        <path d={mal.jetty} />
        <path d={mal.villas} />
      </g>
      <g className="drift-slow" style={fill("l3")}>
        <path d={boat("dhoni", 1010, H + 40, 0.55)} />
      </g>
      <Foreground side="left" seed={91} />
      <Foreground side="right" seed={92} />
    </g>
  );
}

/* -------------------------------------------------------------------- Dubai */

type Building = { x: number; w: number; top: number };

function buildSkyline(seed: number, from: number, to: number, wMin: number, wMax: number, height: (x: number) => number, base = H + 4) {
  const r = rng(seed);
  const parts: string[] = [];
  const windows: string[] = [];
  const buildings: Building[] = [];
  let x = from;
  while (x < to) {
    const w = wMin + r() * (wMax - wMin);
    const h = Math.max(8, height(x) * (0.55 + r() * 0.75));
    buildings.push({ x, w, top: base - h });
    parts.push(`M${x.toFixed(1)} ${base}V${(base - h).toFixed(1)}H${(x + w).toFixed(1)}V${base}Z`);
    if (r() < 0.32) {
      const sw = w * (0.45 + r() * 0.2);
      const sh = 6 + r() * 14;
      parts.push(`M${(x + (w - sw) / 2).toFixed(1)} ${(base - h).toFixed(1)}v${-sh.toFixed(1)}h${sw.toFixed(1)}v${sh.toFixed(1)}Z`);
    }
    if (r() < 0.14) {
      parts.push(`M${(x + w / 2 - 0.9).toFixed(1)} ${(base - h).toFixed(1)}v-${(14 + r() * 24).toFixed(1)}h1.8v${(14).toFixed(1)}Z`);
    }
    if (h > 34) {
      const rows = Math.min(11, Math.floor((h - 12) / 9));
      for (let row = 0; row < rows; row++) {
        for (let cx = x + 3; cx < x + w - 3; cx += 5) {
          if (r() < 0.2) windows.push(`M${cx.toFixed(1)} ${(base - 10 - row * 9).toFixed(1)}h2.2v3.2h-2.2Z`);
        }
      }
    }
    x += w * (0.82 + r() * 0.3);
  }
  return { path: parts.join(""), windows: windows.join(""), buildings };
}

const dub = (() => {
  const farFn = (x: number) => 26 + 44 * Math.exp(-(((x - 860) / 380) ** 2));
  const midFn = (x: number) => 30 + 130 * Math.exp(-(((x - 900) / 300) ** 2));
  const far = buildSkyline(3, 120, 1500, 12, 26, farFn);
  const mid = buildSkyline(8, 560, 1260, 16, 34, midFn);
  const marina = buildSkyline(12, 1180, 1500, 14, 26, (x) => 40 + 60 * Math.exp(-(((x - 1330) / 120) ** 2)));

  const cx = 860;
  const tiers: [number, number][] = [
    [20, 0],
    [20, -34],
    [16, -34],
    [16, -104],
    [12, -104],
    [12, -178],
    [8.5, -178],
    [8.5, -232],
    [5.5, -232],
    [5.5, -284],
    [2.6, -284],
    [1.1, -346],
  ];
  const rightSide = tiers.map(([dx, dy]) => `${(cx + dx).toFixed(1)} ${(H + 4 + dy).toFixed(1)}`);
  const leftSide = [...tiers].reverse().map(([dx, dy]) => `${(cx - dx).toFixed(1)} ${(H + 4 + dy).toFixed(1)}`);
  const burj = `M${rightSide.join("L")}L${leftSide.join("L")}Z`;

  const ax = 450;
  const arab = `M${ax - 13} ${H + 4}V${H - 138}Q${ax + 52} ${H - 90} ${ax + 26} ${H + 4}Z M${ax - 14.5} ${H - 138}V${H - 204}H${ax - 12.5}V${H - 138}Z M${ax - 74} ${H + 6}Q${ax} ${H - 6} ${ax + 74} ${H + 6}Z`;

  const taperL = (x: number) => -170 * Math.min(1, Math.max(0, (x - 120) / 420)) ** 1.6;
  const taperR = (x: number) => -190 * Math.min(1, Math.max(0, (1500 - x) / 420)) ** 1.6;
  const dL = { seed: 21, base: 700, amp: 80, wavelength: 700, octaves: 3, from: -40, to: 600, shape: taperL };
  const dR = { seed: 22, base: 712, amp: 90, wavelength: 760, octaves: 3, from: 1000, to: 1640, shape: taperR };
  const dunesL = ridge({ ...dL, bottom: 1040 });
  const dunesR = ridge({ ...dR, bottom: 1040 });
  const duneLineL = ridgeLine(dL);
  const duneLineR = ridgeLine(dR);
  return { far, mid, marina, burj, arab, dunesL, dunesR, duneLineL, duneLineR };
})();

export function DubaiScene() {
  return (
    <g>
      <g id="dub-sky">
        <g style={fill("l0")}>
          <path d={dub.far.path} />
        </g>
        <g style={fill("l1")}>
          <path d={dub.mid.path} />
          <path d={dub.marina.path} />
          <path d={dub.arab} />
        </g>
        <g style={fill("l2")}>
          <path d={dub.burj} />
        </g>
      </g>
      <path d={dub.far.windows} style={{ ...fill("window"), opacity: "calc(var(--lights-o) * 0.55)" }} />
      <path d={dub.mid.windows} style={{ ...fill("window"), opacity: "calc(var(--lights-o) * 0.9)" }} />
      <path d={dub.marina.windows} style={{ ...fill("window"), opacity: "calc(var(--lights-o) * 0.9)" }} />
      <rect x={-40} y={H - 150} width={1680} height={170} fill="url(#mist-grad)" style={{ opacity: "var(--mist-o)" }} />
      <Sea>
        <Reflection href="#dub-sky" />
        <Glitter />
      </Sea>
      <g className="drift-slow" style={fill("l3")}>
        <path d={boat("dhoni", 700, H + 46, 0.5)} />
      </g>
      <g>
        <path d={dub.dunesL} style={fill("l4")} />
        <path d={dub.dunesR} style={fill("l4")} />
        <path d={dub.duneLineL} fill="none" strokeWidth={1.6} style={{ stroke: "var(--hl)", opacity: 0.35 }} />
        <path d={dub.duneLineR} fill="none" strokeWidth={1.6} style={{ stroke: "var(--hl)", opacity: 0.35 }} />
      </g>
      <Foreground side="right" seed={93} />
    </g>
  );
}

/* ----------------------------------------------------------------- Istanbul */

const ist = (() => {
  const hillY = ridgeY({ seed: 40, base: 604, amp: 46, wavelength: 700, octaves: 3 });
  const hills = ridge({ seed: 40, base: 604, amp: 46, wavelength: 700, octaves: 3, bottom: H + 6 });

  const r = rng(61);
  const houses = (from: number, to: number, base: (x: number) => number, hMin: number, hMax: number) => {
    let d = "";
    let x = from;
    while (x < to) {
      const w = 8 + r() * 18;
      const h = hMin + r() * (hMax - hMin);
      const b = base(x);
      d += `M${x.toFixed(1)} ${(b + 3).toFixed(1)}V${(b - h).toFixed(1)}`;
      if (r() < 0.4) d += `L${(x + w / 2).toFixed(1)} ${(b - h - 5 - r() * 4).toFixed(1)}L${(x + w).toFixed(1)} ${(b - h).toFixed(1)}`;
      else d += `H${(x + w).toFixed(1)}`;
      d += `V${(b + 3).toFixed(1)}Z`;
      x += w * (0.9 + r() * 0.2);
    }
    return d;
  };

  const rowHill = houses(-20, 1620, (x) => hillY(x) + 4, 6, 20);
  const rowWater = houses(300, 1520, () => H + 3, 8, 30);

  const blue = [
    dome(600, 530, 52, 42),
    dome(548, 551, 28, 24),
    dome(652, 551, 28, 24),
    dome(600, 556, 34, 20),
    `M520 590V530H680V590Z`,
    minaret(498, 590, 168, 8),
    minaret(530, 590, 150, 7),
    minaret(670, 590, 150, 7),
    minaret(702, 590, 168, 8),
  ].join("");

  const hagia = [
    dome(872, 520, 54, 44),
    dome(812, 548, 24, 22),
    dome(932, 548, 24, 22),
    `M814 590V520H930V590Z`,
    `M796 590V552H814V590Z M930 590V552H948V590Z`,
    minaret(790, 590, 184, 8.5),
    minaret(954, 590, 184, 8.5),
  ].join("");

  const galata = `M1236 590V452H1264V590Z M1228 454H1272V446H1228Z M1234 446V428H1266V446Z M1233 428L1250 384L1267 428Z`;

  const hillBase = ridge({ seed: 40, base: 604, amp: 46, wavelength: 700, octaves: 3, bottom: H + 6, from: 440, to: 1100 });
  return { hills, rowHill, rowWater, blue, hagia, galata, hillBase };
})();

export function IstanbulScene() {
  return (
    <g>
      <g id="ist-sky">
        <g style={fill("l0")}>
          <path d={ist.hills} />
        </g>
        <g style={fill("l1")}>
          <path d={ist.rowHill} />
        </g>
        <g style={fill("l2")}>
          <path d={ist.hillBase} />
          <path d={ist.blue} />
          <path d={ist.hagia} />
          <path d={ist.galata} />
        </g>
        <g style={fill("l3")}>
          <path d={ist.rowWater} />
        </g>
      </g>
      <rect x={-40} y={H - 150} width={1680} height={170} fill="url(#mist-grad)" style={{ opacity: "var(--mist-o)" }} />
      <Sea>
        <Reflection href="#ist-sky" />
        <Glitter />
      </Sea>
      <g className="drift-mid" style={fill("l3")}>
        <path d={boat("ferry", 520, H + 48, 0.62)} />
      </g>
      <g className="drift-slow" style={fill("l4")}>
        <path d={boat("ferry", 1260, H + 92, 1.05)} />
      </g>
      <g className="gulls" style={{ stroke: "var(--l4)" }} fill="none" strokeWidth={2.2} strokeLinecap="round">
        <path d="M980 290q9 -9 18 0q9 -9 18 0" />
        <path d="M1040 330q7 -7 14 0q7 -7 14 0" />
        <path d="M920 340q6 -6 12 0q6 -6 12 0" />
      </g>
      <Foreground side="left" seed={94} />
    </g>
  );
}

/* --------------------------------------------------------------------- Bali */

function meru(x: number, y: number, s: number) {
  let d = `M${x - 14 * s} ${y}V${y - 12 * s}H${x + 14 * s}V${y}Z`;
  const tiers = 5;
  for (let k = 0; k < tiers; k++) {
    const w = (34 - k * 5.2) * s;
    const top = y - 12 * s - k * 13 * s;
    d += `M${x - w} ${top}L${x - w * 0.62} ${top - 10 * s}H${x + w * 0.62}L${x + w} ${top}Z`;
    d += `M${x - w * 0.5} ${top}V${top + 2.6 * s}H${x + w * 0.5}V${top}Z`;
  }
  const apex = y - 12 * s - tiers * 13 * s;
  d += `M${x - 1 * s} ${apex + 2 * s}L${x} ${apex - 22 * s}L${x + 1 * s} ${apex + 2 * s}Z`;
  return d;
}

const bali = (() => {
  const volcano = (cx: number, w: number, hgt: number, seed: number) => {
    const f = ridgeY({ seed, base: 584, amp: 14, wavelength: 90, octaves: 3, shape: (x) => hgt * Math.max(0, 1 - Math.abs(x - cx) / w) ** 1.55 });
    const pts: string[] = [];
    for (let x = cx - w; x <= cx + w; x += 6) pts.push(`${x.toFixed(1)} ${f(x).toFixed(1)}`);
    return `M${cx - w} 600L${pts.join("L")}L${cx + w} 600Z`;
  };
  const farVolc = volcano(1010, 520, 330, 70) + volcano(420, 330, 150, 71);
  const hills = ridge({ seed: 72, base: 612, amp: 70, wavelength: 520, octaves: 4, bottom: 1040 });
  const bands = Array.from({ length: 5 }, (_, j) => {
    const opts = { seed: 80 + j, base: 632 + j * 44, amp: 26 + j * 4, wavelength: 480 + j * 80, octaves: 3 };
    return { fill: ridge({ ...opts, bottom: 1040 }), line: ridgeLine(opts), shade: j };
  });
  const palms = [
    palm(240, 690, 290, -38, 101),
    palm(300, 700, 220, 24, 102),
    palm(1330, 676, 330, 52, 103),
    palm(1410, 700, 250, -30, 104),
    palm(1480, 690, 190, 22, 105),
  ];
  return { farVolc, hills, bands, palms, meru: meru(610, 628, 1.1), meru2: meru(1100, 608, 0.62) };
})();

export function BaliScene() {
  return (
    <g>
      <g style={fill("l0")}>
        <path d={bali.farVolc} />
      </g>
      <rect x={-40} y={H - 220} width={1680} height={240} fill="url(#mist-grad)" style={{ opacity: "var(--mist-o)" }} />
      <g style={fill("l1")}>
        <path d={bali.hills} />
        <path d={bali.meru2} />
      </g>
      <g className="mist-drift" style={{ ...fill("mist"), opacity: 0.22 }}>
        <ellipse cx={420} cy={H + 6} rx={420} ry={26} />
        <ellipse cx={1180} cy={H + 22} rx={520} ry={30} />
      </g>
      {bali.bands.map((b, j) => (
        <g key={j}>
          <path d={b.fill} fill={`url(#bali-band-${j})`} />
          <path d={b.line} fill="none" strokeWidth={1.5} style={{ stroke: "var(--hl)", opacity: 0.26 - j * 0.03 }} />
          {j === 1 && <path d={bali.meru} style={fill("l3")} />}
        </g>
      ))}
      <g style={fill("l4")}>
        {bali.palms.map((p, i) => (
          <g key={i}>
            <path d={p.trunk} />
            <path d={p.fronds} />
          </g>
        ))}
      </g>
      <Foreground side="right" seed={95} />
      <Foreground side="left" seed={96} />
    </g>
  );
}

/* ------------------------------------------------------------------- Phuket */

const phu = (() => {
  const farKarst = [
    karst(180, H + 2, 120, 118, 1),
    karst(300, H + 2, 90, 92, 2),
    karst(1360, H + 2, 130, 130, 3),
    karst(1480, H + 2, 90, 86, 4),
  ].join("");
  const midKarst = [
    karst(540, H + 6, 140, 170, 5),
    karst(660, H + 6, 90, 110, 6),
    karst(1240, H + 6, 150, 200, 7),
  ].join("");
  const bigKarst = [karst(340, H + 12, 190, 250, 8), karst(1010, H + 14, 230, 300, 9), karst(1150, H + 14, 120, 170, 10)].join("");
  return { farKarst, midKarst, bigKarst };
})();

export function PhuketScene() {
  return (
    <g>
      <g id="phu-sky">
        <g style={fill("l0")}>
          <path d={phu.farKarst} />
        </g>
        <g style={fill("l1")}>
          <path d={phu.midKarst} />
        </g>
        <rect x={-40} y={H - 170} width={1680} height={190} fill="url(#mist-grad)" style={{ opacity: "var(--mist-o)" }} />
        <g style={fill("l2")}>
          <path d={phu.bigKarst} />
        </g>
      </g>
      <Sea>
        <Reflection href="#phu-sky" />
        <Glitter />
      </Sea>
      <g className="drift-mid bob" style={fill("l3")}>
        <path d={boat("longtail", 640, H + 64, 1.05)} />
      </g>
      <g className="drift-slow" style={fill("l4")}>
        <path d={boat("longtail", 1250, H + 120, 1.7)} />
      </g>
      <Foreground side="left" seed={97} />
      <Foreground side="right" seed={98} />
    </g>
  );
}

export const scenes: Record<SceneId, () => ReactNode> = {
  maldives: MaldivesScene,
  dubai: DubaiScene,
  bali: BaliScene,
  istanbul: IstanbulScene,
  phuket: PhuketScene,
};
