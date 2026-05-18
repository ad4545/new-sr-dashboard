import React, { useMemo, useState } from "react";
import {
  AlertOctagon,
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  Search,
  X,
  ChevronDown,
  Download,
  Radio,
  Compass,
  BatteryCharging,
  ShieldAlert,
  ListChecks,
  Crosshair,
  Cpu,
  Plug,
  Wrench,
  Eye,
  CheckCheck,
  Copy,
  MapPin,
  Gauge,
  Wifi,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  LOGS,
  LOG_SEVERITIES,
  LOG_SOURCES,
  LOG_TIME_RANGES,
  formatTimeAgo,
  formatClock,
} from "../../../data/logsMockData";
import { ROBOT_STATS } from "../../../data/statsMockData";

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------
const SEVERITY_MAP = Object.fromEntries(LOG_SEVERITIES.map((s) => [s.id, s]));
const SOURCE_MAP = Object.fromEntries(LOG_SOURCES.map((s) => [s.id, s]));

const SEVERITY_ICONS = {
  critical: AlertOctagon,
  error: AlertCircle,
  warn: AlertTriangle,
  info: Info,
  debug: Bug,
};

const SOURCE_ICONS = {
  navigation: Compass,
  battery: BatteryCharging,
  safety: ShieldAlert,
  "task-manager": ListChecks,
  comms: Radio,
  lidar: Crosshair,
  firmware: Cpu,
  charging: Plug,
  maintenance: Wrench,
  vision: Eye,
};

// ---------------------------------------------------------------------------
// Severity stat tile (top strip)
// ---------------------------------------------------------------------------
const SeverityTile = ({ severity, count, total, active, onClick }) => {
  const Icon = SEVERITY_ICONS[severity.id];
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <button
      data-testid={`severity-tile-${severity.id}`}
      onClick={onClick}
      className={[
        "group relative text-left rounded-2xl border bg-[#15171D] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 flex flex-col gap-2 transition-all",
        active
          ? "border-white/30"
          : "border-white/[0.12] hover:border-white/20",
      ].join(" ")}
      style={
        active
          ? { boxShadow: `0 0 0 1px ${severity.color}66, 0 4px 24px rgba(0,0,0,0.5)` }
          : {}
      }
    >
      <div className="flex items-center justify-between">
        <span
          className="h-9 w-9 rounded-lg flex items-center justify-center"
          style={{ background: `${severity.color}14`, border: `1px solid ${severity.color}40` }}
        >
          <Icon className="h-4 w-4" style={{ color: severity.color }} strokeWidth={1.8} />
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold">
          {pct}%
        </span>
      </div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold">
        {severity.label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[26px] font-extrabold text-white tabular-nums leading-none">
          {count}
        </span>
        <span className="text-[11px] font-bold text-slate-500">events</span>
      </div>
      {/* bottom accent bar */}
      <div
        className="absolute left-4 right-4 bottom-2 h-[2px] rounded-full transition-all"
        style={{
          background: severity.color,
          opacity: active ? 0.9 : 0.25,
        }}
      />
    </button>
  );
};

