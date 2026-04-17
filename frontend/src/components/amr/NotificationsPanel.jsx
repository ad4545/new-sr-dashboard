import React from "react";
import { Bell, AlertTriangle, Info, AlertOctagon, X } from "lucide-react";
import { NOTIFICATIONS } from "../../data/mockData";

const severityMap = {
  critical: { icon: AlertOctagon, color: "#EF4444", label: "CRIT" },
  warning: { icon: AlertTriangle, color: "#F59E0B", label: "WARN" },
  info: { icon: Info, color: "#00C2FF", label: "INFO" },
};

export const NotificationsPanel = () => {
  return (
    <div
      data-testid="notifications-panel"
      className="rounded-2xl border border-white/5 bg-[#0E0F13]/80 backdrop-blur-md p-5 flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-0.5">
            {NOTIFICATIONS.filter((n) => n.severity === "critical").length} crit ·{" "}
            {NOTIFICATIONS.filter((n) => n.severity === "warning").length} warn
          </div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#00C2FF]" strokeWidth={1.8} /> Alerts
          </h3>
        </div>
        <button
          data-testid="mark-all-read"
          className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-400 hover:text-[#00C2FF] transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1 amr-scroll">
        {NOTIFICATIONS.map((n) => {
          const s = severityMap[n.severity];
          const Icon = s.icon;
          return (
            <div
              key={n.id}
              data-testid={`notification-${n.id}`}
              className="group relative flex items-start gap-2.5 p-2.5 rounded-lg border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] transition-all"
            >
              <span
                className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-full"
                style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
              />
              <div
                className="mt-0.5 h-6 w-6 rounded-md flex items-center justify-center shrink-0 border"
                style={{
                  background: `${s.color}12`,
                  borderColor: `${s.color}40`,
                }}
              >
                <Icon className="h-3 w-3" strokeWidth={2} style={{ color: s.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.18em]"
                    style={{ color: s.color }}
                  >
                    {s.label}
                  </span>
                  <span className="font-mono text-[9px] text-slate-600">· {n.time}</span>
                </div>
                <div className="text-[12px] font-semibold text-white truncate leading-tight">
                  {n.title}
                </div>
                <div className="text-[10.5px] text-slate-500 truncate">{n.detail}</div>
              </div>
              <button
                data-testid={`dismiss-${n.id}`}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 rounded-md border border-white/10 flex items-center justify-center text-slate-500 hover:text-white shrink-0"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPanel;
