import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
  ListTodo,
  CheckCircle2,
  Gauge,
  Timer,
  BatteryCharging,
  Repeat,
  PauseCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  TASKS_SCHEDULED,
  TASKS_COMPLETED,
  AVG_SPEED,
  AVG_TIME,
  BATTERY_PER_TASK,
  TASKS_PER_CHARGE,
  IDLE_TIME,
} from "../../../data/statsMockData";

// ------- Generic helpers -------
const cardCls =
  "h-full rounded-2xl border border-white/10 bg-[#0E0F13]/85 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-5 flex flex-col";

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

const ChartTooltip = ({ active, payload, label, suffix = "" }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0A0A0B]/95 backdrop-blur-md px-3 py-2 shadow-xl">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold mb-0.5">
        {label}
      </div>
      <div className="text-[14px] font-extrabold text-white tabular-nums">
        {payload[0].value}
        {suffix && <span className="text-slate-400 text-[12px] ml-1">{suffix}</span>}
      </div>
    </div>
  );
};

// ------- KPI card with sparkline -------
const KpiCard = ({
  icon: Icon,
  title,
  value,
  unit,
  delta,
  series,
  color = "#00C2FF",
  testid,
  formatter = (v) => v,
}) => (
  <div data-testid={testid} className={cardCls}>
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <span
          className="h-9 w-9 rounded-lg flex items-center justify-center"
          style={{
            background: `${color}14`,
            border: `1px solid ${color}40`,
          }}
        >
          <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.8} />
        </span>
        <div>
          <Eyebrow>{title}</Eyebrow>
          <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">Last 7 days</div>
        </div>
      </div>
      <Delta value={delta} />
    </div>

    <div className="flex items-baseline gap-1.5 mt-1 mb-2">
      <span
        className="text-[40px] font-extrabold text-white tabular-nums leading-none"
        data-testid={`${testid}-value`}
      >
        {formatter(value)}
      </span>
      {unit && (
        <span className="text-[14px] font-bold text-slate-500 uppercase tracking-wider">
          {unit}
        </span>
      )}
    </div>

    {/* Sparkline */}
    <div className="flex-1 min-h-[70px] -mx-2 -mb-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 5, right: 6, left: 6, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${testid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            cursor={{ stroke: color, strokeOpacity: 0.4 }}
            content={<ChartTooltip />}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${testid})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: "#0E0F13", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// ------- Chart cards -------
const BatteryChart = () => (
  <div data-testid="stat-battery" className={cardCls}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="h-9 w-9 rounded-lg flex items-center justify-center bg-[#F59E0B]/14 border border-[#F59E0B]/40">
          <BatteryCharging className="h-4 w-4 text-[#F59E0B]" strokeWidth={1.8} />
        </span>
        <div>
          <Eyebrow>Battery Consumption</Eyebrow>
          <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">Avg per task type</div>
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
            content={(p) => <ChartTooltip {...p} suffix="%" />}
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
            content={(p) => <ChartTooltip {...p} suffix=" tasks" />}
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
      {/* Donut */}
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
                return (
                  <div className="rounded-lg border border-white/10 bg-[#0A0A0B]/95 backdrop-blur-md px-3 py-2 shadow-xl">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: d.color }}>
                      {d.name}
                    </div>
                    <div className="text-[14px] font-extrabold text-white tabular-nums">
                      {d.value}%
                    </div>
                  </div>
                );
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

      {/* Legend */}
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

// ------- Main -------
export default function OverallStats() {
  return (
    <div data-testid="overall-stats" className="space-y-3">
      {/* Row 1: 4 KPI cards */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-6 xl:col-span-3 h-[200px]">
          <KpiCard
            icon={ListTodo}
            title="Total Tasks Scheduled"
            value={TASKS_SCHEDULED.total}
            delta={TASKS_SCHEDULED.delta}
            series={TASKS_SCHEDULED.series}
            color="#00C2FF"
            testid="kpi-scheduled"
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3 h-[200px]">
          <KpiCard
            icon={CheckCircle2}
            title="Total Tasks Completed"
            value={TASKS_COMPLETED.total}
            delta={TASKS_COMPLETED.delta}
            series={TASKS_COMPLETED.series}
            color="#10B981"
            testid="kpi-completed"
            formatter={(v) => `${v}`}
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3 h-[200px]">
          <KpiCard
            icon={Gauge}
            title="Average Speed / Task"
            value={AVG_SPEED.value}
            unit={AVG_SPEED.unit}
            delta={AVG_SPEED.delta}
            series={AVG_SPEED.series}
            color="#0066FF"
            testid="kpi-speed"
            formatter={(v) => v.toFixed(2)}
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3 h-[200px]">
          <KpiCard
            icon={Timer}
            title="Average Time / Task"
            value={AVG_TIME.value}
            unit={AVG_TIME.unit}
            delta={AVG_TIME.delta}
            series={AVG_TIME.series}
            color="#A855F7"
            testid="kpi-time"
            formatter={(v) => v.toFixed(1)}
          />
        </div>
      </div>

      {/* Row 2: 3 chart cards */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-4 h-[360px]">
          <BatteryChart />
        </div>
        <div className="col-span-12 xl:col-span-4 h-[360px]">
          <TasksPerChargeChart />
        </div>
        <div className="col-span-12 xl:col-span-4 h-[360px]">
          <IdleTimeChart />
        </div>
      </div>
    </div>
  );
}
