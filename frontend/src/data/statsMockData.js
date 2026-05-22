// Mock data for the Stats page

// 7-day window labels
export const LAST_7_DAYS = [
  { day: "Mon", label: "11" },
  { day: "Tue", label: "12" },
  { day: "Wed", label: "13" },
  { day: "Thu", label: "14" },
  { day: "Fri", label: "15" },
  { day: "Sat", label: "16" },
  { day: "Sun", label: "17" },
];

// 2-hour intervals for intra-day breakdown
export const INTERVALS = [
  "06–08",
  "08–10",
  "10–12",
  "12–14",
  "14–16",
  "16–18",
  "18–20",
  "20–22",
];

// Tasks scheduled vs completed per 2-hour interval (today)
export const THROUGHPUT_BY_INTERVAL = [
  { interval: "06–08", scheduled: 28, completed: 24, failed: 2 },
  { interval: "08–10", scheduled: 42, completed: 38, failed: 3 },
  { interval: "10–12", scheduled: 36, completed: 33, failed: 2 },
  { interval: "12–14", scheduled: 22, completed: 18, failed: 2 },
  { interval: "14–16", scheduled: 45, completed: 41, failed: 3 },
  { interval: "16–18", scheduled: 38, completed: 34, failed: 2 },
  { interval: "18–20", scheduled: 25, completed: 22, failed: 1 },
  { interval: "20–22", scheduled: 12, completed: 9, failed: 1 },
];

export const THROUGHPUT_BY_WEEK = [
  { day: "Mon", scheduled: 42, completed: 37, failed: 2 },
  { day: "Tue", scheduled: 38, completed: 34, failed: 2 },
  { day: "Wed", scheduled: 46, completed: 41, failed: 3 },
  { day: "Thu", scheduled: 40, completed: 35, failed: 3 },
  { day: "Fri", scheduled: 45, completed: 40, failed: 3 },
  { day: "Sat", scheduled: 37, completed: 32, failed: 3 },
];

export const THROUGHPUT_BY_MONTH = [
  { day: "1", scheduled: 34, completed: 30, failed: 2 },
  { day: "2", scheduled: 38, completed: 34, failed: 2 },
  { day: "3", scheduled: 26, completed: 23, failed: 1 },
  { day: "4", scheduled: 41, completed: 36, failed: 3 },
  { day: "5", scheduled: 45, completed: 40, failed: 2 },
  { day: "6", scheduled: 39, completed: 35, failed: 2 },
  { day: "7", scheduled: 43, completed: 38, failed: 3 },
  { day: "8", scheduled: 37, completed: 33, failed: 2 },
  { day: "9", scheduled: 44, completed: 39, failed: 2 },
  { day: "10", scheduled: 31, completed: 27, failed: 2 },
  { day: "11", scheduled: 42, completed: 37, failed: 3 },
  { day: "12", scheduled: 46, completed: 41, failed: 2 },
  { day: "13", scheduled: 40, completed: 35, failed: 3 },
  { day: "14", scheduled: 48, completed: 43, failed: 2 },
  { day: "15", scheduled: 36, completed: 32, failed: 2 },
  { day: "16", scheduled: 43, completed: 38, failed: 3 },
  { day: "17", scheduled: 28, completed: 25, failed: 1 },
  { day: "18", scheduled: 45, completed: 40, failed: 2 },
  { day: "19", scheduled: 47, completed: 42, failed: 3 },
  { day: "20", scheduled: 41, completed: 36, failed: 2 },
  { day: "21", scheduled: 44, completed: 39, failed: 2 },
  { day: "22", scheduled: 38, completed: 34, failed: 2 },
  { day: "23", scheduled: 35, completed: 31, failed: 2 },
  { day: "24", scheduled: 27, completed: 24, failed: 1 },
  { day: "25", scheduled: 43, completed: 38, failed: 3 },
  { day: "26", scheduled: 46, completed: 41, failed: 2 },
  { day: "27", scheduled: 40, completed: 36, failed: 2 },
  { day: "28", scheduled: 45, completed: 40, failed: 3 },
  { day: "29", scheduled: 39, completed: 35, failed: 2 },
  { day: "30", scheduled: 42, completed: 37, failed: 2 },
  { day: "31", scheduled: 29, completed: 26, failed: 1 },
];

