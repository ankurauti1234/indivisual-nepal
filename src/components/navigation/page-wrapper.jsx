"use client";
import { motion } from "framer-motion";
import React from "react";

export const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={{
      initial: {
        clipPath: "circle(0% at 50% 50%)",
        opacity: 0,
      },
      animate: {
        clipPath: "circle(100% at 50% 50%)",
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: "easeInOut",
        },
      },
      exit: {
        clipPath: "circle(0% at 50% 50%)",
        opacity: 0,
        transition: {
          duration: 0.6,
          ease: "easeInOut",
        },
      },
    }}
    style={{
      overflow: "hidden",
    }}
  >
    {children}
  </motion.div>
);
