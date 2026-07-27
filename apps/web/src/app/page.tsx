import type { Metadata } from "next";
import { GeoProvider } from "./components/GeoProvider";
import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import NepalMapSection from "./components/map/NepalMapSection";
import FastProtocol from "./components/FastProtocol";
import HospitalList from "./components/HospitalList";
import WhatToDo from "./components/WhatToDo";
import EmergencyBar from "./components/EmergencyBar";
import SiteFooter from "./components/SiteFooter";
import { getJsonLd } from "./lib/seo";

export const metadata: Metadata = {
  title: "Brain Stroke Emergency Help — Find Nearest Hospital Now",
  description:
    "Get immediate help for brain stroke. Find the nearest hospital, call directly, or get directions instantly. Available 24/7.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = getJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* One geolocation request, shared by the map and the nearest-hospital list. */}
      <GeoProvider>
        <SiteHeader />
        <main>
          <Hero />
          <NepalMapSection />
          <FastProtocol />
          <HospitalList />
          <WhatToDo />
        </main>
        <SiteFooter />
        <EmergencyBar />
      </GeoProvider>
    </>
  );
}
