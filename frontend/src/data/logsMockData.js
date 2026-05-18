// Realistic AMR/robotics fleet logs — modeled after MiR / OTTO / Fetch event streams
// Pure mock data, deterministic per page-load.

export const LOG_SEVERITIES = [
  { id: "info", label: "Normal", color: "#94A3B8" },
  { id: "warn", label: "Warning", color: "#F59E0B" },
  { id: "error", label: "Error", color: "#EF4444" },
];

export const LOG_SOURCES = [
  { id: "navigation", label: "Navigation" },
  { id: "battery", label: "Battery" },
  { id: "safety", label: "Safety" },
  { id: "task-manager", label: "Task Mgr" },
  { id: "comms", label: "Comms" },
  { id: "lidar", label: "LiDAR" },
  { id: "firmware", label: "Firmware" },
  { id: "charging", label: "Charging" },
  { id: "maintenance", label: "Maintenance" },
  { id: "vision", label: "Vision" },
];

export const LOG_TIME_RANGES = [
  { id: "1h", label: "Last 1h", ms: 60 * 60 * 1000 },
  { id: "6h", label: "Last 6h", ms: 6 * 60 * 60 * 1000 },
  { id: "24h", label: "Last 24h", ms: 24 * 60 * 60 * 1000 },
  { id: "7d", label: "Last 7d", ms: 7 * 24 * 60 * 60 * 1000 },
];

// Realistic event templates: code → (severity, source, title, description, suggested)
const TEMPLATES = [
  {
    code: "NAV-0412",
    severity: "warn",
    source: "navigation",
    title: "Path obstructed at waypoint WP-04",
    description:
      "Planner detected a persistent obstacle blocking the primary route. Re-routing via fallback corridor.",
    suggested: "Inspect aisle near WP-04. Confirm no fallen pallets or unmapped equipment.",
  },
  {
    code: "NAV-0301",
    severity: "info",
    source: "navigation",
    title: "Path re-planned successfully",
    description:
      "New optimal path computed (Δ +2.4m). Resuming task.",
    suggested: null,
  },
  {
    code: "NAV-0501",
    severity: "error",
    source: "navigation",
    title: "Failed to localize after stop",
    description:
      "Map confidence dropped below threshold (0.42) after 12s of no motion. Robot held in safe-stop.",
    suggested: "Move robot 1m manually or trigger Re-Localize from console.",
  },
  {
    code: "BAT-0102",
    severity: "warn",
    source: "battery",
    title: "Battery below 20% — return to dock",
    description:
      "State of charge dropped to 18%. Auto-task injected: RTD (return-to-dock) at DOCK-01.",
    suggested: null,
  },
  {
    code: "BAT-0080",
    severity: "critical",
    source: "battery",
    title: "Critical battery — emergency dock",
    description:
      "SoC < 8%. Pre-emptive shutdown sequence armed. Robot navigating to nearest dock with max speed cap 0.6 m/s.",
    suggested: "Clear path to nearest dock. Verify no charging conflicts.",
  },
  {
    code: "BAT-0501",
    severity: "info",
    source: "charging",
    title: "Charging started",
    description:
      "Contact engaged at DOCK-01. Current draw 32A. Estimated full in 38 minutes.",
    suggested: null,
  },
  {
    code: "BAT-0502",
    severity: "info",
    source: "charging",
    title: "Charging completed",
    description: "SoC reached 100%. Disengaging from dock and returning to idle pool.",
    suggested: null,
  },
  {
    code: "SAFE-0001",
    severity: "critical",
    source: "safety",
    title: "Emergency stop activated by operator",
    description:
      "Hardware E-stop pressed at unit. All motion frozen. Awaiting manual reset.",
    suggested: "Verify cause, twist E-stop to release, then issue Resume from console.",
  },
  {
    code: "SAFE-0203",
    severity: "warn",
    source: "safety",
    title: "Front bumper sensor triggered",
    description:
      "Bumper contact detected at 0.8 m/s. Robot decelerated to stop within 0.18m.",
    suggested: "Inspect for soft collision. Check bumper for damage.",
  },
  {
    code: "SAFE-0410",
    severity: "error",
    source: "safety",
    title: "Protective field intrusion · zone B",
    description:
      "Object detected within slowdown zone B (1.2m). Speed limited to 0.4 m/s.",
    suggested: null,
  },
  {
    code: "TASK-0210",
    severity: "info",
    source: "task-manager",
    title: "Task completed",
    description: "Pallet transport task finished within SLA. Distance 12.4m, duration 4m 22s.",
    suggested: null,
  },
  {
    code: "TASK-0301",
    severity: "info",
    source: "task-manager",
    title: "Task assigned",
    description: "Kit Delivery TSK-1287 dispatched. Origin STG-3 → Destination LINE-A2.",
    suggested: null,
  },
  {
    code: "TASK-0500",
    severity: "error",
    source: "task-manager",
    title: "Task aborted — pickup verification failed",
    description:
      "Vision system unable to confirm pallet barcode after 3 retries. Returning to queue origin.",
    suggested: "Check pallet label visibility and lighting at STG-3.",
  },
  {
    code: "COMM-1001",
    severity: "warn",
    source: "comms",
    title: "Lost contact with fleet manager",
    description:
      "Heartbeat missed 3 consecutive cycles. Switching to fallback wifi AP. Reconnecting…",
    suggested: null,
  },
  {
    code: "COMM-1002",
    severity: "info",
    source: "comms",
    title: "Reconnected to fleet manager",
    description: "Link restored. Latency 42ms · signal -56 dBm.",
    suggested: null,
  },
  {
    code: "LIDAR-2001",
    severity: "warn",
    source: "lidar",
    title: "LiDAR field-of-view obstructed (left)",
    description:
      "Persistent occlusion detected in left sensor for >5s. Localization quality degraded.",
    suggested: "Wipe left LiDAR window. Verify no shrink-wrap or debris on sensor.",
  },
  {
    code: "LIDAR-2050",
    severity: "warn",
    source: "lidar",
    title: "Localization confidence dropped",
    description: "Pose confidence fell to 0.62. Robot continuing at 0.7× speed.",
    suggested: null,
  },
  {
    code: "FW-3001",
    severity: "info",
    source: "firmware",
    title: "Firmware update applied",
    description: "Stack updated v4.2.0 → v4.2.1. Restart completed in 22s. All subsystems green.",
    suggested: null,
  },
  {
    code: "MAINT-5001",
    severity: "warn",
    source: "maintenance",
    title: "Wheel encoder calibration recommended",
    description:
      "Drift detected >2cm/100m over last 12 hours. Schedule calibration within 48h.",
    suggested: "Open Maintenance → Encoder Wizard. Allow 8 minutes.",
  },
  {
    code: "MAINT-5102",
    severity: "error",
    source: "maintenance",
    title: "Drive motor temperature high",
    description: "Right drive motor reached 78°C. Throttling output to 80%.",
    suggested: "Inspect wheel for binding. Reduce payload temporarily.",
  },
  {
    code: "VIS-6001",
    severity: "error",
    source: "vision",
    title: "Marker detection failed",
    description: "Pallet AR marker not visible after 3 capture attempts.",
    suggested: "Verify pallet alignment within ±5° of fork pose.",
  },
  {
    code: "VIS-6010",
    severity: "debug",
    source: "vision",
    title: "Frame dropped",
    description: "Camera pipeline dropped 1 frame (latency spike 81ms).",
    suggested: null,
  },
  {
    code: "NAV-0220",
    severity: "debug",
    source: "navigation",
    title: "Costmap inflated near static obstacle",
    description: "Inflation radius adjusted to 0.42m at cell (12, 38).",
    suggested: null,
  },
];

