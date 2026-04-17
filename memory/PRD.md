# AMR (Autonomous Mobile Robot) Dashboard — PRD

## Original Problem Statement
Build a modern AMR web application dashboard inspired by a reference EV-Hub Dribbble design (dark card layout, left sidebar, breadcrumb header). Use blue+black professional theme. Glassy menu bar on the left. Include tasks list, live activities, a Three.js map with static robots at random locations, task history, and alerts. Add other widgets useful to AMR operations. Explicitly NO stats/metrics. Modern, non-legacy look.

## User Choices (gathered)
- Scope: Frontend-only with realistic mock data
- Auth: No auth — direct dashboard access
- Industry: Warehouse / logistics + Manufacturing
- Extra widgets approved: Task scheduler with drag handles, Fleet status overview, Charging docks
- Menu placement: Left vertical glassy sidebar

## Architecture
- React 19 + CRA, Tailwind + Shadcn UI base
- Three.js (vanilla, used via `useRef` and manual scene setup — NOT via React-Three-Fiber because the `@emergentbase/visual-edits` babel plugin injects `x-line-number` JSX attributes that break R3F prop-handling)
- Lucide-react for icons
- Fonts: Chivo (headings), IBM Plex Sans (body), JetBrains Mono (technical/labels)
- No backend required

## Key Components (all at `/app/frontend/src/components/amr/`)
- `Sidebar.jsx` — fixed 260px glassy sidebar (bg-black/40 backdrop-blur-2xl), Orbit.OS logo, 8 nav items, system-online footer card
- `TopHeader.jsx` — breadcrumb, "Fleet Operations" title, live UTC clock, search, bell w/ unread dot, theme/info/avatar
- `ThreeWarehouseMap.jsx` — vanilla Three.js scene: grid floor, perimeter walls, 16 shelves, 5 charging dock markers, 8 static robots (chassis + LIDAR cylinder + glowing floor ring), HTML labels projected from 3D, OrbitControls
- `TasksScheduler.jsx` — queue with drag-handle, priority dots, ETA
- `LiveActivities.jsx` — active task cards with gradient progress bars
- `FleetStatus.jsx` — 8-robot list with battery bars, status pills
- `TasksHistory.jsx` — table with Completed/Aborted/Delayed status pills
- `NotificationsPanel.jsx` — critical/warning/info alerts
- `ChargingStations.jsx` — 6 dock tiles w/ charging pulse animation

## Mock Data (`/app/frontend/src/data/mockData.js`)
- FLEET (8 robots: Atlas, Nova, Orbit, Kite series)
- SCHEDULED_TASKS (6 upcoming)
- LIVE_TASKS (4 active)
- TASK_HISTORY (9 past)
- NOTIFICATIONS (6 alerts)
- CHARGING_STATIONS (6 docks)
- ROBOT_POSITIONS (8 x/z positions for 3D map)
- SHELVES (16 rack positions)

## Implemented (2026-04-17)
- Full single-page dashboard at `/` (all sidebar routes render the same dashboard for now)
- 3D warehouse map with static robots and projected 2D labels
- All 8 widgets styled per design_guidelines.json
- data-testid on every interactive element
- Custom scrollbar, focus rings, live UTC clock

## Not Implemented / Deferred (P1/P2)
- P1: Dedicated pages for Fleet / Tasks / Charging / History / Alerts / Safety
- P1: Real drag-and-drop reorder on task scheduler
- P2: WebSocket-style live telemetry updates to move robots on the 3D map
- P2: Robot detail drawer (click a robot on the map or in fleet list)
- P2: Task creation modal
- P2: Multi-zone / floor switcher
- P2: Dark/light theme toggle
- P2: Backend (FastAPI + MongoDB) to persist tasks/robots/history

## Next Action Items
1. Decide which deferred page(s) to build first (Fleet detail or Tasks full page are highest-value)
2. Optionally wire a lightweight WebSocket backend to animate robots
3. Add interactive click-to-focus on robots from the 3D map

