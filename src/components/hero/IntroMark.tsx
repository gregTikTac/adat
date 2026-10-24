"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { brand } from "@/config/brand";

const HOLD_MS = 1900;
const FLY_S = 1.05;

type Fly = { x: number; y: number; scale: number };

/**
 * Opening scene: the ADAT mark glows in the middle of a clean sheet, the name appears,
 * then the mark flies up into the header while a ring of light spreads over the page.
 * `targetId` is the element the mark lands on.
 */
export function IntroMark({
  targetId,
  onFly,
  onDone,
}: {
  targetId: string;
  /** The mark starts flying: the page behind it can begin to appear. */
  onFly: () => void;
  /** The mark has landed in the header. */
  onDone: () => void;
}) {
  const reduce = useReducedMotion();
  const markRef = useRef<HTMLDivElement>(null);
  const [fly, setFly] = useState<Fly | null>(null);

  useEffect(() => {
    if (reduce) {
      onFly();
      onDone();
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      const from = markRef.current?.getBoundingClientRect();
      const to = document.getElementById(targetId)?.getBoundingClientRect();
      if (!from || !to || !from.height) {
        onDone();
        return;
      }
      setFly({
        x: to.left + to.width / 2 - (from.left + from.width / 2),
        y: to.top + to.height / 2 - (from.top + from.height / 2),
        scale: to.height / from.height,
      });
      onFly();
    }, HOLD_MS);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previous;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, targetId]);

  if (reduce) return null;

  const flying = fly !== null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden>
      <motion.div
        className="absolute inset-0 bg-[#ebe0cc]"
        animate={{ opacity: flying ? 0 : 1 }}
        transition={{ duration: FLY_S * 0.9, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 grid place-items-center">
        <div className="relative flex flex-col items-center">
          <span className="intro-halo absolute left-1/2 top-[60px] size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,206,94,0.55),rgba(247,206,94,0)_68%)]" />

          {flying && (
            <motion.span
              className="absolute left-1/2 top-[60px] size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f7ce5e]"
              initial={{ scale: 0.4, opacity: 0.7 }}
              animate={{ scale: 22, opacity: 0 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            />
          )}

          <motion.div
            ref={markRef}
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={flying ? { opacity: 1, scale: fly.scale, x: fly.x, y: fly.y } : { opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={flying ? { duration: FLY_S, ease: [0.76, 0, 0.24, 1] } : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => {
              if (flying) onDone();
            }}
          >
            <img src="/brand/mark.png" alt="" className="h-[120px] w-auto" draggable={false} />
          </motion.div>

          <motion.div
            className="mt-6 text-center text-[#315059]"
            initial={{ opacity: 0, y: 14 }}
            animate={flying ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
            transition={flying ? { duration: 0.4 } : { duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-display text-4xl tracking-[0.4em] sm:text-5xl">{brand.name}</p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-[#443A2C]/70 sm:text-xs">{brand.descriptor}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
