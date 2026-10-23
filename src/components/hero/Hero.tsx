"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { brand } from "@/config/brand";
import { destinations } from "@/data/destinations";
import { AdatMark } from "./AdatMark";
import { BrandStage } from "./BrandStage";
import { Button } from "@/components/ui/button";
import { LeadDialog } from "./LeadDialog";

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [leadOpen, setLeadOpen] = useState(false);
  const dest = destinations[idx];
  const lines = brand.hero.headline;

  return (
    <section id="top" className="relative isolate z-0 flex h-svh min-h-[640px] flex-col overflow-hidden text-[#443A2C] lg:sticky lg:top-0">
      <BrandStage dest={dest} />

      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 mx-auto flex w-full max-w-[1480px] items-center justify-between gap-6 px-5 pt-5 sm:px-8 sm:pt-7 lg:px-12"
      >
        <a href="#top" className="flex items-center gap-3 text-[#315059]" aria-label={brand.name}>
          <AdatMark className="h-12 w-auto shrink-0" />
          <span className="leading-none">
            <span className="block font-display text-[1.55rem] tracking-[0.28em]">{brand.name}</span>
            <span className="mt-1 block text-[9px] uppercase tracking-[0.22em] text-[#443A2C]/70">{brand.descriptor}</span>
          </span>
        </a>
        <nav aria-label="Основное меню" className="hidden items-center gap-9 lg:flex">
          {brand.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-[13px] tracking-wide text-[#443A2C]/75 transition-colors hover:text-[#315059]"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[#b24d29] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={brand.phoneHref} className="hidden items-center gap-2 text-sm text-[#443A2C]/80 hover:text-[#315059] xl:flex">
            <Phone className="size-3.5" /> {brand.phone}
          </a>
          <Button
            onClick={() => setLeadOpen(true)}
            variant="outline"
            className="h-10 rounded-full border-[#315059]/30 bg-[#ebe0cc]/70 px-5 text-[13px] text-[#315059] hover:bg-[#315059] hover:text-[#ebe0cc]"
          >
            Подобрать тур
          </Button>
        </div>
      </motion.header>

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1480px] flex-1 flex-col justify-center gap-6 px-5 pb-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-12">
        <div className="max-w-[72rem]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#315059] sm:mb-7"
          >
            <span className="h-px w-10 bg-brand" />
            {brand.hero.eyebrow}
          </motion.p>

          <h1 className="font-heading text-[clamp(2.9rem,7.6vw,7.4rem)] font-light leading-[0.94] tracking-[-0.01em] text-balance text-[#443A2C]">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em] lg:whitespace-nowrap">
                <motion.span
                  className={`block ${i === 1 ? "italic text-[#b24d29]" : ""}`}
                  initial={{ y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.75, delay: 0.16 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mt-5 hidden max-w-[32rem] text-[15px] leading-relaxed text-[#443A2C]/85 sm:mt-6 sm:block sm:text-base"
          >
            {brand.hero.lead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.58 }}
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
              className="group inline-flex items-center gap-1.5 border-b border-[#443A2C]/30 pb-0.5 text-sm text-[#443A2C]/85 transition-colors hover:border-[#b24d29] hover:text-[#315059]"
            >
              {brand.hero.secondaryCta}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        <div id="destinations" className="relative -mx-5 bg-[#ebe0cc]/95 px-5 py-3 lg:mx-0 lg:w-[22rem] lg:shrink-0 lg:bg-transparent lg:p-0">
          <div aria-hidden className="pointer-events-none absolute -inset-x-16 -inset-y-10 -z-10 hidden bg-[#ebe0cc]/88 blur-2xl lg:block" />
          <p className="legible-sea mb-2 font-display text-sm tracking-[0.28em] lg:text-right">
            {String(idx + 1).padStart(2, "0")}
            <span className="legible"> / {String(destinations.length).padStart(2, "0")}</span>
          </p>
          <motion.nav
            aria-label="Направления"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            onKeyDown={(event) => {
              if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
              event.preventDefault();
              const next = event.key === "ArrowDown" || event.key === "ArrowRight" ? idx + 1 : idx - 1;
              setIdx((next + destinations.length) % destinations.length);
            }}
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none lg:mx-0 lg:w-full lg:flex-col lg:items-end lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {destinations.map((d, i) => {
              const active = i === idx;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setIdx(i);
                    const target = document.getElementById(`route-${d.id}`);
                    if (!target) return;
                    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
                  }}
                  onFocus={() => setIdx(i)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setIdx(i);
                  }}
                  aria-current={active ? "true" : undefined}
                  className={`group flex shrink-0 items-center gap-3 bg-transparent px-1 py-2 lg:w-full lg:justify-end lg:px-0 lg:py-2.5 ${
                    active ? "legible-sea" : "legible"
                  }`}
                >
                  <span className="mr-1 hidden h-px flex-1 origin-right bg-[#ebe0cc] shadow-[0_0_0_1px_rgba(36,31,26,0.45)] lg:block">
                    <span
                      className={`block h-px origin-right bg-[#8a3212] transition-transform duration-700 ${active ? "scale-x-100" : "scale-x-0"}`}
                    />
                  </span>
                  <span className="legible text-[11px] tabular-nums tracking-widest max-lg:hidden">
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
                  className="legible mt-3 text-sm leading-relaxed"
                >
                  <span className="legible-brick mb-1 block text-[11px] uppercase tracking-[0.24em]">{dest.kicker}</span>
                  {dest.blurb}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.nav>
        </div>
      </div>

      <LeadDialog open={leadOpen} onOpenChange={setLeadOpen} defaultDestination={dest.name} />
    </section>
  );
}