// ---------------------------------------------------------------------------
// Source pill (used inside rows)
// ---------------------------------------------------------------------------
const SourcePill = ({ source }) => {
  const s = SOURCE_MAP[source];
  const Icon = SOURCE_ICONS[source];
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
      style={{
        color: s.color,
        background: `${s.color}10`,
        border: `1px solid ${s.color}30`,
      }}
    >
      <Icon className="h-3 w-3" strokeWidth={2.2} />
      {s.label}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Filter chip (toggleable)
// ---------------------------------------------------------------------------
const FilterChip = ({ active, color, onClick, children, testid }) => (
  <button
    data-testid={testid}
    onClick={onClick}
    className={[
      "h-8 px-2.5 rounded-md flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-all border",
      active
        ? "text-white"
        : "text-slate-400 border-white/10 bg-white/[0.02] hover:text-white hover:border-white/20",
    ].join(" ")}
    style={
      active
        ? { color, background: `${color}18`, borderColor: `${color}66` }
        : {}
    }
  >
    {children}
  </button>
);

// ---------------------------------------------------------------------------
// Sensor status chip (inside expanded row)
// ---------------------------------------------------------------------------
const SensorChip = ({ icon: Icon, label, status }) => {
  const colorMap = {
    ok: "#10B981",
    warn: "#F59E0B",
    triggered: "#EF4444",
    drift: "#F97316",
    weak: "#F59E0B",
  };
  const color = colorMap[status] || "#64748B";
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-md border bg-white/[0.02]"
      style={{ borderColor: `${color}30` }}
    >
      <Icon className="h-3 w-3" style={{ color }} strokeWidth={2} />
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
        {label}
      </span>
      <span
        className="text-[10px] font-bold uppercase tracking-wider tabular-nums"
        style={{ color }}
      >
        {status}
      </span>
    </div>
  );
};

