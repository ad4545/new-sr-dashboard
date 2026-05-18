import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Gauge,
  BatteryCharging,
  Repeat,
  PauseCircle,
  TrendingUp,
  TrendingDown,
  ListChecks,
  Clock,
} from "lucide-react";
import {
  TASKS_SCHEDULED,
  TASKS_COMPLETED,
  AVG_SPEED,
  AVG_TIME,
  BATTERY_PER_TASK,
  TASKS_PER_CHARGE,
  IDLE_TIME,
  THROUGHPUT_BY_INTERVAL,
  SPEED_BY_INTERVAL,
  TIME_BY_INTERVAL,
} from "../../../data/statsMockData";

// -------- shared --------
const cardCls =
  "h-full rounded-2xl border border-white/[0.12] bg-[#15171D] backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-5 flex flex-col";

const Eyebrow = ({ children }) => (
  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500 font-semibold">
    {children}
  </div>
);

const Delta = ({ value }) => {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  const color = positive ? "#10B981" : "#EF4444";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold"
      style={{
        color,
        borderColor: `${color}40`,
        background: `${color}14`,
      }}
    >
      <Icon className="h-3 w-3" strokeWidth={2.4} />
      {positive ? "+" : ""}
      {value}%
    </span>
  );
};

const tooltipBox = (label, rows) => (
  <div className="rounded-lg border border-white/10 bg-[#0A0A0B]/95 backdrop-blur-md px-3 py-2 shadow-xl">
    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold mb-1">
      {label}
    </div>
    {rows.map((r, i) => (
      <div key={i} className="flex items-center gap-2 text-[13px]">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: r.color, boxShadow: `0 0 6px ${r.color}` }}
        />
        <span className="text-slate-400">{r.name}</span>
        <span className="text-white font-extrabold tabular-nums ml-auto">
          {r.value}
          {r.unit && (
            <span className="text-slate-500 font-bold text-[11px] ml-0.5">{r.unit}</span>
          )}
        </span>
      </div>
    ))}
  </div>
);

// -------- 1) Throughput combined card --------
const ThroughputCard = () => {
  const rate = TASKS_COMPLETED.completionRate;
  return (
    <div data-testid="stat-throughput" className={cardCls}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-lg bg-[#00C2FF]/15 border border-[#00C2FF]/40 flex items-center justify-center">
            <ListChecks className="h-4 w-4 text-[#00C2FF]" strokeWidth={1.8} />
          </span>
          <div>
            <Eyebrow>Tasks Throughput</Eyebrow>
            <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">
              Today · scheduled vs completed by 2-hour interval
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Legend
            color="#00C2FF"
            label="Scheduled"
            value={TASKS_SCHEDULED.total}
            delta={TASKS_SCHEDULED.delta}
          />
          <Legend
            color="#10B981"
            label="Completed"
            value={TASKS_COMPLETED.total}
            delta={TASKS_COMPLETED.delta}
          />
          <RingChip rate={rate} />
        </div>
      </div>

      {/* Mobile summary row */}
      <div className="flex sm:hidden items-center gap-2 mb-3">
        <Legend
          color="#00C2FF"
          label="Scheduled"
          value={TASKS_SCHEDULED.total}
          delta={TASKS_SCHEDULED.delta}
        />
        <Legend
          color="#10B981"
          label="Completed"
          value={TASKS_COMPLETED.total}
          delta={TASKS_COMPLETED.delta}
        />
        <RingChip rate={rate} />
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={THROUGHPUT_BY_INTERVAL}
            margin={{ top: 10, right: 8, left: -16, bottom: 0 }}
            barGap={4}
            barCategoryGap="18%"
          >
            <defs>
              <linearGradient id="thrSched" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00C2FF" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#0066FF" stopOpacity={0.35} />
              </linearGradient>
              <linearGradient id="thrComp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1A1D24" vertical={false} />
            <XAxis
              dataKey="interval"
              tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }}
              axisLine={{ stroke: "#1A1D24" }}
              tickLine={false}
              padding={{ left: 8, right: 8 }}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "#0066FF14" }}
              content={(p) => {
                if (!p.active || !p.payload?.length) return null;
                const d = p.payload[0].payload;
                return tooltipBox(`${d.interval}`, [
                  { name: "Scheduled", value: d.scheduled, color: "#00C2FF" },
                  { name: "Completed", value: d.completed, color: "#10B981" },
                ]);
              }}
            />
            <Bar dataKey="scheduled" fill="url(#thrSched)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="url(#thrComp)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Legend = ({ color, label, value, delta }) => (
  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02]">
    <span
      className="h-2 w-2 rounded-full"
      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
    />
    <div className="flex flex-col leading-tight">
      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
        {label}
      </span>
      <span className="text-[18px] font-extrabold text-white tabular-nums">{value}</span>
    </div>
    {delta !== undefined && <Delta value={delta} />}
  </div>
);

