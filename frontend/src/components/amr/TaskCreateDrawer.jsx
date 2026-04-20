import React, { useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Plus,
  GripVertical,
  Trash2,
  MoveRight,
  Timer,
  RotateCcw,
  Save,
  Send,
  ListOrdered,
  Bot,
  Flag,
  Minus,
} from "lucide-react";
import { toast } from "../ui/sonner";
import {
  PATHS,
  POSES,
  TASK_TYPES,
  PRIORITIES,
  FLEET,
} from "../../data/mockData";

// ---------- Shared small UI ----------
const Label = ({ children }) => (
  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold mb-1.5">
    {children}
  </div>
);

const FieldWrap = ({ children }) => <div>{children}</div>;

const selectTriggerCls =
  "h-10 rounded-lg border border-white/10 bg-white/[0.03] text-white text-[13px] hover:bg-white/[0.05] hover:border-[#0066FF]/40 focus:ring-0 focus:outline-none data-[placeholder]:text-slate-500";
const selectContentCls =
  "bg-[#0E0F13] border border-white/10 text-white backdrop-blur-xl";
const selectItemCls =
  "text-[13px] text-slate-200 focus:bg-[#0066FF]/20 focus:text-white data-[highlighted]:bg-[#0066FF]/20 data-[highlighted]:text-white";

// ---------- Step card renderer ----------
const STEP_META = {
  move: {
    label: "Move",
    icon: MoveRight,
    color: "#00C2FF",
  },
  wait: {
    label: "Wait",
    icon: Timer,
    color: "#F59E0B",
  },
  return: {
    label: "Return",
    icon: RotateCcw,
    color: "#10B981",
  },
};

