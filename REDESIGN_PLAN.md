# StrokeAlert — Swiss Redesign Plan

**Codename:** `SIGNAL`
**Scope:** Complete visual + interaction redesign of `apps/web` (public site + admin), plus a new
interactive Nepal hospital map section on the homepage.
**Date:** 2026-07-27

---

## 0. Premise

StrokeAlert is a triage instrument, not a brochure. Someone opens it while a relative's face is
drooping. Every second of hesitation is neurons.

So the design language is **Swiss / International Typographic Style** read as a *precision
instrument panel*: a strict grid, hairline rules instead of floating cards, one signal colour,
monospaced data, and typography doing all the hierarchy work. Müller-Brockmann meets a hospital
dispatch console.

### One stated concern

Pure Swiss minimalism has a failure mode for emergency products: restraint flattens hierarchy, and
the life-saving action stops shouting. The mitigation is explicit and non-negotiable in this system:

> **Aesthetic restraint applies to everything except the emergency actions.**

- `CALL 102` is a full-bleed signal-red bar, sticky on mobile, ≥56px tap target.
- `Call` on every hospital card is signal-filled; `Directions` is ink-outlined. Never equal weight.
- The largest type on any viewport is either the headline or a phone number. Never a decoration.

---

## 1. Design tokens

### 1.1 Typography

Two faces, no more. Both loaded via `next/font/google`, self-hosted, `display: swap`.

| Role | Face | Notes |
|---|---|---|
| Display + UI | **Archivo** (variable 100–900) | True grotesque, the closest free face to Akzidenz-Grotesk / Univers. Tight negative tracking at display sizes. |
| Data + labels | **IBM Plex Mono** (400/500) | Coordinates, distances, phone numbers, section indices, counts, timestamps. Anything numeric or machine-ish. |

Explicitly rejected: Inter (the default AI-slop grotesque), Roboto, system stacks, Space Grotesk.

**Modular scale** — CSS clamp, fluid, tuned so display sizes go genuinely large:

```
display-xl   clamp(3.25rem, 11vw, 9rem)      leading .86   tracking -.045em
display-l    clamp(2.25rem, 6vw, 4.5rem)     leading .92   tracking -.035em
display-m    clamp(1.75rem, 3.5vw, 2.75rem)  leading 1.0   tracking -.025em
h3           1.0625rem                        leading 1.3   tracking -.01em  weight 600
body-l       1.0625rem                        leading 1.55
body         0.9375rem                        leading 1.55
small        0.8125rem                        leading 1.45
label        0.6875rem  MONO UPPERCASE        tracking .14em
micro        0.625rem   MONO UPPERCASE        tracking .16em
```

Rules: headlines are flush-left, ragged-right, **never centred** except the single hero eyebrow.
Labels are always mono/uppercase/tracked. Numerals in tables and cards are always mono with
`font-variant-numeric: tabular-nums`.

### 1.2 Colour

Monochrome plus exactly one chroma. No blue, no green, no purple, no gradients.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#FFFFFF` | `#0B0B0C` | page |
| `--paper-2` | `#F4F4F1` | `#141416` | inset panels, table headers |
| `--ink` | `#0B0B0C` | `#F4F4F1` | primary text, primary fills |
| `--ink-2` | `#6B6B70` | `#9A9AA0` | secondary text |
| `--ink-3` | `#A3A3A8` | `#6B6B70` | tertiary / disabled |
| `--rule` | `#E2E2DE` | `#26262A` | 1px hairlines, the workhorse |
| `--signal` | `#E8112D` | `#FF3049` | emergency only |
| `--signal-ink` | `#FFFFFF` | `#0B0B0C` | text on signal |

Status is encoded with **ink weight + the signal**, not a colour rainbow:
`Active` = filled ink chip · `Inactive` = hairline chip, `--ink-3` text · `24/7` = filled ink chip ·
`Emergency` = signal.

### 1.3 Space, grid, geometry

- **12-column grid**, 24px gutter, `max-width: 1440px`, page inset `clamp(1.25rem, 4vw, 4rem)`.
- **Asymmetric sections:** mono index + title in columns 1–3, content in 4–12.
- **Border-radius: 0.** Everywhere. Only exceptions: map markers, the live pulse dot, avatars.
- **No box-shadows.** Depth comes from hairlines and hard 1px offset borders. Single exception:
  the map tooltip and the detail drawer, which must float above the map to be legible.