// Average speed per task by 2-hour interval (m/s)
export const SPEED_BY_INTERVAL = [
  { interval: "06–08", value: 1.08 },
  { interval: "08–10", value: 1.15 },
  { interval: "10–12", value: 1.18 },
  { interval: "12–14", value: 1.06 },
  { interval: "14–16", value: 1.21 },
  { interval: "16–18", value: 1.14 },
  { interval: "18–20", value: 1.10 },
  { interval: "20–22", value: 1.05 },
];

// Average task duration by 2-hour interval (minutes)
export const TIME_BY_INTERVAL = [
  { interval: "06–08", value: 5.2 },
  { interval: "08–10", value: 4.6 },
  { interval: "10–12", value: 4.4 },
  { interval: "12–14", value: 5.5 },
  { interval: "14–16", value: 4.2 },
  { interval: "16–18", value: 4.8 },
  { interval: "18–20", value: 5.0 },
  { interval: "20–22", value: 5.4 },
];

// KPI totals + per-day series (used for sparklines)
export const TASKS_SCHEDULED = {
  total: 248,
  delta: 12, // % vs prev week
  series: [
    { day: "Mon", value: 32 },
    { day: "Tue", value: 28 },
    { day: "Wed", value: 41 },
    { day: "Thu", value: 35 },
    { day: "Fri", value: 38 },
    { day: "Sat", value: 39 },
    { day: "Sun", value: 35 },
  ],
};

export const TASKS_COMPLETED = {
  total: 219,
  delta: 4,
  series: [
    { day: "Mon", value: 28 },
    { day: "Tue", value: 25 },
    { day: "Wed", value: 37 },
    { day: "Thu", value: 31 },
    { day: "Fri", value: 34 },
    { day: "Sat", value: 35 },
    { day: "Sun", value: 29 },
  ],
};

export const AVG_SPEED = {
  value: 1.12, // m/s
  unit: "m/s",
  delta: -3,
  series: [
    { day: "Mon", value: 1.08 },
    { day: "Tue", value: 1.15 },
    { day: "Wed", value: 1.12 },
    { day: "Thu", value: 1.09 },
    { day: "Fri", value: 1.18 },
    { day: "Sat", value: 1.10 },
    { day: "Sun", value: 1.13 },
  ],
};

export const AVG_TIME = {
  value: 4.8, // minutes
  unit: "min",
  delta: -8,
  series: [
    { day: "Mon", value: 5.2 },
    { day: "Tue", value: 4.9 },
    { day: "Wed", value: 4.7 },
    { day: "Thu", value: 5.0 },
    { day: "Fri", value: 4.6 },
    { day: "Sat", value: 4.8 },
    { day: "Sun", value: 4.6 },
  ],
};

export const TASK_DURATION_DISTRIBUTION = [
  { range: "0–5", tasks: 96 },
  { range: "5–10", tasks: 78 },
  { range: "10–15", tasks: 31 },
  { range: "15–20", tasks: 10 },
  { range: "20+", tasks: 4 },
];

export const DAILY_FLEET_UTILIZATION_HOURS = [
  { name: "Productive Time", hours: 34.8, color: "#10B981" },
  { name: "Idle", hours: 9.4, color: "#64748B" },
  { name: "Charging", hours: 3.8, color: "#F59E0B" },
];

// Fleet utilization split by reporting window
export const FLEET_UTILIZATION = {
  week: [
    { name: "Working", value: 76, color: "#10B981" },
    { name: "Idle", value: 24, color: "#64748B" },
  ],
  month: [
    { name: "Working", value: 71, color: "#10B981" },
    { name: "Idle", value: 29, color: "#64748B" },
  ],
};