const ROBOTS = ["AMR-01", "AMR-02", "AMR-03", "AMR-04", "AMR-05", "AMR-06", "AMR-07", "AMR-08"];
const ZONES = ["A-1", "A-4", "B-2", "C-1", "D-3", "DOCK-1", "DOCK-2", "BAY-X"];

// ----- Deterministic PRNG so logs stay stable on reload -----
const SEED = 1287531;
const _rng = (s) => {
  let v = s;
  return () => {
    v = (v * 1664525 + 1013904223) >>> 0;
    return v / 4294967296;
  };
};

const _pick = (arr, r) => arr[Math.floor(r * arr.length)];
const _round = (n, d = 2) => +n.toFixed(d);

const NOW = Date.now();

// Build a fixed list: 70 normal/info events + 1 warning + 1 error
const _gen = () => {
  const r = _rng(SEED);
  const infoTemplates = TEMPLATES.filter((t) => t.severity === "info");
  const warnTemplates = TEMPLATES.filter((t) => t.severity === "warn");
  const errorTemplates = TEMPLATES.filter(
    (t) => t.severity === "error" || t.severity === "critical"
  );

  const buildEvent = (template, hoursAgo, idx) => {
    const robot = _pick(ROBOTS, r());
    const zone = _pick(ZONES, r());
    const ts = new Date(NOW - hoursAgo * 60 * 60 * 1000 - r() * 60_000);
    const x = _round(2 + r() * 28, 2);
    const y = _round(2 + r() * 14, 2);
    const theta = _round(-180 + r() * 360, 1);
    const vLin = _round(r() * 1.3, 2);
    const vAng = _round((r() - 0.5) * 0.6, 2);
    const battery = Math.round(8 + r() * 92);
    const taskId =
      template.source === "task-manager" || r() > 0.65
        ? `TSK-${1200 + Math.floor(r() * 200)}`
        : null;
    return {
      id: `EVT-${(100000 + idx).toString()}`,
      ts: ts.toISOString(),
      timestamp: ts,
      severity: template.severity === "critical" ? "error" : template.severity,
      source: template.source,
      robotId: robot,
      zone,
      code: template.code,
      title: template.title,
      description: template.description,
      suggested: template.suggested,
      acked: r() > 0.85,
      details: {
        position: { x, y, theta },
        velocity: { linear: vLin, angular: vAng },
        battery,
        taskId,
      },
    };
  };

  const out = [];
  // 70 normal events spread across last 24h
  for (let i = 0; i < 70; i++) {
    const tmpl = infoTemplates[Math.floor(r() * infoTemplates.length)];
    const hoursAgo = Math.pow(r(), 1.6) * 24;
    out.push(buildEvent(tmpl, hoursAgo, i));
  }
  // 1 warning — placed about 2 hours ago (recent enough to be visible)
  const warnTmpl = warnTemplates[Math.floor(r() * warnTemplates.length)];
  out.push(buildEvent(warnTmpl, 2 + r() * 1.5, 200));
  // 1 error — placed in the very recent window so it surfaces near the top
  const errTmpl = errorTemplates[Math.floor(r() * errorTemplates.length)];
  out.push(buildEvent(errTmpl, 0.2 + r() * 0.8, 201));

  out.sort((a, b) => b.timestamp - a.timestamp);
  return out;
};

export const LOGS = _gen();

// Convenience helpers
export const formatTimeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

export const formatClock = (date) => {
  const d = new Date(date);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ss = d.getSeconds().toString().padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};
