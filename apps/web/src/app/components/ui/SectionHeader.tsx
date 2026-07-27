"use client";

import clsx from "clsx";
import Rule from "./Rule";
import { Reveal } from "./Reveal";
import SplitLines from "./SplitLines";

/**
 * Asymmetric Swiss section head: mono index + kicker in the narrow left column,
 * display title and optional lede to its right, all sitting on a top hairline.
 */
export default function SectionHeader({
  index,
  kicker,
  titleLines,
  lede,
  className,
  aside,
}: {
  index: string;
  kicker: string;
  titleLines: string[];
  lede?: string;
  className?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className={clsx("w-full", className)}>
      <Rule weight="ink" />
      <div className="grid grid-cols-12 gap-gutter pt-5 pb-10 sm:pt-6 sm:pb-14">
        <Reveal className="col-span-12 sm:col-span-3" as="div">
          <div className="flex items-baseline gap-3 sm:block">
            <span className="font-mono text-label text-signal">{index}</span>
            <span className="label mt-0 sm:mt-2 block">{kicker}</span>
          </div>
        </Reveal>

        <div className="col-span-12 sm:col-span-9 lg:col-span-6">
          <SplitLines
            lines={titleLines}
            as="h2"
            className="text-display-l font-bold uppercase"
          />
          {lede && (
            <Reveal delay={0.15} className="mt-5 max-w-[46ch] text-body-l text-ink-2" as="p">
              {lede}
            </Reveal>
          )}
        </div>

        {aside && (
          <Reveal delay={0.2} className="col-span-12 lg:col-span-3 lg:pl-6">
            {aside}
          </Reveal>
        )}
      </div>
    </div>
  );
}