// Per-robot detailed stats for the Robot Stats subsection
// Metrics modeled after real-world AMR fleet KPIs (Fetch, MiR, OTTO, Locus, 6 River)
export const ROBOT_STATS = [
  { id: "AMR-01", name: "Atlas-01", model: "HX-500 Tugger",   firmware: "v4.2.1", payloadKg: 500,  status: "active",      battery: 92, soh: 96, successTasks: 142, failedTasks: 3, batteryPerCycle: 5.8, totalDistance: 248.4, distancePerCycle: 16.2, charges: 28, avgSpeed: 1.18, avgTime: 4.6, uptime: "14h 22m", zone: "A-4",    throughputTph: 12.4, utilization: 78, pathEfficiency: 94, mtbfHours: 312, mttrMin: 14, eStops24h: 0, energyPerTaskWh: 28.4, localizationCm: 1.8 },
  { id: "AMR-02", name: "Atlas-02", model: "HX-500 Tugger",   firmware: "v4.2.1", payloadKg: 500,  status: "active",      battery: 64, soh: 91, successTasks: 128, failedTasks: 5, batteryPerCycle: 6.4, totalDistance: 221.7, distancePerCycle: 14.8, charges: 25, avgSpeed: 1.09, avgTime: 5.0, uptime: "11h 03m", zone: "B-2",    throughputTph: 10.8, utilization: 71, pathEfficiency: 89, mtbfHours: 268, mttrMin: 18, eStops24h: 2, energyPerTaskWh: 31.2, localizationCm: 2.1 },
  { id: "AMR-03", name: "Nova-03",  model: "PK-200 Picker",   firmware: "v3.9.4", payloadKg: 200,  status: "charging",    battery: 38, soh: 88, successTasks: 96,  failedTasks: 7, batteryPerCycle: 7.9, totalDistance: 168.2, distancePerCycle: 12.1, charges: 22, avgSpeed: 0.98, avgTime: 5.4, uptime: "08h 47m", zone: "DOCK-1", throughputTph: 8.9,  utilization: 62, pathEfficiency: 86, mtbfHours: 198, mttrMin: 22, eStops24h: 3, energyPerTaskWh: 36.7, localizationCm: 2.4 },
  { id: "AMR-04", name: "Nova-04",  model: "PK-200 Picker",   firmware: "v3.9.4", payloadKg: 200,  status: "active",      battery: 81, soh: 94, successTasks: 134, failedTasks: 4, batteryPerCycle: 6.1, totalDistance: 234.8, distancePerCycle: 15.5, charges: 26, avgSpeed: 1.14, avgTime: 4.7, uptime: "09h 15m", zone: "C-1",    throughputTph: 11.6, utilization: 74, pathEfficiency: 92, mtbfHours: 284, mttrMin: 16, eStops24h: 1, energyPerTaskWh: 29.5, localizationCm: 1.9 },
  { id: "AMR-05", name: "Orbit-05", model: "LF-1000 Lifter",  firmware: "v5.0.0", payloadKg: 1000, status: "idle",        battery: 56, soh: 90, successTasks: 88,  failedTasks: 2, batteryPerCycle: 6.7, totalDistance: 156.0, distancePerCycle: 13.7, charges: 18, avgSpeed: 1.04, avgTime: 5.1, uptime: "06h 10m", zone: "A-1",    throughputTph: 7.4,  utilization: 54, pathEfficiency: 91, mtbfHours: 240, mttrMin: 19, eStops24h: 1, energyPerTaskWh: 42.1, localizationCm: 2.0 },
  { id: "AMR-06", name: "Orbit-06", model: "LF-1000 Lifter",  firmware: "v5.0.0", payloadKg: 1000, status: "charging",    battery: 22, soh: 82, successTasks: 92,  failedTasks: 6, batteryPerCycle: 7.2, totalDistance: 162.5, distancePerCycle: 12.9, charges: 20, avgSpeed: 1.01, avgTime: 5.3, uptime: "02h 41m", zone: "DOCK-2", throughputTph: 7.9,  utilization: 49, pathEfficiency: 84, mtbfHours: 176, mttrMin: 24, eStops24h: 4, energyPerTaskWh: 44.8, localizationCm: 2.6 },
  { id: "AMR-07", name: "Kite-07",  model: "AGV-Flex",        firmware: "v4.2.1", payloadKg: 300,  status: "active",      battery: 77, soh: 98, successTasks: 154, failedTasks: 1, batteryPerCycle: 5.4, totalDistance: 268.9, distancePerCycle: 17.1, charges: 30, avgSpeed: 1.22, avgTime: 4.4, uptime: "13h 00m", zone: "D-3",    throughputTph: 13.6, utilization: 82, pathEfficiency: 96, mtbfHours: 348, mttrMin: 12, eStops24h: 0, energyPerTaskWh: 26.1, localizationCm: 1.6 },
  { id: "AMR-08", name: "Kite-08",  model: "AGV-Flex",        firmware: "v4.1.0", payloadKg: 300,  status: "maintenance", battery: 45, soh: 71, successTasks: 0,   failedTasks: 0, batteryPerCycle: 0,   totalDistance: 0,     distancePerCycle: 0,   charges: 0,  avgSpeed: 0,    avgTime: 0,   uptime: "00h 00m", zone: "BAY-X",  throughputTph: 0,    utilization: 0,  pathEfficiency: 0,  mtbfHours: 84,  mttrMin: 0,  eStops24h: 0, energyPerTaskWh: 0,    localizationCm: 0 },
];

