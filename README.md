# Bynet Protocol — Website

Marketing landing page for **Bynet Protocol**, a trading protocol based on the
Order Book pattern — liquidity provider infrastructure for Cardano.

Rebuilt from the Figma design
([Bynet Protocol website](https://www.figma.com/design/Gv1aWbr82kamH4px0ON6qY/Bynet-Protocol-website))
as a self-contained static site — no build step, no dependencies.

## Run

Open `index.html` directly, or serve the folder:

```bash
# any static server works
python3 -m http.server 8777
# then visit http://localhost:8777
```

## Structure

| File            | Purpose                                                            |
|-----------------|-------------------------------------------------------------------|
| `index.html`    | Page markup (nav, hero, 3 protocol-layer sections, CTA, footer).  |
| `styles.css`    | All styling + responsive rules (1440 / 768 / 375 breakpoints).    |
| `iso.js`        | Renders the isometric 3D block illustrations as inline SVG.       |
| `script.js`     | Mobile menu toggle + sticky-nav scrolled state.                   |
| `assets/`       | Favicon.                                                          |

## Sections

1. **Nav** — logo, Home · Protocol Layers, Get Started
2. **Hero** — "Liquidity provider infrastructure for Cardano" + Explore Protocol / See Pitchdeck
3. **On-chain Order Book** — copy + 3 feature cards + cube-grid render
4. **Matchmaking Engine** — copy with highlighted stake-pool paragraph
5. **Problem solving with Bynet Protocol** — 3 points + block render
6. **Build your own DeFi product** — dark CTA
7. **Footer** — links + social icons

## Notes

- **Design tokens** live at the top of `styles.css` (`:root`) — primary blue
  `#2f6bff`, heading navy `#0b1b36`, dark section `#0b1526`. Fonts are
  Sora (headings) + Inter (body) via Google Fonts.
- The **3D block illustrations** are recreated procedurally in SVG (`iso.js`)
  because the original raster renders can't be exported from Figma. To use the
  real artwork, drop the exported PNG/SVGs in `assets/` and swap the
  `[data-art]` containers in `index.html` for `<img>` tags.
- All button/link targets are placeholders (`#`) — wire them to real
  destinations (pitchdeck, app, socials) when available.
