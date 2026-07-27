import {
  NEPAL_PROJECTION,
  NEPAL_PROVINCES,
  projectPoint,
  type NepalProvince,
} from "../data/nepal-map";

/**
 * Geometry helpers for the Nepal map: path parsing, point-in-province lookup,
 * marker de-collision, and a truthful scale bar.
 *
 * Province membership is resolved *geometrically* rather than from the
 * hospital's `state` string — admins type that field freely, and a marker's
 * position is the only thing we can actually trust.
 */

type Ring = Array<[number, number]>;

/** Parses the generated `M x y L x y … Z` subpaths back into point rings. */
function parsePath(d: string): Ring[] {
  const rings: Ring[] = [];
  for (const chunk of d.split("M").slice(1)) {
    const ring: Ring = [];
    for (const pair of chunk.replace(/Z$/, "").split("L")) {
      const [x, y] = pair.trim().split(/\s+/).map(Number);
      if (Number.isFinite(x) && Number.isFinite(y)) ring.push([x, y]);
    }
    if (ring.length > 2) rings.push(ring);
  }
  return rings;
}

/** Axis-aligned bounds, used to skip provinces before the expensive test. */
interface PreparedProvince {
  province: NepalProvince;
  rings: Ring[];
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

let prepared: PreparedProvince[] | null = null;

function getPrepared(): PreparedProvince[] {
  if (prepared) return prepared;
  prepared = NEPAL_PROVINCES.map((province) => {
    const rings = parsePath(province.d);
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const ring of rings) {
      for (const [x, y] of ring) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    return { province, rings, minX, maxX, minY, maxY };
  });
  return prepared;
}

/** Even-odd ray casting across every ring of a province. */
function ringsContain(rings: Ring[], px: number, py: number): boolean {
  let inside = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
  }
  return inside;
}

/** The province containing a viewBox-space point, or null if outside Nepal. */
export function provinceAtPoint(x: number, y: number): NepalProvince | null {
  for (const p of getPrepared()) {
    if (x < p.minX || x > p.maxX || y < p.minY || y > p.maxY) continue;
    if (ringsContain(p.rings, x, y)) return p.province;
  }
  return null;
}

export function provinceForCoords(lat: number, lng: number): NepalProvince | null {
  const { x, y } = projectPoint(lat, lng);
  return provinceAtPoint(x, y);
}

/**
 * Nudges markers that would otherwise stack into an unclickable pile
 * (Kathmandu has several hospitals within a couple of km). Deterministic, so
 * pins never jump between renders.
 */
export function spreadMarkers<T extends { x: number; y: number }>(
  points: T[],
  cell = 11,
  radius = 8
): T[] {
  const buckets = new Map<string, T[]>();
  for (const p of points) {
    const key = `${Math.round(p.x / cell)}:${Math.round(p.y / cell)}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(p);
    else buckets.set(key, [p]);
  }

  const out: T[] = [];
  for (const bucket of buckets.values()) {
    if (bucket.length === 1) {
      out.push(bucket[0]);
      continue;
    }
    // Fan the collided pins around their shared centre.
    const step = (Math.PI * 2) / bucket.length;
    bucket.forEach((p, i) => {
      const angle = i * step - Math.PI / 2;
      out.push({
        ...p,
        x: p.x + Math.cos(angle) * radius,
        y: p.y + Math.sin(angle) * radius,
      });
    });
  }

  // Southern pins draw last so they sit in front, like a real relief map.
  return out.sort((a, b) => a.y - b.y);
}

/** viewBox units per kilometre at Nepal's mid-latitude — for an honest scale bar. */
export function unitsPerKm(): number {
  const midLat = (NEPAL_PROJECTION.latMin + NEPAL_PROJECTION.latMax) / 2;
  const kmPerLonDegree = 111.32 * Math.cos((midLat * Math.PI) / 180);
  return NEPAL_PROJECTION.scale / kmPerLonDegree;
}

/** Formats a signed coordinate the way a map margin should: 27.7172° N */
export function formatCoord(value: number, axis: "lat" | "lng"): string {
  const hemisphere = axis === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
  return `${Math.abs(value).toFixed(4)}° ${hemisphere}`;
}
