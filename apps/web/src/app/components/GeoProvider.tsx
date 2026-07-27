"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * One geolocation request for the whole page. Both the nearest-hospital list and
 * the map need the visitor's position; asking twice would mean two prompts and
 * two waits during an emergency.
 */

export type GeoStatus = "idle" | "locating" | "granted" | "denied" | "unsupported";

export interface Coords {
  lat: number;
  lng: number;
}

interface GeoValue {
  status: GeoStatus;
  coords: Coords | null;
  request: () => void;
}

const GeoContext = createContext<GeoValue>({
  status: "idle",
  coords: null,
  request: () => {},
});

export function GeoProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<Coords | null>(null);

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("granted");
      },
      () => setStatus("denied"),
      { timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    request();
  }, [request]);

  const value = useMemo(() => ({ status, coords, request }), [status, coords, request]);

  return <GeoContext.Provider value={value}>{children}</GeoContext.Provider>;
}

export function useGeo() {
  return useContext(GeoContext);
}

/** Haversine distance in kilometres. Mirrors the API's own calculation. */
export function distanceKm(a: Coords, bLat: number, bLng: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - a.lat);
  const dLon = toRad(bLng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
