import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
  Route as RouteIcon,
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
        className="relative flex-1 h-[70px] rounded-[14px] border-2 border-white/15 overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.04) 100%)",
          boxShadow: `inset 0 2px 6px rgba(255,255,255,0.06), inset 0 -2px 8px rgba(0,0,0,0.5), 0 0 22px ${glow}`,
        }}
      >
        {/* Cell ridge marks */}
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
          <div className="absolute inset-x-0 top-0 h-2.5 bg-gradient-to-b from-white/25 to-transparent" />
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
            <div className="text-[26px] font-extrabold text-white tabular-nums leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {offline ? "—" : `${percent}`}
            </div>
            <div className="text-[13px] font-bold text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
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
        className="ml-[3px] w-[8px] h-[26px] rounded-r-md border border-white/15 border-l-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 100%)",
        }}
      />
    </div>
  );
};

// ----------------------------------------------------------------------------
// Top KPI Card (compact)
// ----------------------------------------------------------------------------
const KpiTile = ({ icon: Icon, color, label, value, unit, sub, delta }) => (
  <div data-testid={`kpi-${label.replace(/\s+/g, "-").toLowerCase()}`} className={cardCls}>
    <div className="flex items-center justify-between mb-3">
      <span
        className="h-9 w-9 rounded-lg flex items-center justify-center"
        style={{ background: `${color}14`, border: `1px solid ${color}40` }}
      >
        <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.8} />
      </span>
      {delta !== undefined && <Delta value={delta} />}
    </div>
    <Eyebrow>{label}</Eyebrow>
    <div className="mt-1 flex items-baseline gap-1.5">
      <span className="text-[28px] font-extrabold text-white tabular-nums leading-none">
        {value}
      </span>
      {unit && (
        <span className="text-[13px] font-bold text-slate-500">{unit}</span>
      )}
    </div>
    {sub && (
      <div className="mt-2 text-[11px] text-slate-500 font-semibold">{sub}</div>
    )}
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
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-[26px] font-extrabold text-white tabular-nums leading-none">
            {headlineValue}
            {unit && (
              <span className="text-[13px] text-slate-500 font-bold ml-1">{unit}</span>
            )}
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-semibold">
            7-day avg
          </div>
        </div>
        {delta !== undefined && <Delta value={delta} />}
      </div>
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

  // 7-day energy avg
  const energyAvg = profile.energyDaily.length
    ? Math.round(
        profile.energyDaily.reduce((a, d) => a + d.value, 0) /
          profile.energyDaily.length
      )
    : 0;
  // 7-day distance avg
  const distanceAvg = profile.distanceDaily.length
    ? +(
        profile.distanceDaily.reduce((a, d) => a + d.value, 0) /
        profile.distanceDaily.length
      ).toFixed(1)
    : 0;

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
        {/* Battery card */}
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <div className={cardCls} data-testid="kpi-battery">
            <div className="flex items-center justify-between mb-3">
              <span
                className="h-9 w-9 rounded-lg flex items-center justify-center"
                style={{ background: "#10B98114", border: "1px solid #10B98140" }}
              >
                <BatteryCharging className="h-4 w-4" style={{ color: "#10B981" }} strokeWidth={1.8} />
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold">
                {profile.charges} cycles
              </span>
            </div>
            <Eyebrow>Battery</Eyebrow>
            <div className="mt-3 flex-1 flex items-center">
              <HorizontalBatteryCell
                percent={profile.battery}
                status={profile.status}
                soh={profile.soh}
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-3">
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
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
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
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <KpiTile
            icon={Gauge}
            color="#A855F7"
            label="Utilization"
            value={`${profile.utilization}`}
            unit="%"
            sub={`MTBF ${profile.mtbfHours}h · MTTR ${profile.mttrMin}m`}
            delta={profile.utilization >= 70 ? +6 : -3}
          />
        </div>
      </div>

      {/* ====== Line charts (OverallStats style) ====== */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-6 h-[320px]">
          <LineKpiCard
            testid="chart-energy-daily"
            icon={Zap}
            title="Energy Consumption"
            subtitle="Wh consumed · last 7 days"
            data={profile.energyDaily}
            color="#00C2FF"
            headlineValue={energyAvg}
            unit="Wh"
            yUnit=""
            delta={-3}
          />
        </div>
        <div className="col-span-12 xl:col-span-6 h-[320px]">
          <LineKpiCard
            testid="chart-distance-daily"
            icon={RouteIcon}
            title="Distance Travelled"
            subtitle="km per day · last 7 days"
            data={profile.distanceDaily}
            color="#10B981"
            headlineValue={distanceAvg}
            unit="km"
            yUnit="km"
            delta={+5}
          />
        </div>
        <div className="col-span-12 h-[320px]">
          <LineKpiCard
            testid="chart-throughput-intraday"
            icon={Timer}
            title="Throughput · Today"
            subtitle="Tasks completed per 2-hour interval"
            data={profile.throughputIntraday}
            color="#0066FF"
            headlineValue={profile.throughputTph.toFixed(1)}
            unit="tasks/hr"
            yUnit=""
            xKey="interval"
            delta={+4}
          />
        </div>
      </div>
    </div>
  );
}
