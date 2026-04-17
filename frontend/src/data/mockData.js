// Mock data for the AMR (Autonomous Mobile Robot) dashboard
// Warehouse & manufacturing hybrid environment

export const FLEET = [
  { id: "AMR-01", name: "Atlas-01", model: "HX-500 Tugger", battery: 92, status: "active", currentTask: "TSK-2041", zone: "A-4", uptime: "14h 22m" },
  { id: "AMR-02", name: "Atlas-02", model: "HX-500 Tugger", battery: 64, status: "active", currentTask: "TSK-2042", zone: "B-2", uptime: "11h 03m" },
  { id: "AMR-03", name: "Nova-03", model: "PK-200 Picker", battery: 38, status: "charging", currentTask: null, zone: "DOCK-1", uptime: "08h 47m" },
  { id: "AMR-04", name: "Nova-04", model: "PK-200 Picker", battery: 81, status: "active", currentTask: "TSK-2045", zone: "C-1", uptime: "09h 15m" },
  { id: "AMR-05", name: "Orbit-05", model: "LF-1000 Lifter", battery: 56, status: "idle", currentTask: null, zone: "A-1", uptime: "06h 10m" },
  { id: "AMR-06", name: "Orbit-06", model: "LF-1000 Lifter", battery: 22, status: "charging", currentTask: null, zone: "DOCK-2", uptime: "02h 41m" },
  { id: "AMR-07", name: "Kite-07", model: "AGV-Flex", battery: 77, status: "active", currentTask: "TSK-2048", zone: "D-3", uptime: "13h 00m" },
  { id: "AMR-08", name: "Kite-08", model: "AGV-Flex", battery: 45, status: "maintenance", currentTask: null, zone: "BAY-X", uptime: "00h 00m" },
];

export const SCHEDULED_TASKS = [
  { id: "TSK-2051", type: "Pallet Transport", origin: "Dock-A", destination: "Rack-12", priority: "high", eta: "14:20", payload: "450 kg" },
  { id: "TSK-2052", type: "Bin Pickup", origin: "Station-3", destination: "QA-Lane", priority: "medium", eta: "14:35", payload: "22 kg" },
  { id: "TSK-2053", type: "Assembly Feed", origin: "WH-B2", destination: "Line-7", priority: "high", eta: "14:42", payload: "180 kg" },
  { id: "TSK-2054", type: "Empty Return", origin: "Line-4", destination: "Dock-B", priority: "low", eta: "15:05", payload: "—" },
  { id: "TSK-2055", type: "Pallet Transport", origin: "Inbound-2", destination: "Rack-8", priority: "medium", eta: "15:12", payload: "620 kg" },
  { id: "TSK-2056", type: "Kit Delivery", origin: "Kitting-1", destination: "Cell-11", priority: "high", eta: "15:30", payload: "64 kg" },
];

export const LIVE_TASKS = [
  { id: "TSK-2041", robot: "AMR-01", type: "Pallet Transport", progress: 72, from: "Dock-A", to: "Rack-03", elapsed: "04:12" },
  { id: "TSK-2042", robot: "AMR-02", type: "Kit Delivery", progress: 41, from: "Kitting-2", to: "Cell-08", elapsed: "02:38" },
  { id: "TSK-2045", robot: "AMR-04", type: "Bin Pickup", progress: 88, from: "Line-2", to: "QA-Lane", elapsed: "05:50" },
  { id: "TSK-2048", robot: "AMR-07", type: "Assembly Feed", progress: 24, from: "WH-B3", to: "Line-9", elapsed: "01:07" },
];

