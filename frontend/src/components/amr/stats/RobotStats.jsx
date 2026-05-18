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
  XCircle,
  Activity,
  Gauge,
  Route as RouteIcon,
  Zap,
  ShieldAlert,
  Wrench,
  Timer,
  Crosshair,
  Cpu,
  TrendingUp,
  TrendingDown,
  Sparkles,
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
// Shared visual primitives (match OverallStats look)
// ----------------------------------------------------------------------------
const cardCls =
  "h-full rounded-2xl border border-white/[0.12] bg-[#15171D] backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 flex flex-col";

const Eyebrow = ({ children }) => (
  <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold">
    {children}
  </div>
);

const statusStyle = {
  active: { color: "#00C2FF", label: "Active" },
  charging: { color: "#F59E0B", label: "Charging" },
  idle: { color: "#64748B", label: "Idle" },
  maintenance: { color: "#EF4444", label: "In Service" },
};

const Delta = ({ value, suffix = "%" }) => {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  const color = positive ? "#10B981" : "#EF4444";
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
      style={{ color, background: `${color}14`, border: `1px solid ${color}30` }}
    >
      <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
      {Math.abs(value)}
      {suffix}
    </span>
  );
};

// ----------------------------------------------------------------------------
// Horizontal Battery Cell — liquid fills left → right with vertical wave surface
// ----------------------------------------------------------------------------
const HorizontalBatteryCell = ({ percent, status, soh }) => {
  const isService = status === "maintenance";
  const offline = isService;
  const color = offline
    ? "#475569"
    : percent > 60
      ? "#10B981"
      : percent > 30
        ? "#F59E0B"
        : "#EF4444";
  const glow = `${color}55`;
  const fillPercent = offline ? 4 : Math.max(percent, 6);

  return (
    <div
      data-testid="battery-cell-horizontal"
      className="relative flex items-center w-full"
      style={{ filter: offline ? "saturate(0.4) opacity(0.7)" : "none" }}
    >
      {/* Battery body */}
      <div
        className="relative flex-1 h-[78px] rounded-[14px] border-2 border-white/15 overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.04) 100%)",
          boxShadow: `inset 0 2px 6px rgba(255,255,255,0.06), inset 0 -2px 8px rgba(0,0,0,0.5), 0 0 22px ${glow}`,
        }}
      >
        {/* Ridge marks (vertical lines like real cell shrink-wrap) */}
        <span className="absolute top-[10%] bottom-[10%] left-[20%] w-px bg-white/[0.05]" />
        <span className="absolute top-[10%] bottom-[10%] left-[40%] w-px bg-white/[0.05]" />
        <span className="absolute top-[10%] bottom-[10%] left-[60%] w-px bg-white/[0.05]" />
        <span className="absolute top-[10%] bottom-[10%] left-[80%] w-px bg-white/[0.05]" />

        {/* Liquid fill (left → right) */}
        <div
          className="absolute top-0 bottom-0 left-0 transition-[width] duration-700 ease-out overflow-hidden"
          style={{
            width: `${fillPercent}%`,
            background: `linear-gradient(90deg, ${color}EE 0%, ${color}FF 100%)`,
          }}
        >
          {/* Front wave on right edge (vertical scroll) */}
          <svg
            className="absolute -right-[10px] top-0 h-[200%] w-[20px] animate-amr-wave-vert pointer-events-none"
            viewBox="0 0 20 200"
            preserveAspectRatio="none"
          >
            <path
              d="M12,0 Q2,12.5 12,25 T12,50 T12,75 T12,100 T12,125 T12,150 T12,175 T12,200 L20,200 L20,0 Z"
              fill={color}
            />
          </svg>
          {/* Back wave (slower) */}
          <svg
            className="absolute -right-[14px] top-0 h-[200%] w-[20px] animate-amr-wave-vert-slow pointer-events-none opacity-40"
            viewBox="0 0 20 200"
            preserveAspectRatio="none"
          >
            <path
              d="M10,0 Q4,12.5 10,25 T10,50 T10,75 T10,100 T10,125 T10,150 T10,175 T10,200 L20,200 L20,0 Z"
              fill="#FFFFFF"
            />
          </svg>

          {/* Liquid top highlight */}
          <div className="absolute inset-x-0 top-0 h-2.5 bg-gradient-to-b from-white/25 to-transparent" />

          {/* Bubbles drifting right */}
          {!offline && (
            <>
              <span
                className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-white/55 animate-amr-bubble-h"
                style={{ animationDelay: "0s" }}
              />
              <span
                className="absolute bottom-5 left-8 h-1 w-1 rounded-full bg-white/40 animate-amr-bubble-h"
                style={{ animationDelay: "0.7s" }}
              />
              <span
                className="absolute bottom-2 left-14 h-1 w-1 rounded-full bg-white/40 animate-amr-bubble-h"
                style={{ animationDelay: "1.4s" }}
              />
            </>
          )}
        </div>

        {/* Centered % + SoH */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex items-baseline gap-2">
            <div className="text-[28px] font-extrabold text-white tabular-nums leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {offline ? "—" : `${percent}`}
            </div>
            <div className="text-[14px] font-bold text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              %
            </div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/70 font-bold ml-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              SoH {offline ? "—" : `${soh}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Cap on right */}
      <div
        className="ml-[3px] w-[8px] h-[28px] rounded-r-md border border-white/15 border-l-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 100%)",
        }}
      />
    </div>
  );
};

// ----------------------------------------------------------------------------
// KPI Tile
// ----------------------------------------------------------------------------
const KpiTile = ({ icon: Icon, color = "#00C2FF", label, value, unit, sub, delta, deltaSuffix = "%" }) => (
  <div data-testid={`kpi-${label.replace(/\s+/g, "-").toLowerCase()}`} className={cardCls}>
    <div className="flex items-center justify-between mb-3">
      <div
        className="h-8 w-8 rounded-lg flex items-center justify-center"
        style={{ background: `${color}14`, border: `1px solid ${color}40` }}
      >
        <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.8} />
      </div>
      {delta !== undefined && <Delta value={delta} suffix={deltaSuffix} />}
    </div>
    <Eyebrow>{label}</Eyebrow>
    <div className="mt-1 flex items-baseline gap-1.5">
      <span className="text-[26px] font-extrabold text-white tabular-nums leading-none">
        {value}
      </span>
      {unit && (
        <span className="text-[12px] font-bold text-slate-500">{unit}</span>
      )}
    </div>
    {sub && (
      <div className="mt-2 text-[11px] text-slate-500 font-semibold">{sub}</div>
    )}
  </div>
);

// ----------------------------------------------------------------------------
// Chart card wrapper
// ----------------------------------------------------------------------------
const ChartCard = ({ title, sub, right, children, height = 240, testid }) => (
  <div data-testid={testid} className={cardCls}>
    <div className="flex items-start justify-between mb-3">
      <div>
        <Eyebrow>{title}</Eyebrow>
        {sub && (
          <div className="text-[12px] text-slate-400 font-semibold mt-1">
            {sub}
          </div>
        )}
      </div>
      {right}
    </div>
    <div style={{ width: "100%", height }}>{children}</div>
  </div>
);

const tooltipStyle = {
  background: "#0E0F13",
  border: "1px solid rgba(0,102,255,0.3)",
  borderRadius: "8px",
  fontSize: "12px",
  fontFamily: "Manrope, sans-serif",
  color: "#F8FAFC",
};

// ----------------------------------------------------------------------------
// Main page
// ----------------------------------------------------------------------------
export default function RobotStats() {
  const [robotId, setRobotId] = useState(ROBOT_STATS[0].id);
  const profile = useMemo(() => getRobotProfile(robotId), [robotId]);
  const s = statusStyle[profile.status];

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
            <div className="flex items-center gap-2 mt-0.5">
              <Select value={robotId} onValueChange={setRobotId}>
                <SelectTrigger
                  data-testid="robot-select-trigger"
                  className="h-9 w-[240px] bg-white/[0.03] border-white/10 text-white text-[14px] font-bold focus:ring-[#0066FF]/40"
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
                          <span className="text-slate-500 font-bold">
                            · {r.id}
                          </span>
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
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Meta chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <MetaChip label="Model" value={profile.model} />
          <MetaChip label="Firmware" value={profile.firmware} />
          <MetaChip label="Payload" value={`${profile.payloadKg} kg`} />
          <MetaChip label="Zone" value={profile.zone} />
          <MetaChip label="Uptime" value={profile.uptime} />
        </div>
      </div>

      {/* ====== KPI Tile Grid ====== */}
      <div className="grid grid-cols-12 gap-3">
        {/* Battery card (compact, alongside other tiles) — spans 4 cols */}
        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <div className={cardCls} data-testid="kpi-battery">
            <div className="flex items-center justify-between mb-3">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: "#10B98114", border: "1px solid #10B98140" }}
              >
                <Zap className="h-4 w-4" style={{ color: "#10B981" }} strokeWidth={1.8} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold">
                {profile.charges} cycles
              </span>
            </div>
            <Eyebrow>Battery — State of Charge</Eyebrow>
            <div className="mt-3 mb-2">
              <HorizontalBatteryCell
                percent={profile.battery}
                status={profile.status}
                soh={profile.soh}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <MicroStat label="Energy / Task" value={`${profile.energyPerTaskWh}`} unit="Wh" />
              <MicroStat label="Battery / Cycle" value={`${profile.batteryPerCycle.toFixed(1)}`} unit="%" />
            </div>
          </div>
        </div>

        {/* Tiles */}
        <div className="col-span-6 md:col-span-3 xl:col-span-2">
          <KpiTile
            icon={Activity}
            color="#00C2FF"
            label="Throughput"
            value={profile.throughputTph.toFixed(1)}
            unit="tasks/hr"
            sub={`${profile.successTasks + profile.failedTasks} tasks · 7d`}
            delta={+4}
          />
        </div>
        <div className="col-span-6 md:col-span-3 xl:col-span-2">
          <KpiTile
            icon={Gauge}
            color="#A855F7"
            label="Utilization"
            value={`${profile.utilization}`}
            unit="%"
            sub="Active vs available time"
            delta={profile.utilization >= 70 ? +6 : -3}
          />
        </div>
        <div className="col-span-6 md:col-span-3 xl:col-span-2">
          <KpiTile
            icon={CheckCircle2}
            color="#10B981"
            label="Success Rate"
            value={`${profile.successRate}`}
            unit="%"
            sub={`${profile.successTasks} ok · ${profile.failedTasks} failed`}
            delta={profile.successRate >= 95 ? +2 : -1}
          />
        </div>
        <div className="col-span-6 md:col-span-3 xl:col-span-2">
          <KpiTile
            icon={Crosshair}
            color="#0066FF"
            label="Path Efficiency"
            value={`${profile.pathEfficiency}`}
            unit="%"
            sub="Actual vs planned distance"
            delta={profile.pathEfficiency >= 90 ? +1 : -2}
          />
        </div>

        <div className="col-span-6 md:col-span-3 xl:col-span-2">
          <KpiTile
            icon={Wrench}
            color="#F59E0B"
            label="MTBF"
            value={`${profile.mtbfHours}`}
            unit="hrs"
            sub="Mean time between failures"
          />
        </div>
        <div className="col-span-6 md:col-span-3 xl:col-span-2">
          <KpiTile
            icon={Timer}
            color="#EC4899"
            label="MTTR"
            value={`${profile.mttrMin}`}
            unit="min"
            sub="Mean time to recovery"
          />
        </div>
        <div className="col-span-6 md:col-span-3 xl:col-span-2">
          <KpiTile
            icon={ShieldAlert}
            color="#EF4444"
            label="E-Stops · 24h"
            value={`${profile.eStops24h}`}
            sub={profile.eStops24h === 0 ? "Clean shift" : "Safety triggers"}
          />
        </div>
        <div className="col-span-6 md:col-span-3 xl:col-span-2">
          <KpiTile
            icon={Sparkles}
            color="#00C2FF"
            label="Avg Velocity"
            value={`${profile.avgSpeed.toFixed(2)}`}
            unit="m/s"
            sub={`Cycle ${profile.avgTime.toFixed(1)} min`}
          />
        </div>
        <div className="col-span-6 md:col-span-3 xl:col-span-2">
          <KpiTile
            icon={RouteIcon}
            color="#10B981"
            label="Total Distance"
            value={`${profile.totalDistance.toFixed(1)}`}
            unit="km"
            sub={`${profile.distancePerCycle.toFixed(1)} km / cycle`}
          />
        </div>
        <div className="col-span-6 md:col-span-3 xl:col-span-2">
          <KpiTile
            icon={Cpu}
            color="#A855F7"
            label="Localization"
            value={`±${profile.localizationCm.toFixed(1)}`}
            unit="cm"
            sub="LiDAR + IMU fusion"
          />
        </div>
        <div className="col-span-6 md:col-span-3 xl:col-span-2">
          <KpiTile
            icon={XCircle}
            color="#EF4444"
            label="Failed Tasks · 7d"
            value={`${profile.failedTasks}`}
            sub="Aborts / re-plans"
          />
        </div>
      </div>

      {/* ====== Charts ====== */}
      <div className="grid grid-cols-12 gap-3">
        {/* Energy consumption line — 6 cols */}
        <div className="col-span-12 xl:col-span-6">
          <ChartCard
            testid="chart-energy-daily"
            title="Energy Consumption · 7 Days"
            sub="Wh consumed per day"
          >
            <ResponsiveContainer>
              <LineChart data={profile.energyDaily} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 600 }} stroke="rgba(255,255,255,0.08)" />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 600 }} stroke="rgba(255,255,255,0.08)" />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(0,194,255,0.2)" }} formatter={(v) => [`${v} Wh`, "Energy"]} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00C2FF"
                  strokeWidth={2.5}
                  dot={{ fill: "#00C2FF", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#00C2FF", stroke: "#fff", strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Throughput bars — 3 cols */}
        <div className="col-span-12 md:col-span-7 xl:col-span-3">
          <ChartCard
            testid="chart-throughput-intraday"
            title="Throughput · Today"
            sub="Tasks completed per 2-hr slot"
          >
            <ResponsiveContainer>
              <BarChart data={profile.throughputIntraday} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="thruBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C2FF" />
                    <stop offset="100%" stopColor="#0066FF" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="interval" tick={{ fill: "#94A3B8", fontSize: 9, fontWeight: 600 }} stroke="rgba(255,255,255,0.08)" interval={0} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 600 }} stroke="rgba(255,255,255,0.08)" />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(0,194,255,0.06)" }} formatter={(v) => [`${v} tasks`, "Completed"]} />
                <Bar dataKey="value" fill="url(#thruBar)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Time-state donut — 3 cols */}
        <div className="col-span-12 md:col-span-5 xl:col-span-3">
          <ChartCard
            testid="chart-state-donut"
            title="Time State · 24h"
            sub="Active / Idle / Charging"
            height={240}
          >
            <div className="relative w-full h-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={profile.statusBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {profile.statusBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v}%`, n]} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold">
                  Active
                </div>
                <div className="text-[24px] font-extrabold text-white tabular-nums leading-none mt-0.5">
                  {profile.statusBreakdown.find((d) => d.name === "Active")?.value ?? 0}%
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
              {profile.statusBreakdown.map((d) => (
                <span key={d.name} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                  <span className="text-slate-500 font-bold tabular-nums">{d.value}%</span>
                </span>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Small bits
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

const MicroStat = ({ label, value, unit }) => (
  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1.5">
    <div className="text-[9px] uppercase tracking-[0.16em] text-slate-500 font-bold">
      {label}
    </div>
    <div className="flex items-baseline gap-1 mt-0.5">
      <span className="text-[14px] text-white font-extrabold tabular-nums">
        {value}
      </span>
      <span className="text-[10px] text-slate-500 font-bold">{unit}</span>
    </div>
  </div>
);
