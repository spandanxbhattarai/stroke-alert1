/**
 * Generates a compact, pre-projected SVG path dataset for Nepal from raw GeoJSON.
 * Output: apps/web/src/app/data/nepal-map.ts
 *
 * Projection: spherical Mercator, linearly fit to a 1000-unit-wide viewBox.
 * The same projection constants are exported so runtime code can place
 * hospital lat/lng markers in exactly the same coordinate space.
 */
const fs = require("fs");
const path = require("path");

// Usage:
//   1. Download the two source files (they are ~7.5MB total and are NOT committed):
//      curl -sLO https://raw.githubusercontent.com/mesaugat/geoJSON-Nepal/master/nepal-states.geojson
//      curl -sLO https://raw.githubusercontent.com/mesaugat/geoJSON-Nepal/master/nepal-districts-new.geojson
//   2. node scripts/gen-nepal-map.js <out.ts> [srcDir=cwd]
const OUT = process.argv[2];
const SCRATCH = process.argv[3] || process.cwd();

const WIDTH = 1000;

// ---------- geometry helpers ----------

// Mercator northing, expressed in *degrees* so it shares units with longitude.
function mercY(lat) {
  const rad = (lat * Math.PI) / 180;
  return (Math.log(Math.tan(Math.PI / 4 + rad / 2)) * 180) / Math.PI;
}

function ringsOf(geometry) {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return geometry.coordinates;
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flat();
  return [];
}

