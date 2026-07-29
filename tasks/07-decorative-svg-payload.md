# ~6.5 MB of decorative SVG loads on every page

**Where:** `public/*-tag.svg`, `public/spray-bomb.svg`, rendered by
`src/components/site-background.tsx` via `src/components/landing/decorative-svg.tsx`
**Status:** not started — recorded from the audit of 2026-07-30

## What happens

`SiteBackground` is mounted in the root layout, so all nine decorations render on
every route. Five of them are very large:

| File | Size | Contents |
| --- | --- | --- |
| `spray-bomb.svg` | 2.4 MB | vector, enormous path data |
| `multimedia-tag.svg` | 1.3 MB | base64-embedded raster |
| `marketing-tag.svg` | 1.1 MB | base64-embedded raster |
| `communication-tag.svg` | 928 KB | base64-embedded raster |
| `design-tag.svg` | 724 KB | base64-embedded raster |

`next/image` does not optimize SVG — no resizing, no format conversion — so
these ship byte-for-byte to every visitor. The four tags are PNGs wearing an
`.svg` extension: base64 inflates the bytes by a third and defeats image
compression on the way out.

Two extra wrinkles:

- `spray-bomb` is `hidden lg:block` (`decorative-svg.tsx`), but the `<img>` is
  still in the markup, so phones download all 2.4 MB to render nothing.
- The staff dashboard, the login page, and the ballot all pay for this too,
  though none of them is the graffiti-wall landing page the art was drawn for.

## Why it was left

It is an asset-authoring job, not a code change — the four tags need
re-exporting from the design source as real rasters, and `spray-bomb.svg` needs
running through SVGO (or re-exporting at a sane path precision). That wants
whoever owns the Figma file, and the result should be eyeballed against the
current look rather than swapped in blind.

## What to do

1. Re-export the four `*-tag` files as PNG (or WebP) at their rendered size and
   render them through `next/image`, which will then actually optimize them.
   Rendered widths are ~17–20% of viewport, so nothing needs to be 1000 px wide.
2. Run `spray-bomb.svg` through SVGO; if it stays in the megabytes, it is a
   raster in disguise too and belongs in step 1.
3. Give `spray-bomb` a `<picture>`/`sizes` treatment (or drop it from the DOM
   below `lg`) so mobile does not fetch what it cannot see.
4. Consider not rendering `SiteBackground` on the dashboard routes at all. It is
   `aria-hidden` decoration behind a data table.

## Verifying

`du -h public/*.svg` for the payload, and the Network panel's transferred total
on a cold load of `/` and `/hr`. Today `/hr` transfers several megabytes of
background it never shows to an admin reading a table.
