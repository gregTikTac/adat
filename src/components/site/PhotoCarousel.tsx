"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT, EASE_SOFT, SWAP_IN, SWAP_OUT, type WipeDir } from "@/lib/wipe";

type Photo = { src: string; alt: string };

type Props = {
  /** Changes when the place changes, so the carousel starts from its first photo. */
  id: string;
  photos: Photo[];
  /** Size of the frame. Every photo fills it, so all slides have the same size. */
  className?: string;
  /** Direction the first photo of a newly chosen place drifts in from. */
  swapDir?: WipeDir;
};

/**
 * Photo slider. Every change, whether by arrows, a swipe or a new place, is a slow dissolve
 * with a small drift and a settling zoom. Edges glow, the picture zooms on hover.
 */
export function PhotoCarousel({ id, photos, className, swapDir = 1 }: Props) {
  const reduce = useReducedMotion();
  const [state, setState] = useState<{ id: string; index: number; dir: WipeDir | null }>({
    id,
    index: 0,
    dir: null,
  });
  const same = state.id === id;
  const index = same ? state.index : 0;
  const dir: WipeDir = same && state.dir !== null ? state.dir : swapDir;
  const photo = photos[index];
  const drift = reduce ? 0 : dir * 4;

  const go = (step: 1 | -1) =>
    setState({ id, index: (index + step + photos.length) % photos.length, dir: step });

  return (
    <motion.div
      className={cn("glow-frame group relative overflow-hidden bg-[#d8cbb2]", className)}
      style={{ touchAction: "pan-y" }}
      onPanEnd={(_, info) => {
        if (info.offset.x < -40) go(1);
        else if (info.offset.x > 40) go(-1);
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={`${id}-${index}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.999, transition: { duration: reduce ? 0.3 : SWAP_OUT, ease: "linear" } }}
          transition={{ duration: reduce ? 0.3 : SWAP_IN, ease: EASE_SOFT }}
        >
          <div className="h-full w-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.14]">
            <motion.img
              src={photo.src}
              alt={photo.alt}
              draggable={false}
              loading="lazy"
              decoding="async"
              initial={reduce ? false : { scale: 1.16, x: `${drift}%` }}
              animate={{ scale: 1, x: "0%" }}
              transition={{ duration: 2.4, ease: EASE_OUT }}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <span aria-hidden className="glow-edge pointer-events-none absolute inset-0" />

      {photos.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-gradient-to-t from-[#241f1a]/60 to-transparent px-4 pb-3 pt-10 text-[#ebe0cc]">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Предыдущее фото"
            className="inline-flex size-11 items-center justify-center rounded-full outline-none transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#f7ce5e]"
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="text-xs tabular-nums tracking-widest">{index + 1}</span>
          <span className="relative h-px w-20 bg-white/35 sm:w-28">
            <motion.span
              className="absolute inset-y-0 left-0 bg-[#f7ce5e]"
              animate={{ width: `${((index + 1) / photos.length) * 100}%` }}
              transition={{ duration: 0.9, ease: EASE_OUT }}
            />
          </span>
          <span className="text-xs tabular-nums tracking-widest">{photos.length}</span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Следующее фото"
            className="inline-flex size-11 items-center justify-center rounded-full outline-none transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#f7ce5e]"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