## Iteration 2 (2026-04-17)
**User feedback addressed:**
- Nunito font for all dashboard content (scoped via `.amr-dashboard` class)
- Tighter 5/7-column reference-style layout; smaller card sizes; no huge widgets
- **Real HTML5 drag-and-drop** on Task Scheduler (verified via Playwright — TSK-2051 moved to position 4)
- **Removed** Charging Docks widget
- **Removed** Fleet Status as a standalone widget — now a floating overlay on the 3D map showing ~2-3 robots with speed (m/s), battery %, status; rest scrolls within the overlay
- **Added** Maintenance Schedule widget (upcoming service, severity badges DUE/SOON/PLAN)
- **Added** Shift Handover widget (full-width, signed log entries from Ops/Safety/Maintenance/Dispatch roles)
- **Replaced** Task History with a richer Activity Log — click any entry to expand to a 6-cell detail grid (Origin/Destination/Payload/Avg Speed/Distance/Waypoints), styled like the reference Drive Details activity log
- **Responsive**: mobile hamburger sidebar + stack, tablet (single column + hidden clock/search), laptop/desktop (5/7 split)

**Current Files (post-iteration)**
- Removed: FleetStatus.jsx, ChargingStations.jsx, TasksHistory.jsx
- Added: FleetOverlay.jsx, MaintenanceSchedule.jsx, ShiftHandover.jsx, ActivityLog.jsx

## Iteration 3 (2026-04-17)
**User feedback addressed:**
- Map reduced to ~420px, sits in a proper card with its own header (not "pasted on top")
- **Removed** floating robot-list overlay entirely
- **Added professional inline header bar** on the map card with chips: "8 Robots · 4 Active · 2 Charging · Nominal" + map controls (Layers/Locate/Fullscreen)
- Subtle bottom-left legend and bottom-right hint "Click a robot for details"
- **Robot click → RobotDrawer (Shadcn Sheet)** showing:
  - Hero: name, fleet group, ID, model, status chip, battery/speed/zone metric chips
  - Quick actions: Pause / Re-route / E-Stop
  - Live Task section with progress bar
  - Assignment grid (operator, route, uptime, waypoints)
  - Maintenance History timeline (date, type, tech, notes)
  - Safety-interlock + telemetry footer
- Three.js raycasting implements click detection (ignores drag-rotate via 4-px threshold)
- Cursor changes to pointer when hovering a robot
- **Layout rearranged professionally:**
  - Row 1: Map (7) | Task Scheduler (5)
  - Row 2: Activity Log (7) | Live Activities (5)
  - Row 3: Maintenance (7) | Alerts (5)
  - Row 4: Shift Handover (full-width)

**New mock data in mockData.js:**
- ROBOT_MAINTENANCE_HISTORY (per-robot)
- ROBOT_ASSIGNMENTS (operator, route, waypoints, fleetGroup)

**Files added:** RobotDrawer.jsx
**Files removed:** FleetOverlay.jsx

## Iteration 4 (2026-04-17)
**User feedback addressed:**
- Unified typography — Nunito applied to every element inside `.amr-dashboard` (including former font-mono IDs/labels). Base dashboard size bumped to 14px.
- Sidebar redesigned as a **floating, collapsible pill** (margin all around, rounded-2xl, shadow). Edge-pill collapse toggle (ChevronLeft/Right). State persisted in localStorage. Collapsed width 76px (icon-only with hover tooltip), expanded 228px.
- Main content responds to sidebar state via CSS custom selector `[data-collapsed]`.
- **Removed Shift Handover widget.**
- **New packed layout with gap-3:**
  - Row 1: Warehouse Map (7) | Live Activities (5) — shows every running task with progress bars
  - Row 2: Task Scheduler (7) | Activity Log (5)
  - Row 3: Maintenance (7) | Alerts (5)
- Mobile keeps hamburger overlay pattern unchanged.