// perpendicular distance from p to segment a-b
function segDist(p, a, b) {
  let x = a[0];
  let y = a[1];
  let dx = b[0] - x;
  let dy = b[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = b[0];
      y = b[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  dx = p[0] - x;
  dy = p[1] - y;
  return dx * dx + dy * dy;
}

function simplifyDP(points, sqTol) {
  const last = points.length - 1;
  const simplified = [points[0]];
  (function step(first, lastIdx) {
    let maxSqDist = sqTol;
    let index = -1;
    for (let i = first + 1; i < lastIdx; i++) {
      const sqDist = segDist(points[i], points[first], points[lastIdx]);
      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }
    if (index > -1) {
      step(first, index);
      simplified.push(points[index]);
      step(index, lastIdx);
    }
  })(0, last);
  simplified.push(points[last]);
  return simplified;
}

function ringArea(ring) {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(area / 2);
}

// ---------- load ----------

const states = JSON.parse(
  fs.readFileSync(path.join(SCRATCH, "nepal-states.geojson"), "utf8")
);
const districts = JSON.parse(
  fs.readFileSync(path.join(SCRATCH, "nepal-districts-new.geojson"), "utf8")
);

// ---------- bbox over the whole country ----------

let lonMin = Infinity;
let lonMax = -Infinity;
let latMin = Infinity;
let latMax = -Infinity;

for (const f of states.features) {
  for (const ring of ringsOf(f.geometry)) {
    for (const [lon, lat] of ring) {
      if (lon < lonMin) lonMin = lon;
      if (lon > lonMax) lonMax = lon;
      if (lat < latMin) latMin = lat;
      if (lat > latMax) latMax = lat;
    }
  }
}

const yTop = mercY(latMax); // northernmost point -> y = 0
const scale = WIDTH / (lonMax - lonMin);
const HEIGHT = (yTop - mercY(latMin)) * scale;

function project([lon, lat]) {
  return [(lon - lonMin) * scale, (yTop - mercY(lat)) * scale];
}

// ---------- path builder ----------

function toPath(feature, degTol, minAreaDeg2, precision) {
  const out = [];
  for (const ring of ringsOf(feature.geometry)) {
    if (ring.length < 4) continue;
    if (ringArea(ring) < minAreaDeg2) continue;
    const simple = simplifyDP(ring, degTol * degTol);
    if (simple.length < 4) continue;
    const pts = simple.map(project);
    let d = "M";
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = pts[i];
      d +=
        (i ? "L" : "") +
        x.toFixed(precision) +
        " " +
        y.toFixed(precision);
    }
    out.push(d + "Z");
  }
  return out.join("");
}

// ---------- provinces ----------

const PROVINCE_NAMES = {
  1: "Koshi",
  2: "Madhesh",
  3: "Bagmati",
  4: "Gandaki",
  5: "Lumbini",
  6: "Karnali",
  7: "Sudurpashchim",
};

/** Mean of the simplified outline — a good-enough interior anchor for a label. */
function labelAnchor(d) {
  const pts = (d.match(/-?[\d.]+ -?[\d.]+/g) || []).map((s) => s.split(" ").map(Number));
  const sx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
  const sy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  return [Number(sx.toFixed(1)), Number(sy.toFixed(1))];
}

const provinces = states.features
  .map((f) => {
    const key = String(f.properties.ADM1_EN).trim();
    const d = toPath(f, 0.006, 0.0008, 1);
    const [labelX, labelY] = labelAnchor(d);
    return {
      id: `P${key}`,
      no: Number(key),
      name: PROVINCE_NAMES[Number(key)] || `Province ${key}`,
      labelX,
      labelY,
      d,
    };
  })
  .filter((p) => p.d)
  .sort((a, b) => a.no - b.no);

// ---------- districts (hairline underlay) ----------

const districtList = districts.features
  .map((f) => ({
    name: String(f.properties.DIST_EN || "").trim(),
    province: Number(f.properties.ADM1_EN),
    d: toPath(f, 0.01, 0.0012, 1),
  }))
  .filter((x) => x.d)
  .sort((a, b) => a.name.localeCompare(b.name));

console.log("districts:", districtList.length);

// ---------- emit ----------

const banner = `// AUTO-GENERATED — do not edit by hand.
// Source: https://github.com/mesaugat/geoJSON-Nepal (nepal-states / nepal-districts)
// Geometry is Douglas-Peucker simplified and pre-projected (spherical Mercator)
// into the viewBox below. Regenerate with scripts/gen-nepal-map.js.
`;

const body = `${banner}
export const NEPAL_VIEWBOX = { width: ${WIDTH}, height: ${HEIGHT.toFixed(2)} } as const;

/** Projection constants — keep in sync with projectPoint() below. */
export const NEPAL_PROJECTION = {
  lonMin: ${lonMin},
  lonMax: ${lonMax},
  latMin: ${latMin},
  latMax: ${latMax},
  scale: ${scale},
  yTop: ${yTop},
} as const;

/**
 * Projects a WGS84 coordinate into NEPAL_VIEWBOX space.
 * Must mirror the generator's projection exactly.
 */
export function projectPoint(lat: number, lng: number): { x: number; y: number } {
  const { lonMin, scale, yTop } = NEPAL_PROJECTION;
  const mercY =
    (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
  return { x: (lng - lonMin) * scale, y: (yTop - mercY) * scale };
}

/** True when a coordinate falls inside Nepal's bounding box. */
export function isInsideNepal(lat: number, lng: number): boolean {
  const { lonMin, lonMax, latMin, latMax } = NEPAL_PROJECTION;
  return lat >= latMin && lat <= latMax && lng >= lonMin && lng <= lonMax;
}

export interface NepalProvince {
  id: string;
  no: number;
  name: string;
  /** Interior anchor for an on-map label, in viewBox space. */
  labelX: number;
  labelY: number;
  d: string;
}

export const NEPAL_PROVINCES: NepalProvince[] = ${JSON.stringify(provinces, null, 2)};

export interface NepalDistrict {
  name: string;
  province: number;
  d: string;
}

/** All 77 districts, drawn as a hairline mesh beneath the province outlines. */
export const NEPAL_DISTRICTS: NepalDistrict[] = ${JSON.stringify(districtList)};
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, body, "utf8");

console.log("viewBox:", WIDTH, HEIGHT.toFixed(2));
console.log("bbox lon:", lonMin, lonMax, "lat:", latMin, latMax);
console.log("provinces:", provinces.map((p) => `${p.no} ${p.name} (${p.d.length}b)`).join(", "));
console.log("output bytes:", fs.statSync(OUT).size);
