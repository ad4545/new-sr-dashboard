import React from "react";
import { Bot, Battery, BatteryCharging, Circle } from "lucide-react";
import { FLEET } from "../../data/mockData";

const statusStyles = {
  active: { dot: "#10B981", label: "Active", text: "text-[#6EE7B7]" },
  idle: { dot: "#64748B", label: "Idle", text: "text-slate-300" },
  charging: { dot: "#F59E0B", label: "Charging", text: "text-[#FCD34D]" },
  maintenance: { dot: "#EF4444", label: "Service", text: "text-[#FCA5A5]" },
};

const batteryColor = (v) => (v > 60 ? "#10B981" : v > 30 ? "#F59E0B" : "#EF4444");

export const FleetStatus = () => {
  return (
    <div
      data-testid="fleet-status"
      className="rounded-2xl border border-white/5 bg-[#0E0F13]/80 backdrop-blur-md p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-1">
            {FLEET.length} units · {FLEET.filter((f) => f.status === "active").length} active
          </div>
          <h3 className="font-[Chivo] text-xl font-bold text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#00C2FF]" strokeWidth={1.8} /> Fleet Status
          </h3>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-0.5">
          {["All", "Active", "Charging"].map((f, i) => (
            <button
              key={f}
              data-testid={`fleet-filter-${f.toLowerCase()}`}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-md transition-all ${
                i === 0 ? "bg-[#0066FF]/20 text-[#00C2FF]" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto pr-1 amr-scroll">
        {FLEET.map((r) => {
          const s = statusStyles[r.status];
          const bc = batteryColor(r.battery);
          return (
            <div
              key={r.id}
              data-testid={`fleet-row-${r.id}`}
              className="group flex items-center gap-3 px-3 py-3 rounded-xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] hover:border-[#0066FF]/20 transition-all"
            >
              {/* Robot avatar */}
              <div className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-[#0066FF]/20 to-[#001A4D]/40 border border-[#0066FF]/30 flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 text-[#00C2FF]" strokeWidth={1.6} />
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0E0F13]"
                  style={{ background: s.dot, boxShadow: `0 0 6px ${s.dot}` }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">{r.name}</span>
                  <span className="font-mono text-[10px] text-slate-500">· {r.id}</span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 truncate">
                  {r.model} · Zone {r.zone}
                </div>
              </div>

              {/* Battery */}
              <div className="hidden sm:flex flex-col items-end gap-1 w-20">
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  {r.status === "charging" ? (
                    <BatteryCharging className="h-3.5 w-3.5 text-[#F59E0B]" strokeWidth={1.8} />
                  ) : (
                    <Battery className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.8} />
                  )}
                  <span className="tabular-nums" style={{ color: bc }}>
                    {r.battery}%
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${r.battery}%`, background: bc, boxShadow: `0 0 6px ${bc}` }}
                  />
                </div>
              </div>

              {/* Status pill */}
              <div
                className={`px-2 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider ${s.text}`}
                style={{ borderColor: `${s.dot}40`, background: `${s.dot}12` }}
              >
                <span className="inline-flex items-center gap-1">
                  <Circle className="h-1.5 w-1.5 fill-current" />
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FleetStatus;
