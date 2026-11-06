# HITHA Documentation Diagram Standard (Golden Reference)

This document establishes the strict architectural, visual, and UX standard for all diagrams across the HITHA documentation platform (`<FlowDiagram>`). Any diagram that deviates from these specifications is considered defective.

---

## 1. Golden Reference Architecture

The **Overview Hero Diagram** and **Core Principles Diagram** establish the visual baseline:
- Clean blueprint grid canvas (`radial-gradient(#d5e5fc 1.25px, transparent 1.25px)` on a 20px grid).
- 3D glossy rounded-square logo tiles with authentic product logos.
- Curving, labelled directional edges connecting every node.
- Step-by-step interactive playback narration.

---

## 2. Geometry & Spacing Contracts

| Dimension | Specification | Implementation Setting |
|:---|:---|:---|
| **Horizontal Rank Gap** | Minimum 220px clear between node edges | Dagre `ranksep: 240` (exceeds label width + 60px) |
| **Vertical Node Gap** | Minimum 130px clear between nodes | Dagre `nodesep: 130` |
| **LogoNode Tile Size** | 88px × 88px glossy square | Inner padding: 16px, border-radius: 18px |
| **Tile to Title Gap** | Exactly 10px | `margin: 10px 0 3px` |
| **Title to Caption Gap** | Exactly 4px | `margin: 0` with line-height 1.3 |
| **Max Node Text** | Title: ≤ 2 lines · Caption: ≤ 2 lines (≤ 28 chars/line) | Strict text truncation / ellipsis |
| **Container Padding** | 40px inner canvas padding | `fitView({ padding: 0.15 })` |
| **Edge Label Pill** | Opaque pill at midpoint, max 24 chars | Background: canvas surface, 4px 10px padding, 12px font |

---

## 3. Real-Life Flow Scenarios (Rule 1)

Every diagram must tell a human, real-life story: **WHO** does **WHAT**, and which **SYSTEM** reacts.

### Allowed Node Types & Actors
- **Human Actors**: `Patient` (👤), `Doctor` (👨‍⚕️), `Admin` (🛡️), `Super Admin` (👑), `Attacker Bot` (🤖), `Compliance Auditor` (📋).
- **Client Devices**: `Patient App` (phone model), `Doctor Portal` (desktop/tablet), `Admin Dashboard`.
- **Infrastructure & Technologies**: `Spring Boot 3.3`, `PostgreSQL 16`, `Redis 7.2`, `LiveKit SFU`, `Cloudflare R2`, `PayHere Gateway`, `Logback Async`.

### Banned Terms in Diagram Canvas
- **BANNED IN LABELS, TITLES & CAPTIONS**: `*Impl`, `*Service`, `*Controller`, `*Filter`, `*Repository`, `*Entrypoint`, and method names like `findLatestHashChainValue()`.
- **PERMITTED LOCATION**: Class names and technical implementation details belong **strictly** inside the click-to-open **Technical Details** side drawer.

---

## 4. Canvas Controls & Navigation (Rule 2)

- **Controls Panel**: The visible React Flow control box (`.react-flow__controls`) is **completely eliminated**.
- **Header Controls**: Only two interactive buttons are rendered:
  1. `▶ Play flow` (or `⏸ Pause` when active).
  2. `↺ Reset` (restores initial zoom and fit-view).
- **Mouse & Gesture Interaction**:
  - `zoomOnScroll={false}` and `preventScrolling={false}`: Standard mouse scroll scrolls the documentation page uninterrupted.
  - **Zooming**: Hold `Ctrl` (or `⌘`) + scroll wheel to zoom in/out. Pinch-to-zoom on trackpads and mobile screens.
  - **Panning**: Drag anywhere on the canvas surface.
  - **Double Click**: Zooms in by one increment.
  - **Hover Hint**: Subtle indicator shows `"Ctrl + scroll to zoom · Drag to pan"`.
- **Auto-Fit & Responsiveness**:
  - Bound to `ResizeObserver` on container mount.
  - On viewports < 640px, automatically transitions layout direction from `'LR'` to `'TB'`.

---

## 5. Play Flow Narration Bar

Underneath the canvas, an interactive step narration bar displays:
```
[ Step X of Y ] "Plain English explanation of what happens in this step."
```
During playback, active nodes and edges are spotlighted with an accent glow, while previous nodes maintain a settled state.

---

## 6. Typography & Content Spacing (Rule 3)

- **Article Body**: `line-height: 1.7`, `margin-bottom: 1.25rem`, max width: ~760px.
- **Headings**: `h2` margin-top 3rem, margin-bottom 1rem; `h3` margin-top 2rem.
- **Diagram Margin**: 32px above and below, 24px gap between canvas and caption.
- **Stat Chips Row**: 12px gap between chips, placed 20px below diagram caption.
- **Admonitions & Tables**: 24px vertical margin, 16px inner padding.
