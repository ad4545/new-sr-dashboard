import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar, { SIDEBAR_W } from "../components/amr/Sidebar";
import {
  Bot,
  Wifi,
  Activity,
  BatteryCharging,
  Gauge,
  Crosshair,
  Compass,
  Signal,
  Circle,
  Square,
  Camera,
  CameraOff,
  Cctv,
  Layers,
  RadioTower,
  ArrowUpRight,
  ArrowLeft,
  Mic,
  MicOff,
  Power,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Link } from "react-router-dom";
import { ROBOT_STATS } from "../data/statsMockData";

const STORAGE_KEY = "amr-sidebar-collapsed";

// ----------------------------------------------------------------------------
// Animated "robot POV" background — CSS-perspective warehouse aisle
// ----------------------------------------------------------------------------
const WarehouseFeed = ({ cameraMode }) => {
  // For rear / top camera we just rotate / scale slightly to feel different
  const transformMap = {
    front: "none",
    rear: "rotateY(180deg)",
    top: "none",
  };
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#05070A]">
      {/* Vignette ambient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,30,60,0.4) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Perspective stage */}
      <div
        className="absolute inset-0 amr-stream-stage"
        style={{
          perspective: cameraMode === "top" ? "none" : "560px",
          perspectiveOrigin: "50% 56%",
          transform: transformMap[cameraMode],
        }}
      >
        {/* Floor — scrolling perspective grid */}
        <div className="amr-floor" />

        {/* Ceiling glow strip */}
        {cameraMode !== "top" && (
          <>
            <div className="amr-ceiling-strip" />
            {/* Side walls / shelves columns */}
            <div className="amr-wall amr-wall-left">
              <div className="amr-shelf-grid" />
            </div>
            <div className="amr-wall amr-wall-right">
              <div className="amr-shelf-grid" />
            </div>
          </>
        )}

        {/* Top-down view → just a moving rectangular floor pattern */}
        {cameraMode === "top" && (
          <div className="absolute inset-0 amr-topdown-pattern" />
        )}
      </div>

      {/* Subtle moving "depth fog" overlay */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(0,8,18,0.9) 90%)",
        }}
      />
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 100%)",
        }}
      />

      {/* Camera grain + scanlines */}
      <div className="absolute inset-0 pointer-events-none amr-stream-grain" />
      <div className="absolute inset-0 pointer-events-none amr-stream-scanlines" />

      {/* Lens vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 200px 60px rgba(0,0,0,0.9)",
        }}
      />
    </div>
  );
};

// ----------------------------------------------------------------------------
// HUD corner brackets + center reticle
// ----------------------------------------------------------------------------
const HudOverlay = ({ recording }) => (
  <div className="absolute inset-0 pointer-events-none">
    {/* Four corner brackets */}
    {[
      "top-6 left-6 border-t-2 border-l-2 rounded-tl-md",
      "top-6 right-6 border-t-2 border-r-2 rounded-tr-md",
      "bottom-6 left-6 border-b-2 border-l-2 rounded-bl-md",
      "bottom-6 right-6 border-b-2 border-r-2 rounded-br-md",
    ].map((c) => (
      <span
        key={c}
        className={`absolute h-6 w-6 border-[#00C2FF]/60 ${c}`}
        style={{ filter: "drop-shadow(0 0 6px rgba(0,194,255,0.45))" }}
      />
    ))}

    {/* Center reticle */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[120px] w-[120px]">
        <span className="absolute left-1/2 top-0 -translate-x-1/2 h-4 w-px bg-[#00C2FF]/70" />
        <span className="absolute left-1/2 bottom-0 -translate-x-1/2 h-4 w-px bg-[#00C2FF]/70" />
        <span className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-px bg-[#00C2FF]/70" />
        <span className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-px bg-[#00C2FF]/70" />
        <span className="absolute inset-0 rounded-full border border-[#00C2FF]/30" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#00C2FF] shadow-[0_0_8px_rgba(0,194,255,0.8)]" />
      </div>
    </div>

    {/* Horizon line (subtle) */}
    <span className="absolute top-1/2 left-[20%] right-[20%] h-px bg-[#00C2FF]/20" />

    {/* REC indicator */}
    {recording && (
      <div
        data-testid="rec-indicator"
        className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-md border border-red-500/40 bg-red-500/15 backdrop-blur-sm pointer-events-auto"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-60" />
          <span className="relative h-2 w-2 rounded-full bg-red-500" />
        </span>
        <span className="text-[10px] font-extrabold tracking-[0.22em] text-red-300 uppercase">
          REC · 02:47
        </span>
      </div>
    )}
  </div>
);

// ----------------------------------------------------------------------------
// Top status bar — robot selector left, stream stats right
// ----------------------------------------------------------------------------
const statusStyle = {
  active: { color: "#00C2FF", label: "Active" },
  charging: { color: "#F59E0B", label: "Charging" },
  idle: { color: "#64748B", label: "Idle" },
  maintenance: { color: "#EF4444", label: "Service" },
};

const TopBar = ({ robot, robotId, setRobotId, metrics }) => {
  const s = statusStyle[robot.status];
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 md:top-4 z-30 flex flex-wrap items-center gap-2">
      {/* Robot selector */}
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl border border-white/15 bg-black/55 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${s.color}1a`, border: `1px solid ${s.color}55` }}
        >
          <Bot className="h-4 w-4" style={{ color: s.color }} strokeWidth={1.9} />
        </div>
        <Select value={robotId} onValueChange={setRobotId}>
          <SelectTrigger
            data-testid="stream-robot-select"
            className="h-8 w-[180px] bg-transparent border-0 text-white text-[13px] font-bold focus:ring-0"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#05070A]/95 backdrop-blur-xl border-white/15 text-white">
            {ROBOT_STATS.map((r) => {
              const c = statusStyle[r.status].color;
              return (
                <SelectItem
                  key={r.id}
                  value={r.id}
                  data-testid={`stream-option-${r.id}`}
                  className="font-semibold focus:bg-[#0066FF]/20 focus:text-white"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: c, boxShadow: `0 0 4px ${c}` }}
                    />
                    {r.name}
                    <span className="text-slate-500 font-bold">· {r.id}</span>
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
        />
      </div>

      {/* Connection stats inline */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 bg-black/55 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <ConnectionChip
          icon={Wifi}
          label="Link"
          value={`${metrics.signal} dBm`}
          color={metrics.signal > -65 ? "#10B981" : metrics.signal > -78 ? "#F59E0B" : "#EF4444"}
        />
        <span className="h-4 w-px bg-white/10" />
        <ConnectionChip
          icon={RadioTower}
          label="Lat"
          value={`${metrics.latency} ms`}
          color={metrics.latency < 80 ? "#10B981" : metrics.latency < 150 ? "#F59E0B" : "#EF4444"}
        />
        <span className="h-4 w-px bg-white/10" />
        <ConnectionChip
          icon={ArrowUpRight}
          label="Bitrate"
          value={`${metrics.bitrate} Mbps`}
          color="#00C2FF"
        />
        <span className="h-4 w-px bg-white/10" />
        <ConnectionChip icon={Activity} label="FPS" value={metrics.fps} color="#A855F7" />
      </div>
    </div>
  );
};

const ConnectionChip = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-1.5">
    <Icon className="h-3.5 w-3.5" style={{ color }} strokeWidth={2.2} />
    <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold">
      {label}
    </span>
    <span className="text-[12px] font-extrabold text-white tabular-nums">{value}</span>
  </div>
);

// ----------------------------------------------------------------------------
// Right-side metrics rail
// ----------------------------------------------------------------------------
const MetricCard = ({ icon: Icon, label, value, unit, color = "#00C2FF", sub, big }) => (
  <div
    className="rounded-xl border border-white/15 bg-black/55 backdrop-blur-xl px-3 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] min-w-[180px]"
  >
    <div className="flex items-center gap-2 mb-1.5">
      <span
        className="h-6 w-6 rounded-md flex items-center justify-center"
        style={{ background: `${color}1a`, border: `1px solid ${color}55` }}
      >
        <Icon className="h-3 w-3" style={{ color }} strokeWidth={2} />
      </span>
      <span className="text-[9px] uppercase tracking-[0.22em] text-slate-400 font-bold">
        {label}
      </span>
    </div>
    <div className="flex items-baseline gap-1">
      <span
        className={`font-extrabold text-white tabular-nums leading-none ${
          big ? "text-[24px]" : "text-[18px]"
        }`}
      >
        {value}
      </span>
      {unit && (
        <span className="text-[10px] font-bold text-slate-500">{unit}</span>
      )}
    </div>
    {sub && (
      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{sub}</div>
    )}
  </div>
);

const SignalBars = ({ strength }) => {
  // strength: dBm (e.g. -45 great, -85 bad)
  const bars = Math.max(0, Math.min(5, Math.floor((strength + 90) / 9)));
  return (
    <div className="flex items-end gap-[2px] h-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-[1px]"
          style={{
            height: `${(i + 1) * 20}%`,
            background: i < bars ? "#10B981" : "rgba(255,255,255,0.12)",
          }}
        />
      ))}
    </div>
  );
};

const RightRail = ({ metrics, robot }) => (
  <div className="absolute right-4 top-24 bottom-[210px] z-30 flex flex-col gap-2 max-w-[220px] overflow-hidden">
    {/* Position card big */}
    <div className="rounded-xl border border-white/15 bg-black/55 backdrop-blur-xl px-3 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 mb-2">
        <span className="h-6 w-6 rounded-md flex items-center justify-center bg-[#00C2FF]/15 border border-[#00C2FF]/55">
          <Compass className="h-3 w-3 text-[#00C2FF]" strokeWidth={2} />
        </span>
        <span className="text-[9px] uppercase tracking-[0.22em] text-slate-400 font-bold">
          Pose · Zone {robot.zone}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold">X</div>
          <div className="text-[14px] font-extrabold text-white tabular-nums leading-none mt-0.5 font-mono">
            {metrics.x.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold">Y</div>
          <div className="text-[14px] font-extrabold text-white tabular-nums leading-none mt-0.5 font-mono">
            {metrics.y.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold">θ</div>
          <div className="text-[14px] font-extrabold text-white tabular-nums leading-none mt-0.5 font-mono">
            {metrics.theta.toFixed(0)}°
          </div>
        </div>
      </div>
      {/* Mini-radar */}
      <div className="relative h-[100px] w-full rounded-md border border-white/10 bg-[#00C2FF]/[0.03] overflow-hidden">
        <span className="absolute inset-0 amr-radar-sweep" />
        <span className="absolute top-1/2 left-0 right-0 h-px bg-[#00C2FF]/20" />
        <span className="absolute top-0 bottom-0 left-1/2 w-px bg-[#00C2FF]/20" />
        <span className="absolute inset-2 rounded-full border border-[#00C2FF]/15" />
        <span className="absolute inset-6 rounded-full border border-[#00C2FF]/10" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#00C2FF] shadow-[0_0_6px_#00C2FF]" />
      </div>
    </div>

    <MetricCard
      icon={Gauge}
      label="Linear Velocity"
      value={metrics.linVel.toFixed(2)}
      unit="m/s"
      color="#00C2FF"
      sub={`Cap ${metrics.speedCap.toFixed(1)} m/s`}
      big
    />
    <MetricCard
      icon={Activity}
      label="Angular Velocity"
      value={metrics.angVel.toFixed(2)}
      unit="rad/s"
      color="#A855F7"
    />
    <div className="rounded-xl border border-white/15 bg-black/55 backdrop-blur-xl px-3 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] min-w-[180px]">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="h-6 w-6 rounded-md flex items-center justify-center bg-[#10B981]/15 border border-[#10B981]/55">
          <Wifi className="h-3 w-3 text-[#10B981]" strokeWidth={2} />
        </span>
        <span className="text-[9px] uppercase tracking-[0.22em] text-slate-400 font-bold">
          Internet
        </span>
        <span className="ml-auto">
          <SignalBars strength={metrics.signal} />
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold">RSSI</div>
          <div className="text-[13px] font-extrabold text-white tabular-nums leading-none mt-0.5">
            {metrics.signal} <span className="text-[9px] text-slate-500 font-bold">dBm</span>
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold">AP</div>
          <div className="text-[12px] font-extrabold text-white truncate leading-none mt-0.5 font-mono">
            wh-mesh-04
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold">Lat</div>
          <div className="text-[13px] font-extrabold text-white tabular-nums leading-none mt-0.5">
            {metrics.latency} <span className="text-[9px] text-slate-500 font-bold">ms</span>
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold">Jitter</div>
          <div className="text-[13px] font-extrabold text-white tabular-nums leading-none mt-0.5">
            {metrics.jitter} <span className="text-[9px] text-slate-500 font-bold">ms</span>
          </div>
        </div>
      </div>
    </div>
    <MetricCard
      icon={BatteryCharging}
      label="Battery"
      value={metrics.battery.toFixed(1)}
      unit="%"
      color={metrics.battery > 60 ? "#10B981" : metrics.battery > 30 ? "#F59E0B" : "#EF4444"}
      sub={`SoH ${robot.soh}% · ETA ${Math.round((metrics.battery / 100) * 240)} min`}
      big
    />
    <MetricCard
      icon={Crosshair}
      label="Obstacle Distance"
      value={metrics.obstacle.toFixed(1)}
      unit="m"
      color={metrics.obstacle < 0.8 ? "#EF4444" : metrics.obstacle < 1.5 ? "#F59E0B" : "#10B981"}
      sub="Forward field"
    />
  </div>
);

// ----------------------------------------------------------------------------
// Bottom-left camera mode controls
// ----------------------------------------------------------------------------
const CameraControls = ({ cameraMode, setCameraMode, recording, setRecording, mic, setMic, leftOffset }) => {
  const modes = [
    { id: "front", icon: Camera, label: "Front" },
    { id: "rear", icon: CameraOff, label: "Rear" },
    { id: "top", icon: Layers, label: "Top-Down" },
  ];
  return (
    <div
      className="absolute bottom-6 z-30 flex flex-col gap-2"
      style={{ left: leftOffset }}
    >
      {/* Camera mode chips */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-white/15 bg-black/55 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        {modes.map((m) => {
          const Icon = m.icon;
          const active = cameraMode === m.id;
          return (
            <button
              key={m.id}
              data-testid={`cam-mode-${m.id}`}
              onClick={() => setCameraMode(m.id)}
              className={[
                "h-8 px-2.5 rounded-md flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all",
                active
                  ? "bg-[#0066FF] text-white shadow-[0_0_12px_rgba(0,102,255,0.5)]"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.06]",
              ].join(" ")}
            >
              <Icon className="h-3 w-3" strokeWidth={2.2} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Record + Mic */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-white/15 bg-black/55 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <button
          data-testid="rec-toggle"
          onClick={() => setRecording((v) => !v)}
          className={[
            "h-8 px-2.5 rounded-md flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all",
            recording
              ? "bg-red-500/20 text-red-300 border border-red-500/50"
              : "text-slate-300 hover:text-white hover:bg-white/[0.06]",
          ].join(" ")}
        >
          {recording ? <Square className="h-3 w-3 fill-current" /> : <Circle className="h-3 w-3 fill-red-500 text-red-500" />}
          {recording ? "Stop" : "Record"}
        </button>
        <button
          data-testid="mic-toggle"
          onClick={() => setMic((v) => !v)}
          className={[
            "h-8 px-2.5 rounded-md flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all",
            mic
              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
              : "text-slate-300 hover:text-white hover:bg-white/[0.06]",
          ].join(" ")}
        >
          {mic ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
          {mic ? "Talk" : "Mute"}
        </button>
        <button
          data-testid="emergency-stop"
          className="h-8 px-2.5 rounded-md flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all bg-red-500/15 text-red-300 border border-red-500/40 hover:bg-red-500/25"
        >
          <AlertTriangle className="h-3 w-3" />
          E-Stop
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Bottom-right joystick + manual control mode
// ----------------------------------------------------------------------------
const Joystick = ({ onChange, mode, setMode }) => {
  const baseRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const RADIUS = 60; // max knob travel from center

  const move = useCallback(
    (clientX, clientY) => {
      const base = baseRef.current;
      if (!base) return;
      const rect = base.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > RADIUS) {
        dx = (dx / dist) * RADIUS;
        dy = (dy / dist) * RADIUS;
      }
      setPos({ x: dx, y: dy });
      onChange?.({ x: dx / RADIUS, y: -dy / RADIUS });
    },
    [onChange]
  );

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    move(e.clientX, e.clientY);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    move(e.clientX, e.clientY);
  };
  const onPointerUp = (e) => {
    setDragging(false);
    setPos({ x: 0, y: 0 });
    onChange?.({ x: 0, y: 0 });
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="absolute bottom-6 right-6 z-30 flex items-end gap-3">
      {/* Mode toggle + cmd readout — stacked vertically to the LEFT of joystick */}
      <div className="flex flex-col gap-2 mb-1">
        <div className="flex flex-col gap-1 p-1.5 rounded-xl border border-white/15 bg-black/55 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          {["auto", "manual"].map((m) => (
            <button
              key={m}
              data-testid={`mode-${m}`}
              onClick={() => setMode(m)}
              className={[
                "h-7 px-3 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 justify-center",
                mode === m
                  ? m === "manual"
                    ? "bg-[#F59E0B] text-black"
                    : "bg-[#0066FF] text-white"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.06]",
              ].join(" ")}
            >
              {m === "auto" ? <Cctv className="h-3 w-3" /> : <Power className="h-3 w-3" />}
              {m}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border border-white/15 bg-black/55 backdrop-blur-xl">
          <span className="text-[8px] uppercase tracking-[0.2em] text-slate-500 font-bold">
            Cmd
          </span>
          <span className="text-[10px] font-extrabold text-white tabular-nums font-mono leading-none">
            {(-pos.y / RADIUS).toFixed(2)}
          </span>
          <span className="text-[10px] font-extrabold text-white tabular-nums font-mono leading-none">
            {(pos.x / RADIUS).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Joystick base — compact */}
      <div
        className="relative rounded-full border-2 backdrop-blur-xl"
        style={{
          width: 150,
          height: 150,
          borderColor: "rgba(255,255,255,0.18)",
          background:
            "radial-gradient(circle at 50% 40%, rgba(0,102,255,0.15) 0%, rgba(0,0,0,0.7) 70%)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,194,255,0.08)",
        }}
      >
        {/* Crosshair */}
        <span className="absolute top-1/2 left-2 right-2 h-px bg-white/10 -translate-y-1/2" />
        <span className="absolute left-1/2 top-2 bottom-2 w-px bg-white/10 -translate-x-1/2" />
        <span className="absolute inset-3 rounded-full border border-white/[0.06]" />
        <span className="absolute inset-8 rounded-full border border-white/[0.04]" />

        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.2em] text-slate-500 font-bold">
          F
        </span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.2em] text-slate-500 font-bold">
          R
        </span>
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[8px] uppercase tracking-[0.2em] text-slate-500 font-bold">
          L
        </span>
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] uppercase tracking-[0.2em] text-slate-500 font-bold">
          R
        </span>

        <div
          ref={baseRef}
          data-testid="joystick-base"
          className="absolute inset-0 touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ cursor: dragging ? "grabbing" : "grab" }}
        >
          <div
            data-testid="joystick-knob"
            className="absolute h-[52px] w-[52px] rounded-full border-2 border-white/30 shadow-[0_8px_24px_rgba(0,194,255,0.4)] pointer-events-none transition-transform"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
              background:
                "radial-gradient(circle at 30% 30%, #00C2FF 0%, #0066FF 60%, #002a66 100%)",
              transitionDuration: dragging ? "0ms" : "260ms",
              transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
          </div>
        </div>

        {mode === "auto" && (
          <div className="absolute inset-0 rounded-full bg-black/55 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none gap-1">
            <Cctv className="h-4 w-4 text-[#00C2FF]" strokeWidth={1.8} />
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#00C2FF] font-bold">
              Autopilot
            </span>
            <span className="text-[7px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-0.5">
              Manual to drive
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Back-to-dashboard button (top-left, below sidebar collapse area)
// ----------------------------------------------------------------------------
const BackButton = () => (
  <Link
    to="/"
    data-testid="back-dashboard"
    className="absolute top-4 z-40 px-3 h-9 rounded-xl border border-white/15 bg-black/55 backdrop-blur-xl text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:border-white/30 transition-all flex items-center gap-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
    style={{ left: 0 }}
  >
    <ArrowLeft className="h-3 w-3" />
    Dashboard
  </Link>
);

// ----------------------------------------------------------------------------
// Main page
// ----------------------------------------------------------------------------
export default function VideoStreamPage() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return true;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  const [robotId, setRobotId] = useState(
    ROBOT_STATS.find((r) => r.status === "active")?.id || ROBOT_STATS[0].id
  );
  const robot = ROBOT_STATS.find((r) => r.id === robotId) || ROBOT_STATS[0];

  const [cameraMode, setCameraMode] = useState("front");
  const [recording, setRecording] = useState(false);
  const [mic, setMic] = useState(false);
  const [driveMode, setDriveMode] = useState("auto");
  const [joy, setJoy] = useState({ x: 0, y: 0 });

  // Live mock metrics
  const [metrics, setMetrics] = useState({
    linVel: 0.95,
    angVel: 0.05,
    battery: robot.battery,
    signal: -58,
    latency: 42,
    jitter: 3,
    bitrate: 2.6,
    fps: 30,
    speedCap: 1.5,
    obstacle: 2.4,
    x: 12.3,
    y: 6.8,
    theta: 92,
  });

  // Reset metrics base when robot changes
  useEffect(() => {
    setMetrics((m) => ({
      ...m,
      battery: robot.battery,
      linVel: robot.avgSpeed || 0.5,
    }));
  }, [robot]);

  // Tick: jitter the metrics every 600ms to feel live
  useEffect(() => {
    const t = setInterval(() => {
      setMetrics((m) => {
        const wobble = (n, amp) => n + (Math.random() - 0.5) * amp;
        const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

        // In manual mode: joystick directly influences velocity
        // joy.y > 0 means UP (forward) → positive linear velocity
        const targetLin = driveMode === "manual" ? joy.y * 1.4 : robot.avgSpeed || 0.6;
        const targetAng = driveMode === "manual" ? joy.x * 0.6 : 0.05;

        return {
          ...m,
          linVel: clamp(wobble(targetLin, 0.05), -1.8, 1.8),
          angVel: clamp(wobble(targetAng, 0.04), -1.2, 1.2),
          battery: clamp(m.battery - 0.02, 0, 100),
          signal: Math.round(clamp(wobble(m.signal, 3), -90, -40)),
          latency: Math.round(clamp(wobble(m.latency, 8), 18, 220)),
          jitter: Math.round(clamp(wobble(m.jitter, 1.4), 1, 14)),
          bitrate: +clamp(wobble(m.bitrate, 0.3), 1.2, 4.2).toFixed(1),
          fps: Math.round(clamp(wobble(m.fps, 1.5), 22, 34)),
          obstacle: +clamp(wobble(m.obstacle, 0.35), 0.4, 6).toFixed(1),
          x: +(m.x + (driveMode === "manual" ? joy.y * 0.08 : 0.02)).toFixed(2),
          y: +(m.y + (driveMode === "manual" ? joy.x * 0.05 : 0.005)).toFixed(2),
          theta: Math.round(
            (m.theta + (driveMode === "manual" ? joy.x * 4 : 0.4)) % 360
          ),
        };
      });
    }, 600);
    return () => clearInterval(t);
  }, [driveMode, joy, robot]);

  return (
    <div className="amr-dashboard fixed inset-0 bg-black text-white overflow-hidden">
      {/* Sidebar (collapsed by default; user can still navigate) */}
      <Sidebar collapsed={collapsed} onCollapseChange={setCollapsed} />

      {/* Video feed fills entire viewport */}
      <WarehouseFeed cameraMode={cameraMode} />

      {/* HUD on top */}
      <HudOverlay recording={recording} />

      {/* Back to dashboard — positioned to avoid sidebar */}
      <div
        className="absolute top-4 z-40 pointer-events-none"
        style={{
          left: collapsed ? SIDEBAR_W.collapsed + 18 : SIDEBAR_W.expanded + 18,
        }}
      >
        <div className="pointer-events-auto">
          <BackButton />
        </div>
      </div>

      {/* Top bar (robot select + connection chips) */}
      <TopBar
        robot={robot}
        robotId={robotId}
        setRobotId={setRobotId}
        metrics={metrics}
      />

      {/* Right metrics rail */}
      <RightRail metrics={metrics} robot={robot} />

      {/* Bottom-left camera controls — offset to clear sidebar */}
      <CameraControls
        cameraMode={cameraMode}
        setCameraMode={setCameraMode}
        recording={recording}
        setRecording={setRecording}
        mic={mic}
        setMic={setMic}
        leftOffset={collapsed ? SIDEBAR_W.collapsed + 18 : SIDEBAR_W.expanded + 18}
      />

      {/* Bottom-right joystick */}
      <Joystick onChange={setJoy} mode={driveMode} setMode={setDriveMode} />

      {/* Bottom-center status strip */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl border border-white/15 bg-black/55 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex items-center gap-3 pointer-events-none">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
          <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[10px] uppercase tracking-[0.22em] text-emerald-300 font-bold">
          Live Stream · {robot.name}
        </span>
        <span className="h-3 w-px bg-white/15" />
        <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400 font-bold">
          {cameraMode} cam · 1920×1080 · h.264
        </span>
        <span className="h-3 w-px bg-white/15" />
        <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400 font-bold">
          mode:{" "}
          <span
            className={driveMode === "manual" ? "text-[#F59E0B]" : "text-[#00C2FF]"}
          >
            {driveMode}
          </span>
        </span>
      </div>
    </div>
  );
}
