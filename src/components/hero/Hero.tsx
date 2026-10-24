"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { brand } from "@/config/brand";
import { destinations } from "@/data/destinations";
import type { WipeDir } from "@/lib/wipe";
import { goToPlace } from "@/lib/goToPlace";
import { AnimatedHeading } from "@/components/site/AnimatedHeading";
import { AdatMark } from "./AdatMark";
import { BrandStage } from "./BrandStage";
import { Button } from "@/components/ui/button";
import { HeroPlacePanel } from "./HeroPlacePanel";
import { IntroMark } from "./IntroMark";
import { LeadDialog } from "./LeadDialog";
import { MobileNav } from "./MobileNav";

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<WipeDir>(1);
  const [leadOpen, setLeadOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const dest = destinations[idx];
  const lines = brand.hero.headline;

  const choose = (next: number) => {
    if (next === idx) return;
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  };

  /** A hover or the first tap selects a place; pressing the selected place opens its programme. */
  const press = (i: number) => {
    if (i === idx) goToPlace(destinations[i].id);
    else choose(i);
  };

  return (
    <section id="top" className="relative isolate z-0 flex min-h-svh flex-col overflow-hidden text-[#443A2C] lg:sticky lg:top-0 lg:h-svh lg:min-h-[640px]">
      {!introDone && <IntroMark targetId="adat-mark-slot" onFly={() => setReady(true)} onDone={() => setIntroDone(true)} />}
      <BrandStage dest={dest} dir={dir} ready={ready} />

      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 mx-auto flex w-full max-w-[1480px] items-center justify-between gap-6 px-5 pt-5 sm:px-8 sm:pt-7 lg:px-12"
      >
        <a href="#top" className="flex min-h-11 items-center gap-3 text-[#315059]" aria-label={brand.name}>
          <span id="adat-mark-slot" className="shrink-0">
            <AdatMark className="h-12 w-auto" show={introDone} />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[1.55rem] tracking-[0.28em]">{brand.name}</span>
            <span className="legible mt-1 block text-[11px] font-medium uppercase tracking-[0.22em]">{brand.descriptor}</span>
          </span>
        </a>
        <nav aria-label="Основное меню" className="hidden items-center gap-9 lg:flex">
          {brand.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative py-2 text-sm tracking-wide text-[#443A2C]/75 transition-colors hover:text-[#315059]"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[#b24d29] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={brand.phoneHref} className="hidden min-h-11 items-center gap-2 text-sm text-[#443A2C]/80 hover:text-[#315059] xl:flex">
            <Phone className="size-4" /> {brand.phone}
          </a>
          <Button
            onClick={() => setLeadOpen(true)}
            variant="outline"
            className="h-11 rounded-full border-[#315059]/30 bg-[#ebe0cc]/70 px-5 text-[13px] text-[#315059] hover:bg-[#315059] hover:text-[#ebe0cc]"
          >
            Подобрать тур
          </Button>
          <MobileNav />
        </div>
      </motion.header>

      <div className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-1 flex-col justify-end gap-6 px-5 pb-8 pt-[max(46svh,280px)] sm:px-8 sm:pb-16 lg:min-h-0 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-12 lg:pt-0">
        <div className="max-w-[72rem]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[#315059] sm:mb-7"
          >
            <span className="h-px w-10 bg-brand" />
            {brand.hero.eyebrow}
          </motion.p>

          <AnimatedHeading
            as="h1"
            immediate
            active={ready}
            delay={0.25}
            trackFrom="0.08em"
            parts={[lines[0], "\n", { text: lines[1], className: "italic text-[#b24d29]" }]}
            className="font-heading text-[clamp(2.4rem,11vw,4rem)] font-light leading-[0.94] text-[#443A2C] sm:text-[clamp(3rem,8vw,4.6rem)] lg:text-[clamp(3.4rem,5.6vw,6.2rem)]"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-5 hidden max-w-[32rem] text-[15px] leading-relaxed text-[#443A2C]/85 sm:mt-6 sm:block sm:text-base"
          >
            {brand.hero.lead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.7, delay: 1.1 }}
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
              href="#routes"
              className="group inline-flex min-h-11 items-center gap-1.5 border-b border-[#443A2C]/30 pb-0.5 text-base text-[#443A2C]/85 transition-colors hover:border-[#b24d29] hover:text-[#315059]"
            >
              {brand.hero.secondaryCta}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        <div id="destinations" className="relative -mx-5 bg-[#ebe0cc] px-5 py-3 lg:mx-0 lg:w-[21rem] lg:shrink-0 lg:bg-transparent lg:p-0 xl:w-[23rem]">
          <div aria-hidden className="pointer-events-none absolute -inset-x-16 -inset-y-10 -z-10 hidden bg-[#ebe0cc]/88 blur-2xl lg:block" />
          <p className="legible-sea mb-2 font-display text-sm tracking-[0.28em] lg:text-right">
            {String(idx + 1).padStart(2, "0")}
            <span className="legible"> / {String(destinations.length).padStart(2, "0")}</span>
          </p>
          <motion.nav
            aria-label="Направления"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            onKeyDown={(event) => {
              if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
              event.preventDefault();
              const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
              const next = (idx + step + destinations.length) % destinations.length;
              setDir(step === 1 ? 1 : -1);
              setIdx(next);
            }}
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none lg:mx-0 lg:w-full lg:flex-col lg:items-end lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {destinations.map((d, i) => {
              const active = i === idx;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => press(i)}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(":focus-visible")) choose(i);
                  }}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") choose(i);
                  }}
                  aria-current={active ? "true" : undefined}
                  className={`group flex shrink-0 items-center gap-3 bg-transparent px-2 py-3 lg:w-full lg:justify-end lg:px-0 lg:py-2.5 ${
                    active ? "legible-sea" : "legible"
                  }`}
                >
                  <span className="mr-1 hidden h-px flex-1 origin-right bg-[#ebe0cc] shadow-[0_0_0_1px_rgba(36,31,26,0.45)] lg:block">
                    <span
                      className={`block h-px origin-right bg-[#8a3212] transition-transform duration-700 ${active ? "scale-x-100" : "scale-x-0"}`}
                    />
                  </span>
                  <span className="legible text-xs tabular-nums tracking-widest max-lg:hidden">
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
          </motion.nav>

          <HeroPlacePanel dest={dest} dir={dir} />
        </div>
      </div>

      <LeadDialog open={leadOpen} onOpenChange={setLeadOpen} defaultDestination={dest.name} />
    </section>
  );
}
