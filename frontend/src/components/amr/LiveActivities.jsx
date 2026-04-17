import React from "react";
import { Activity, Pause, X } from "lucide-react";
import { LIVE_TASKS } from "../../data/mockData";

export const LiveActivities = () => {
  return (
    <div
      data-testid="live-activities"
      className="h-full rounded-2xl border border-white/5 bg-[#0E0F13]/80 backdrop-blur-md p-5 flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-0.5 flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            </span>
            {LIVE_TASKS.length} running
          </div>
          <h3 className="text-[22px] font-extrabold text-white flex items-center gap-2">
            <Activity className="h-[18px] w-[18px] text-[#00C2FF]" strokeWidth={1.8} /> Live Activities
          </h3>
        </div>
      </div>

      <div className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1 amr-scroll">
        {LIVE_TASKS.map((t) => (
          <div
            key={t.id}
            data-testid={`live-task-${t.id}`}
            className="rounded-lg border border-white/5 bg-white/[0.02] p-3 hover:border-[#0066FF]/25 transition-all"
          >
            <div className="flex items-start justify-between mb-2 gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="h-7 w-7 rounded-md bg-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center shrink-0">
                  <span className="font-mono text-[9px] text-[#00C2FF] font-bold">
                    {t.robot.split("-")[1]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[11px] text-[#00C2FF]">{t.id}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-[13px] font-semibold text-white truncate">{t.type}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 mt-0.5 truncate">
                    {t.from} <span className="text-slate-700">→</span> {t.to}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <IconAction testid={`pause-${t.id}`}><Pause className="h-3 w-3" /></IconAction>
                <IconAction testid={`cancel-${t.id}`}><X className="h-3 w-3" /></IconAction>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] relative"
                  style={{ width: `${t.progress}%` }}
                >
                  <div className="absolute inset-0 bg-[#00C2FF]/40 blur-sm" />
                </div>
              </div>
              <span className="font-mono text-[10px] text-white tabular-nums w-8 text-right">
                {t.progress}%
              </span>
            </div>

            <div className="flex items-center justify-between mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
              <span>Elapsed · {t.elapsed}</span>
              <span className="text-[#00C2FF]">{t.robot}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IconAction = ({ children, testid }) => (
  <button
    data-testid={testid}
    className="h-6 w-6 rounded-md border border-white/5 bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:border-[#0066FF]/40 transition-all"
  >
    {children}
  </button>
);

export default LiveActivities;
