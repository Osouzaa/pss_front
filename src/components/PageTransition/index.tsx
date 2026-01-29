import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function PageTransition({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ minHeight: "100dvh" }}
    >
      {children}
    </motion.div>
  );
}
