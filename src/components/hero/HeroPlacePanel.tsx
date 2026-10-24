"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Destination } from "@/data/destinations";
import { placePhotos } from "@/data/places";
import { PhotoCarousel } from "@/components/site/PhotoCarousel";
import { EASE_OUT, type SwapMode, type WipeDir } from "@/lib/wipe";

type Props = { dest: Destination; dir: WipeDir; mode: SwapMode };

/**
 * Photo slider and caption of the chosen place, right on the main screen.
 * After a click the caption slides along the diagonal of the background;
 * after a mouse hover it only fades.
 */
export function HeroPlacePanel({ dest, dir, mode }: Props) {
  const reduce = useReducedMotion();
  const slide = mode === "wipe" && !reduce;
  const dx = slide ? dir * 28 : 0;
  const dy = slide ? dir * 16 : 0;

  return (
    <div className="mt-4 lg:mt-5">
      <PhotoCarousel
        id={dest.id}
        photos={placePhotos[dest.id]}
        swapMode={mode}
        swapDir={dir}
        className="aspect-[16/10] w-full"
      />

      <div className="relative mt-4 min-h-[8.5rem] overflow-hidden lg:min-h-[9.5rem] lg:text-right">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, x: dx, y: dy }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -dx, y: -dy, transition: { duration: 0.28, ease: "easeIn" } }}
            transition={{ duration: slide ? 0.7 : 0.9, ease: EASE_OUT }}
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
