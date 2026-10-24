"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/** Photo that drifts slightly while scrolling, with the same edge glow and hover zoom as GlowImage. */
export function ParallaxImage({
  src,
  alt,
  className,
  speed = 30,
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -speed, reduce ? 0 : speed]);

  return (
    <div ref={ref} className={cn("glow-frame group relative overflow-hidden bg-[#d8cbb2]", className)}>
      <motion.div style={{ y, scale: 1.08 }} className="absolute inset-0">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.14]"
        />
      </motion.div>
      <span aria-hidden className="glow-edge pointer-events-none absolute inset-0" />
    </div>
  );
}
