# HITHA Documentation Portal — Design Tokens (Extracted from docs.dyte.io)

This document records the exact computed tokens, spacing, typography, and structural dimensions extracted from the reference portal (`docs.dyte.io`) and adapted to HITHA's official healthcare theme.

---

## 🎨 1. Color Palette (Hitha Official + Dyte Structure)

| Token Name | Light Value | Dark Value | Purpose |
|:---|:---|:---|:---|
| `--ifm-color-primary` | `#00a8b5` (Hitha Mint) | `#00a8b5` | Primary brand accent, active tabs, buttons |
| `--ifm-color-primary-dark` | `#00838d` | `#00838d` | Button hover state |
| `--ifm-color-primary-light` | `#26b9c4` | `#54cbd4` | Focus rings and subtle glows |
| `--hitha-bg` | `#f8fafc` | `#071520` (Dark Forest/Obsidian) | Root document background |
| `--hitha-surface` | `#ffffff` | `#0c202d` | Navbar, Sidebar, Card surface |
| `--hitha-border` | `#e2e8f0` | `rgba(211, 234, 228, 0.12)` | Component separation lines |
| `--hitha-text` | `#0f172a` | `#f3fbf8` | Primary readable prose |
| `--hitha-text-muted` | `#64748b` | `#7c97af` | Secondary labels and metadata |
| `--hitha-accent-green` | `#4caf50` | `#a8d672` (Leaf) | Success, system indicators |

---

## ✍️ 2. Typography

- **Body Font**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Font Size: `15px` / Line Height: `1.65` / Weight: `400`
- **Headings (H1 - H4)**: `'Plus Jakarta Sans', sans-serif`
  - `H1`: `2.25rem` (`36px`), Weight `800`, tracking `-0.03em`
  - `H2`: `1.5rem` (`24px`), Weight `700`, tracking `-0.02em`
  - `H3`: `1.15rem` (`18.4px`), Weight `600`, tracking `-0.015em`
- **Code & Monospace**: `'JetBrains Mono', SFMono-Regular, Menlo, Monaco, monospace`
  - Font Size: `13px` / Line Height: `1.6` / Weight: `500`

---

## 📐 3. Layout Dimensions

- **Navbar Height**: `64px` (sticky, `backdrop-filter: blur(16px)`)
- **Sidebar Width**: `280px` (`max-width: 320px`, independently scrollable)
- **TOC (Right Sidebar)**: `240px`
- **Content Max Width**: `840px` (reading column)
- **Border Radius**:
  - Cards: `14px`
  - Buttons / Inputs: `8px`
  - Code Blocks: `12px`
  - Badges / Pills: `9999px`

---

## 🖼️ 4. Visual Diagram Standards (Reference: `build-live-video-app`)

- Grid layout on light blue/slate background with subtle grid lines.
- Distinct component blocks: `YOUR APP`, `YOUR BACKEND`, and `HITHA SERVER / CLOUD STORAGE`.
- Numbered circular step markers (`1`, `2`, `3`, `4`).
- Directional arrow lines labeled with explicit API calls or payloads.
- Integrated Mermaid diagrams for sequence flows and state transitions.
