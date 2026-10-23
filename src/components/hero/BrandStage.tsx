"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Destination } from "@/data/destinations";

type Plate = { src: string; alt: string; focus: string };

/** Each route keeps its own plates. Paintings sit with the Gunib book plates that match that place. */
const PLATES: Record<string, Plate[]> = {
  sulak: [
    { src: "/brand/sulak-canyon.jpg", alt: "Сулакский каньон", focus: "object-[70%_40%]" },
    { src: "/brand/sulak-river.jpg", alt: "Река в Сулакском каньоне", focus: "object-center" },
  ],
  derbent: [
    { src: "/brand/derbent-engraving.png", alt: "Цитадель Дербента", focus: "object-[58%_32%]" },
  ],
  gunib: [
    { src: "/brand/gunib-aivazovsky.jpg", alt: "Аул Гуниб", focus: "object-[56%_40%]" },
    { src: "/brand/gunib-village.jpg", alt: "Аул в горах Гуниба", focus: "object-[68%_28%]" },
    { src: "/brand/gunib-eagle.jpg", alt: "Горы Гуниба и орёл", focus: "object-[70%_26%]" },
    { src: "/brand/gunib-fortress.jpg", alt: "Крепость Гуниба", focus: "object-[64%_32%]" },
  ],
  khunzakh: [
    { src: "/brand/gunib-line.jpg", alt: "Горный рисунок для плато", focus: "object-[64%_34%]" },
  ],
  goor: [
    { src: "/brand/goor-tower.jpg", alt: "Башня на кромке обрыва", focus: "object-[40%_42%]" },
    { src: "/brand/gunib-wall.jpg", alt: "Стена над ущельем", focus: "object-[66%_30%]" },
  ],
};

const HOLD_MS = 12000;

export function BrandStage({ dest }: { dest: Destination }) {
  const plates = PLATES[dest.id] ?? PLATES.gunib;
  const [frame, setFrame] = useState(0);
  const [opened, setOpened] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 72]);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpened(true), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setFrame(0);
    if (plates.length < 2 || reduce) return;
    const id = window.setInterval(() => {
      setFrame((n) => (n + 1) % plates.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [dest.id, plates, reduce]);

  const plate = plates[frame % plates.length];
  const reveal = !opened && !reduce;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#ebe0cc]" aria-hidden>
      <motion.div style={{ y }} className="absolute inset-y-0 right-0 w-full overflow-hidden lg:w-[78%]">
        <AnimatePresence mode="sync">
          <motion.img
            key={`${dest.id}-${plate.src}`}
            src={plate.src}
            alt=""
            initial={
              reveal
                ? { clipPath: "inset(12% 8% 16% 20%)", opacity: 0.35, scale: 1.02 }
                : { opacity: 0, scale: 1.03 }
            }
            animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scale: reduce ? 1 : 1.06 }}
            exit={{ opacity: 0 }}
            transition={{
              clipPath: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.9, ease: "easeInOut" },
              scale: { duration: reduce ? 0.4 : HOLD_MS / 1000, ease: "linear" },
            }}
            className={`absolute inset-0 h-full w-full object-cover ${plate.focus}`}
          />
        </AnimatePresence>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#ebe0cc] from-[12%] via-[#ebe0cc]/92 via-[38%] to-transparent to-[70%] max-lg:from-[#ebe0cc]/95 max-lg:via-[#ebe0cc]/55 max-lg:to-[#ebe0cc]/10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#ebe0cc] via-[#ebe0cc]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#ebe0cc] via-[#ebe0cc]/75 to-transparent lg:h-[18%] lg:via-[#ebe0cc]/40" />
    </div>
  );
}
