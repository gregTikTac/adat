"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { Moon, Sun, Sunrise, Sunset } from "lucide-react";
import { formatHour } from "@/lib/sun";

export type Preset = { id: string; label: string; hour: number };

type Props = {
  placeName: string;
  hour: MotionValue<number>;
  clock: number;
  isNight: boolean;
  rise: number | null;
  set: number | null;
  gradient: string;
  liveHour: number | null;
  presets: Preset[];
  activePreset: string | null;
  onScrub: (hour: number) => void;
  onPreset: (preset: Preset) => void;
};

export function DayDial({
  placeName,
  hour,
  clock,
  isNight,
  rise,
  set,
  gradient,
  liveHour,
  presets,
  activePreset,
  onScrub,
  onPreset,
}: Props) {
  const track = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const left = useTransform(hour, (h) => `${(Math.min(24, Math.max(0, h)) / 24) * 100}%`);

  const fromEvent = (clientX: number) => {
    const rect = track.current?.getBoundingClientRect();
    if (!rect) return;
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onScrub(t * 24);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 1 : 0.25;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") onScrub(Math.min(24, hour.get() + step));
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") onScrub(Math.max(0, hour.get() - step));
    else if (e.key === "Home") onScrub(0);
    else if (e.key === "End") onScrub(24);
    else return;
    e.preventDefault();
  };

  const pct = (h: number | null) => (h === null ? 0 : (h / 24) * 100);
  const Icon = isNight ? Moon : Sun;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/60">
          Сутки · {placeName}
          <span className="ml-2 hidden normal-case tracking-normal text-white/40 sm:inline">проведите по шкале</span>
        </p>
        <div className="-mx-1 flex max-w-full gap-1.5 overflow-x-auto px-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Время суток">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPreset(p)}
              aria-pressed={activePreset === p.id}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                activePreset === p.id
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-white/20 text-white/75 hover:border-white/50 hover:text-white"
              }`}
            >
              {p.id === "live" && (
                <span
                  className={`mr-1.5 inline-block size-1.5 rounded-full align-middle ${
                    activePreset === "live" ? "bg-brand-ink" : "bg-emerald-400"
                  }`}
                />
              )}
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={track}
        className="relative h-10 cursor-pointer touch-none select-none"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          fromEvent(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && fromEvent(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <div
          className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
          style={{ background: gradient }}
        />
        {rise !== null && (
          <span className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-white/60" style={{ left: `${pct(rise)}%` }} />
        )}
        {set !== null && (
          <span className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-white/60" style={{ left: `${pct(set)}%` }} />
        )}
        {liveHour !== null && (
          <span
            title="Сейчас там"
            className="absolute -top-0.5 size-1.5 -translate-x-1/2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.7)]"
            style={{ left: `${pct(liveHour)}%` }}
          />
        )}
        <motion.div
          role="slider"
          tabIndex={0}
          aria-label={`Время суток: ${placeName}`}
          aria-valuemin={0}
          aria-valuemax={24}
          aria-valuenow={Math.round((clock / 60) * 100) / 100}
          aria-valuetext={formatHour(clock / 60)}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#10151f] shadow-[0_6px_24px_rgba(0,0,0,0.45)] outline-none ring-offset-2 ring-offset-transparent focus-visible:ring-2 focus-visible:ring-brand"
          style={{ left }}
        >
          <Icon className="size-4" strokeWidth={2} />
        </motion.div>
      </div>

      <div className="relative -mt-1 h-4 text-xs text-white/55">
        <span className="absolute left-0 tabular-nums">00:00</span>
        <span className="absolute right-0 tabular-nums">24:00</span>
        {rise !== null && (
          <span
            className="absolute flex -translate-x-1/2 items-center gap-1 whitespace-nowrap tabular-nums text-white/75"
            style={{ left: `clamp(48px, ${pct(rise)}%, calc(100% - 140px))` }}
          >
            <Sunrise className="size-3" /> {formatHour(rise)}
          </span>
        )}
        {set !== null && (
          <span
            className="absolute flex -translate-x-1/2 items-center gap-1 whitespace-nowrap tabular-nums text-white/75"
            style={{ left: `clamp(110px, ${pct(set)}%, calc(100% - 48px))` }}
          >
            <Sunset className="size-3" /> {formatHour(set)}
          </span>
        )}
      </div>
    </div>
  );
}
