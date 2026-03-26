import type { Metadata } from "next";
import EmergencyHero from "./components/EmergencyHero";
import HospitalList from "./components/HospitalList";
import { getJsonLd } from "./lib/seo";

export const metadata: Metadata = {
  title: "Brain Stroke Emergency Help — Find Nearest Hospital Now",
  description:
    "Get immediate help for brain stroke. Find the nearest hospital, call directly, or get directions instantly. Available 24/7.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const jsonLd = getJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-white">
        {/* Top bar */}
        <nav className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚨</span>
            <span className="text-xl font-black tracking-tight">STROKE ALERT</span>
          </div>
          <a
            href="/admin/login"
            className="text-xs text-red-200 hover:text-white transition-colors underline"
          >
            For Hospitals
          </a>
        </nav>

        {/* Emergency Hero */}
        <EmergencyHero />

        {/* Hospital List — Client component with geolocation */}
        <section aria-label="Nearest hospitals" className="px-4 pb-12">
          <HospitalList />
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 text-center py-6 px-4 text-sm">
          <p>StrokeAlert — Emergency Response Platform</p>
          <p className="mt-1">
            Nepal Emergency: <a href="tel:102" className="text-red-400 font-bold">102</a>
          </p>
        </footer>
      </main>
    </>
  );
}
