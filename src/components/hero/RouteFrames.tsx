"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Destination } from "@/data/destinations";
import { placePhotos } from "@/data/places";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const TILT = [-4, 2.5, -1.5];

type Props = { dest: Destination };

/** Small full-color prints beside the active route. Click opens the frame. */
export function RouteFrames({ dest }: Props) {
  const photos = placePhotos[dest.id];
  const [open, setOpen] = useState<number | null>(null);
  const photo = open === null ? null : photos[open];

  return (
    <>
      <div className="mt-1 flex items-end gap-2 lg:mt-4 lg:justify-end" aria-label={`Кадры: ${dest.name}`}>
        <AnimatePresence mode="popLayout">
          {photos.map((item, i) => (
            <motion.button
              key={item.src}
              type="button"
              initial={{ opacity: 0, y: 16, rotate: TILT[i] ?? 0 }}
              animate={{ opacity: 1, y: 0, rotate: TILT[i] ?? 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, rotate: 0, zIndex: 2 }}
              onClick={() => setOpen(i)}
              className="relative h-[4.25rem] w-[3.35rem] shrink-0 bg-[#ebe0cc] p-[3px] shadow-[0_14px_28px_rgba(0,0,0,0.38)] sm:h-[5.25rem] sm:w-[4.1rem]"
            >
              <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={open !== null} onOpenChange={(next) => !next && setOpen(null)}>
        <DialogContent className="max-w-4xl gap-3 rounded-none border-0 bg-[#ebe0cc] p-3 text-[#443a2c] ring-0 sm:max-w-4xl sm:p-4">
          <DialogTitle className="pr-8 font-heading text-2xl font-light">{dest.name}</DialogTitle>
          {photo && (
            <img src={photo.src} alt={photo.alt} className="max-h-[74vh] w-full object-contain" />
          )}
          {photo && <p className="text-xs tracking-wide text-[#443a2c]/70">{photo.alt}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}
