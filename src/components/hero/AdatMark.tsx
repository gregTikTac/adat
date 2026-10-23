"use client";

import { motion } from "motion/react";

/** Tour-operator symbol from brand-book pages 6–7. Lines reveal on load. */
export function AdatMark({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <motion.img
      src="/brand/mark.png"
      alt=""
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0.4 }}
      animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
      transition={{ duration: 1.15, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