const DetailField = ({ label, children, mono = false }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold">
      {label}
    </span>
    <span
      className={`text-[12px] text-white font-${mono ? "mono" : "bold"} ${
        mono ? "tabular-nums" : ""
      }`}
    >
      {children}
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// Log Row (collapsible)
// ---------------------------------------------------------------------------
const LogRow = ({ log, expanded, onToggle }) => {
  const sev = SEVERITY_MAP[log.severity];

  return (
    <div
      data-testid={`log-row-${log.id}`}
      className={[
        "rounded-xl border bg-[#15171D] transition-all",
        expanded
          ? "border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          : "border-white/[0.08] hover:border-white/[0.18]",
      ].join(" ")}
      style={
        expanded
          ? { boxShadow: `inset 3px 0 0 0 ${sev.color}, 0 4px 24px rgba(0,0,0,0.5)` }
          : { boxShadow: `inset 3px 0 0 0 ${sev.color}55` }
      }
    >
      <button
        data-testid={`log-toggle-${log.id}`}
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        {/* Severity icon */}
        <span
          className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
          style={{ background: `${sev.color}14`, border: `1px solid ${sev.color}40` }}
        >
          {React.createElement(SEVERITY_ICONS[log.severity], {
            className: "h-3.5 w-3.5",
            style: { color: sev.color },
            strokeWidth: 1.9,
          })}
        </span>

        {/* Timestamp */}
        <div className="flex flex-col leading-tight w-[110px] shrink-0">
          <span className="text-[12px] font-extrabold text-white tabular-nums font-mono">
            {formatClock(log.timestamp)}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold">
            {formatTimeAgo(log.timestamp)}
          </span>
        </div>

        {/* Robot */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] font-bold text-slate-300 font-mono shrink-0">
          {log.robotId}
        </span>

        {/* Source */}
        <div className="shrink-0">
          <SourcePill source={log.source} />
        </div>

        {/* Code */}
        <span className="text-[10px] font-bold text-slate-500 font-mono tabular-nums shrink-0">
          {log.code}
        </span>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-white truncate">
            {log.title}
          </div>
        </div>

        {/* Acknowledged badge */}
        {log.acked && (
          <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 shrink-0">
            <CheckCheck className="h-2.5 w-2.5" strokeWidth={2.4} />
            Acked
          </span>
        )}

        {/* Chevron */}
        <ChevronDown
          className={[
            "h-4 w-4 text-slate-500 transition-transform shrink-0",
            expanded ? "rotate-180 text-white" : "",
          ].join(" ")}
          strokeWidth={2}
        />
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div
          data-testid={`log-details-${log.id}`}
          className="border-t border-white/[0.08] px-5 pt-4 pb-5"
        >
          {/* Description */}
          <p className="text-[13px] text-slate-300 leading-relaxed mb-4">
            {log.description}
          </p>

          {/* Two-column detail grid */}
          <div className="grid grid-cols-12 gap-3">
            {/* Diagnostics */}
            <div className="col-span-12 lg:col-span-7 rounded-lg border border-white/[0.08] bg-white/[0.02] p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-3">
                Diagnostics Snapshot
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <DetailField label="Position" mono>
                  ({log.details.position.x}, {log.details.position.y})
                </DetailField>
                <DetailField label="Heading θ" mono>
                  {log.details.position.theta}°
                </DetailField>
                <DetailField label="Velocity" mono>
                  {log.details.velocity.linear} m/s
                </DetailField>
                <DetailField label="Battery" mono>
                  {log.details.battery}%
                </DetailField>
                <DetailField label="Zone">{log.zone}</DetailField>
                <DetailField label="Angular Vel" mono>
                  {log.details.velocity.angular} rad/s
                </DetailField>
                {log.details.taskId && (
                  <DetailField label="Linked Task" mono>
                    {log.details.taskId}
                  </DetailField>
                )}
                <DetailField label="Event ID" mono>
                  {log.id}
                </DetailField>
              </div>

              {/* Sensor strip */}
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-2 mb-2">
                Sensor State
              </div>
              <div className="flex flex-wrap gap-1.5">
                <SensorChip icon={Crosshair} label="Front LiDAR" status={log.details.sensors.front_lidar} />
                <SensorChip icon={Crosshair} label="Rear LiDAR" status={log.details.sensors.rear_lidar} />
                <SensorChip icon={ShieldAlert} label="Bumper" status={log.details.sensors.bumper} />
                <SensorChip icon={Gauge} label="IMU" status={log.details.sensors.imu} />
                <SensorChip icon={Wifi} label="WiFi" status={log.details.sensors.wifi} />
              </div>
            </div>

            {/* Suggested action */}
            <div className="col-span-12 lg:col-span-5 rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 flex flex-col">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">
                {log.suggested ? "Suggested Resolution" : "Raw Payload"}
              </div>
              {log.suggested ? (
                <p className="text-[12px] text-slate-300 leading-relaxed flex-1">
                  {log.suggested}
                </p>
              ) : (
                <pre className="text-[10px] text-slate-400 font-mono leading-relaxed flex-1 whitespace-pre-wrap break-all">
                  {`{`}
                  {"\n"}
                  {`  "event": "${log.code}",`}
                  {"\n"}
                  {`  "ts": "${log.ts}",`}
                  {"\n"}
                  {`  "robot": "${log.robotId}",`}
                  {"\n"}
                  {`  "ctx": { "x": ${log.details.position.x}, "y": ${log.details.position.y} }`}
                  {"\n"}
                  {`}`}
                </pre>
              )}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                <button
                  data-testid={`log-ack-${log.id}`}
                  className={[
                    "h-7 px-2.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border transition-all",
                    log.acked
                      ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                      : "text-slate-300 border-white/10 bg-white/[0.03] hover:text-white hover:border-white/20",
                  ].join(" ")}
                >
                  <CheckCheck className="h-3 w-3" strokeWidth={2.2} />
                  {log.acked ? "Acknowledged" : "Acknowledge"}
                </button>
                <button
                  data-testid={`log-copy-${log.id}`}
                  className="h-7 px-2.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-white/10 bg-white/[0.03] hover:text-white hover:border-white/20 transition-all flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    try {
                      navigator.clipboard.writeText(log.id);
                    } catch {
                      /* ignore */
                    }
                  }}
                >
                  <Copy className="h-3 w-3" strokeWidth={2.2} />
                  Copy ID
                </button>
                <button
                  data-testid={`log-locate-${log.id}`}
                  className="h-7 px-2.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-[#00C2FF] border border-[#00C2FF]/30 bg-[#00C2FF]/10 hover:bg-[#00C2FF]/20 transition-all flex items-center gap-1 ml-auto"
                >
                  <MapPin className="h-3 w-3" strokeWidth={2.2} />
                  Locate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function SystemLogs() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState(new Set());
  const [sourceFilter, setSourceFilter] = useState("all");
  const [robotFilter, setRobotFilter] = useState("all");
  const [rangeFilter, setRangeFilter] = useState("24h");
  const [expanded, setExpanded] = useState(new Set());
  const [showAcked, setShowAcked] = useState(true);

  const rangeMs = LOG_TIME_RANGES.find((r) => r.id === rangeFilter)?.ms ?? Infinity;
  const cutoff = Date.now() - rangeMs;

  // Counts per severity (within time window + non-search filters that don't conflict)
  const severityCounts = useMemo(() => {
    const counts = Object.fromEntries(LOG_SEVERITIES.map((s) => [s.id, 0]));
    LOGS.forEach((l) => {
      if (l.timestamp.getTime() < cutoff) return;
      counts[l.severity] = (counts[l.severity] || 0) + 1;
    });
    return counts;
  }, [cutoff]);

  const totalInRange = Object.values(severityCounts).reduce((a, b) => a + b, 0);

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return LOGS.filter((l) => {
      if (l.timestamp.getTime() < cutoff) return false;
      if (severityFilter.size > 0 && !severityFilter.has(l.severity)) return false;
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (robotFilter !== "all" && l.robotId !== robotFilter) return false;
      if (!showAcked && l.acked) return false;
      if (q) {
        const hay =
          `${l.title} ${l.description} ${l.code} ${l.robotId} ${l.source} ${l.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cutoff, severityFilter, sourceFilter, robotFilter, search, showAcked]);

  const toggleSeverity = (id) => {
    setSeverityFilter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSearch("");
    setSeverityFilter(new Set());
    setSourceFilter("all");
    setRobotFilter("all");
    setRangeFilter("24h");
    setShowAcked(true);
  };

  const hasActiveFilters =
    search ||
    severityFilter.size > 0 ||
    sourceFilter !== "all" ||
    robotFilter !== "all" ||
    rangeFilter !== "24h" ||
    !showAcked;

  return (
    <div data-testid="system-logs" className="flex flex-col gap-3">
      {/* ====== Severity stat strip ====== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {LOG_SEVERITIES.map((s) => (
          <SeverityTile
            key={s.id}
            severity={s}
            count={severityCounts[s.id] || 0}
            total={totalInRange}
            active={severityFilter.has(s.id)}
            onClick={() => toggleSeverity(s.id)}
          />
        ))}
      </div>

      {/* ====== Filter bar ====== */}
      <div className="rounded-2xl border border-white/[0.12] bg-[#15171D] shadow-[0_4px_24px_rgba(0,0,0,0.4)] px-3 py-3 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-white/[0.03] border border-white/10 focus-within:border-[#0066FF]/40 transition-all flex-1 min-w-[220px]">
          <Search className="h-3.5 w-3.5 text-slate-500" strokeWidth={2} />
          <input
            data-testid="log-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, codes, robots… (e.g. NAV-0412, bumper, AMR-03)"
            className="bg-transparent outline-none text-[13px] text-white placeholder:text-slate-600 font-semibold w-full"
          />
          {search && (
            <button
              data-testid="log-search-clear"
              onClick={() => setSearch("")}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Robot select */}
        <Select value={robotFilter} onValueChange={setRobotFilter}>
          <SelectTrigger
            data-testid="filter-robot"
            className="h-9 w-[160px] bg-white/[0.03] border-white/10 text-white text-[12px] font-bold"
          >
            <SelectValue placeholder="All Robots" />
          </SelectTrigger>
          <SelectContent className="bg-[#0E0F13] border-white/10 text-white">
            <SelectItem value="all" className="font-semibold">
              All Robots
            </SelectItem>
            {ROBOT_STATS.map((r) => (
              <SelectItem key={r.id} value={r.id} className="font-semibold font-mono">
                {r.id} · {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Source select */}
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger
            data-testid="filter-source"
            className="h-9 w-[160px] bg-white/[0.03] border-white/10 text-white text-[12px] font-bold"
          >
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent className="bg-[#0E0F13] border-white/10 text-white">
            <SelectItem value="all" className="font-semibold">
              All Sources
            </SelectItem>
            {LOG_SOURCES.map((s) => (
              <SelectItem key={s.id} value={s.id} className="font-semibold">
                <span className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: s.color }}
                  />
                  {s.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Time range chips */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/10">
          {LOG_TIME_RANGES.map((r) => (
            <button
              key={r.id}
              data-testid={`range-${r.id}`}
              onClick={() => setRangeFilter(r.id)}
              className={[
                "h-7 px-2.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all",
                rangeFilter === r.id
                  ? "bg-[#0066FF] text-white shadow-[0_0_12px_rgba(0,102,255,0.4)]"
                  : "text-slate-400 hover:text-white",
              ].join(" ")}
            >
              {r.label.replace("Last ", "")}
            </button>
          ))}
        </div>

        {/* Show acked toggle */}
        <button
          data-testid="toggle-acked"
          onClick={() => setShowAcked((v) => !v)}
          className={[
            "h-9 px-3 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5",
            showAcked
              ? "text-slate-300 border-white/10 bg-white/[0.02] hover:text-white"
              : "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
          ].join(" ")}
        >
          <CheckCheck className="h-3 w-3" strokeWidth={2.4} />
          {showAcked ? "All" : "Unacked"}
        </button>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            data-testid="clear-filters"
            onClick={clearAllFilters}
            className="h-9 px-3 rounded-lg border border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-1"
          >
            <X className="h-3 w-3" strokeWidth={2.4} />
            Clear
          </button>
        )}

        {/* Export (visual) */}
        <button
          data-testid="export-logs"
          className="h-9 px-3 rounded-lg border border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:border-[#0066FF]/40 transition-all flex items-center gap-1.5"
        >
          <Download className="h-3 w-3" strokeWidth={2.4} />
          CSV
        </button>
      </div>

      {/* ====== Active severity filter chip row ====== */}
      {severityFilter.size > 0 && (
        <div className="flex items-center gap-2 flex-wrap px-1">
          <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold">
            Severity ·
          </span>
          {LOG_SEVERITIES.map((s) => {
            if (!severityFilter.has(s.id)) return null;
            return (
              <FilterChip
                key={s.id}
                testid={`active-chip-${s.id}`}
                active
                color={s.color}
                onClick={() => toggleSeverity(s.id)}
              >
                {s.label}
                <X className="h-3 w-3 ml-0.5" strokeWidth={2.4} />
              </FilterChip>
            );
          })}
        </div>
      )}

      {/* ====== Result count strip ====== */}
      <div className="flex items-center justify-between px-1">
        <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500 font-bold">
          Showing{" "}
          <span className="text-white font-extrabold tabular-nums">{filtered.length}</span>{" "}
          of{" "}
          <span className="text-slate-400 font-bold tabular-nums">{LOGS.length}</span>{" "}
          events
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Stream Live · 24h Window
        </div>
      </div>

      {/* ====== Log list ====== */}
      <div className="flex flex-col gap-1.5">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#15171D] p-12 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center mb-3">
              <Search className="h-5 w-5 text-[#00C2FF]" strokeWidth={1.6} />
            </div>
            <h3 className="text-base font-extrabold text-white mb-1">No events match</h3>
            <p className="text-[12px] text-slate-500 max-w-sm">
              Try widening the time range, clearing the search, or removing severity filters.
            </p>
          </div>
        ) : (
          filtered.map((log) => (
            <LogRow
              key={log.id}
              log={log}
              expanded={expanded.has(log.id)}
              onToggle={() => toggleExpand(log.id)}
            />
          ))
        )}
      </div>

      {/* Bottom hint */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-center pt-2 pb-1 text-[10px] uppercase tracking-[0.22em] text-slate-600 font-bold">
          End of stream · {filtered.length} events rendered · click any row to expand
        </div>
      )}
    </div>
  );
}
