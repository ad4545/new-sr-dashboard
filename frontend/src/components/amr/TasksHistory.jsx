import React from "react";
import { History, Check, AlertCircle, XCircle } from "lucide-react";
import { TASK_HISTORY } from "../../data/mockData";

const statusMap = {
  completed: { icon: Check, color: "#10B981", label: "Completed" },
  aborted: { icon: XCircle, color: "#EF4444", label: "Aborted" },
  delayed: { icon: AlertCircle, color: "#F59E0B", label: "Delayed" },
};

export const TasksHistory = () => {
  return (
    <div
      data-testid="tasks-history"
      className="rounded-2xl border border-white/5 bg-[#0E0F13]/80 backdrop-blur-md p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-1">
            Last shift · archived
          </div>
          <h3 className="font-[Chivo] text-xl font-bold text-white flex items-center gap-2">
            <History className="h-5 w-5 text-[#00C2FF]" strokeWidth={1.8} /> Task History
          </h3>
        </div>
        <button
          data-testid="history-view-all"
          className="text-xs font-mono uppercase tracking-[0.18em] text-slate-400 hover:text-[#00C2FF] transition-colors"
        >
          View all →
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-auto flex-1 amr-scroll">
        <table className="w-full text-left border-collapse min-w-[520px]">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
              <th className="pb-3 pr-4 font-normal">Task ID</th>
              <th className="pb-3 pr-4 font-normal">Robot</th>
              <th className="pb-3 pr-4 font-normal">Type</th>
              <th className="pb-3 pr-4 font-normal">Duration</th>
              <th className="pb-3 pr-4 font-normal">Finished</th>
              <th className="pb-3 font-normal text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {TASK_HISTORY.map((h) => {
              const s = statusMap[h.status];
              const Icon = s.icon;
              return (
                <tr
                  key={h.id}
                  data-testid={`history-row-${h.id}`}
                  className="border-t border-white/5 hover:bg-white/[0.015] transition-colors group"
                >
                  <td className="py-3 pr-4 font-mono text-xs text-[#00C2FF]">{h.id}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-300">{h.robot}</td>
                  <td className="py-3 pr-4 text-sm text-slate-200">{h.type}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-400 tabular-nums">
                    {h.duration}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-500 tabular-nums">
                    {h.completedAt}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider"
                      style={{
                        color: s.color,
                        borderColor: `${s.color}40`,
                        background: `${s.color}10`,
                      }}
                    >
                      <Icon className="h-3 w-3" strokeWidth={2} />
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksHistory;
