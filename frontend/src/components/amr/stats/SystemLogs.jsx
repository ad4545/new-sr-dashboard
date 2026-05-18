import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Search,
  X,
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

const SEVERITY_MAP = Object.fromEntries(LOG_SEVERITIES.map((s) => [s.id, s]));
const SOURCE_MAP = Object.fromEntries(LOG_SOURCES.map((s) => [s.id, s]));

const SEVERITY_ICONS = {
  info: Info,
  warn: AlertTriangle,
  error: AlertCircle,
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
// Source pill — neutral monochrome (no per-source color)
// ---------------------------------------------------------------------------
const SourcePill = ({ source }) => {
  const s = SOURCE_MAP[source];
  const Icon = SOURCE_ICONS[source];
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-[3px] rounded-md text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400 bg-white/[0.03] border border-white/[0.06]">
      <Icon className="h-3 w-3" strokeWidth={1.8} />
      {s.label}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Log Row (expand-on-hover, neutral by default, color only for warn/error)
// ---------------------------------------------------------------------------
const LogRow = ({ log }) => {
  const sev = SEVERITY_MAP[log.severity];
  const Icon = SEVERITY_ICONS[log.severity];
  const isNormal = log.severity === "info";

  return (
    <div
      data-testid={`log-row-${log.id}`}
      className={[
        "group relative rounded-md border bg-[#15171D]/60 hover:bg-[#15171D] transition-all overflow-hidden",
        isNormal
          ? "border-white/[0.05] hover:border-white/[0.14]"
          : "border-white/[0.08] hover:border-white/[0.2]",
      ].join(" ")}
      style={
        isNormal
          ? undefined
          : { boxShadow: `inset 3px 0 0 0 ${sev.color}` }
      }
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-2.5 text-left">
        {/* Severity icon — muted for normal, colored for warn/error */}
        <Icon
          className="h-[14px] w-[14px] shrink-0"
          style={{ color: isNormal ? "#475569" : sev.color }}
          strokeWidth={1.8}
        />

        {/* Timestamp */}
        <span className="text-[12px] font-medium text-slate-300 tabular-nums font-mono shrink-0 w-[72px] tracking-tight">
          {formatClock(log.timestamp)}
        </span>

        {/* Robot */}
        <span className="text-[11px] font-semibold text-slate-500 font-mono shrink-0 w-[60px] tracking-tight">
          {log.robotId}
        </span>

        {/* Source */}
        <div className="shrink-0">
          <SourcePill source={log.source} />
        </div>

        {/* Code */}
        <span className="text-[10px] font-medium text-slate-600 font-mono tabular-nums shrink-0 w-[80px] tracking-tight">
          {log.code}
        </span>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div
            className={[
              "text-[13px] truncate transition-colors tracking-[-0.005em]",
              isNormal
                ? "text-slate-300 font-medium group-hover:text-white"
                : "text-white font-semibold",
            ].join(" ")}
          >
            {log.title}
          </div>
        </div>

        {/* Time ago + Acked */}
        <span className="text-[10px] text-slate-600 font-medium shrink-0 tabular-nums">
          {formatTimeAgo(log.timestamp)}
        </span>
        {log.acked && (
          <span
            className="hidden md:inline-flex items-center gap-1 text-slate-500 shrink-0"
            title="Acknowledged"
          >
            <CheckCheck className="h-3 w-3" strokeWidth={2} />
          </span>
        )}
      </div>

      {/* Expand-on-hover details */}
      <div
        data-testid={`log-details-${log.id}`}
        className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300"
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-3 pt-1 border-t border-white/[0.04]">
            <p className="text-[12px] text-slate-400 leading-relaxed mb-2 tracking-[-0.005em]">
              {log.description}
            </p>

            {/* Inline diagnostics */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-2">
              <DataPair label="POS" value={`${log.details.position.x}, ${log.details.position.y}`} />
              <DataPair label="θ" value={`${log.details.position.theta}°`} />
              <DataPair label="VEL" value={`${log.details.velocity.linear} m/s`} />
              <DataPair label="BAT" value={`${log.details.battery}%`} />
              <DataPair label="ZONE" value={log.zone} />
              {log.details.taskId && <DataPair label="TASK" value={log.details.taskId} />}
              <DataPair label="ID" value={log.id} />
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              {log.suggested ? (
                <p className="text-[11px] text-slate-500 italic flex-1 min-w-0">
                  → {log.suggested}
                </p>
              ) : (
                <span className="flex-1" />
              )}
              <div className="flex items-center gap-1 shrink-0">
                <ActionButton testid={`log-ack-${log.id}`} icon={CheckCheck} active={log.acked}>
                  {log.acked ? "Acked" : "Ack"}
                </ActionButton>
                <ActionButton
                  testid={`log-copy-${log.id}`}
                  icon={Copy}
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(log.id);
                    } catch {
                      /* ignore */
                    }
                  }}
                >
                  Copy
                </ActionButton>
                <ActionButton testid={`log-locate-${log.id}`} icon={MapPin}>
                  Locate
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Tiny building blocks
// ---------------------------------------------------------------------------
const DataPair = ({ label, value }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className="text-[9px] uppercase tracking-[0.18em] text-slate-600 font-semibold">
      {label}
    </span>
    <span className="text-[11px] text-slate-300 font-medium tabular-nums font-mono">
      {value}
    </span>
  </span>
);

const ActionButton = ({ icon: Icon, children, onClick, active, testid }) => (
  <button
    data-testid={testid}
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className={[
      "h-6 px-2 rounded text-[10px] font-medium uppercase tracking-[0.08em] flex items-center gap-1 border transition-all",
      active
        ? "text-slate-300 border-white/15 bg-white/[0.04]"
        : "text-slate-500 border-white/[0.06] bg-transparent hover:text-white hover:border-white/15 hover:bg-white/[0.03]",
    ].join(" ")}
  >
    <Icon className="h-2.5 w-2.5" strokeWidth={2} />
    {children}
  </button>
);

// ---------------------------------------------------------------------------
// Compact severity filter pill (inline in filter bar)
// ---------------------------------------------------------------------------
const SeverityFilterPill = ({ severity, count, active, onClick }) => {
  const Icon = SEVERITY_ICONS[severity.id];
  const isNormal = severity.id === "info";
  return (
    <button
      data-testid={`severity-pill-${severity.id}`}
      onClick={onClick}
      className={[
        "h-7 px-2.5 rounded-md flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.08em] transition-all border",
        active
          ? isNormal
            ? "text-slate-200 border-white/20 bg-white/[0.06]"
            : "text-white"
          : "text-slate-500 border-white/[0.06] bg-transparent hover:text-slate-300 hover:border-white/15",
      ].join(" ")}
      style={
        active && !isNormal
          ? {
              color: severity.color,
              background: `${severity.color}14`,
              borderColor: `${severity.color}40`,
            }
          : {}
      }
    >
      <Icon className="h-3 w-3" strokeWidth={1.8} />
      {severity.label}
      <span className="text-[9px] opacity-50 tabular-nums">{count}</span>
    </button>
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

  const rangeMs = LOG_TIME_RANGES.find((r) => r.id === rangeFilter)?.ms ?? Infinity;
  const cutoff = Date.now() - rangeMs;

  const severityCounts = useMemo(() => {
    const counts = Object.fromEntries(LOG_SEVERITIES.map((s) => [s.id, 0]));
    LOGS.forEach((l) => {
      if (l.timestamp.getTime() < cutoff) return;
      counts[l.severity] = (counts[l.severity] || 0) + 1;
    });
    return counts;
  }, [cutoff]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return LOGS.filter((l) => {
      if (l.timestamp.getTime() < cutoff) return false;
      if (severityFilter.size > 0 && !severityFilter.has(l.severity)) return false;
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (robotFilter !== "all" && l.robotId !== robotFilter) return false;
      if (q) {
        const hay =
          `${l.title} ${l.description} ${l.code} ${l.robotId} ${l.source} ${l.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cutoff, severityFilter, sourceFilter, robotFilter, search]);

  const toggleSeverity = (id) =>
    setSeverityFilter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const clearAll = () => {
    setSearch("");
    setSeverityFilter(new Set());
    setSourceFilter("all");
    setRobotFilter("all");
    setRangeFilter("24h");
  };
  const hasActive =
    search ||
    severityFilter.size > 0 ||
    sourceFilter !== "all" ||
    robotFilter !== "all" ||
    rangeFilter !== "24h";

  return (
    <div data-testid="system-logs" className="flex flex-col gap-3">
      {/* ====== Filter bar ====== */}
      <div className="rounded-2xl border border-white/[0.12] bg-[#15171D] shadow-[0_4px_24px_rgba(0,0,0,0.4)] px-3 py-3 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-white/[0.03] border border-white/10 focus-within:border-[#0066FF]/40 transition-all flex-1 min-w-[260px]">
          <Search className="h-3.5 w-3.5 text-slate-500" strokeWidth={2} />
          <input
            data-testid="log-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, codes, robots…"
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
            className="h-9 w-[140px] bg-white/[0.03] border-white/10 text-white text-[12px] font-bold"
          >
            <SelectValue placeholder="All Robots" />
          </SelectTrigger>
          <SelectContent className="bg-[#0E0F13] border-white/10 text-white">
            <SelectItem value="all" className="font-semibold">
              All Robots
            </SelectItem>
            {ROBOT_STATS.map((r) => (
              <SelectItem key={r.id} value={r.id} className="font-semibold font-mono">
                {r.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Source select */}
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger
            data-testid="filter-source"
            className="h-9 w-[140px] bg-white/[0.03] border-white/10 text-white text-[12px] font-bold"
          >
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent className="bg-[#0E0F13] border-white/10 text-white">
            <SelectItem value="all" className="font-semibold">
              All Sources
            </SelectItem>
            {LOG_SOURCES.map((s) => (
              <SelectItem key={s.id} value={s.id} className="font-semibold">
                {s.label}
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
                "h-7 px-2 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all",
                rangeFilter === r.id
                  ? "bg-[#0066FF] text-white"
                  : "text-slate-400 hover:text-white",
              ].join(" ")}
            >
              {r.label.replace("Last ", "")}
            </button>
          ))}
        </div>

        {hasActive && (
          <button
            data-testid="clear-filters"
            onClick={clearAll}
            className="h-9 px-3 rounded-lg border border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-1"
          >
            <X className="h-3 w-3" strokeWidth={2.4} />
            Clear
          </button>
        )}

        <button
          data-testid="export-logs"
          className="h-9 px-3 rounded-lg border border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:border-[#0066FF]/40 transition-all flex items-center gap-1.5"
        >
          <Download className="h-3 w-3" strokeWidth={2.4} />
          CSV
        </button>
      </div>

      {/* ====== Severity pills (inline filter) ====== */}
      <div className="flex flex-wrap items-center gap-1.5 px-1">
        {LOG_SEVERITIES.map((s) => (
          <SeverityFilterPill
            key={s.id}
            severity={s}
            count={severityCounts[s.id] || 0}
            active={severityFilter.has(s.id)}
            onClick={() => toggleSeverity(s.id)}
          />
        ))}
        <span className="flex-1" />
        <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold">
          <span className="text-white font-extrabold tabular-nums">{filtered.length}</span>{" "}
          events
        </span>
      </div>

      {/* ====== Log list ====== */}
      <div className="flex flex-col gap-1">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.12] bg-[#15171D] p-10 flex flex-col items-center justify-center text-center">
            <Search className="h-5 w-5 text-slate-500 mb-2" strokeWidth={1.6} />
            <p className="text-[12px] text-slate-500 max-w-sm font-semibold">
              No events match. Try widening the time range or clearing filters.
            </p>
          </div>
        ) : (
          filtered.map((log) => <LogRow key={log.id} log={log} />)
        )}
      </div>
    </div>
  );
}
