"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, type AnimationPlaybackControls } from "motion/react";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { brand } from "@/config/brand";
import { destinations, haversineKm } from "@/data/destinations";
import { SkyStage } from "@/components/scene/SkyStage";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_DOY,
  dayGradient,
  dayOfYear,
  formatHour,
  hourForAltitude,
  solar,
  sunTimes,
  wrapHour,
} from "@/lib/sun";
import { DayDial, type Preset } from "./DayDial";
import { LeadDialog } from "./LeadDialog";

const INTRO_START = 4.9;
const EASE = [0.65, 0, 0.35, 1] as const;
const MONTHS = ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"];

type Weather = { air: number; sea: number | null; live: boolean };

function phaseLabel(alt: number, H: number) {
  const morning = H < 0;
  if (alt < -12) return "Глубокая ночь";
  if (alt < -0.8) return morning ? "Предрассветные сумерки" : "Вечерние сумерки";
  if (alt < 7) return morning ? "Рассвет" : "Закат";
  if (alt < 55) return morning ? "Утро" : "День";
  return "Полдень";
}

const subscribeNever = () => () => {};
const currentDay = () => Math.floor(Date.now() / 86_400_000);

function localHourNow(tz: number) {
  const d = new Date();
  return wrapHour(d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600 + tz);
}

function RouteArc({ from, to, km, flight }: { from: string; to: string; km: number; flight: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">Маршрут</p>
      <div className="relative mt-2 h-12 w-full max-w-[250px]">
        <svg viewBox="0 0 250 48" className="absolute inset-0 h-full w-full overflow-visible">
          <path d="M6 42Q125 -22 244 42" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeDasharray="2 5" />
          <circle cx="6" cy="42" r="3" fill="#fff" />
          <circle cx="244" cy="42" r="3" fill="none" stroke="#fff" strokeWidth="1.2" />
        </svg>
        <motion.span
          className="absolute left-0 top-0 block size-1.5 rounded-full bg-brand shadow-[0_0_10px_3px_rgba(227,201,160,0.7)]"
          style={{ offsetPath: "path('M6 42Q125 -22 244 42')", offsetRotate: "0deg" }}
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
        />
      </div>
      <p className="mt-1 flex items-baseline justify-between gap-2 text-sm text-white/85">
        <span>
          {from} <span className="text-white/40">→</span> {to}
        </span>
        <span className="text-xs text-white/55 tabular-nums">{km.toLocaleString("ru-RU")} км</span>
      </p>
      <p className="text-xs text-white/55">В пути {flight.replace("≈ ", "≈ ")}</p>
    </div>
  );
}

function Season({ months, label, currentMonth }: { months: number[]; label: string; currentMonth: number | null }) {
  const inSeason = currentMonth !== null && months.includes(currentMonth);
  return (
    <div>
      <p className="flex items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
        Лучший сезон
        {currentMonth !== null && (
          <span className={`normal-case tracking-normal ${inSeason ? "text-emerald-300" : "text-white/45"}`}>
            {inSeason ? "● сейчас сезон" : "сейчас не сезон"}
          </span>
        )}
      </p>
      <div className="mt-2.5 grid grid-cols-12 gap-1" aria-hidden>
        {MONTHS.map((m, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span
              className={`h-1.5 w-full rounded-full transition-colors ${months.includes(i) ? "bg-brand" : "bg-white/15"} ${
                currentMonth === i ? "ring-1 ring-white ring-offset-1 ring-offset-transparent" : ""
              }`}
            />
            <span className={`text-[9px] ${currentMonth === i ? "text-white" : "text-white/40"}`}>{m}</span>
          </div>
        ))}
      </div>
      <p className="mt-1 text-xs text-white/55">{label}</p>
    </div>
  );
}

