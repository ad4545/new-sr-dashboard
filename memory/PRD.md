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

## Iteration 5 (2026-04-17)
- Reduced inter-widget gap to 5px (gap-[5px] mb-[5px]) and trimmed main padding to 6-8px
- Sidebar now at left-5 (20px) with 30px gap before main content for more breathing room
- Font sizes bumped: dashboard base 14px → 15px; widget titles text-lg → text-xl (20px); page title up to 34px on xl; scheduler rows bumped one step

## Iteration 6 (2026-04-17)
- **Fixed row heights** so widgets always fill full row area without dead space:
  - Row 1 = 520 px (Map | Live Activities)
  - Row 2 = 480 px (Task Scheduler | Activity Log)
  - Row 3 = 420 px (Maintenance | Alerts)
  - All widget roots `h-full` + scroll areas `flex-1 min-h-0 overflow-y-auto`
- **Glassier sidebar** — bg-white/[0.04] + backdrop-blur-[28px] + backdrop-saturate-200, border-white/15, inner blue/cyan glow blobs, shadow with blue tint
- Base font 15 → 16 px, widget titles 20 → 22 px, scheduler row text 14 → 15 px

## Iteration 7 (2026-04-17)
- Increased inter-widget gap from 5 px to 10 px (still small but clearly separated — no overlap appearance)
- Main content horizontal padding increased to 10-12 px
- Widget borders strengthened: border-white/5 → border-white/10; card bg opacity 80 → 85
- Added subtle shadow `shadow-[0_4px_24px_rgba(0,0,0,0.4)]` on every widget card to give each a distinct floating feel

## Iteration 8 (2026-04-20)
Task creation composer — industrial AMR mission builder:
- Right-side Sheet drawer ("Create Task") opens from the "+ New" button
- Top fields: Task name (required), Type, Priority (low/medium/high/critical), Assign Robot (auto or specific)
- **Composable step cards** — drag-drop reorderable; three step kinds:
  - **Move**: PATH/POSE segmented toggle + Shadcn Select for predefined paths (7) or poses (8)
  - **Wait**: dwell-time stepper (+/-) with 5s/10s/30s/60s quick presets
  - **Return**: simple "robot returns to home dock" card
- Each card: numbered badge, accent colour, grip handle, delete button
- "+ Move / + Wait / + Return" add-step buttons at bottom of step list
- Footer: Cancel (ghost) / Save (outlined, requires name + 1 step) / Send (blue primary with glow, requires every step complete)
- Sonner toast confirmation on save/send
- Sonner `<Toaster />` mounted in App.js with dark theme

**New mock data:** PATHS, POSES, TASK_TYPES, PRIORITIES
**New component:** TaskCreateDrawer.jsx

## Iteration 9 (2026-05-18)
**Stats / Analytics page**
- Added `/stats` route with routable subsections `/stats/overall`, `/stats/robots`, `/stats/logs` (sidebar item "Stats" with BarChart3 icon)
- Layout: same TopHeader + Sidebar + subnav tabs (Overall Stats / Robot Stats / Logs) + date-range / export buttons
- **Overall Stats** delivered with all 7 metrics:
  1. Total Tasks Scheduled — KPI card with area sparkline + delta chip
  2. Total Tasks Completed — KPI + green sparkline
  3. Average Speed per Task (m/s) — KPI + blue sparkline
  4. Average Time per Task (min) — KPI + purple sparkline
  5. Battery Consumption per Task — bar chart by task type (orange) + fleet avg
  6. Tasks per Charge Cycle — bar chart by robot (blue gradient)
  7. Robot Idle Time % — donut chart with center % + legend
- Charts built with Recharts (Area, Bar, Pie + Cell) with custom dark tooltips and gradient fills
- Robot Stats & Logs subsections render a polished "coming soon" placeholder card
- New mock data: `statsMockData.js`
- New components: `pages/StatsPage.jsx`, `components/amr/stats/OverallStats.jsx`

## Iteration 10 (2026-05-18)
**Overall Stats reworked:**
- **Tasks Throughput** (new combined card): grouped scheduled vs completed bars per 2-hour interval; headline pills for Scheduled / Completed (with delta) + radial Completion % ring (88.3%)
- **Average Speed / Task** and **Average Time / Task**: changed from sparklines to proper line charts with X-axis at 2-hour intervals (06–08, 08–10, … 20–22); explicit numeric Y-axis domain + ticks
- Existing Battery / Charge cycle / Idle donut kept on row 3 (unchanged)
- Added new mock data: INTERVALS, THROUGHPUT_BY_INTERVAL, SPEED_BY_INTERVAL, TIME_BY_INTERVAL

## Iteration 11 (2026-05-18)
- **Widget cards lifted off the page** — switched bg from `#0E0F13/85` to solid `#15171D` and border to `white/[0.12]`. Clear contrast against page bg `#0A0A0B`.
- **Font upgraded** to **Manrope** (with ss01/cv02 features and -0.005em letter-spacing for refinement). Replaces Nunito across the whole `.amr-dashboard` scope (including elements that previously used `.font-mono`).
- **`/stats` default**: index Navigate already redirects to `/stats/overall` — verified Overall Stats pill is highlighted and the throughput + line charts + bar/donut charts all render.

## Iteration 12 (2026-05-18)
**Robot Stats subsection delivered**
- 8 robot cards (3 per row on desktop) at `/stats/robots`
- Each card has an **animated battery cell** on the left:
  - Tall rounded-rect with small cap, inner ridges, glowing outer shadow
  - Liquid fills from bottom to current `battery%`
  - **Wavy top surface** (SVG path with 8 wave periods) animated horizontally — front opaque wave + slower translucent back wave
  - **Rising bubbles** (3 staggered, ease-in-out infinite)
  - Color shifts: green > 60%, amber 30-60%, red <30%, grey for maintenance
  - Centered % + "Charge" label (or "—" + "Service" for offline)
