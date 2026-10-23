"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, type MotionValue } from "motion/react";
import type { Destination } from "@/data/destinations";
import { skyState } from "@/lib/sun";

const PLATES: Record<string, { src: string; alt: string }> = {
  sulak: { src: "/brand/gunib-eagle.jpg", alt: "Горы Гуниба, гравюра" },
  derbent: { src: "/brand/gunib-fortress.jpg", alt: "Крепость в Гунибе" },
  gunib: { src: "/brand/gunib-village.jpg", alt: "Аул в горах Гуниба" },
  khunzakh: { src: "/brand/gunib-line.jpg", alt: "Горный рисунок Гуниба" },
  goor: { src: "/brand/gunib-wall.jpg", alt: "Стена крепости в Гунибе" },
};

function washFor(alt: number) {
  if (alt < -2) return "rgba(49, 80, 89, 0.42)";
  if (alt < 3) return "rgba(178, 77, 41, 0.18)";
  if (alt < 10) return "rgba(178, 77, 41, 0.08)";
  return "transparent";
}

export function BrandStage({
  dest,
  hour,
  doy,
}: {
  dest: Destination;
  hour: MotionValue<number>;
  doy: number;
}) {
  const plate = PLATES[dest.id] ?? PLATES.gunib;
  const [wash, setWash] = useState(() => washFor(skyState(dest, doy, hour.get(), 800).alt));

  useMotionValueEvent(hour, "change", (h) => {
    setWash(washFor(skyState(dest, doy, h, 800).alt));
  });

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#ebe0cc]" aria-hidden>
      <div className="absolute inset-y-0 right-0 w-full overflow-hidden lg:w-[74%]">
        <AnimatePresence mode="sync">
          <motion.img
            key={plate.src}
            src={plate.src}
            alt=""
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1.12 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.05, ease: "easeInOut" }, scale: { duration: 22, ease: "linear" } }}
            className="absolute inset-0 h-full w-full object-cover object-[68%_28%]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 transition-colors duration-700" style={{ background: wash }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#ebe0cc] from-[18%] via-[#ebe0cc]/88 via-[42%] to-transparent to-[70%] max-lg:from-[8%] max-lg:via-[28%]" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#ebe0cc] via-[#ebe0cc]/75 to-transparent" />
    </div>
  );
}
