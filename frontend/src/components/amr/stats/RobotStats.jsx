import React from "react";
import {
  CheckCircle2,
  XCircle,
  Zap,
  Route as RouteIcon,
  Repeat,
  Bot,
} from "lucide-react";
import { ROBOT_STATS } from "../../../data/statsMockData";

const statusStyle = {
  active: { color: "#00C2FF", label: "Active" },
  charging: { color: "#F59E0B", label: "Charging" },
  idle: { color: "#64748B", label: "Idle" },
  maintenance: { color: "#EF4444", label: "Service" },
};

// Animated battery cell — green wavy liquid that fills to `percent`
const BatteryCell = ({ percent, status }) => {
  const isService = status === "maintenance";
  const offline = isService || percent === 0;
  // Color shifts with charge level
  const color =
    offline ? "#475569" :
    percent > 60 ? "#10B981" :
    percent > 30 ? "#F59E0B" :
    "#EF4444";
  const glow = `${color}66`;

  // For a 0% case, show empty cell; for offline show grey
  const fillPercent = offline ? 4 : Math.max(percent, 6); // tiny puddle even at low

  return (
    <div
      data-testid="battery-cell"
      className="relative w-[96px] h-[160px] shrink-0"
      style={{ filter: offline ? "saturate(0.4) opacity(0.7)" : "none" }}
    >
      {/* Top cap */}
      <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-9 h-[10px] rounded-t-md bg-gradient-to-b from-white/25 to-white/10 border border-white/15 border-b-0" />

      {/* Cell body */}
      <div
        className="relative w-full h-full rounded-[18px] border-2 border-white/15 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.35) 100%)",
          boxShadow:
            `inset 0 2px 6px rgba(255,255,255,0.08), inset 0 -2px 8px rgba(0,0,0,0.5), 0 0 22px ${glow}`,
        }}
      >
        {/* Inner subtle highlights (cell ridges) */}
        <span className="absolute left-[10%] top-2 bottom-2 w-px bg-white/[0.04]" />
        <span className="absolute right-[10%] top-2 bottom-2 w-px bg-white/[0.04]" />

        {/* Liquid fill */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-[height] duration-700 ease-out"
          style={{
            height: `${fillPercent}%`,
            background: `linear-gradient(180deg, ${color}EE 0%, ${color}FF 100%)`,
          }}
        >
          {/* Front wave (faster, opaque) */}
          <svg
            className="absolute -top-[10px] left-0 w-[200%] h-[20px] animate-amr-wave pointer-events-none"
            viewBox="0 0 200 20"
            preserveAspectRatio="none"
          >
            <path
              d="M0,12 Q12.5,2 25,12 T50,12 T75,12 T100,12 T125,12 T150,12 T175,12 T200,12 L200,20 L0,20 Z"
              fill={color}
            />
          </svg>
          {/* Back wave (slower, translucent) */}
          <svg
            className="absolute -top-[14px] left-0 w-[200%] h-[20px] animate-amr-wave-slow pointer-events-none opacity-50"
            viewBox="0 0 200 20"
            preserveAspectRatio="none"
          >
            <path
              d="M0,12 Q12.5,4 25,12 T50,12 T75,12 T100,12 T125,12 T150,12 T175,12 T200,12 L200,20 L0,20 Z"
              fill="#FFFFFF"
            />
          </svg>

          {/* Inner highlight (top of liquid) */}
          <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white/25 to-transparent" />

          {/* Bubbles */}
          {!offline && (
            <>
              <span
                className="absolute left-3 bottom-3 h-1.5 w-1.5 rounded-full bg-white/55 animate-amr-bubble"
                style={{ animationDelay: "0s" }}
              />
              <span
                className="absolute left-8 bottom-1 h-1 w-1 rounded-full bg-white/40 animate-amr-bubble"
                style={{ animationDelay: "0.7s" }}
              />
              <span
                className="absolute right-3 bottom-4 h-1 w-1 rounded-full bg-white/45 animate-amr-bubble"
                style={{ animationDelay: "1.4s" }}
              />
            </>
          )}
        </div>

        {/* Centered percentage */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-[28px] font-extrabold text-white tabular-nums leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
              {offline ? "—" : `${percent}%`}
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/70 font-bold mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              {offline ? "Service" : "Charge"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tiny stat row inside a robot card
const StatRow = ({ icon: Icon, color, label, value, unit }) => (
  <div className="flex items-center gap-2.5 py-2 border-b border-white/[0.05] last:border-b-0">
    <span
      className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
      style={{
        background: `${color}14`,
        border: `1px solid ${color}40`,
      }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color }} strokeWidth={1.8} />
    </span>
    <span className="flex-1 text-[12px] text-slate-400 font-semibold uppercase tracking-wider">
      {label}
    </span>
    <span className="text-[15px] font-extrabold text-white tabular-nums">
      {value}
      {unit && (
        <span className="text-slate-500 font-bold text-[11px] ml-0.5">{unit}</span>
      )}
    </span>
  </div>
);

const RobotCard = ({ robot }) => {
  const s = statusStyle[robot.status];
  return (
    <div
      data-testid={`robot-card-${robot.id}`}
      className="h-full rounded-2xl border border-white/[0.12] bg-[#15171D] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: `${s.color}14`,
              border: `1px solid ${s.color}40`,
            }}
          >
            <Bot className="h-4 w-4" style={{ color: s.color }} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-extrabold text-white truncate leading-tight">
              {robot.name}
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold mt-0.5">
              {robot.id} · {robot.model}
            </div>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider"
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

      {/* Body: battery cell + stats */}
      <div className="flex items-start gap-4 flex-1">
        <div className="pl-2 pt-3">
          <BatteryCell percent={robot.battery} status={robot.status} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <StatRow
            icon={CheckCircle2}
            color="#10B981"
            label="Success Tasks"
            value={robot.successTasks}
          />
          <StatRow
            icon={XCircle}
            color="#EF4444"
            label="Failed Tasks"
            value={robot.failedTasks}
          />
          <StatRow
            icon={Zap}
            color="#F59E0B"
            label="Battery / Cycle"
            value={robot.batteryPerCycle.toFixed(1)}
            unit="%"
          />
          <StatRow
            icon={RouteIcon}
            color="#00C2FF"
            label="Total Distance"
            value={robot.totalDistance.toFixed(1)}
            unit="km"
          />
          <StatRow
            icon={Repeat}
            color="#A855F7"
            label="Distance / Cycle"
            value={robot.distancePerCycle.toFixed(1)}
            unit="km"
          />
        </div>
      </div>

      {/* Footer summary */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-600 font-bold">
        <span>{robot.charges} charge cycles</span>
        <span>
          Success rate ·{" "}
          <span className="text-[#6EE7B7] font-extrabold">
            {robot.successTasks + robot.failedTasks > 0
              ? Math.round((robot.successTasks /
                  (robot.successTasks + robot.failedTasks)) *
                  100)
              : 0}
            %
          </span>
        </span>
      </div>
    </div>
  );
};

export default function RobotStats() {
  return (
    <div data-testid="robot-stats" className="grid grid-cols-12 gap-3">
      {ROBOT_STATS.map((r) => (
        <div
          key={r.id}
          className="col-span-12 md:col-span-6 xl:col-span-4 h-[330px]"
        >
          <RobotCard robot={r} />
        </div>
      ))}
    </div>
  );
}
