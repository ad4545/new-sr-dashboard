import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  Bot,
  Gauge,
  Battery,
  BatteryCharging,
  MapPin,
  Clock,
  Wrench,
  User,
  Route,
  Activity,
  ShieldCheck,
  Pause,
  Power,
} from "lucide-react";
import {
  FLEET,
  LIVE_TASKS,
  ROBOT_ASSIGNMENTS,
  ROBOT_MAINTENANCE_HISTORY,
} from "../../data/mockData";

const statusColor = {
  active: "#00C2FF",
  charging: "#F59E0B",
  idle: "#64748B",
  maintenance: "#EF4444",
};
const statusLabel = {
  active: "Active",
  charging: "Charging",
  idle: "Idle",
  maintenance: "Service",
};

export const RobotDrawer = ({ open, robotId, onOpenChange }) => {
  const robot = FLEET.find((f) => f.id === robotId);
  if (!robot) {
    return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent /></Sheet>;
  }

  const c = statusColor[robot.status];
  const liveTask = LIVE_TASKS.find((t) => t.robot === robot.id);
  const assign = ROBOT_ASSIGNMENTS[robot.id] || {};
  const history = ROBOT_MAINTENANCE_HISTORY[robot.id] || [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        data-testid="robot-drawer"
        side="right"
        className="amr-dashboard w-[92vw] sm:max-w-[460px] p-0 bg-[#0A0A0B] border-l border-white/10 text-white overflow-y-auto"
      >
        {/* Accent top bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${c}, transparent)` }} />

        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-5 border-b border-white/5 text-left space-y-0">
          <div className="flex items-start gap-4">
            <div
              className="relative h-14 w-14 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: `${c}14`,
                border: `1px solid ${c}40`,
                boxShadow: `0 0 20px ${c}25, inset 0 0 18px ${c}10`,
              }}
            >
              <Bot className="h-7 w-7" style={{ color: c }} strokeWidth={1.5} />
              <span
                className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full ring-2 ring-[#0A0A0B]"
                style={{
                  background: c,
                  boxShadow: `0 0 8px ${c}`,
                  animation: robot.status === "active" ? "amr-pulse 1.4s ease-in-out infinite" : "none",
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {assign.fleetGroup || "Fleet"}
              </div>
              <SheetTitle className="text-2xl font-extrabold text-white leading-tight mt-0.5">
                {robot.name}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="font-mono text-[11px] text-slate-500">{robot.id}</span>
                <span className="text-slate-700">·</span>
                <span className="font-mono text-[11px] text-slate-400">{robot.model}</span>
              </div>
            </div>
          </div>

          {/* Status row */}
          <div className="mt-5 flex items-center gap-2 flex-wrap">
            <StatusChip
              color={c}
              label={statusLabel[robot.status]}
              testid="drawer-status"
            />
            <MetricChip
              icon={<Battery className="h-3 w-3" />}
              label={`${robot.battery}%`}
              color={robot.battery > 60 ? "#10B981" : robot.battery > 30 ? "#F59E0B" : "#EF4444"}
              testid="drawer-battery"
            />
            <MetricChip
              icon={<Gauge className="h-3 w-3" />}
              label={`${robot.speed.toFixed(1)} m/s`}
              color="#00C2FF"
              testid="drawer-speed"
            />
            <MetricChip
              icon={<MapPin className="h-3 w-3" />}
              label={`Zone ${robot.zone}`}
              color="#94A3B8"
              testid="drawer-zone"
            />
          </div>

          {/* Quick actions */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ActionBtn
              testid="drawer-pause"
              icon={<Pause className="h-3.5 w-3.5" />}
              label="Pause"
            />
            <ActionBtn
              testid="drawer-reroute"
              icon={<Route className="h-3.5 w-3.5" />}
              label="Re-route"
            />
            <ActionBtn
              testid="drawer-estop"
              icon={<Power className="h-3.5 w-3.5" />}
              label="E-Stop"
              danger
            />
          </div>
        </SheetHeader>

        {/* Live Task */}
        <Section icon={<Activity className="h-3.5 w-3.5" />} title="Live Task">
          {liveTask ? (
            <div
              data-testid="drawer-live-task"
              className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
            >
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-mono text-[11px] text-[#00C2FF]">{liveTask.id}</span>
                <span className="text-slate-700">·</span>
                <span className="text-[13px] font-semibold text-white">{liveTask.type}</span>
              </div>
              <div className="font-mono text-[11px] text-slate-500 mb-2.5">
                {liveTask.from} <span className="text-slate-700">→</span> {liveTask.to}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF]"
                    style={{ width: `${liveTask.progress}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] text-white tabular-nums w-10 text-right">
                  {liveTask.progress}%
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <span>Elapsed · {liveTask.elapsed}</span>
                <span>{assign.waypoints || 0} waypoints</span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-white/10 p-4 text-center text-[12px] text-slate-500">
              No active task — {assign.route || "parked"}
            </div>
          )}
        </Section>

        {/* Assignment */}
        <Section icon={<User className="h-3.5 w-3.5" />} title="Assignment">
          <div className="grid grid-cols-2 gap-2">
            <InfoCell label="Operator" value={assign.operator || "Unassigned"} />
            <InfoCell label="Route" value={assign.route || "—"} />
            <InfoCell label="Uptime" value={robot.uptime} />
            <InfoCell label="Waypoints" value={String(assign.waypoints ?? 0)} />
          </div>
        </Section>

        {/* Maintenance */}
        <Section
          icon={<Wrench className="h-3.5 w-3.5" />}
          title="Maintenance History"
          action={<span className="font-mono text-[10px] text-slate-500">{history.length} events</span>}
        >
          {history.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/10 p-4 text-center text-[12px] text-slate-500">
              No recorded maintenance.
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((h, i) => (
                <div
                  key={i}
                  data-testid={`drawer-maint-${i}`}
                  className="relative pl-4 pr-3 py-2.5 rounded-lg border border-white/5 bg-white/[0.015]"
                >
                  <span
                    className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-full bg-[#00C2FF]/60"
                    style={{ boxShadow: "0 0 6px #00C2FF" }}
                  />
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[12px] font-bold text-white">{h.type}</span>
                    <span className="font-mono text-[10px] text-slate-500 tabular-nums">{h.date}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{h.note}</div>
                  <div className="font-mono text-[10px] text-slate-600 mt-0.5">by {h.tech}</div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Safety interlocks nominal
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
            <Clock className="h-3 w-3" /> Telemetry fresh
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Section = ({ icon, title, action, children }) => (
  <div className="px-6 py-5 border-b border-white/5">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
        {icon}
        <span>{title}</span>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const InfoCell = ({ label, value }) => (
  <div className="rounded-md border border-white/5 bg-white/[0.02] px-3 py-2">
    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500 mb-0.5">
      {label}
    </div>
    <div className="text-[12px] font-semibold text-white truncate">{value}</div>
  </div>
);

const StatusChip = ({ color, label, testid }) => (
  <span
    data-testid={testid}
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[10px] uppercase tracking-wider"
    style={{ color, borderColor: `${color}40`, background: `${color}14` }}
  >
    <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
    {label}
  </span>
);

const MetricChip = ({ icon, label, color, testid }) => (
  <span
    data-testid={testid}
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.02] font-mono text-[11px]"
    style={{ color }}
  >
    {icon}
    <span className="tabular-nums">{label}</span>
  </span>
);

const ActionBtn = ({ icon, label, testid, danger }) => (
  <button
    data-testid={testid}
    className={`flex items-center justify-center gap-1.5 h-9 rounded-lg border transition-all text-[12px] font-semibold ${
      danger
        ? "border-[#EF4444]/40 bg-[#EF4444]/10 text-[#FCA5A5] hover:bg-[#EF4444]/20"
        : "border-white/10 bg-white/[0.02] text-slate-200 hover:bg-[#0066FF]/10 hover:border-[#0066FF]/40 hover:text-white"
    }`}
  >
    {icon} {label}
  </button>
);

export default RobotDrawer;