- **Cards are grid cells,** separated by shared `1px` rules (negative-margin technique), not
  detached rounded boxes.
- Spacing scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`.
- Visible hairline **column guides** as a background layer behind the hero and the map — the
  signature Swiss "show your grid" move.

---

## 2. Motion language (Framer Motion)

Motion is *editorial*, not bouncy. One shared easing curve, short durations, everything
`viewport={{ once: true }}`. All of it is gated on `useReducedMotion()`.

| Pattern | Spec |
|---|---|
| `EASE` | `[0.16, 1, 0.3, 1]` (expo-out) — the house curve |
| `Reveal` | `opacity 0→1`, `y 16→0`, `.55s`, stagger `.06` on `whileInView` (`margin: -80px`) |
| `SplitLines` | Headline lines rise out of an `overflow-hidden` mask, `y 105%→0`, `.7s`, stagger `.05` |
| Rule draw-in | `scaleX 0→1`, `transform-origin: left`, `.8s` |
| `CountUp` | `useMotionValue` + `animate`, `1.1s`, mono tabular numerals |
| Button hover | signal panel sweeps in from left (`scaleX`, origin-left), label crossfades |
| Map markers | staggered `scale 0→1` (`.03` per marker), `whileHover scale 1.7` + concentric ring |
| Selected marker | shared `layoutId` crosshair that flies between markers |
| Drawer | spring `x: 100%→0` (`stiffness 260, damping 30`) inside `AnimatePresence` |
| Page load | hero orchestrates one staggered sequence; no scattered micro-fidgets elsewhere |

---

## 3. The Nepal hospital map (new)

### 3.1 Geometry pipeline

Source: [`mesaugat/geoJSON-Nepal`](https://github.com/mesaugat/geoJSON-Nepal)
(`nepal-states.geojson`, `nepal-districts-new.geojson`) — HDX/OCHA admin boundaries.

The raw files are 5.4MB + 2.1MB, far too heavy to ship. They are pre-processed **once, offline**
into `apps/web/src/app/data/nepal-map.ts` (~70KB) by `scripts/gen-nepal-map.js`:

1. Compute the country bbox — `lon 80.0586 … 88.2017`, `lat 26.3478 … 30.4473`.
2. Douglas–Peucker simplify every ring (tolerance `0.006°` provinces, `0.01°` districts) and drop
   slivers under an area threshold.
3. Project with **spherical Mercator expressed in degrees** so northing and easting share units,
   then linearly fit to a `1000 × 572.48` viewBox.
4. Emit ready-to-render `d` path strings rounded to 1 decimal.

The file also exports `projectPoint(lat, lng)`, which mirrors the generator's projection exactly —
that is what places hospital markers in the same coordinate space. Verified: Kathmandu →
`(646.6, 383.7)`, Biratnagar → `(885.8, 558.1)`, Dhangadhi → `(66.5, 246.7)`.

No map library, no tile server, no API key: a pure inline SVG. That is what makes full Swiss
styling and Framer Motion control possible, and it renders offline.

### 3.2 Composition

```
┌ 01 ─ NETWORK ──────────────────────────────────────────────┐
│  HOSPITALS          ┌──────────────────────────────────┐   │
│  ACROSS NEPAL       │   77 district hairline mesh      │   │
│                     │   7 province outlines            │   │
│  ── 12 hospitals    │   ● markers @ projected lat/lng  │   │
│  ── 7 provinces     │        ↑ hover → tooltip         │   │
│  ── 24/7: 9         │                                  │   │
│  [province filter]  └──────────────────────────────────┘   │
│                     ● 24/7   ○ limited   ✕ inactive        │
└────────────────────────────────────────────────────────────┘
```

- **Layer order:** district hairlines (`--rule`, `0.5px`) → province fills (`--paper-2`) → province
  outlines (`--ink`, `1px`) → marker halos → markers → labels.
- **Province hover** raises that province's fill and dims the others; clicking filters the marker
  set and the side list.
- **Marker states:** 24/7 = solid signal disc · limited hours = hollow ink ring · selected = signal
  disc + animated crosshair + pulse ring.
- **Marker collision:** markers are sorted by `y` so southern (front) pins draw last; overlapping
  pins in dense Kathmandu get a slight deterministic radial offset so all stay clickable.
- Markers whose coordinates fall outside the Nepal bbox are listed in the sidebar but not plotted,
  and flagged (`isInsideNepal()`), rather than silently drawn on the border.

### 3.3 Interaction contract (exactly what was asked)

| Action | Result |
|---|---|
| **Hover a marker** | Tooltip pinned to the marker: hospital **name** + **location** (`addressLine1, city · Province`), and a distance readout when geolocation is available. Marker scales 1.7×, ring animates out, crosshair snaps to it. |
| **Click a marker** | Marker becomes selected; the side panel switches to that hospital's summary with a **VIEW MORE** button. |
| **VIEW MORE** | Detail drawer slides in: full address, phone + emergency phone, type, 24/7 status, all specializations, exact coordinates, notes, plus `CALL NOW` (signal) and `DIRECTIONS` (ink outline) actions. |
| Keyboard | Every marker is a real focusable `<button>`; `Tab` cycles, `Enter` selects, `Esc` closes the drawer. Tooltip mirrors focus, so it works without a mouse. |
| Touch | No hover on touch — first tap selects and shows the tooltip, the panel's `VIEW MORE` opens the drawer. |

### 3.4 Data

Client-fetched from the existing backend: `GET /api/hospitals?pageSize=200&active=true`.

The only backend change in this redesign: thread an `active` query param through
`hospital.controller → hospital.service → hospital.repository` (the repository already accepts
`isActive`), so the public map and list never show deactivated hospitals. Everything else reuses the
API as-is.

---

## 4. Page-by-page

### 4.1 `/` — Public emergency page

| # | Section | Design |
|---|---|---|
| — | `SiteHeader` | Sticky, hairline bottom rule. Wordmark left (mono `STROKE` + bold `ALERT`), live status dot + `NEPAL EMERGENCY 102` centre, `FOR HOSPITALS →` right. Collapses to 48px on scroll. |
| — | `Hero` | Full-bleed. Visible column guides. `display-xl` headline `STROKE / EMERGENCY?` rising out of masks, line by line. Mono eyebrow with pulse dot. Two actions: `CALL 102` (signal, huge) + `FIND NEAREST` (ink outline, scrolls). Right column: a mono data block — time-to-treatment facts set like a timetable. |
| 01 | `FastProtocol` | The FAST test as four grid cells divided by shared hairlines. Giant `F A S T` letters in `display-l`, ink; description in body. Staggered reveal. Replaces the current cramped 4-up red boxes. |
| 02 | `NepalMapSection` | As specified in §3. |
| 03 | `NearestHospitals` | Geolocation-driven list. Header shows a mono readout of the resolved coordinates. Cards are hairline-divided rows, not floating boxes: rank index (mono `01`), name in `h3`, address in `--ink-2`, distance right-aligned mono, chips for 24/7 + specializations, then `CALL` / `DIRECTIONS`. Skeletons are hairline rows, not grey blobs. `LocationSearch` for the permission-denied path. |
| 04 | `WhatToDo` | Do / Don't list — two columns split by a vertical hairline. Numbered, editorial. |
| — | `EmergencyBar` | Sticky bottom signal bar on mobile, always one tap from `102`. |
| — | `SiteFooter` | Hairline grid: wordmark + emergency numbers + links + `EIN`-style meta line. Mono. |

### 4.2 Admin

| Route | Design |
|---|---|
| `/admin/login` | Split screen. Left: signal-red panel, column guides, `display-l` wordmark, mono strapline. Right: form on paper — hairline-underline inputs (no boxes), label above in mono uppercase, focus moves the underline to signal. |
| `/admin` | Dashboard. Hairline stat grid (`Total` / `Active` / `Cities`) with `CountUp` in `display-m` mono. Quick actions as ink/outline bars. Section-indexed like the public site. |
| `/admin/hospitals` | Data table. Mono uppercase headers on `--paper-2`, 1px row rules, hover tints the row `--paper-2`. Columns: name + 24/7 chip · city (mono) · phone (mono) · type chip · status toggle · actions. Search input is a hairline underline field. Pagination is mono `01 / 04` with ink arrows. |
| `/admin/hospitals/new`, `/[id]/edit` | Numbered form sections (`01 IDENTITY`, `02 ADDRESS`, `03 CONTACT`, `04 COORDINATES`, `05 CAPABILITY`, `06 NOTES`), each a grid row with the index in column 1. Specializations are hairline toggle chips that fill ink when on. Sticky action bar at the bottom. |
| `/admin/hospitals/[id]` | Detail. Definition-list layout on hairlines, mono values. Includes a **mini Nepal locator map** reusing the same SVG, with the single hospital marked — plus the Google Maps embed. |
| `Sidebar` | Ink-on-paper, hairline right rule, mono nav labels, active item marked by a signal left bar (not a rounded pill). Sign-out and back-to-site pinned bottom. |

---

## 5. File plan

```
apps/web/src/app/
  data/nepal-map.ts               NEW  generated geometry + projectPoint()
  globals.css                     REWRITE  tokens, base, grid utilities
  layout.tsx                      REWRITE  Archivo + IBM Plex Mono, theme meta
  page.tsx                        REWRITE  section composition
  components/
    ui/Container.tsx              NEW
    ui/GridLines.tsx              NEW  hairline column guides
    ui/SectionHeader.tsx          NEW  mono index + title, asymmetric
    ui/Rule.tsx                   NEW  draw-in hairline
    ui/Button.tsx                 NEW  signal / ink / outline / ghost, sweep hover
    ui/Chip.tsx                   NEW
    ui/Reveal.tsx                 NEW  whileInView stagger
    ui/SplitLines.tsx             NEW  masked line rise
    ui/CountUp.tsx                NEW
    ui/Logo.tsx                   NEW
    SiteHeader.tsx                NEW
    SiteFooter.tsx                NEW
    Hero.tsx                      REPLACES EmergencyHero
    FastProtocol.tsx              NEW
    WhatToDo.tsx                  NEW
    EmergencyBar.tsx              NEW
    HospitalList.tsx              REWRITE
    HospitalCard.tsx              REWRITE
    LocationSearch.tsx            REWRITE
    map/NepalMapSection.tsx       NEW  section shell + data fetching
    map/NepalMap.tsx              NEW  the SVG
    map/MapTooltip.tsx            NEW  hover: name + location
    map/HospitalDrawer.tsx        NEW  view more: full details
    map/MapLegend.tsx             NEW
  admin/**                        REWRITE all pages + components
apps/api/src/                     controller/service/repository: `active` param
scripts/gen-nepal-map.js          NEW  reproducible geometry generator
tailwind.config.ts                REWRITE  Swiss tokens
package.json                      + framer-motion
```

---

## 6. Accessibility & performance guardrails

- Contrast: `--ink` on `--paper` = 19.6:1; `--ink-2` on `--paper` = 5.3:1; `--signal-ink` on
  `--signal` = 4.9:1. All ≥ AA. `--ink-3` is used only for disabled states, never for content.
- Hairlines are decorative — never the sole carrier of meaning.
- All motion behind `useReducedMotion()`; the map is fully usable with animation off.
- Map markers are `<button>` elements with `aria-label` (`name, city`), so screen readers get the
  same information the tooltip shows. The sidebar list is the non-visual equivalent of the map.
- Tap targets ≥ 44px; emergency actions ≥ 56px.
- Map payload is ~70KB of static geometry, tree-shaken into one client chunk; zero runtime map
  requests, no tile server, no API key, works offline once loaded.
- Fonts: two families, `display: swap`, variable weights — no FOIT, no layout shift.

---

## 7. Out of scope

- No schema changes; no new tables or fields.
- No auth/session rework (still `localStorage` bearer token — worth revisiting, but not here).
- No new public routes: the map's `VIEW MORE` drawer carries hospital detail rather than adding a
  `/hospitals/[id]` page.
- Dark mode ships as tokens + `prefers-color-scheme`, but no in-app theme toggle.
