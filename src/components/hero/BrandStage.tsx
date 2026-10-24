"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Destination } from "@/data/destinations";
import { EASE_OUT, EASE_WIPE, wipeHidden, wipeShown, type WipeDir } from "@/lib/wipe";

type Plate = { src: string; alt: string; focus: string };

/** Each route keeps its own plates. Light WebP copies of the brand pictures (see public/brand/web). */
const PLATES: Record<string, Plate[]> = {
  sulak: [
    { src: "/brand/web/sulak-canyon.webp", alt: "Сулакский каньон", focus: "object-[70%_40%]" },
    { src: "/brand/web/sulak-river.webp", alt: "Река в Сулакском каньоне", focus: "object-center" },
  ],
  derbent: [
    { src: "/brand/web/derbent-engraving.webp", alt: "Цитадель Дербента", focus: "object-[58%_32%]" },
  ],
  gunib: [
    { src: "/brand/web/gunib-aivazovsky.webp", alt: "Аул Гуниб", focus: "object-[56%_40%]" },
    { src: "/brand/web/gunib-village.webp", alt: "Аул в горах Гуниба", focus: "object-[68%_28%]" },
    { src: "/brand/web/gunib-eagle.webp", alt: "Горы Гуниба и орёл", focus: "object-[70%_26%]" },
    { src: "/brand/web/gunib-fortress.webp", alt: "Крепость Гуниба", focus: "object-[64%_32%]" },
  ],
  khunzakh: [
    { src: "/brand/web/gunib-line.webp", alt: "Горный рисунок для плато", focus: "object-[64%_34%]" },
  ],
  goor: [
    { src: "/brand/web/goor-tower.webp", alt: "Башня на кромке обрыва", focus: "object-[40%_42%]" },
    { src: "/brand/web/gunib-wall.webp", alt: "Стена над ущельем", focus: "object-[66%_30%]" },
  ],
};

const HOLD_MS = 12000;

type Props = { dest: Destination; dir: WipeDir; ready: boolean };

/**
 * Hero background. Changing the place wipes the new picture in along a diagonal,
 * with a short zoom-out, so the swap reads as one movement. Pictures are decoded
 * before they are shown and the rest are warmed up in the background.
 */
export function BrandStage({ dest, dir, ready }: Props) {
  const plates = PLATES[dest.id] ?? PLATES.gunib;
  const [slide, setSlide] = useState({ id: dest.id, n: 0 });
  const frame = slide.id === dest.id ? slide.n : 0;
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 72]);

  useEffect(() => {
    const warm = window.setTimeout(() => {
      Object.values(PLATES)
        .flat()
        .forEach((p) => {
          const img = new Image();
          img.src = p.src;
          void img.decode?.().catch(() => {});
        });
    }, 500);
    return () => window.clearTimeout(warm);
  }, []);

  useEffect(() => {
    if (plates.length < 2 || reduce) return;
    const id = window.setInterval(() => {
      setSlide((s) => ({ id: dest.id, n: ((s.id === dest.id ? s.n : 0) + 1) % plates.length }));
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [dest.id, plates, reduce]);

  const plate = plates[frame % plates.length];

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#ebe0cc]" aria-hidden>
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 top-0 h-[68%] overflow-hidden lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[78%]"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={`${dest.id}-${frame}`}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { clipPath: wipeHidden(dir) }}
            animate={ready ? (reduce ? { opacity: 1 } : { clipPath: wipeShown(dir) }) : undefined}
            exit={{ opacity: 0.999, transition: { duration: 1.25, ease: "linear" } }}
            transition={{ duration: reduce ? 0.4 : 1.15, ease: EASE_WIPE }}
          >
            <motion.img
              src={plate.src}
              alt=""
              draggable={false}
              initial={reduce ? false : { scale: 1.22 }}
              animate={ready ? { scale: reduce ? 1 : 1.06 } : undefined}
              transition={{ duration: reduce ? 0.4 : 2.4, ease: EASE_OUT }}
              className={`h-full w-full object-cover max-lg:object-center ${plate.focus}`}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#ebe0cc] from-0% via-[#ebe0cc]/95 via-[45%] to-transparent to-[75%] max-lg:hidden" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#ebe0cc]/90 via-[#ebe0cc]/45 to-transparent lg:h-28 lg:from-[#ebe0cc] lg:via-[#ebe0cc]/80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#ebe0cc] via-[#ebe0cc]/92 via-[55%] to-transparent lg:h-[18%] lg:via-[#ebe0cc]/40" />
    </div>
  );
}
