"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { destinations } from "@/data/destinations";
import { placePhotos } from "@/data/places";
import { AnimatedHeading } from "./AnimatedHeading";
import { GlowImage } from "./GlowImage";
import { goToPlace } from "@/lib/goToPlace";
import { Reveal } from "./Reveal";

export function Routes() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const dest = destinations[active];
  const photo = placePhotos[dest.id][0];

  useEffect(() => {
    const nodes = destinations
      .map((d) => document.getElementById(`route-${d.id}`))
      .filter((node): node is HTMLElement => node !== null);
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = destinations.findIndex((d) => `route-${d.id}` === visible.target.id);
        if (index >= 0) setActive(index);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.25, 0.5, 0.75] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="routes" className="relative z-20 bg-[#f3eadc] text-[#443A2C]">
      <div className="mx-auto max-w-[1480px] px-5 pt-16 sm:px-8 lg:px-12 lg:pt-24">
        <p className="text-xs uppercase tracking-[0.28em] text-[#315059]">Пять направлений</p>
        <AnimatedHeading
          as="h2"
          parts={["Маршруты из Махачкалы"]}
          className="mt-3 max-w-xl font-heading text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-none"
        />
      </div>

      <div className="mx-auto mt-10 grid max-w-[1480px] lg:mt-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
        <div className="px-5 sm:px-8 lg:px-12">
          {destinations.map((d, i) => {
            const frame = placePhotos[d.id][0];
            return (
              <Reveal key={d.id} delay={i * 0.06}>
                <article
                  id={`route-${d.id}`}
                  className="scroll-mt-8 border-t border-[#443A2C]/15 py-10 lg:min-h-[70vh] lg:py-20"
                >
                  <a
                    href={`#tour-${d.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      goToPlace(d.id);
                    }}
                    className="group block"
                  >
                    <p className="font-display text-sm tracking-[0.28em] text-[#315059]">
                      {String(i + 1).padStart(2, "0")}
                      <span className="text-[#443A2C]/35"> / 05</span>
                    </p>
                    <AnimatedHeading
                      as="h3"
                      parts={[d.name]}
                      trackFrom="0.2em"
                      className="mt-3 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-none transition-colors group-hover:text-[#315059]"
                    />
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#443A2C]/75">{d.blurb}</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[#b24d29]">
                      {d.flight} на авто · подробнее
                    </p>
                  </a>
                  <GlowImage src={frame.src} alt={frame.alt} className="mt-6 aspect-[16/10] w-full lg:hidden" />
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="sticky top-0 hidden h-svh overflow-hidden lg:block">
          <AnimatePresence mode="sync">
            <motion.img
              key={photo.src}
              src={photo.src}
              alt=""
              initial={reduce ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#443A2C]/55 to-transparent p-8 text-[#ebe0cc]">
            <p className="font-display text-sm tracking-[0.28em]">
              {String(active + 1).padStart(2, "0")}
              <span className="text-[#ebe0cc]/50"> / 05</span>
            </p>
            <p className="mt-2 font-display text-4xl">{dest.name}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
