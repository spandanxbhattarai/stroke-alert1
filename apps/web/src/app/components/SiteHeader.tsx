"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import Container from "./ui/Container";
import Logo from "./ui/Logo";
import LiveDot from "./ui/LiveDot";
import { ArrowRightIcon } from "./ui/Icons";
import { DUR, EASE } from "./ui/motion";

export default function SiteHeader() {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 24));

  return (
    <motion.header
      className="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur-sm"
      initial={false}
      animate={{ height: condensed ? 52 : 68 }}
      transition={{ duration: DUR.base, ease: EASE }}
    >
      <Container className="flex h-full items-center justify-between gap-4">
        <a href="#top" aria-label="StrokeAlert home" className="shrink-0">
          <Logo size={condensed ? "sm" : "md"} />
        </a>

        <div className="hidden items-center gap-2.5 sm:flex">
          <LiveDot />
          <span className="label-ink">Nepal emergency</span>
          <a
            href="tel:102"
            className="font-mono text-label tracking-[0.14em] text-signal underline decoration-signal/40 underline-offset-4 transition-colors hover:decoration-signal"
          >
            102
          </a>
        </div>

        <a
          href="/admin/login"
          className={clsx(
            "group flex shrink-0 items-center gap-2 font-mono text-micro uppercase tracking-[0.14em]",
            "text-ink-2 transition-colors hover:text-ink"
          )}
        >
          For hospitals
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-swiss group-hover:translate-x-1" />
        </a>
      </Container>
    </motion.header>
  );
}