- 5 stat rows on the right: Success Tasks, Failed Tasks, Battery / Cycle %, Total Distance km, Distance / Cycle km — each with colored icon chip
- Card footer: charge-cycle count + computed success rate %
- New CSS keyframes in index.css: `amr-wave`, `amr-wave-slow`, `amr-bubble`
- New mock data: `ROBOT_STATS` (per-robot)
- New component: `components/amr/stats/RobotStats.jsx`
- Wired into `/stats/robots` route


## Iteration 13 (2026-05-18)
**Robot Stats refactored to single-robot deep-dive view (final layout)**
- Layout simplified per user feedback: **only 4 compact KPI cards at top**, then **large line charts below** in the same `LineKpiCard` style used in Overall Stats
- Top row: Battery (with horizontal animated cell + SoH), Throughput (tasks/hr), Success Rate, Utilization (with inline MTBF/MTTR sub)
- Charts row 1 (side-by-side): **Energy Consumption · 7 days** (line, cyan) + **Distance Travelled · 7 days** (line, green)
- Charts row 2 (full-width): **Throughput · Today** per 2-hour interval (line, blue)
- Each chart uses OverallStats-style header: icon chip + title + 7-day avg headline + delta pill; dotted grid; tooltip box with branded styling
- Removed the previous donut, MTBF/MTTR/E-Stops/Localization/Path Efficiency KPI tiles to reduce visual noise

### Iteration 13 (earlier draft — superseded)
- Replaced 8-card grid with stateful single-robot page driven by Shadcn `<Select>` dropdown (lists all 8 AMRs with status dot indicator)
- **Horizontal battery cell** (compact, inside a card alongside other KPI tiles):
  - Liquid fills left → right, vertical wavy surface on the right edge (front + slow translucent back wave)
  - Drifting bubbles, centered `%` + `SoH` label, cap on right
  - Color: green >60%, amber 30–60%, red <30%, grey for maintenance
- New CSS keyframes added: `amr-wave-vert`, `amr-wave-vert-slow`, `amr-bubble-h`
- **Realistic AMR/robotics KPI tiles** (replaces generic stats):
  - Throughput (tasks/hr), Utilization %, Success Rate %, Path Efficiency %
  - MTBF (hrs), MTTR (min), E-Stops · 24h, Avg Velocity (m/s)
  - Total Distance (km), Localization accuracy (± cm), Failed Tasks · 7d
  - Battery card: SoC + SoH + Energy/Task (Wh) + Battery/Cycle (%)
- **Charts (Recharts)**:
  - Energy consumption · 7 days (line)
  - Throughput · today per 2-hr slot (bar)
  - Time State · 24h donut (Active / Idle / Charging) with center % label
- Header meta chips: Model, Firmware, Payload kg, Zone, Uptime
- Extended `ROBOT_STATS` schema with: `firmware`, `payloadKg`, `soh`, `throughputTph`, `utilization`, `pathEfficiency`, `mtbfHours`, `mttrMin`, `eStops24h`, `energyPerTaskWh`, `localizationCm`
- Extended `getRobotProfile()` to build `energyDaily` and `throughputIntraday` series

## Pending / Roadmap
- **P2**: Mini sparklines under KPI tiles on Robot Stats (7-day micro-trends)
- **P2**: Extract shared `Tile` / `ChartCard` primitives across OverallStats and RobotStats

## Iteration 14 (2026-05-18)
**System Logs page delivered at `/stats/logs`**
- **Severity stat strip** at top: 5 clickable tiles (Critical / Error / Warning / Info / Debug) showing event count + % share within the active time window; clicking toggles severity filter
- **Filter bar**:
  - Text search across title/description/code/robot/id (e.g., "NAV-0412", "bumper", "AMR-03")
  - Robot select (All Robots + 8 AMRs)
  - Source select (All Sources + 10 categories: navigation, battery, safety, task-mgr, comms, lidar, firmware, charging, maintenance, vision)
  - Time range chips: 1h · 6h · 24h · 7d (cyan when active)
  - All / Unacked toggle
  - Clear filters (appears when any filter active)
  - CSV export (visual)
- **Active severity filter chip row** appears under filter bar when severities selected, with × to remove individually
- **Result count strip**: "Showing X of 72 events" + live-stream indicator with pulsing dot
- **Collapsible log rows**: each row has severity-color left border (solid when expanded, faded when collapsed), severity icon, timestamp + relative-time, robot badge, source pill, monospace event code, title, "Acked" badge, chevron
- **Expanded panel** (per row):
  - Description text
  - **Diagnostics Snapshot**: Position (x,y), Heading θ, Linear/Angular Velocity, Battery %, Zone, Linked Task ID, Event ID — all in mono tabular numerals
  - **Sensor State chips**: Front LiDAR · Rear LiDAR · Bumper · IMU · WiFi (status-colored: ok / warn / triggered / drift / weak)
  - **Suggested Resolution** (or Raw Payload JSON for non-actionable events)
  - Action buttons: Acknowledge · Copy ID (writes event ID to clipboard) · Locate (cyan, takes-you-to-map intent)
- **Mock data** (`logsMockData.js`): 72 deterministic events across 24h, drawn from 23 realistic event templates (NAV-0412, BAT-0080, SAFE-0001, LIDAR-2050, COMM-1001, etc.), each with full diagnostics payload
- **Empty state**: friendly "No events match" card when filters yield zero
- Removed the placeholder; route `path="logs"` now mounts `<SystemLogs />`
- Tested: clicking severity tile filters correctly (3 critical events shown), expanding row reveals full diagnostics panel
