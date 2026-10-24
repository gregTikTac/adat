"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Destination } from "@/data/destinations";
import { placePhotos } from "@/data/places";
import { PhotoCarousel } from "@/components/site/PhotoCarousel";
import { EASE_OUT, type WipeDir } from "@/lib/wipe";

type Props = { dest: Destination; dir: WipeDir };

/**
 * Photo slider and caption of the chosen place, right on the main screen.
 * When the place changes, the caption slides along the same diagonal as the background.
 */
export function HeroPlacePanel({ dest, dir }: Props) {
  const reduce = useReducedMotion();
  const dx = reduce ? 0 : dir * 28;
  const dy = reduce ? 0 : dir * 16;

  return (
    <div className="mt-4 lg:mt-5">
      <PhotoCarousel id={dest.id} photos={placePhotos[dest.id]} className="aspect-[16/10] w-full" />

      <div className="relative mt-4 min-h-[8.5rem] overflow-hidden lg:min-h-[9.5rem] lg:text-right">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, x: dx, y: dy }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -dx, y: -dy, transition: { duration: 0.28, ease: "easeIn" } }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="legible text-sm leading-relaxed"
          >
            <span className="legible-brick mb-1 block text-xs uppercase tracking-[0.24em]">{dest.kicker}</span>
            {dest.blurb}
            <a
              href={`#tour-${dest.id}`}
              className="legible-sea group mt-1 flex min-h-11 items-center gap-2 text-sm font-medium lg:justify-end"
            >
              Программа дня · {dest.flight}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
