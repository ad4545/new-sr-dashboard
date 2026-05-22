import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Bot,
  CheckCircle2,
  Activity,
  Gauge,
  Zap,
  TrendingUp,
  TrendingDown,
  BatteryCharging,
  Timer,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { ROBOT_STATS, getRobotProfile } from "../../../data/statsMockData";

// ----------------------------------------------------------------------------
// Shared visual primitives (matches OverallStats look)
// ----------------------------------------------------------------------------
const cardCls =
  "h-full rounded-2xl border border-white/[0.12] bg-[#15171D] backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-5 flex flex-col";

const Eyebrow = ({ children }) => (
  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500 font-semibold">
    {children}
  </div>
);

const statusStyle = {
  active: { color: "#00C2FF", label: "Active" },
  charging: { color: "#F59E0B", label: "Charging" },
  idle: { color: "#64748B", label: "Idle" },
  maintenance: { color: "#EF4444", label: "In Service" },
};

const Delta = ({ value }) => {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  const color = positive ? "#10B981" : "#EF4444";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold"
      style={{ color, borderColor: `${color}40`, background: `${color}14` }}
    >
      <Icon className="h-3 w-3" strokeWidth={2.4} />
      {positive ? "+" : ""}
      {value}%
    </span>
  );
};

const tooltipBox = (label, rows) => (
  <div className="rounded-lg border border-white/10 bg-[#0A0A0B]/95 backdrop-blur-md px-3 py-2 shadow-xl">
    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold mb-1">
      {label}
    </div>
    {rows.map((r, i) => (
      <div key={i} className="flex items-center gap-2 text-[13px]">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: r.color, boxShadow: `0 0 6px ${r.color}` }}
        />
        <span className="text-slate-400">{r.name}</span>
        <span className="text-white font-extrabold tabular-nums ml-auto">
          {r.value}
          {r.unit && (
            <span className="text-slate-500 font-bold text-[11px] ml-0.5">{r.unit}</span>
          )}
        </span>
      </div>
    ))}
  </div>
);

