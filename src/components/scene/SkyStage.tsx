"use client";

import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useSpring, useTransform, type MotionValue } from "motion/react";
import type { Destination } from "@/data/destinations";
import { HORIZON_Y, skyState } from "@/lib/sun";
import { r1, rng } from "./art";
import { scenes } from "./scenes";

const VIEW_Y = 110;

type Props = {
  dest: Destination;
  hour: MotionValue<number>;
  doy: number;
};

function Stars() {
  const stars = useMemo(() => {
    const r = rng(2024);
    return Array.from({ length: 190 }, (_, i) => ({
      x: r1(r() * 1600),
      y: r1(Math.pow(r(), 1.4) * 520),
      r: r1(0.4 + r() * 1.3),
      o: r1(0.35 + r() * 0.65),
      twinkle: i % 6 === 0,
      delay: r1(r() * 5),
    }));
  }, []);
  return (
    <g style={{ opacity: "var(--stars-o)" }} fill="#fff">
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          opacity={s.o}
          className={s.twinkle ? "twinkle" : undefined}
          style={s.twinkle ? { animationDelay: `${s.delay}s` } : undefined}
        />
      ))}
    </g>
  );
}

export function SkyStage({ dest, hour, doy }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const halfWidth = useRef(800);

  const apply = (h: number) => {
    const el = ref.current;
    if (!el) return;
    const { vars } = skyState(dest, doy, h, halfWidth.current);
    for (const key in vars) el.style.setProperty(key, vars[key]);
  };

  useMotionValueEvent(hour, "change", apply);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const visible = Math.min(1600, (width / height) * 900);
      halfWidth.current = visible / 2;
      apply(hour.get());
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dest, doy]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 50, damping: 20, mass: 0.8 });
  const sy = useSpring(py, { stiffness: 50, damping: 20, mass: 0.8 });
  const skyX = useTransform(sx, (v) => v * -7);
  const skyY = useTransform(sy, (v) => v * -4);
  const sceneX = useTransform(sx, (v) => v * -18);
  const sceneY = useTransform(sy, (v) => v * -8);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 2);
      py.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py]);

  const Scene = scenes[dest.id];

  return (
    <div ref={ref} className="sky-stage absolute inset-0 overflow-hidden bg-[#02040c]" aria-hidden>
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.14 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 7, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg className="h-full w-full" viewBox={`0 ${VIEW_Y} 1600 900`} preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="sky-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={HORIZON_Y + 40}>
              <stop offset="0" style={{ stopColor: "var(--sky-top)" }} />
              <stop offset="0.55" style={{ stopColor: "var(--sky-mid)" }} />
              <stop offset="1" style={{ stopColor: "var(--sky-hor)" }} />
            </linearGradient>
            <radialGradient id="glow-grad">
              <stop offset="0" style={{ stopColor: "var(--glow)" }} stopOpacity="1" />
              <stop offset="0.25" style={{ stopColor: "var(--glow)" }} stopOpacity="0.55" />
              <stop offset="0.6" style={{ stopColor: "var(--glow)" }} stopOpacity="0.14" />
              <stop offset="1" style={{ stopColor: "var(--glow)" }} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sun-halo">
              <stop offset="0" style={{ stopColor: "var(--sun-color)" }} stopOpacity="0.9" />
              <stop offset="0.3" style={{ stopColor: "var(--sun-color)" }} stopOpacity="0.28" />
              <stop offset="1" style={{ stopColor: "var(--sun-color)" }} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sun-disc">
              <stop offset="0" stopColor="#fffaf0" />
              <stop offset="0.55" style={{ stopColor: "var(--sun-color)" }} />
              <stop offset="1" style={{ stopColor: "var(--sun-color)" }} />
            </radialGradient>
            <filter id="sun-soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.1" />
            </filter>
            <radialGradient id="moon-halo">
              <stop offset="0" stopColor="#cfd9ff" stopOpacity="0.45" />
              <stop offset="0.35" stopColor="#9fb2ff" stopOpacity="0.12" />
              <stop offset="1" stopColor="#9fb2ff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="moon-disc" cx="0.38" cy="0.35" r="0.75">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.7" stopColor="#dde4f7" />
              <stop offset="1" stopColor="#aeb9d8" />
            </radialGradient>
            <linearGradient id="sea-grad" gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON_Y} x2="0" y2="990">
              <stop offset="0" style={{ stopColor: "var(--sea-top)" }} />
              <stop offset="1" style={{ stopColor: "var(--sea-bot)" }} />
            </linearGradient>
            <linearGradient id="mist-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--mist)" }} stopOpacity="0" />
              <stop offset="1" style={{ stopColor: "var(--mist)" }} stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="refl-core" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="refl-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="1" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="refl-mask" maskUnits="userSpaceOnUse" x="-100" y={HORIZON_Y} width="1800" height="380">
              <rect x="-100" y={HORIZON_Y} width="1800" height="380" fill="url(#refl-fade)" />
            </mask>
            <filter id="blur-soft" x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur stdDeviation="2.4 5" />
            </filter>
            {[0, 1, 2, 3, 4].map((j) => (
              <linearGradient key={j} id={`bali-band-${j}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: `var(--l${Math.min(4, j + 1)})` }} />
                <stop offset="1" style={{ stopColor: "var(--l4)" }} />
              </linearGradient>
            ))}
          </defs>

          <motion.g style={{ x: skyX, y: skyY }}>
            <rect x="-60" y="-60" width="1720" height="1200" fill="url(#sky-grad)" />
            <Stars />
            <g style={{ transform: "translate(var(--moon-x), var(--moon-y))", opacity: "var(--moon-o)" }}>
              <circle r="260" fill="url(#moon-halo)" />
              <circle r="25" fill="url(#moon-disc)" />
              <circle cx="-8" cy="-6" r="4.5" fill="#9aa6c8" opacity="0.28" />
              <circle cx="9" cy="6" r="6" fill="#9aa6c8" opacity="0.22" />
              <circle cx="3" cy="-12" r="2.6" fill="#9aa6c8" opacity="0.2" />
            </g>
            <g style={{ transform: "translate(var(--sun-x), var(--sun-y))" }}>
              <circle r="760" fill="url(#glow-grad)" style={{ opacity: "var(--glow-o)", mixBlendMode: "screen" }} />
              <g style={{ opacity: "var(--sun-o)" }}>
                <g style={{ transform: "scale(var(--sun-s))" }}>
                  <circle r="190" fill="url(#sun-halo)" style={{ mixBlendMode: "screen" }} />
                  <circle r="40" fill="url(#sun-disc)" filter="url(#sun-soft)" />
                </g>
              </g>
            </g>
          </motion.g>

          <motion.g style={{ x: sceneX, y: sceneY }}>
            <AnimatePresence initial={false}>
              <motion.g
                key={dest.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              >
                <Scene />
              </motion.g>
            </AnimatePresence>
          </motion.g>
        </svg>
      </motion.div>

      <div className="grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
