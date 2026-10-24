"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

type Part = string | { text: string; className?: string };
type Tag = "h1" | "h2" | "h3" | "p" | "div";

type Props = {
  parts: Part[];
  as?: Tag;
  className?: string;
  /** Seconds before the first letter appears. */
  delay?: number;
  /** Letter spacing the text starts with and settles to. */
  trackFrom?: string;
  trackTo?: string;
  /** Play right away instead of waiting for the heading to scroll into view. */
  immediate?: boolean;
  /** With `immediate`: hold the heading hidden until this becomes true. */
  active?: boolean;
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Heading whose letters surface one by one out of a slight blur while the
 * spacing between them tightens. Screen readers get the full text via aria-label.
 */
export function AnimatedHeading({
  parts,
  as = "h2",
  className,
  delay = 0,
  trackFrom = "0.14em",
  trackTo = "0em",
  immediate = false,
  active = true,
}: Props) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.h2;

  const normalized = parts.map((p) => (typeof p === "string" ? { text: p, className: undefined } : p));
  const label = normalized.map((p) => (p.text === "\n" ? " " : p.text)).join("");

  const container: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4, delay } } }
    : {
        hidden: { letterSpacing: trackFrom },
        show: {
          letterSpacing: trackTo,
          transition: { duration: 1.5, delay, ease: EASE, delayChildren: delay, staggerChildren: 0.032 },
        },
      };

  const letter: Variants = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
        show: { opacity: 1, y: "0em", filter: "blur(0px)", transition: { duration: 0.95, ease: EASE } },
      };

  const trigger = immediate
    ? { animate: active ? ("show" as const) : ("hidden" as const) }
    : { whileInView: "show" as const, viewport: { once: true, margin: "-8% 0px" } };

  return (
    <MotionTag aria-label={label} className={className} variants={container} initial="hidden" {...trigger}>
      {normalized.map((part, pi) => {
        if (part.text === "\n") return <br key={`br-${pi}`} />;
        return part.text.split(/(\s+)/).map((token, ti) => {
          if (token === "") return null;
          if (/^\s+$/.test(token)) return " ";
          return (
            <span
              key={`${pi}-${ti}`}
              aria-hidden
              className={`inline-block whitespace-nowrap ${part.className ?? ""}`}
            >
              {Array.from(token).map((char, ci) => (
                <motion.span key={ci} variants={letter} className="inline-block">
                  {char}
                </motion.span>
              ))}
            </span>
          );
        });
      })}
    </MotionTag>
  );
}
