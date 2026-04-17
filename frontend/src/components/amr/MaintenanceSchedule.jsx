import React from "react";
import { Wrench, Calendar } from "lucide-react";
import { MAINTENANCE } from "../../data/mockData";

const sevStyle = {
  due: { color: "#EF4444", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/30", label: "DUE" },
  upcoming: { color: "#F59E0B", bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/25", label: "SOON" },
  planned: { color: "#00C2FF", bg: "bg-[#00C2FF]/10", border: "border-[#00C2FF]/25", label: "PLAN" },
};

export const MaintenanceSchedule = () => {
  return (
    <div
      data-testid="maintenance-schedule"
      className="rounded-2xl border border-white/5 bg-[#0E0F13]/80 backdrop-blur-md p-5 flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-0.5">
            {MAINTENANCE.length} scheduled · next 7 days
          </div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Wrench className="h-4 w-4 text-[#00C2FF]" strokeWidth={1.8} /> Maintenance
          </h3>
        </div>
        <button
          data-testid="maintenance-calendar"
          className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:border-[#0066FF]/40 transition-all"
        >
          <Calendar className="h-3.5 w-3.5" strokeWidth={1.6} />
        </button>
      </div>

      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 amr-scroll">
        {MAINTENANCE.map((m) => {
          const s = sevStyle[m.severity];
          return (
            <div
              key={m.id}
              data-testid={`maintenance-${m.id}`}
              className={`relative flex items-start gap-3 px-3 py-2.5 rounded-lg border ${s.border} ${s.bg} hover:-translate-y-0.5 transition-all`}
            >
              <span
                className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-full"
                style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-white truncate">{m.robot}</span>
                  <span className="text-slate-700">·</span>
                  <span className="text-[12px] text-slate-300 truncate">{m.type}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 truncate">{m.detail}</div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className="px-1.5 py-0.5 rounded-full border text-[9px] font-mono uppercase tracking-wider"
                  style={{
                    color: s.color,
                    borderColor: `${s.color}40`,
                    background: `${s.color}14`,
                  }}
                >
                  {s.label}
                </span>
                <span className="font-mono text-[10px] text-slate-400 whitespace-nowrap">
                  {m.due}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaintenanceSchedule;
