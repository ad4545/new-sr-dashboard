import React from "react";
import { Bot, Gauge, Battery, ChevronRight } from "lucide-react";
import { FLEET } from "../../data/mockData";

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

// Floating overlay placed on the 3D map.
// Shows the full fleet in a scrollable list — ~ 2-3 visible, the rest scrolls.
export const FleetOverlay = () => {
  return (
    <div
      data-testid="fleet-overlay"
      className="absolute top-4 right-4 z-10 w-[260px] rounded-xl border border-white/10
                 bg-black/65 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <Bot className="h-3.5 w-3.5 text-[#00C2FF]" strokeWidth={1.8} />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-200">
            Active Fleet
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-500 tabular-nums">
          {FLEET.length} units
        </span>
      </div>

      {/* scroll area: roughly 2.5 items visible */}
      <div className="max-h-[210px] overflow-y-auto amr-scroll px-2 py-2 space-y-1.5">
        {FLEET.map((r) => {
          const c = statusColor[r.status];
          return (
            <div
              key={r.id}
              data-testid={`fleet-overlay-row-${r.id}`}
              className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              <div
                className="relative h-7 w-7 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0"
                style={{ boxShadow: `inset 0 0 10px ${c}20` }}
              >
                <Bot className="h-3.5 w-3.5" style={{ color: c }} strokeWidth={1.8} />
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ring-1 ring-black"
                  style={{
                    background: c,
                    boxShadow: `0 0 6px ${c}`,
                    animation: r.status === "active" ? "amr-pulse 1.6s ease-in-out infinite" : "none",
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-bold text-white truncate">{r.name}</span>
                  <span className="font-mono text-[9px] text-slate-600">· {r.id}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px] text-slate-400">
                  <span className="inline-flex items-center gap-0.5">
                    <Gauge className="h-2.5 w-2.5" strokeWidth={2} />
                    <span className="tabular-nums">{r.speed.toFixed(1)}</span>
                    <span className="text-slate-600">m/s</span>
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <Battery className="h-2.5 w-2.5" strokeWidth={2} />
                    <span className="tabular-nums">{r.battery}%</span>
                  </span>
                  <span
                    className="text-[9px] uppercase tracking-wider"
                    style={{ color: c }}
                  >
                    {statusLabel[r.status]}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-700 group-hover:text-[#00C2FF] transition-colors shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FleetOverlay;