// Generates synthetic but reasonable per-robot time series given the stats
const _seed = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
const _rng = (seed) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const INTRADAY = ["06–08", "08–10", "10–12", "12–14", "14–16", "16–18", "18–20", "20–22"];
const _buildSeries = (robot) => {
  const rng = _rng(_seed(robot.id));
  const batteryDaily = DAYS.map((d) => ({
    day: d,
    value: +(robot.batteryPerCycle * (0.7 + rng() * 0.6)).toFixed(1),
  }));
  const distanceDaily = DAYS.map((d) => ({
    day: d,
    value: +(robot.distancePerCycle * (0.8 + rng() * 0.5) * (1 + rng() * 0.3)).toFixed(1),
  }));
  const energyDaily = DAYS.map((d) => ({
    day: d,
    // Wh consumed per day = energy/task × tasks/hour × ~8h with variation
    value: Math.round(robot.energyPerTaskWh * robot.throughputTph * (6 + rng() * 4)),
  }));
  // Throughput per 2-hour interval today (tasks completed)
  // Skewed bell around mid-shift; scaled by robot throughput
  const bell = [0.55, 0.95, 1.05, 0.65, 1.1, 0.9, 0.7, 0.45];
  const throughputIntraday = INTRADAY.map((slot, i) => ({
    interval: slot,
    value: Math.max(0, Math.round(robot.throughputTph * 2 * bell[i] * (0.85 + rng() * 0.3))),
  }));
  return { batteryDaily, distanceDaily, energyDaily, throughputIntraday };
};

// Task-type distribution (synthesized so totals look real per robot)
const _typeBreakdown = (robot) => {
  if (robot.successTasks === 0) return [];
  const total = robot.successTasks;
  const splits = [0.38, 0.22, 0.18, 0.12, 0.06, 0.04];
  const types = ["Pallet Transport", "Kit Delivery", "Bin Pickup", "Assembly Feed", "Empty Return", "Inspection"];
  const colors = ["#00C2FF", "#10B981", "#F59E0B", "#A855F7", "#0066FF", "#EC4899"];
  return types.map((t, i) => ({
    name: t,
    value: Math.round(total * splits[i]),
    color: colors[i],
  }));
};

const _statusBreakdown = (robot) => {
  if (robot.status === "maintenance") {
    return [
      { name: "Service", value: 100, color: "#EF4444" },
    ];
  }
  // Slight variations based on battery & model
  const active = Math.round(58 + (robot.battery / 100) * 16);
  const charging = Math.max(0, Math.round((100 - robot.battery) / 6));
  const idle = Math.max(0, 100 - active - charging);
  return [
    { name: "Active", value: active, color: "#00C2FF" },
    { name: "Idle", value: idle, color: "#64748B" },
    { name: "Charging", value: charging, color: "#F59E0B" },
  ];
};

export const getRobotProfile = (id) => {
  const robot = ROBOT_STATS.find((r) => r.id === id);
  if (!robot) return null;
  const { batteryDaily, distanceDaily, energyDaily, throughputIntraday } = _buildSeries(robot);
  return {
    ...robot,
    batteryDaily,
    distanceDaily,
    energyDaily,
    throughputIntraday,
    taskTypeBreakdown: _typeBreakdown(robot),
    statusBreakdown: _statusBreakdown(robot),
    successRate:
      robot.successTasks + robot.failedTasks > 0
        ? Math.round(
            (robot.successTasks /
              (robot.successTasks + robot.failedTasks)) *
              100
          )
        : 0,
  };
};
