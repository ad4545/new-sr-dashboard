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
  completionRate: 88.3,
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

// Battery consumption per task type (avg %)
export const BATTERY_PER_TASK = {
  avg: 6.2,
  unit: "%",
  byType: [
    { type: "Pallet Transport", value: 8.4 },
    { type: "Kit Delivery", value: 5.1 },
    { type: "Bin Pickup", value: 4.2 },
    { type: "Assembly Feed", value: 7.6 },
    { type: "Empty Return", value: 3.8 },
    { type: "Inspection", value: 5.5 },
  ],
};

// Tasks per charge cycle per robot
export const TASKS_PER_CHARGE = {
  avg: 14.5,
  byRobot: [
    { robot: "AMR-01", value: 16.2 },
    { robot: "AMR-02", value: 14.8 },
    { robot: "AMR-03", value: 12.1 },
    { robot: "AMR-04", value: 15.5 },
    { robot: "AMR-05", value: 13.7 },
    { robot: "AMR-06", value: 12.9 },
    { robot: "AMR-07", value: 17.1 },
    { robot: "AMR-08", value: 0 },
  ],
};

// Robot idle time %
export const IDLE_TIME = {
  avg: 22, // %
  byStatus: [
    { name: "Active", value: 64, color: "#00C2FF" },
    { name: "Idle", value: 22, color: "#64748B" },
    { name: "Charging", value: 11, color: "#F59E0B" },
    { name: "Service", value: 3, color: "#EF4444" },
  ],
};
