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
