import React, { useState } from "react";
import {
  History,
  Check,
  AlertCircle,
  XCircle,
  ChevronDown,
  MapPin,
  Clock,
  Package,
  Gauge,
} from "lucide-react";
import { TASK_HISTORY } from "../../data/mockData";

const statusMap = {
  completed: { icon: Check, color: "#10B981", label: "Completed" },
  aborted: { icon: XCircle, color: "#EF4444", label: "Aborted" },
  delayed: { icon: AlertCircle, color: "#F59E0B", label: "Delayed" },
};

// Synthetic extra details merged per row for the expanded view
const synthDetails = (row, index) => ({
  distance: (6 + (index % 5) * 1.4).toFixed(1) + " m",
  avgSpeed: (0.8 + (index % 4) * 0.2).toFixed(2) + " m/s",
  payload: ["450 kg", "22 kg", "180 kg", "—", "620 kg", "64 kg"][index % 6],
  origin: ["Dock-A", "Kitting-1", "Line-2", "WH-B3", "Inbound-2"][index % 5],
  destination: ["Rack-12", "Cell-11", "QA-Lane", "Line-9", "Rack-8"][index % 5],
  steps: 3 + (index % 3),
});

export const ActivityLog = () => {
  const [expanded, setExpanded] = useState(TASK_HISTORY[0]?.id || null);

  return (
    <div
      data-testid="activity-log"
      className="h-full rounded-2xl border border-white/10 bg-[#0E0F13]/85 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-5 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-0.5">
            Last shift · {TASK_HISTORY.length} entries
          </div>
          <h3 className="text-[22px] font-extrabold text-white flex items-center gap-2">
            <History className="h-[18px] w-[18px] text-[#00C2FF]" strokeWidth={1.8} /> Activity Log
          </h3>
        </div>
        <button
          data-testid="log-view-all"
          className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-400 hover:text-[#00C2FF] transition-colors"
        >
          Export →
        </button>
      </div>

      {/* Vertical timeline list */}
      <div className="relative flex-1 min-h-0 overflow-y-auto amr-scroll pl-4 pr-1">
        <span className="absolute left-[7px] top-1 bottom-1 w-[1px] bg-white/5" />
        {TASK_HISTORY.map((h, i) => {
          const s = statusMap[h.status];
          const Icon = s.icon;
          const open = expanded === h.id;
          const d = synthDetails(h, i);
          return (
            <div key={h.id} data-testid={`log-${h.id}`} className="relative pb-3">
              {/* Timeline dot */}
              <span
                className="absolute -left-[11px] top-3 h-2 w-2 rounded-full"
                style={{
                  background: s.color,
                  boxShadow: `0 0 8px ${s.color}`,
                  outline: "3px solid #0E0F13",
                }}
              />

              <button
                onClick={() => setExpanded(open ? null : h.id)}
                data-testid={`log-toggle-${h.id}`}
                className="w-full text-left rounded-lg border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] hover:border-[#0066FF]/20 transition-all"
              >
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <div
                    className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: `${s.color}14`, border: `1px solid ${s.color}30` }}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} style={{ color: s.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] text-[#00C2FF]">{h.id}</span>
                      <span className="text-slate-700">·</span>
                      <span className="text-[13px] font-semibold text-white truncate">{h.type}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px] text-slate-500 flex-wrap">
                      <span>{h.robot}</span>
                      <span className="text-slate-700">·</span>
                      <span>finished {h.completedAt}</span>
                      <span className="text-slate-700">·</span>
                      <span>duration {h.duration}</span>
                    </div>
                  </div>
                  <span
                    className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-mono uppercase tracking-wider shrink-0"
                    style={{
                      color: s.color,
                      borderColor: `${s.color}40`,
                      background: `${s.color}10`,
                    }}
                  >
                    {s.label}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform shrink-0 ${
                      open ? "rotate-180 text-[#00C2FF]" : ""
                    }`}
                  />
                </div>

                {open && (
                  <div className="border-t border-white/5 p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <DetailCell
                      icon={<MapPin className="h-3 w-3" />}
                      label="Origin"
                      value={d.origin}
                    />
                    <DetailCell
                      icon={<MapPin className="h-3 w-3" />}
                      label="Destination"
                      value={d.destination}
                    />
                    <DetailCell
                      icon={<Package className="h-3 w-3" />}
                      label="Payload"
                      value={d.payload}
                    />
                    <DetailCell
                      icon={<Gauge className="h-3 w-3" />}
                      label="Avg Speed"
                      value={d.avgSpeed}
                    />
                    <DetailCell
                      icon={<Clock className="h-3 w-3" />}
                      label="Distance"
                      value={d.distance}
                    />
                    <DetailCell
                      icon={<Clock className="h-3 w-3" />}
                      label="Waypoints"
                      value={String(d.steps)}
                    />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DetailCell = ({ icon, label, value }) => (
  <div className="rounded-md border border-white/5 bg-white/[0.02] px-2.5 py-2">
    <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-[12px] font-semibold text-white tabular-nums">{value}</div>
  </div>
);

export default ActivityLog;
