import { motion } from "motion/react";
import { pageVariants } from "@/lib/animations";
import type { ReactNode } from "react";

export function AnimatedPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
