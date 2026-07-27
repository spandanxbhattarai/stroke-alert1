import Container from "./ui/Container";
import Logo from "./ui/Logo";

const NUMBERS = [
  { label: "Ambulance", value: "102" },
  { label: "Police", value: "100" },
  { label: "Fire", value: "101" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink pb-24 pt-12 sm:pb-12">
      <Container>
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-4">
            <Logo size="lg" />
            <p className="mt-4 max-w-[32ch] text-body text-ink-2">
              A directory of stroke-ready hospitals in Nepal, built so the nearest one is never more
              than one tap away.
            </p>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <p className="label border-b border-ink pb-2">National emergency numbers</p>
            <dl>
              {NUMBERS.map((n) => (
                <div
                  key={n.value}
                  className="flex items-baseline justify-between border-b border-rule py-3"
                >
                  <dt className="text-body text-ink-2">{n.label}</dt>
                  <dd>
                    <a
                      href={`tel:${n.value}`}
                      className="font-mono text-[1.125rem] font-medium text-signal"
                      data-numeric
                    >
                      {n.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <p className="label border-b border-ink pb-2">This site</p>
            <ul>
              {[
                { href: "#network", label: "Hospital map" },
                { href: "#fast", label: "The FAST test" },
                { href: "#nearest", label: "Nearest hospitals" },
                { href: "#what-to-do", label: "What to do" },
                { href: "/admin/login", label: "For hospitals" },
              ].map((link) => (
                <li key={link.href} className="border-b border-rule">
                  <a
                    href={link.href}
                    className="tap flex items-center text-body text-ink-2 transition-colors hover:text-signal"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-micro uppercase tracking-[0.14em] text-ink-3">
            StrokeAlert — emergency response directory
          </p>
          <p className="font-mono text-micro uppercase tracking-[0.14em] text-ink-3">
            Not medical advice · Boundaries: HDX / OCHA Nepal
          </p>
        </div>
      </Container>
    </footer>
  );
}
