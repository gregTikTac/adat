"use client";

import { motion } from "motion/react";

/** Tour-operator symbol from brand-book pages 6–7. It appears once the intro mark has landed. */
export function AdatMark({ className = "h-12 w-auto", show = true }: { className?: string; show?: boolean }) {
  return (
    <motion.img
      src="/brand/mark.png"
      alt=""
      className={className}
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.01 }}
    />
  );
}
