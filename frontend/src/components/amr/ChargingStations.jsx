import React from "react";
import { Zap, Plug } from "lucide-react";
import { CHARGING_STATIONS } from "../../data/mockData";

const statusMap = {
  available: { color: "#10B981", label: "Free", ring: "border-[#10B981]/40", bg: "bg-[#10B981]/[0.08]" },
  charging: { color: "#F59E0B", label: "Charging", ring: "border-[#F59E0B]/40", bg: "bg-[#F59E0B]/[0.08]" },
  offline: { color: "#64748B", label: "Offline", ring: "border-white/10", bg: "bg-white/[0.02]" },
};

export const ChargingStations = () => {
  return (
    <div
      data-testid="charging-stations"
      className="rounded-2xl border border-white/5 bg-[#0E0F13]/80 backdrop-blur-md p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-1">
            {CHARGING_STATIONS.filter((c) => c.status === "available").length} of{" "}
            {CHARGING_STATIONS.length} free
          </div>
          <h3 className="font-[Chivo] text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#00C2FF]" strokeWidth={1.8} /> Charging Docks
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
        {CHARGING_STATIONS.map((c) => {
          const s = statusMap[c.status];
          return (
            <div
              key={c.id}
              data-testid={`dock-${c.id}`}
              className={`relative rounded-xl border ${s.ring} ${s.bg} p-4 overflow-hidden transition-all hover:-translate-y-0.5`}
            >
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl"
                   style={{ background: `${s.color}25` }} />
              <div className="relative flex items-start justify-between mb-3">
                <Plug className="h-5 w-5" strokeWidth={1.6} style={{ color: s.color }} />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: s.color,
                    boxShadow: `0 0 8px ${s.color}`,
                    animation: c.status === "charging" ? "amr-pulse 1.2s ease-in-out infinite" : "none",
                  }}
                />
              </div>
              <div className="relative">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  {c.id}
                </div>
                <div className="font-[Chivo] text-base font-bold text-white mt-0.5">
                  {c.label}
                </div>
                <div
                  className="mt-2 font-mono text-[11px] uppercase tracking-wider"
                  style={{ color: s.color }}
                >
                  {s.label}
                </div>
                {c.robot && (
                  <div className="mt-1 font-mono text-[10px] text-slate-400">
                    {c.robot} · {c.kw}kW
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChargingStations;
