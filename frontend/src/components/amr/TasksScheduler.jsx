import React from "react";
import { GripVertical, Plus, Filter } from "lucide-react";
import { SCHEDULED_TASKS } from "../../data/mockData";

const priorityMap = {
  high: { dot: "#EF4444", label: "HIGH", style: "text-[#FCA5A5] bg-[#EF4444]/10 border-[#EF4444]/25" },
  medium: { dot: "#F59E0B", label: "MED", style: "text-[#FCD34D] bg-[#F59E0B]/10 border-[#F59E0B]/25" },
  low: { dot: "#64748B", label: "LOW", style: "text-slate-300 bg-white/5 border-white/10" },
};

export const TasksScheduler = () => {
  return (
    <div
      data-testid="tasks-scheduler"
      className="rounded-2xl border border-white/5 bg-[#0E0F13]/80 backdrop-blur-md p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-1">
            Queue · Drag to reorder
          </div>
          <h3 className="font-[Chivo] text-xl font-bold text-white">Task Scheduler</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            data-testid="filter-tasks"
            className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:border-[#0066FF]/40 transition-all"
          >
            <Filter className="h-4 w-4" strokeWidth={1.6} />
          </button>
          <button
            data-testid="new-task-btn"
            className="h-9 px-3 rounded-lg bg-[#0066FF] text-white text-sm font-medium flex items-center gap-1.5 hover:bg-[#3385FF] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,102,255,0.35)]"
          >
            <Plus className="h-4 w-4" /> New
          </button>
        </div>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto pr-1 amr-scroll">
        {SCHEDULED_TASKS.map((t) => {
          const p = priorityMap[t.priority];
          return (
            <div
              key={t.id}
              data-testid={`scheduled-task-${t.id}`}
              className="group relative flex items-center gap-3 pl-2 pr-4 py-3 rounded-xl border border-white/5 bg-white/[0.015]
                         hover:bg-gradient-to-r hover:from-[#0066FF]/10 hover:to-transparent hover:border-[#0066FF]/25
                         transition-all cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-slate-600 group-hover:text-[#00C2FF] transition-colors" />
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: p.dot, boxShadow: `0 0 6px ${p.dot}` }}
              />
              <div className="font-mono text-xs text-[#00C2FF] w-20 shrink-0">{t.id}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{t.type}</div>
                <div className="font-mono text-[11px] text-slate-500 truncate">
                  {t.origin} <span className="text-slate-700">→</span> {t.destination}
                </div>
              </div>
              <div className="hidden md:block font-mono text-[11px] text-slate-400 w-14 text-right">
                {t.payload}
              </div>
              <div
                className={`px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider ${p.style}`}
              >
                {p.label}
              </div>
              <div className="font-mono text-xs text-slate-300 w-12 text-right tabular-nums">
                {t.eta}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksScheduler;