export const TASK_HISTORY = [
  { id: "TSK-2039", robot: "AMR-02", type: "Pallet Transport", duration: "06:41", status: "completed", completedAt: "13:58" },
  { id: "TSK-2038", robot: "AMR-01", type: "Kit Delivery", duration: "04:18", status: "completed", completedAt: "13:47" },
  { id: "TSK-2037", robot: "AMR-07", type: "Empty Return", duration: "03:52", status: "completed", completedAt: "13:31" },
  { id: "TSK-2036", robot: "AMR-05", type: "Bin Pickup", duration: "05:22", status: "aborted", completedAt: "13:18" },
  { id: "TSK-2035", robot: "AMR-04", type: "Assembly Feed", duration: "07:09", status: "completed", completedAt: "13:02" },
  { id: "TSK-2034", robot: "AMR-02", type: "Pallet Transport", duration: "06:55", status: "completed", completedAt: "12:51" },
  { id: "TSK-2033", robot: "AMR-03", type: "Kit Delivery", duration: "04:44", status: "completed", completedAt: "12:38" },
  { id: "TSK-2032", robot: "AMR-01", type: "Pallet Transport", duration: "08:12", status: "delayed", completedAt: "12:22" },
  { id: "TSK-2031", robot: "AMR-07", type: "Bin Pickup", duration: "03:30", status: "completed", completedAt: "12:06" },
];

export const NOTIFICATIONS = [
  { id: "N-01", severity: "critical", title: "Obstruction detected — Lane B-2", detail: "AMR-02 halted awaiting clearance", time: "2m ago" },
  { id: "N-02", severity: "warning", title: "Battery low on Orbit-06", detail: "22% — routing to DOCK-2", time: "6m ago" },
  { id: "N-03", severity: "info", title: "Shift handover complete", detail: "Night-shift fleet ready (8 robots)", time: "14m ago" },
  { id: "N-04", severity: "warning", title: "Network latency spike", detail: "Zone-D telemetry > 220ms", time: "22m ago" },
  { id: "N-05", severity: "info", title: "Maintenance scheduled", detail: "Kite-08 — tomorrow 08:00", time: "38m ago" },
  { id: "N-06", severity: "critical", title: "Emergency stop triggered", detail: "Cell-07 operator E-stop — resolved", time: "51m ago" },
];

export const CHARGING_STATIONS = [
  { id: "CS-1", label: "Dock-1", status: "charging", robot: "AMR-03", kw: 22 },
  { id: "CS-2", label: "Dock-2", status: "charging", robot: "AMR-06", kw: 18 },
  { id: "CS-3", label: "Dock-3", status: "available", robot: null, kw: 0 },
  { id: "CS-4", label: "Dock-4", status: "available", robot: null, kw: 0 },
  { id: "CS-5", label: "Dock-5", status: "offline", robot: null, kw: 0 },
  { id: "CS-6", label: "Dock-6", status: "available", robot: null, kw: 0 },
];

// Static robot positions on the 3D map (x, z) — z is depth in three.js ground plane
export const ROBOT_POSITIONS = [
  { id: "AMR-01", pos: [-14, 0, -8], color: "#00C2FF", status: "active" },
  { id: "AMR-02", pos: [6, 0, -12], color: "#00C2FF", status: "active" },
  { id: "AMR-03", pos: [-20, 0, 14], color: "#F59E0B", status: "charging" },
  { id: "AMR-04", pos: [12, 0, 4], color: "#00C2FF", status: "active" },
  { id: "AMR-05", pos: [-4, 0, 10], color: "#64748B", status: "idle" },
  { id: "AMR-06", pos: [18, 0, 16], color: "#F59E0B", status: "charging" },
  { id: "AMR-07", pos: [0, 0, -18], color: "#00C2FF", status: "active" },
  { id: "AMR-08", pos: [22, 0, -4], color: "#EF4444", status: "maintenance" },
];

// Warehouse rack/shelf positions [x, z, w, d]
export const SHELVES = [
  [-22, -14, 2, 8], [-18, -14, 2, 8], [-14, -14, 2, 8], [-10, -14, 2, 8],
  [-22, 0, 2, 8],   [-18, 0, 2, 8],   [-14, 0, 2, 8],   [-10, 0, 2, 8],
  [10, -14, 2, 8],  [14, -14, 2, 8],  [18, -14, 2, 8],  [22, -14, 2, 8],
  [10, 0, 2, 8],    [14, 0, 2, 8],    [18, 0, 2, 8],    [22, 0, 2, 8],
];