const newStep = (kind) => {
  const id = `S-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  if (kind === "move") return { id, kind, target: "path", pathId: "", poseId: "" };
  if (kind === "wait") return { id, kind, seconds: 5 };
  return { id, kind }; // return
};

const StepCard = ({
  step,
  index,
  total,
  onUpdate,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
}) => {
  const meta = STEP_META[step.kind];
  const Icon = meta.icon;
  const c = meta.color;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      data-testid={`step-card-${step.id}`}
      className={`relative rounded-xl border bg-white/[0.02] hover:bg-white/[0.04] transition-all
                  ${isDragging ? "opacity-40" : ""}
                  border-white/10 hover:border-[#0066FF]/30`}
    >
      <span
        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
        style={{ background: c, boxShadow: `0 0 6px ${c}` }}
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <GripVertical className="h-4 w-4 text-slate-600 shrink-0 cursor-grab active:cursor-grabbing" />
        <span
          className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
          style={{
            background: `${c}18`,
            color: c,
            border: `1px solid ${c}40`,
          }}
        >
          {index + 1}
        </span>
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: c }} strokeWidth={2} />
          <span className="text-[14px] font-bold text-white">{meta.label}</span>
          <span className="text-[11px] text-slate-500 truncate hidden sm:inline">
            · Step {index + 1} of {total}
          </span>
        </div>
        <div className="flex-1" />
        <button
          data-testid={`step-remove-${step.id}`}
          onClick={() => onRemove(step.id)}
          className="h-7 w-7 rounded-md border border-white/5 bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-all"
          title="Remove step"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Body */}
      {step.kind === "move" && (
        <div className="px-3 pb-3 space-y-2.5">
          {/* Segmented: Path / Pose */}
          <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5 w-full">
            {[
              { v: "path", l: "Path" },
              { v: "pose", l: "Pose" },
            ].map((opt) => {
              const active = step.target === opt.v;
              return (
                <button
                  key={opt.v}
                  data-testid={`step-${step.id}-target-${opt.v}`}
                  onClick={() => onUpdate(step.id, { target: opt.v })}
                  className={`flex-1 h-8 rounded-md text-[12px] font-semibold uppercase tracking-wider transition-all ${
                    active
                      ? "bg-[#0066FF] text-white shadow-[0_0_18px_rgba(0,102,255,0.35)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {opt.l}
                </button>
              );
            })}
          </div>

          {step.target === "path" ? (
            <FieldWrap>
              <Label>Select Path</Label>
              <Select
                value={step.pathId}
                onValueChange={(v) => onUpdate(step.id, { pathId: v })}
              >
                <SelectTrigger data-testid={`step-${step.id}-path`} className={selectTriggerCls}>
                  <SelectValue placeholder="Choose a predefined path…" />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  {PATHS.map((p) => (
                    <SelectItem key={p.id} value={p.id} className={selectItemCls}>
                      <div className="flex items-center justify-between gap-3 w-full">
                        <div className="flex flex-col">
                          <span className="font-semibold">{p.name}</span>
                          <span className="text-[10px] text-slate-500">
                            {p.id} · {p.distance} · {p.waypoints} wpts · Zone {p.zone}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWrap>
          ) : (
            <FieldWrap>
              <Label>Select Pose</Label>
              <Select
                value={step.poseId}
                onValueChange={(v) => onUpdate(step.id, { poseId: v })}
              >
                <SelectTrigger data-testid={`step-${step.id}-pose`} className={selectTriggerCls}>
                  <SelectValue placeholder="Choose a predefined pose…" />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  {POSES.map((p) => (
                    <SelectItem key={p.id} value={p.id} className={selectItemCls}>
                      <div className="flex flex-col">
                        <span className="font-mono text-[12px] font-semibold">{p.name}</span>
                        <span className="text-[10px] text-slate-500">
                          {p.id} · x:{p.x} y:{p.y} yaw:{p.yaw}° · Zone {p.zone}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWrap>
          )}
        </div>
      )}

      {step.kind === "wait" && (
        <div className="px-3 pb-3">
          <Label>Dwell Time</Label>
          <div className="flex items-center gap-2">
            <button
              data-testid={`step-${step.id}-sec-dec`}
              onClick={() =>
                onUpdate(step.id, { seconds: Math.max(1, (step.seconds || 0) - 1) })
              }
              className="h-10 w-10 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#0066FF]/40 transition-all"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 h-10 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center gap-1.5">
              <input
                data-testid={`step-${step.id}-sec-input`}
                type="number"
                min="1"
                value={step.seconds}
                onChange={(e) =>
                  onUpdate(step.id, {
                    seconds: Math.max(1, parseInt(e.target.value || "1", 10)),
                  })
                }
                className="w-20 bg-transparent border-none text-center text-[17px] font-bold text-white focus:outline-none tabular-nums"
              />
              <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                seconds
              </span>
            </div>
            <button
              data-testid={`step-${step.id}-sec-inc`}
              onClick={() => onUpdate(step.id, { seconds: (step.seconds || 0) + 1 })}
              className="h-10 w-10 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#0066FF]/40 transition-all"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {[5, 10, 30, 60].map((v) => (
              <button
                key={v}
                data-testid={`step-${step.id}-sec-quick-${v}`}
                onClick={() => onUpdate(step.id, { seconds: v })}
                className="px-2 py-0.5 rounded-full border border-white/5 bg-white/[0.02] text-[11px] text-slate-400 hover:border-[#0066FF]/40 hover:text-white transition-all font-semibold"
              >
                {v}s
              </button>
            ))}
          </div>
        </div>
      )}

      {step.kind === "return" && (
        <div className="px-3 pb-3">
          <div className="rounded-lg border border-dashed border-white/10 px-3 py-2.5 text-[12px] text-slate-400 flex items-center gap-2">
            <RotateCcw className="h-3.5 w-3.5 text-[#10B981]" strokeWidth={2} />
            Robot returns to its home dock when this step starts.
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- Main Drawer ----------
export const TaskCreateDrawer = ({ open, onOpenChange }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("medium");
  const [robotId, setRobotId] = useState("auto");
  const [steps, setSteps] = useState([]);

  const [dragIndex, setDragIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const dragNode = useRef(null);

  const reset = () => {
    setName("");
    setType("");
    setPriority("medium");
    setRobotId("auto");
    setSteps([]);
  };

  const addStep = (kind) => {
    setSteps((s) => [...s, newStep(kind)]);
  };

  const updateStep = (id, patch) => {
    setSteps((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const removeStep = (id) => {
    setSteps((s) => s.filter((x) => x.id !== id));
  };

  // Drag-drop reorder
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    dragNode.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (hoverIndex !== index) setHoverIndex(index);
  };
  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return cleanup();
    setSteps((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    cleanup();
  };
  const cleanup = () => {
    dragNode.current = null;
    setDragIndex(null);
    setHoverIndex(null);
  };

  // Validation
  const canSave = name.trim().length > 0 && steps.length > 0;
  const canSend =
    canSave &&
    steps.every((s) => {
      if (s.kind === "move")
        return s.target === "path" ? !!s.pathId : !!s.poseId;
      if (s.kind === "wait") return s.seconds > 0;
      return true;
    });

  const doSave = () => {
    if (!canSave) {
      toast.error("Task name and at least one step required");
      return;
    }
    toast.success(`Task “${name}” saved as draft`, {
      description: `${steps.length} step${steps.length !== 1 ? "s" : ""} · ${priority.toUpperCase()}`,
    });
    reset();
    onOpenChange(false);
  };

  const doSend = () => {
    if (!canSend) {
      toast.error("Complete every step before sending");
      return;
    }
    toast.success(`Task “${name}” dispatched to fleet`, {
      description: `Assigned to ${robotId === "auto" ? "next available robot" : robotId}`,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        data-testid="task-create-drawer"
        side="right"
        className="amr-dashboard w-[94vw] sm:max-w-[520px] p-0 bg-[#0A0A0B] border-l border-white/10 text-white overflow-hidden flex flex-col"
      >
        {/* Accent top */}
        <div className="h-1 w-full bg-gradient-to-r from-[#0066FF] via-[#00C2FF] to-transparent" />

        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-white/5 text-left space-y-0 shrink-0">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500 font-semibold">
            New Mission · Composer
          </div>
          <SheetTitle className="text-[26px] font-extrabold text-white leading-tight mt-0.5">
            Create Task
          </SheetTitle>
          <div className="text-[13px] text-slate-400 mt-1">
            Compose a sequence of steps. Drag to reorder.
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto amr-scroll px-6 py-5 space-y-5">
          {/* Task meta fields */}
          <div className="space-y-3">
            <FieldWrap>
              <Label>Task Name</Label>
              <input
                data-testid="task-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Morning Pallet Run — Line 7"
                className="w-full h-10 px-3 rounded-lg border border-white/10 bg-white/[0.03] text-[14px] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0066FF]/60 focus:bg-white/[0.05] transition-all"
              />
            </FieldWrap>

            <div className="grid grid-cols-2 gap-3">
              <FieldWrap>
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger data-testid="task-type" className={selectTriggerCls}>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent className={selectContentCls}>
                    {TASK_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className={selectItemCls}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWrap>
              <FieldWrap>
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger data-testid="task-priority" className={selectTriggerCls}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentCls}>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value} className={selectItemCls}>
                        <span className="flex items-center gap-2">
                          <Flag
                            className="h-3 w-3"
                            style={{
                              color:
                                p.value === "critical" ? "#EF4444" :
                                p.value === "high" ? "#FCA5A5" :
                                p.value === "medium" ? "#F59E0B" :
                                "#64748B",
                            }}
                          />
                          {p.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWrap>
            </div>

            <FieldWrap>
              <Label>Assign Robot</Label>
              <Select value={robotId} onValueChange={setRobotId}>
                <SelectTrigger data-testid="task-robot" className={selectTriggerCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  <SelectItem value="auto" className={selectItemCls}>
                    <span className="flex items-center gap-2">
                      <Bot className="h-3.5 w-3.5 text-[#00C2FF]" />
                      Auto-assign (next available)
                    </span>
                  </SelectItem>
                  {FLEET.filter((r) => r.status !== "maintenance").map((r) => (
                    <SelectItem key={r.id} value={r.id} className={selectItemCls}>
                      <span className="flex items-center gap-2">
                        <Bot className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold">{r.name}</span>
                        <span className="text-[10px] text-slate-500">
                          {r.id} · {r.battery}% · {r.status}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWrap>
          </div>

          {/* Steps section */}
          <div className="pt-3 border-t border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-[#00C2FF]" strokeWidth={1.8} />
                <span className="text-[13px] font-bold text-white">Steps</span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {steps.length} · drag to reorder
                </span>
              </div>
            </div>

            {/* Step list */}
            {steps.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
                <ListOrdered className="h-8 w-8 mx-auto text-slate-600 mb-2" strokeWidth={1.5} />
                <div className="text-[13px] text-slate-400 font-semibold">
                  No steps yet
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Start by adding a Move, Wait, or Return card below.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {steps.map((s, i) => (
                  <React.Fragment key={s.id}>
                    {hoverIndex === i && dragIndex !== null && dragIndex !== i && (
                      <div className="h-0.5 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] shadow-[0_0_8px_#0066FF]" />
                    )}
                    <StepCard
                      step={s}
                      index={i}
                      total={steps.length}
                      onUpdate={updateStep}
                      onRemove={removeStep}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragEnd={cleanup}
                      isDragging={dragIndex === i}
                    />
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Add step buttons */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <AddStepBtn
                testid="add-move"
                onClick={() => addStep("move")}
                icon={<MoveRight className="h-4 w-4" />}
                label="Move"
                color="#00C2FF"
              />
              <AddStepBtn
                testid="add-wait"
                onClick={() => addStep("wait")}
                icon={<Timer className="h-4 w-4" />}
                label="Wait"
                color="#F59E0B"
              />
              <AddStepBtn
                testid="add-return"
                onClick={() => addStep("return")}
                icon={<RotateCcw className="h-4 w-4" />}
                label="Return"
                color="#10B981"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-2 shrink-0">
          <button
            data-testid="task-cancel"
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
            className="h-10 px-4 rounded-lg border border-white/10 bg-white/[0.02] text-[13px] font-semibold text-slate-300 hover:text-white hover:border-white/20 transition-all"
          >
            Cancel
          </button>
          <div className="flex-1" />
          <button
            data-testid="task-save"
            onClick={doSave}
            disabled={!canSave}
            className="h-10 px-4 rounded-lg border border-white/15 bg-white/[0.04] text-[13px] font-semibold text-white flex items-center gap-2 hover:bg-white/[0.07] hover:border-[#0066FF]/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="h-3.5 w-3.5" /> Save
          </button>
          <button
            data-testid="task-send"
            onClick={doSend}
            disabled={!canSend}
            className="h-10 px-5 rounded-lg bg-[#0066FF] hover:bg-[#3385FF] text-[13px] font-semibold text-white flex items-center gap-2 shadow-[0_0_24px_rgba(0,102,255,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="h-3.5 w-3.5" /> Send
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const AddStepBtn = ({ icon, label, color, onClick, testid }) => (
  <button
    data-testid={testid}
    onClick={onClick}
    className="h-12 rounded-lg border border-dashed border-white/10 bg-white/[0.015] hover:bg-white/[0.04] transition-all flex items-center justify-center gap-2 group"
  >
    <span
      className="h-7 w-7 rounded-md flex items-center justify-center transition-all"
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {icon}
    </span>
    <span className="text-[13px] font-semibold text-slate-300 group-hover:text-white">
      {label}
    </span>
  </button>
);

export default TaskCreateDrawer;
