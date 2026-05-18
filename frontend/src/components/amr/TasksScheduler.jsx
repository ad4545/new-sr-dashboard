import React, { useState, useRef } from "react";
import { GripVertical, Plus, Filter } from "lucide-react";
import { SCHEDULED_TASKS } from "../../data/mockData";
import TaskCreateDrawer from "./TaskCreateDrawer";

const priorityMap = {
  high: { dot: "#EF4444", label: "HIGH", style: "text-[#FCA5A5] bg-[#EF4444]/10 border-[#EF4444]/25" },
  medium: { dot: "#F59E0B", label: "MED", style: "text-[#FCD34D] bg-[#F59E0B]/10 border-[#F59E0B]/25" },
  low: { dot: "#64748B", label: "LOW", style: "text-slate-300 bg-white/5 border-white/10" },
};

export const TasksScheduler = () => {
  const [tasks, setTasks] = useState(SCHEDULED_TASKS);
  const [dragIndex, setDragIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const dragNode = useRef(null);

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    dragNode.current = e.currentTarget;
    // Required for Firefox
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    // Visual feedback on next tick
    setTimeout(() => {
      if (dragNode.current) dragNode.current.classList.add("opacity-40");
    }, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (hoverIndex !== index) setHoverIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) {
      cleanup();
      return;
    }
    setTasks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    cleanup();
  };

  const handleDragEnd = () => cleanup();

  const cleanup = () => {
    if (dragNode.current) dragNode.current.classList.remove("opacity-40");
    dragNode.current = null;
    setDragIndex(null);
    setHoverIndex(null);
  };

  return (
    <div
      data-testid="tasks-scheduler"
      className="h-full rounded-2xl border border-white/[0.12] bg-[#15171D] backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-5 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-0.5">
            Queue · drag to reorder
          </div>
          <h3 className="text-[22px] font-extrabold text-white">Task Scheduler</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            data-testid="filter-tasks"
            className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:border-[#0066FF]/40 transition-all"
          >
            <Filter className="h-3.5 w-3.5" strokeWidth={1.6} />
          </button>
          <button
            data-testid="new-task-btn"
            onClick={() => setCreateOpen(true)}
            className="h-8 px-3 rounded-lg bg-[#0066FF] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#3385FF] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,102,255,0.35)]"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        </div>
      </div>

      <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1 amr-scroll">
        {tasks.map((t, i) => {
          const p = priorityMap[t.priority];
          const showTopIndicator = hoverIndex === i && dragIndex !== null && dragIndex !== i;
          return (
            <React.Fragment key={t.id}>
              {showTopIndicator && (
                <div className="h-0.5 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] shadow-[0_0_8px_#0066FF]" />
              )}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={(e) => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
                data-testid={`scheduled-task-${t.id}`}
                className="group relative flex items-center gap-2.5 pl-2 pr-3 py-2.5 rounded-lg border border-white/5 bg-white/[0.015]
                         hover:bg-gradient-to-r hover:from-[#0066FF]/10 hover:to-transparent hover:border-[#0066FF]/25
                         transition-all cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 text-slate-600 group-hover:text-[#00C2FF] transition-colors shrink-0" />
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: p.dot, boxShadow: `0 0 6px ${p.dot}` }}
                />
                <div className="font-mono text-[12px] text-[#00C2FF] w-16 shrink-0">{t.id}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-white truncate leading-tight">{t.type}</div>
                  <div className="font-mono text-[12px] text-slate-500 truncate">
                    {t.origin} <span className="text-slate-700">→</span> {t.destination}
                  </div>
                </div>
                <div
                  className={`px-1.5 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider ${p.style} shrink-0`}
                >
                  {p.label}
                </div>
                <div className="font-mono text-[12px] text-slate-300 w-12 text-right tabular-nums shrink-0">
                  {t.eta}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <TaskCreateDrawer open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
};

export default TasksScheduler;