// ----------------------------------------------------------------------------
// Compact header battery meter
// ----------------------------------------------------------------------------
const CompactBatteryMeter = ({ percent, status }) => {
  const isService = status === "maintenance";
  const color = isService
    ? "#475569"
    : percent > 60
      ? "#10B981"
      : percent > 30
        ? "#F59E0B"
        : "#EF4444";
  const fillPercent = Math.max(percent, 6);

  return (
    <div
      data-testid="header-battery-meter"
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5"
      style={{ filter: isService ? "saturate(0.45) opacity(0.78)" : "none" }}
    >
      <div className="relative flex h-[18px] w-[44px] items-center">
        <div className="relative h-full flex-1 overflow-hidden rounded-[4px] border border-white/20 bg-black/25">
          <span className="absolute inset-y-[3px] left-1/4 w-px bg-white/10" />
          <span className="absolute inset-y-[3px] left-1/2 w-px bg-white/10" />
          <span className="absolute inset-y-[3px] left-3/4 w-px bg-white/10" />
          <span
            className="absolute inset-y-0 left-0 transition-[width] duration-500"
            style={{
              width: `${fillPercent}%`,
              background: `linear-gradient(90deg, ${color}CC, ${color})`,
              boxShadow: `0 0 10px ${color}66`,
            }}
          />
          <span className="absolute inset-x-0 top-0 h-1 bg-white/20" />
        </div>
        <span className="h-[9px] w-[4px] rounded-r-sm border border-l-0 border-white/20 bg-white/10" />
      </div>
      <span className="text-[12px] font-extrabold tabular-nums text-white">
        {percent}
        <span className="ml-0.5 text-[10px] font-bold text-slate-500">%</span>
      </span>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Slim current-day KPI Card
// ----------------------------------------------------------------------------
const KpiTile = ({ icon: Icon, color, label, value, unit, sub }) => (
  <div
    data-testid={`kpi-${label.replace(/\s+/g, "-").toLowerCase()}`}
    className="h-full min-h-[104px] rounded-xl border border-white/[0.1] bg-[#15171D] px-4 py-3 shadow-[0_4px_18px_rgba(0,0,0,0.28)]"
  >
    <div className="flex h-full items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${color}14`, border: `1px solid ${color}35` }}
      >
        <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.9} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="text-[10px] font-bold uppercase leading-snug tracking-[0.16em] text-slate-500">
            {label}
          </div>
          <span className="shrink-0 rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Today
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-[25px] font-extrabold leading-none text-white tabular-nums">
            {value}
          </span>
          {unit && <span className="text-[12px] font-bold text-slate-500">{unit}</span>}
        </div>
        {sub && <div className="mt-1 text-[11px] font-semibold text-slate-500">{sub}</div>}
      </div>
    </div>
  </div>
);

// ----------------------------------------------------------------------------
// Large line-chart card (matches OverallStats LineKpiCard styling)
// ----------------------------------------------------------------------------
const LineKpiCard = ({
  icon: Icon,
  title,
  subtitle,
  data,
  color,
  headlineValue,
  unit,
  delta,
  yUnit,
  xKey = "day",
  testid,
  summaryLabel = "7-day avg",
  hideSummary = false,
}) => (
  <div data-testid={testid} className={cardCls}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span
          className="h-9 w-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}14`, border: `1px solid ${color}40` }}
        >
          <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.8} />
        </span>
        <div>
          <Eyebrow>{title}</Eyebrow>
          <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">{subtitle}</div>
        </div>
      </div>
      {!hideSummary && (
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[26px] font-extrabold text-white tabular-nums leading-none">
              {headlineValue}
              {unit && (
                <span className="text-[13px] text-slate-500 font-bold ml-1">{unit}</span>
              )}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-semibold">
              {summaryLabel}
            </div>
          </div>
          {delta !== undefined && <Delta value={delta} />}
        </div>
      )}
    </div>

    <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#1A1D24" vertical={false} strokeDasharray="3 5" />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }}
            axisLine={{ stroke: "#1A1D24" }}
            tickLine={false}
            padding={{ left: 4, right: 4 }}
          />
          <YAxis
            tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v) => `${v}${yUnit ? " " + yUnit : ""}`}
          />
          <Tooltip
            cursor={{ stroke: color, strokeOpacity: 0.4, strokeDasharray: "3 3" }}
            content={(p) => {
              if (!p.active || !p.payload?.length) return null;
              const d = p.payload[0].payload;
              return tooltipBox(d[xKey], [
                {
                  name: title,
                  value: typeof d.value === "number" ? d.value.toFixed(2) : d.value,
                  unit: yUnit,
                  color,
                },
              ]);
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#0E0F13", stroke: color, strokeWidth: 2 }}
            activeDot={{ r: 6, fill: color, stroke: "#0E0F13", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// ----------------------------------------------------------------------------
// Workday utilization pie card
// ----------------------------------------------------------------------------
const UtilizationPieCard = ({ data, productiveHours, productivePercent }) => (
  <div data-testid="chart-robot-utilization" className={cardCls}>
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#10B98140] bg-[#10B98114]">
          <Activity className="h-4 w-4 text-[#10B981]" strokeWidth={1.8} />
        </span>
        <div>
          <Eyebrow>Robot Utilization</Eyebrow>
          <div className="mt-0.5 text-[11px] font-semibold text-slate-600">
            8-hour workday allocation
          </div>
        </div>
      </div>
    </div>

    <div className="grid flex-1 min-h-0 grid-cols-1 items-center gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(180px,0.9fr)]">
      <div className="relative h-full min-h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={(p) => {
                if (!p.active || !p.payload?.length) return null;
                const d = p.payload[0].payload;
                return tooltipBox("8-hour workday", [
                  {
                    name: d.name,
                    value: d.hours.toFixed(1),
                    unit: "h",
                    color: d.color,
                  },
                ]);
              }}
            />
            <Pie
              data={data}
              dataKey="hours"
              nameKey="name"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={3}
              stroke="#15171D"
              strokeWidth={4}
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[30px] font-extrabold leading-none text-white tabular-nums">
              {productiveHours.toFixed(1)}
              <span className="ml-1 text-[13px] font-bold text-slate-500">h</span>
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              productive
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Utilization Rate
          </div>
          <div className="mt-1 text-[24px] font-extrabold leading-none text-white tabular-nums">
            {productivePercent}
            <span className="ml-1 text-[12px] font-bold text-slate-500">%</span>
          </div>
        </div>
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: item.color, boxShadow: `0 0 8px ${item.color}66` }}
              />
              <span className="truncate text-[12px] font-bold text-slate-300">{item.name}</span>
            </div>
            <div className="text-right text-[13px] font-extrabold text-white tabular-nums">
              {item.hours.toFixed(1)}
              <span className="ml-1 text-[10px] font-bold text-slate-500">h</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ----------------------------------------------------------------------------
// Task throughput bar card
// ----------------------------------------------------------------------------
const ThroughputBarCard = ({ data }) => {
  const completedTasks = data.reduce((sum, d) => sum + d.completed, 0);
  const failedTasks = data.reduce((sum, d) => sum + d.failed, 0);

  return (
    <div data-testid="chart-throughput-intraday" className={cardCls}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#0066FF40] bg-[#0066FF14]">
            <Timer className="h-4 w-4 text-[#0066FF]" strokeWidth={1.8} />
          </span>
          <div>
            <Eyebrow>Task Throughput · Today</Eyebrow>
            <div className="mt-0.5 text-[11px] font-semibold text-slate-600">
              Completed and failed tasks per 2-hour interval
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-right">
            <div className="text-[22px] font-extrabold leading-none text-white tabular-nums">
              {completedTasks}
            </div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
              completed
            </div>
          </div>
          <div className="rounded-xl border border-[#EF444440] bg-[#EF444414] px-3 py-2 text-right">
            <div className="text-[22px] font-extrabold leading-none text-white tabular-nums">
              {failedTasks}
            </div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#EF4444]">
              failed
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 18, right: 14, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="throughputBarFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00C2FF" stopOpacity={1} />
                <stop offset="100%" stopColor="#0066FF" stopOpacity={0.72} />
              </linearGradient>
              <linearGradient id="failedBarFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F87171" stopOpacity={1} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.74} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1A1D24" vertical={false} strokeDasharray="3 5" />
            <XAxis
              dataKey="interval"
              tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }}
              axisLine={{ stroke: "#1A1D24" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,102,255,0.08)" }}
              content={(p) => {
                if (!p.active || !p.payload?.length) return null;
                const d = p.payload[0].payload;
                return tooltipBox(d.interval, [
                  {
                    name: "Completed Tasks",
                    value: d.completed,
                    unit: "tasks",
                    color: "#00C2FF",
                  },
                  {
                    name: "Failed Tasks",
                    value: d.failed,
                    unit: "tasks",
                    color: "#EF4444",
                  },
                ]);
              }}
            />
            <Bar
              dataKey="completed"
              stackId="tasks"
              fill="url(#throughputBarFill)"
              radius={[0, 0, 3, 3]}
              maxBarSize={54}
              isAnimationActive={false}
            />
            <Bar
              dataKey="failed"
              stackId="tasks"
              fill="url(#failedBarFill)"
              radius={[8, 8, 0, 0]}
              maxBarSize={54}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Meta chip
// ----------------------------------------------------------------------------
const MetaChip = ({ label, value }) => (
  <div className="flex flex-col px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.02]">
    <span className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold leading-none">
      {label}
    </span>
    <span className="text-[12px] text-white font-bold leading-tight mt-0.5">
      {value}
    </span>
  </div>
);

// ----------------------------------------------------------------------------
// Main page
// ----------------------------------------------------------------------------
export default function RobotStats() {
  const [robotId, setRobotId] = useState(ROBOT_STATS[0].id);
  const profile = useMemo(() => getRobotProfile(robotId), [robotId]);
  const s = statusStyle[profile.status];
  const totalTasksToday = profile.successTasks + profile.failedTasks;
  const avgTasksPerCharge =
    profile.charges > 0 ? +(totalTasksToday / profile.charges).toFixed(1) : null;
  const batteryConsumptionIntervals = useMemo(
    () =>
      profile.throughputIntraday
        .filter((d) => ["08–10", "10–12", "12–14", "14–16", "16–18", "18–20"].includes(d.interval))
        .map((d) => ({
          interval: d.interval,
          value: +(d.value * profile.batteryPerCycle).toFixed(1),
        })),
    [profile]
  );
  const totalBatteryConsumed = +batteryConsumptionIntervals
    .reduce((sum, d) => sum + d.value, 0)
    .toFixed(1);
  const throughputByOutcome = useMemo(() => {
    const intervals = profile.throughputIntraday;
    const failedSlots = intervals.map(() => 0);

    for (let i = 0; i < profile.failedTasks; i += 1) {
      const slot = (i * 3 + robotId.length) % intervals.length;
      failedSlots[slot] += 1;
    }

    return intervals.map((d, index) => ({
      interval: d.interval,
      completed: d.value,
      failed: failedSlots[index],
    }));
  }, [profile, robotId]);
  const utilizationData = useMemo(() => {
    const statusValue = (name) =>
      profile.statusBreakdown.find((item) => item.name === name)?.value ?? 0;
    const productive = statusValue("Active");
    const idle = profile.status === "maintenance" ? 100 : statusValue("Idle");
    const charging = statusValue("Charging");

    return [
      { name: "Productive Time", hours: +((productive / 100) * 8).toFixed(1), color: "#10B981" },
      { name: "Idle Time", hours: +((idle / 100) * 8).toFixed(1), color: "#64748B" },
      { name: "Charging Time", hours: +((charging / 100) * 8).toFixed(1), color: "#F59E0B" },
    ];
  }, [profile]);
  const productiveHours = utilizationData[0].hours;
  const productivePercent = Math.round((productiveHours / 8) * 100);

  return (
    <div data-testid="robot-stats" className="flex flex-col gap-3">
      {/* ====== Header: robot picker + meta ====== */}
      <div className="rounded-2xl border border-white/[0.12] bg-[#15171D] shadow-[0_4px_24px_rgba(0,0,0,0.4)] px-4 py-3 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${s.color}14`, border: `1px solid ${s.color}40` }}
          >
            <Bot className="h-5 w-5" style={{ color: s.color }} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <Eyebrow>Robot Profile</Eyebrow>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <Select value={robotId} onValueChange={setRobotId}>
                <SelectTrigger
                  data-testid="robot-select-trigger"
                  className="h-9 w-[220px] sm:w-[240px] bg-white/[0.03] border-white/10 text-white text-[14px] font-bold focus:ring-[#0066FF]/40"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  data-testid="robot-select-content"
                  className="bg-[#0E0F13] border-white/10 text-white"
                >
                  {ROBOT_STATS.map((r) => {
                    const c = statusStyle[r.status].color;
                    return (
                      <SelectItem
                        key={r.id}
                        value={r.id}
                        data-testid={`robot-option-${r.id}`}
                        className="font-semibold focus:bg-[#0066FF]/20 focus:text-white"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: c, boxShadow: `0 0 4px ${c}` }}
                          />
                          {r.name}
                          <span className="text-slate-500 font-bold">· {r.id}</span>
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <span
                className="inline-flex items-center gap-1.5 px-2.5 h-9 rounded-lg border text-[11px] font-bold uppercase tracking-wider"
                style={{
                  color: s.color,
                  borderColor: `${s.color}40`,
                  background: `${s.color}14`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: s.color, boxShadow: `0 0 4px ${s.color}` }}
                />
                {s.label}
              </span>
              <CompactBatteryMeter percent={profile.battery} status={profile.status} />
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 flex-wrap">
          <MetaChip label="Model" value={profile.model} />
          <MetaChip label="Firmware" value={profile.firmware} />
          <MetaChip label="Payload" value={`${profile.payloadKg} kg`} />
          <MetaChip label="Zone" value={profile.zone} />
          <MetaChip label="Uptime" value={profile.uptime} />
        </div>
      </div>

      {/* ====== Top KPI Row — only 4 cards ====== */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <KpiTile
            icon={BatteryCharging}
            color="#F59E0B"
            label="Avg Battery Consumption per Task"
            value={profile.batteryPerCycle.toFixed(1)}
            unit="%"
            sub={`${totalTasksToday} tasks processed`}
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <KpiTile
            icon={CheckCircle2}
            color="#10B981"
            label="Success Rate"
            value={profile.successRate}
            unit="%"
            sub={`${profile.successTasks} successful · ${profile.failedTasks} failed`}
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <KpiTile
            icon={Activity}
            color="#00C2FF"
            label="Avg Tasks per Charge Cycle"
            value={avgTasksPerCharge ?? "--"}
            unit={avgTasksPerCharge === null ? "" : "tasks"}
            sub={`${profile.charges} charge cycles`}
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <KpiTile
            icon={Gauge}
            color="#A855F7"
            label="Average Speed"
            value={profile.avgSpeed.toFixed(2)}
            unit="m/s"
            sub="Today average"
          />
        </div>
      </div>

      {/* ====== Line charts (OverallStats style) ====== */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-6 h-[320px]">
          <LineKpiCard
            testid="chart-battery-consumption-interval"
            icon={Zap}
            title="Battery Consumption · Today"
            subtitle="Total battery consumed per 2-hour interval · 08:00-20:00"
            data={batteryConsumptionIntervals}
            color="#F59E0B"
            headlineValue={totalBatteryConsumed}
            unit="%"
            yUnit="%"
            xKey="interval"
            hideSummary
          />
        </div>
        <div className="col-span-12 xl:col-span-6 h-[320px]">
          <UtilizationPieCard
            data={utilizationData}
            productiveHours={productiveHours}
            productivePercent={productivePercent}
          />
        </div>
        <div className="col-span-12 h-[320px]">
          <ThroughputBarCard data={throughputByOutcome} />
        </div>
      </div>
    </div>
  );
}