const RingChip = ({ rate }) => {
  const r = 16;
  const c = 2 * Math.PI * r;
  const dash = (rate / 100) * c;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#10B981]/30 bg-[#10B981]/10">
      <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
        <circle cx="20" cy="20" r={r} stroke="#1A1D24" strokeWidth="4" fill="none" />
        <circle
          cx="20"
          cy="20"
          r={r}
          stroke="#10B981"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ filter: "drop-shadow(0 0 6px #10B98180)" }}
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
          Completion
        </span>
        <span className="text-[16px] font-extrabold text-[#6EE7B7] tabular-nums">
          {rate}%
        </span>
      </div>
    </div>
  );
};

// -------- 2) Line chart card for Speed / Time --------
const LineKpiCard = ({
  icon: Icon,
  title,
  subtitle,
  data,
  color,
  headlineValue,
  unit,
  delta,
  yUnit,
  yDomain,
  yTicks,
  yFormatter,
  testid,
}) => (
  <div data-testid={testid} className={cardCls}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span
          className="h-9 w-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}14`, border: `1px solid ${color}40` }}
        >
          <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.8} />
        </span>
        <div>
          <Eyebrow>{title}</Eyebrow>
          <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">{subtitle}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-[26px] font-extrabold text-white tabular-nums leading-none">
            {headlineValue}
            {unit && (
              <span className="text-[13px] text-slate-500 font-bold ml-1">{unit}</span>
            )}
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-semibold">
            7-day avg
          </div>
        </div>
        <Delta value={delta} />
      </div>
    </div>

    <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id={`gline-${testid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1A1D24" vertical={false} strokeDasharray="3 5" />
          <XAxis
            dataKey="interval"
            tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }}
            axisLine={{ stroke: "#1A1D24" }}
            tickLine={false}
            padding={{ left: 4, right: 4 }}
          />
          <YAxis
            tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={yFormatter || ((v) => `${v}${yUnit ? " " + yUnit : ""}`)}
            domain={yDomain || ["auto", "auto"]}
            ticks={yTicks}
          />
          <Tooltip
            cursor={{ stroke: color, strokeOpacity: 0.4, strokeDasharray: "3 3" }}
            content={(p) => {
              if (!p.active || !p.payload?.length) return null;
              const d = p.payload[0].payload;
              return tooltipBox(d.interval, [
                {
                  name: title,
                  value: typeof d.value === "number" ? d.value.toFixed(2) : d.value,
                  unit: yUnit,
                  color,
                },
              ]);
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#0E0F13", stroke: color, strokeWidth: 2 }}
            activeDot={{ r: 6, fill: color, stroke: "#0E0F13", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// -------- 3) Existing bar/donut cards (kept from prior iteration) --------
const BatteryChart = () => (
  <div data-testid="stat-battery" className={cardCls}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="h-9 w-9 rounded-lg flex items-center justify-center bg-[#F59E0B]/14 border border-[#F59E0B]/40">
          <BatteryCharging className="h-4 w-4 text-[#F59E0B]" strokeWidth={1.8} />
        </span>
        <div>
          <Eyebrow>Battery Consumption</Eyebrow>
          <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">
            Avg per task type
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[26px] font-extrabold text-white tabular-nums leading-none">
          {BATTERY_PER_TASK.avg}%
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-semibold">
          fleet avg
        </div>
      </div>
    </div>
    <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={BATTERY_PER_TASK.byType}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          barCategoryGap="22%"
        >
          <defs>
            <linearGradient id="batGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1A1D24" vertical={false} />
          <XAxis
            dataKey="type"
            tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }}
            axisLine={{ stroke: "#1A1D24" }}
            tickLine={false}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <Tooltip
            cursor={{ fill: "#0066FF14" }}
            content={(p) => {
              if (!p.active || !p.payload?.length) return null;
              const d = p.payload[0].payload;
              return tooltipBox(d.type, [
                { name: "Battery", value: d.value, unit: "%", color: "#F59E0B" },
              ]);
            }}
          />
          <Bar dataKey="value" fill="url(#batGrad)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const TasksPerChargeChart = () => (
  <div data-testid="stat-charge-cycle" className={cardCls}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="h-9 w-9 rounded-lg flex items-center justify-center bg-[#00C2FF]/14 border border-[#00C2FF]/40">
          <Repeat className="h-4 w-4 text-[#00C2FF]" strokeWidth={1.8} />
        </span>
        <div>
          <Eyebrow>Tasks per Charge Cycle</Eyebrow>
          <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">By robot</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[26px] font-extrabold text-white tabular-nums leading-none">
          {TASKS_PER_CHARGE.avg}
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-semibold">
          tasks / cycle
        </div>
      </div>
    </div>
    <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={TASKS_PER_CHARGE.byRobot}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          barCategoryGap="22%"
        >
          <defs>
            <linearGradient id="chargeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00C2FF" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#0066FF" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1A1D24" vertical={false} />
          <XAxis
            dataKey="robot"
            tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }}
            axisLine={{ stroke: "#1A1D24" }}
            tickLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "#0066FF14" }}
            content={(p) => {
              if (!p.active || !p.payload?.length) return null;
              const d = p.payload[0].payload;
              return tooltipBox(d.robot, [
                { name: "Tasks", value: d.value, color: "#00C2FF" },
              ]);
            }}
          />
          <Bar dataKey="value" fill="url(#chargeGrad)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const IdleTimeChart = () => (
  <div data-testid="stat-idle-time" className={cardCls}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="h-9 w-9 rounded-lg flex items-center justify-center bg-[#64748B]/20 border border-[#64748B]/40">
          <PauseCircle className="h-4 w-4 text-slate-300" strokeWidth={1.8} />
        </span>
        <div>
          <Eyebrow>Robot Idle Time</Eyebrow>
          <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">Fleet utilization</div>
        </div>
      </div>
    </div>
    <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
      <div className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={IDLE_TIME.byStatus}
              innerRadius="60%"
              outerRadius="92%"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {IDLE_TIME.byStatus.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={(p) => {
                if (!p.active || !p.payload?.length) return null;
                const d = p.payload[0].payload;
                return tooltipBox(d.name, [
                  { name: "Share", value: d.value, unit: "%", color: d.color },
                ]);
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <div className="text-[28px] font-extrabold text-white tabular-nums leading-none">
            {IDLE_TIME.avg}%
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-semibold">
            Idle
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-2.5">
        {IDLE_TIME.byStatus.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ background: s.color, boxShadow: `0 0 6px ${s.color}40` }}
            />
            <span className="text-[12px] font-semibold text-slate-300 flex-1">{s.name}</span>
            <span className="text-[13px] font-extrabold text-white tabular-nums">
              {s.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// -------- main --------
export default function OverallStats() {
  return (
    <div data-testid="overall-stats" className="space-y-3">
      {/* Row 1: Throughput full width */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 h-[320px]">
          <ThroughputCard />
        </div>
      </div>

      {/* Row 2: Line charts side by side */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-6 h-[300px]">
          <LineKpiCard
            testid="line-speed"
            icon={Gauge}
            title="Average Speed / Task"
            subtitle="m/s · by 2-hour interval"
            data={SPEED_BY_INTERVAL}
            color="#0066FF"
            headlineValue={AVG_SPEED.value.toFixed(2)}
            unit={AVG_SPEED.unit}
            delta={AVG_SPEED.delta}
            yUnit="m/s"
            yDomain={[0.9, 1.3]}
            yTicks={[0.9, 1.0, 1.1, 1.2, 1.3]}
            yFormatter={(v) => v.toFixed(1)}
          />
        </div>
        <div className="col-span-12 xl:col-span-6 h-[300px]">
          <LineKpiCard
            testid="line-time"
            icon={Clock}
            title="Average Time / Task"
            subtitle="minutes · by 2-hour interval"
            data={TIME_BY_INTERVAL}
            color="#A855F7"
            headlineValue={AVG_TIME.value.toFixed(1)}
            unit={AVG_TIME.unit}
            delta={AVG_TIME.delta}
            yUnit="min"
            yDomain={[3.5, 6]}
            yTicks={[3.5, 4, 4.5, 5, 5.5, 6]}
            yFormatter={(v) => v.toFixed(1)}
          />
        </div>
      </div>

      {/* Row 3: Battery / Charge cycle / Idle */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-4 h-[340px]">
          <BatteryChart />
        </div>
        <div className="col-span-12 xl:col-span-4 h-[340px]">
          <TasksPerChargeChart />
        </div>
        <div className="col-span-12 xl:col-span-4 h-[340px]">
          <IdleTimeChart />
        </div>
      </div>
    </div>
  );
}
