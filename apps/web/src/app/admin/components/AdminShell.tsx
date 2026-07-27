import Sidebar from "./Sidebar";
import Rule from "../../components/ui/Rule";
import { Reveal } from "../../components/ui/Reveal";

/**
 * Shared admin frame: nav rail plus a page head on the same asymmetric grid the
 * public site uses, so both halves of the product read as one system.
 */
export default function AdminShell({
  index,
  kicker,
  title,
  lede,
  actions,
  children,
}: {
  index: string;
  kicker: string;
  title: string;
  lede?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 px-inset py-8 sm:py-10">
        <Rule weight="ink" animate={false} />

        <div className="flex flex-col gap-6 pb-8 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-label tracking-[0.14em] text-signal">{index}</span>
              <span className="label">{kicker}</span>
            </div>
            <h1 className="mt-3 text-display-m font-bold uppercase leading-none">{title}</h1>
            {lede && <p className="mt-3 max-w-[52ch] text-body text-ink-2">{lede}</p>}
          </Reveal>

          {actions && (
            <Reveal delay={0.08} className="flex shrink-0 flex-wrap gap-px">
              {actions}
            </Reveal>
          )}
        </div>

        {children}
      </main>
    </div>
  );
}