export function Hero() {
  const [idx, setIdx] = useState(0);
  const dest = destinations[idx];

  const hour = useMotionValue(INTRO_START);
  const [clock, setClock] = useState(Math.round(INTRO_START * 60));
  useMotionValueEvent(hour, "change", (v) => setClock(Math.round(wrapHour(v) * 60) % 1440));

  const day = useSyncExternalStore(subscribeNever, currentDay, () => 0);
  const today = useMemo(() => (day ? new Date(day * 86_400_000 + 43_200_000) : null), [day]);
  const doy = today ? dayOfYear(today) : DEFAULT_DOY;
  const month = today ? today.getUTCMonth() : null;
  const [liveHour, setLiveHour] = useState<number | null>(null);
  const [preset, setPreset] = useState<string | null>("golden");
  const [weather, setWeather] = useState<Record<string, Weather>>({});
  const [leadOpen, setLeadOpen] = useState(false);

  const playback = useRef<AnimationPlaybackControls | null>(null);
  const booted = useRef(false);

  const stop = () => playback.current?.stop();
  const glide = useCallback(
    (to: number, duration = 1.7) => {
      playback.current?.stop();
      playback.current = animate(hour, to, { duration, ease: EASE });
    },
    [hour],
  );

  const presets = useMemo<Preset[]>(() => {
    const noon = 12 + dest.tz - dest.lon / 15;
    return [
      { id: "dawn", label: "Рассвет", hour: hourForAltitude(dest, doy, 4, false) },
      { id: "noon", label: "Полдень", hour: noon },
      { id: "golden", label: "Закат", hour: hourForAltitude(dest, doy, 4, true) },
      { id: "night", label: "Ночь", hour: 23.6 },
      { id: "live", label: "Сейчас", hour: liveHour ?? 12 },
    ];
  }, [dest, doy, liveHour]);

  const presetsRef = useRef(presets);
  useEffect(() => {
    presetsRef.current = presets;
  }, [presets]);

  /* Clock, season and the opening sweep through the day. */
  useEffect(() => {
    const golden = hourForAltitude(destinations[0], dayOfYear(new Date()), 4, true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hour.set(golden);
    } else {
      playback.current = animate(hour, golden, { duration: 7.5, ease: [0.45, 0, 0.2, 1], delay: 0.35 });
    }
    booted.current = true;
    return () => playback.current?.stop();
  }, [hour]);

  /* Keep the "now" marker (and live mode) ticking. */
  useEffect(() => {
    const tick = (follow: boolean) => {
      const h = localHourNow(dest.tz);
      setLiveHour(h);
      if (follow && preset === "live") hour.set(h);
    };
    tick(false);
    const id = setInterval(() => tick(true), 20_000);
    return () => clearInterval(id);
  }, [dest, hour, preset]);

  /* When the destination changes, keep the same "mood" of the day there. */
  const prevIdx = useRef(0);
  useEffect(() => {
    if (!booted.current || prevIdx.current === idx) return;
    prevIdx.current = idx;
    const match = presetsRef.current.find((p) => p.id === preset);
    if (match) {
      if (match.id === "live") hour.set(localHourNow(dest.tz));
      else glide(match.hour, 1.4);
    }
  }, [idx, preset, dest, glide, hour]);

  /* Live weather, cached per destination. */
  useEffect(() => {
    if (weather[dest.id]) return;
    const ctrl = new AbortController();
    fetch(`/api/weather?id=${dest.id}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((w: Weather | null) => {
        if (w) setWeather((prev) => ({ ...prev, [dest.id]: w }));
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [dest.id, weather]);

  const times = useMemo(() => sunTimes(dest, doy), [dest, doy]);
  const gradient = useMemo(() => dayGradient(dest, doy), [dest, doy]);
  const { alt, H } = solar(dest, doy, clock / 60);
  const km = Math.round(haversineKm(brand.origin.lat, brand.origin.lon, dest.lat, dest.lon) / 10) * 10;
  const w = weather[dest.id] ?? { air: dest.fallback.air, sea: dest.fallback.sea, live: false };
  const temp = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n)}°`;

  const onScrub = (h: number) => {
    stop();
    setPreset(null);
    hour.set(h);
  };
  const onPreset = (p: Preset) => {
    setPreset(p.id);
    if (p.id === "live") {
      const h = localHourNow(dest.tz);
      glide(h, 1.6);
    } else glide(p.hour);
  };

  const lines = brand.hero.headline;

  return (
    <section id="top" className="relative isolate flex h-svh min-h-[780px] flex-col overflow-hidden text-white">
      <SkyStage dest={dest} hour={hour} doy={doy} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <header className="relative z-20 mx-auto flex w-full max-w-[1480px] items-center justify-between gap-6 px-5 pt-5 sm:px-8 sm:pt-7 lg:px-12">
        <a href="#top" className="flex items-baseline gap-3" aria-label={brand.name}>
          <span className="font-display text-[1.7rem] font-medium tracking-[0.34em]">{brand.name}</span>
          <span className="hidden text-[10px] uppercase tracking-[0.3em] text-white/55 xl:inline">{brand.descriptor}</span>
        </a>
        <nav aria-label="Основное меню" className="hidden items-center gap-9 lg:flex">
          {brand.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-[13px] tracking-wide text-white/80 transition-colors hover:text-white"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brand transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={brand.phoneHref} className="hidden items-center gap-2 text-sm text-white/80 hover:text-white xl:flex">
            <Phone className="size-3.5" /> {brand.phone}
          </a>
          <Button
            onClick={() => setLeadOpen(true)}
            variant="outline"
            className="h-10 rounded-full border-white/30 bg-white/10 px-5 text-[13px] text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
          >
            Подобрать тур
          </Button>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1480px] flex-1 flex-col justify-center gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-12">
        <div className="max-w-[72rem]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-white/75 sm:mb-7"
          >
            <span className="h-px w-10 bg-brand" />
            {brand.hero.eyebrow}
          </motion.p>

          <h1 className="font-display text-[clamp(2.9rem,7.6vw,7.4rem)] font-light leading-[0.94] tracking-[-0.01em] text-balance drop-shadow-[0_2px_30px_rgba(0,0,0,0.25)]">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em] lg:whitespace-nowrap">
                <motion.span
                  className={`block ${i === 1 ? "italic text-brand" : ""}`}
                  initial={{ y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.25, delay: 0.35 + i * 0.16, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-5 hidden max-w-[34rem] text-[15px] leading-relaxed text-white/80 sm:mt-7 sm:block sm:text-base"
          >
            {brand.hero.lead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.05 }}
            className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 sm:mt-8"
          >
            <Button
              onClick={() => setLeadOpen(true)}
              className="group h-12 rounded-full bg-brand px-7 text-[15px] font-medium text-brand-ink hover:bg-white"
            >
              {brand.hero.cta}
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <a
              href="#destinations"
              className="group inline-flex items-center gap-1.5 border-b border-white/30 pb-0.5 text-sm text-white/85 transition-colors hover:border-brand hover:text-white"
            >
              {brand.hero.secondaryCta}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        <motion.nav
          aria-label="Направления"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none [text-shadow:0_1px_18px_rgba(0,0,0,0.55)] lg:mx-0 lg:w-[19rem] lg:shrink-0 lg:flex-col lg:items-end lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {destinations.map((d, i) => {
            const active = i === idx;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setIdx(i)}
                aria-current={active}
                className={`group flex shrink-0 items-center gap-3 rounded-full border px-4 py-2 transition-colors lg:w-full lg:justify-end lg:rounded-none lg:border-0 lg:px-0 lg:py-2.5 ${
                  active
                    ? "border-brand bg-white/10 text-white lg:bg-transparent"
                    : "border-white/20 text-white/55 hover:text-white lg:border-0"
                }`}
              >
                <span className="mr-1 hidden h-px flex-1 origin-right bg-white/25 lg:block">
                  <span
                    className={`block h-px origin-right bg-brand transition-transform duration-700 ${active ? "scale-x-100" : "scale-x-0"}`}
                  />
                </span>
                <span className="text-[11px] tabular-nums tracking-widest text-white/50 max-lg:hidden">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-display leading-none transition-all duration-500 max-lg:text-lg lg:text-[2rem] ${
                    active ? "lg:translate-x-0" : "lg:translate-x-3 lg:group-hover:translate-x-0"
                  }`}
                >
                  {d.name}
                </span>
              </button>
            );
          })}
          <div className="hidden min-h-[4.5rem] text-right lg:block">
            <AnimatePresence mode="wait">
              <motion.p
                key={dest.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="mt-3 text-sm leading-relaxed text-white/70"
              >
                <span className="mb-1 block text-[11px] uppercase tracking-[0.24em] text-brand">{dest.kicker}</span>
                {dest.blurb}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.nav>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto mb-4 mt-5 w-full max-w-[1480px] px-3 sm:mb-6 sm:px-6 lg:px-12"
      >
        <div className="grid gap-5 rounded-[1.75rem] border border-white/15 bg-black/25 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-5 lg:grid-cols-[17rem_minmax(0,1fr)_17rem] lg:items-center lg:gap-8 lg:px-7 lg:py-5 xl:grid-cols-[18rem_minmax(0,1fr)_minmax(16rem,22rem)]">
          <div className="flex items-end justify-between gap-4 lg:block">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
                Сейчас там · {dest.place}
              </p>
              <p
                className="mt-1 font-display text-[3.4rem] font-light leading-none tabular-nums sm:text-[4.2rem]"
                aria-live="off"
              >
                {formatHour(clock / 60)}
              </p>
              <p className="mt-1.5 text-sm text-brand">{phaseLabel(alt, H)}</p>
            </div>
            <div className="text-right text-sm text-white/80 lg:mt-3 lg:text-left">
              <p className="flex items-center justify-end gap-2 lg:justify-start">
                <span
                  className={`size-1.5 rounded-full ${w.live ? "bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" : "bg-white/30"}`}
                  title={w.live ? "Данные в реальном времени" : "Средние значения"}
                />
                <span className="tabular-nums">{temp(w.air)}</span>
                <span className="text-white/45">воздух</span>
              </p>
              {w.sea !== null && (
                <p className="mt-0.5 tabular-nums">
                  {temp(w.sea)} <span className="text-white/45">вода</span>
                </p>
              )}
            </div>
          </div>

          <DayDial
            placeName={dest.name}
            hour={hour}
            clock={clock}
            isNight={alt < -2}
            rise={times.rise}
            set={times.set}
            gradient={gradient}
            liveHour={liveHour}
            presets={presets}
            activePreset={preset}
            onScrub={onScrub}
            onPreset={onPreset}
          />

          <div className="hidden gap-5 lg:grid lg:grid-cols-1 xl:grid-cols-1">
            <RouteArc from={brand.origin.name} to={dest.place} km={km} flight={dest.flight} />
            <Season months={dest.bestMonths} label={dest.seasonLabel} currentMonth={month} />
          </div>
        </div>
      </motion.div>

      <LeadDialog open={leadOpen} onOpenChange={setLeadOpen} defaultDestination={dest.name} />
    </section>
  );
}
