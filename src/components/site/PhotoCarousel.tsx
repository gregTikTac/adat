"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT, EASE_WIPE, wipeHidden, wipeShown, type WipeDir } from "@/lib/wipe";

type Photo = { src: string; alt: string };

type Props = {
  /** Changes when the place changes, so the carousel starts from its first photo. */
  id: string;
  photos: Photo[];
  /** Size of the frame. Every photo fills it, so all slides have the same size. */
  className?: string;
};

/**
 * Photo slider: slides replace each other with a diagonal wipe, the picture settles
 * from a slight zoom, the edges glow and the picture zooms on hover.
 */
export function PhotoCarousel({ id, photos, className }: Props) {
  const reduce = useReducedMotion();
  const [state, setState] = useState<{ id: string; index: number; dir: WipeDir }>({ id, index: 0, dir: 1 });
  const index = state.id === id ? state.index : 0;
  const dir: WipeDir = state.id === id ? state.dir : 1;
  const photo = photos[index];

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
          initial={reduce ? { opacity: 0 } : { clipPath: wipeHidden(dir) }}
          animate={reduce ? { opacity: 1 } : { clipPath: wipeShown(dir) }}
          exit={{ opacity: 0.999, transition: { duration: 1.15, ease: "linear" } }}
          transition={{ duration: reduce ? 0.3 : 1.05, ease: EASE_WIPE }}
        >
          <div className="h-full w-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.14]">
            <motion.img
              src={photo.src}
              alt={photo.alt}
              draggable={false}
              loading="lazy"
              decoding="async"
              initial={reduce ? false : { scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: EASE_OUT }}
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
              transition={{ duration: 0.6, ease: EASE_OUT }}
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
