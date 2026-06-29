"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const landingEase = [0.22, 1, 0.36, 1] as const;

type Direction = "up" | "down" | "left" | "right" | "none";

type MotionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

function offsetFor(direction: Direction) {
  switch (direction) {
    case "down":
      return { y: -18 };
    case "left":
      return { x: 18 };
    case "right":
      return { x: -18 };
    case "none":
      return {};
    case "up":
    default:
      return { y: 18 };
  }
}

function revealVariants(direction: Direction, delay = 0): Variants {
  return {
    hidden: {
      opacity: 0,
      filter: "blur(8px)",
      ...offsetFor(direction),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay,
        duration: 0.72,
        ease: landingEase,
      },
    },
  };
}

export function Reveal({
  children,
  className,
  id,
  direction = "up",
  delay = 0,
  amount = 0.24,
}: MotionProps & {
  direction?: Direction;
  delay?: number;
  amount?: number;
}) {
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion === true;

  return (
    <motion.div
      id={id}
      className={className}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      variants={revealVariants(direction, shouldReduceMotion ? 0 : delay)}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  id,
  stagger = 0.075,
  delay = 0,
  amount = 0.18,
}: MotionProps & {
  stagger?: number;
  delay?: number;
  amount?: number;
}) {
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion === true;
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: shouldReduceMotion ? 0 : delay,
        staggerChildren: shouldReduceMotion ? 0 : stagger,
      },
    },
  };

  return (
    <motion.div
      id={id}
      className={className}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -10% 0px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  id,
  direction = "up",
}: MotionProps & {
  direction?: Direction;
}) {
  return (
    <motion.div id={id} className={className} variants={revealVariants(direction)}>
      {children}
    </motion.div>
  );
}

export function SoftFloat({ children, className, id }: MotionProps) {
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion === true;

  return (
    <motion.div
      id={id}
      className={className}
      animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
}
