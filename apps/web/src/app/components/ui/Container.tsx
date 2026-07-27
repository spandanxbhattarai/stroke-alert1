import clsx from "clsx";
import { createElement } from "react";

/** The 1440px / 12-column page frame. Every section sits inside one. */
export default function Container({
  className,
  children,
  as = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "header" | "footer" | "nav" | "main";
}) {
  return createElement(
    as,
    { className: clsx("mx-auto w-full max-w-grid px-inset", className) },
    children
  );
}
