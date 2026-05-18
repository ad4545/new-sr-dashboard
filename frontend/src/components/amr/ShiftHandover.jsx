import React from "react";
import { FileText, CheckCircle2 } from "lucide-react";
import { HANDOVER } from "../../data/mockData";

const roleColor = {
  "Ops Lead": "#00C2FF",
  Safety: "#EF4444",
  Maintenance: "#F59E0B",
  Dispatch: "#10B981",
};

export const ShiftHandover = () => {
  return (
    <div
      data-testid="shift-handover"
      className="rounded-2xl border border-white/5 bg-[#15171D] backdrop-blur-md p-5 flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-0.5">
            Night → Day · completed 06:55
          </div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#00C2FF]" strokeWidth={1.8} /> Shift Handover
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[10px] font-mono uppercase tracking-wider text-[#6EE7B7]">
          <CheckCircle2 className="h-3 w-3" strokeWidth={2} /> Signed
        </span>
      </div>

      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 amr-scroll">
        {HANDOVER.map((h) => {
          const c = roleColor[h.role] || "#64748B";
          return (
            <div
              key={h.id}
              data-testid={`handover-${h.id}`}
              className="relative rounded-lg border border-white/5 bg-white/[0.015] p-3 hover:bg-white/[0.03] transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-white">{h.author}</span>
                  <span
                    className="px-1.5 py-0.5 rounded-full border text-[9px] font-mono uppercase tracking-wider"
                    style={{
                      color: c,
                      borderColor: `${c}40`,
                      background: `${c}14`,
                    }}
                  >
                    {h.role}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500 tabular-nums">{h.time}</span>
              </div>
              <p className="text-[11.5px] text-slate-400 leading-snug">{h.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftHandover;
