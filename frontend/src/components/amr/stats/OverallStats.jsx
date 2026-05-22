import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
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
  ListChecks,
  Clock,
  BatteryCharging,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  DAILY_FLEET_UTILIZATION_HOURS,
  TASK_DURATION_DISTRIBUTION,
  ROBOT_STATS,
  THROUGHPUT_BY_INTERVAL,
  THROUGHPUT_BY_WEEK,
  THROUGHPUT_BY_MONTH,
  AVG_TIME,
} from "../../../data/statsMockData";

// -------- shared --------
const cardCls =
  "h-full rounded-2xl border border-white/[0.12] bg-[#15171D] backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-5 flex flex-col";

const Eyebrow = ({ children }) => (
  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500 font-semibold">
    {children}
  </div>
);

const KpiCard = ({ icon: Icon, color, label, value, unit, subtext, trend, inverseTrend = false }) => {
  const isPositive = trend >= 0;
  const isGood = inverseTrend ? !isPositive : isPositive;
  const trendColor = isGood ? "#10B981" : "#EF4444";
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className="group relative rounded-xl border border-white/[0.07] bg-[#121419] p-4 transition-all duration-300 hover:border-white/[0.14] hover:bg-[#15171C] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] hover:-translate-y-[2px] flex items-center justify-between min-h-[82px]"
      style={{
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.015)",
      }}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(100px circle at 50% 0px, ${color}12, transparent)`,
        }}
      />

      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
          style={{
            background: `${color}0D`,
            border: `1px solid ${color}20`,
            boxShadow: `0 0 10px ${color}08`,
          }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color }} strokeWidth={1.8} />
        </div>

        <div className="flex flex-col">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold mb-1 leading-none">
            {label}
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-[23px] font-extrabold text-white tracking-tight tabular-nums leading-none">
              {value}
            </span>
            {unit && (
              <span className="text-[12px] font-bold text-slate-500 ml-0.5 leading-none">{unit}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        {trend !== undefined && (
          <div
            className="flex items-center gap-0.5 px-2 py-0.5 rounded-full border text-[10px] font-bold transition-all duration-300"
            style={{
              color: trendColor,
              borderColor: `${trendColor}25`,
              background: `${trendColor}0A`,
            }}
          >
            <TrendIcon className="h-2.5 w-2.5" strokeWidth={2.4} />
            <span>
              {isPositive ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
        {subtext && (
          <div className="text-[10px] text-slate-500 font-semibold leading-none">
            {subtext}
          </div>
        )}
      </div>
    </div>
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
const THROUGHPUT_VIEWS = {
  day: {
    label: "Day",
    subtitle: "Today · scheduled, completed and failed by 2-hour interval",
    data: THROUGHPUT_BY_INTERVAL.map((d) => ({ ...d, label: d.interval })),
    xInterval: 0,
    barCategoryGap: "18%",
  },
  week: {
    label: "Week",
    subtitle: "This week · Monday to Saturday",
    data: THROUGHPUT_BY_WEEK.map((d) => ({ ...d, label: d.day })),
    xInterval: 0,
    barCategoryGap: "22%",
  },
  month: {
    label: "Month",
    subtitle: "This month · daily task volume",
    data: THROUGHPUT_BY_MONTH.map((d) => ({ ...d, label: d.day })),
    xInterval: 4,
    barCategoryGap: "10%",
  },
};

const THROUGHPUT_COLORS = {
  scheduled: "#00C2FF",
  completed: "#10B981",
  failed: "#F43F5E",
};

const ThroughputCard = () => {
  const [view, setView] = useState("day");
  const activeView = THROUGHPUT_VIEWS[view];
  const totals = useMemo(
    () =>
      activeView.data.reduce(
        (acc, d) => ({
          scheduled: acc.scheduled + d.scheduled,
          completed: acc.completed + d.completed,
          failed: acc.failed + d.failed,
        }),
        { scheduled: 0, completed: 0, failed: 0 }
      ),
    [activeView]
  );

  return (
    <div data-testid="stat-throughput" className={cardCls}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-lg bg-[#00C2FF]/15 border border-[#00C2FF]/40 flex items-center justify-center">
            <ListChecks className="h-4 w-4 text-[#00C2FF]" strokeWidth={1.8} />
          </span>
          <div>
            <Eyebrow>Tasks Throughput</Eyebrow>
            <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">
              {activeView.subtitle}
            </div>
          </div>
        </div>
        <div
          className="shrink-0 inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-1"
          aria-label="Throughput range"
        >
          {Object.entries(THROUGHPUT_VIEWS).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={[
                "h-8 px-3 rounded-md text-[12px] font-bold transition-all",
                view === key
                  ? "bg-[#0066FF] text-white shadow-[0_0_18px_rgba(0,102,255,0.28)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>



      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={activeView.data}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            barGap={view === "month" ? 1 : 4}
            barCategoryGap={activeView.barCategoryGap}
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
              <linearGradient id="thrFail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity={0.28} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1A1D24" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }}
              axisLine={{ stroke: "#1A1D24" }}
              tickLine={false}
              padding={{ left: 8, right: 8 }}
              interval={activeView.xInterval}
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
                return tooltipBox(`${d.label}`, [
                  { name: "Scheduled", value: d.scheduled, color: THROUGHPUT_COLORS.scheduled },
                  { name: "Completed", value: d.completed, color: THROUGHPUT_COLORS.completed },
                  { name: "Failed", value: d.failed, color: THROUGHPUT_COLORS.failed },
                ]);
              }}
            />
            <Bar dataKey="scheduled" fill="url(#thrSched)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="url(#thrComp)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="failed" fill="url(#thrFail)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};



const FleetUtilizationPie = () => {
  const totalHours = DAILY_FLEET_UTILIZATION_HOURS.reduce((sum, item) => sum + item.hours, 0);
  const taskHours =
    DAILY_FLEET_UTILIZATION_HOURS.find((item) => item.name === "Productive Time")?.hours || 0;

  return (
    <div data-testid="stat-fleet-utilization" className={cardCls}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Eyebrow>Fleet Utilization</Eyebrow>
          <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">
            Today · productive time vs idle and charging
          </div>
        </div>
        <div className="text-right">
          <div className="text-[26px] font-extrabold text-white tabular-nums leading-none">
            {totalHours.toFixed(1)}
            <span className="text-[13px] text-slate-500 font-bold ml-1">h</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-semibold">
            total
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
        <div className="relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DAILY_FLEET_UTILIZATION_HOURS}
                innerRadius="60%"
                outerRadius="92%"
                paddingAngle={2}
                dataKey="hours"
                stroke="none"
              >
                {DAILY_FLEET_UTILIZATION_HOURS.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={(p) => {
                  if (!p.active || !p.payload?.length) return null;
                  const d = p.payload[0].payload;
                  return tooltipBox(d.name, [
                    { name: "Hours", value: d.hours.toFixed(1), unit: "h", color: d.color },
                    {
                      name: "Share",
                      value: ((d.hours / totalHours) * 100).toFixed(0),
                      unit: "%",
                      color: d.color,
                    },
                  ]);
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <div className="text-[28px] font-extrabold text-white tabular-nums leading-none">
              {Math.round((taskHours / totalHours) * 100)}%
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-semibold">
              Productive Time
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2.5">
          {DAILY_FLEET_UTILIZATION_HOURS.map((item) => (
            <div key={item.name} className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-sm shrink-0"
                style={{
                  background: item.color,
                  boxShadow: `0 0 8px ${item.color}66`,
                }}
              />
              <span className="text-[12px] font-semibold text-slate-300 flex-1">
                {item.name}
              </span>
              <span className="text-[13px] font-extrabold text-white tabular-nums">
                {item.hours.toFixed(1)}
                <span className="text-[11px] font-bold text-slate-500 ml-0.5">h</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// -------- 2) Supporting charts --------
const TaskDurationDistribution = () => {
  const totalTasks = TASK_DURATION_DISTRIBUTION.reduce((sum, item) => sum + item.tasks, 0);
  return (
    <div data-testid="task-duration-distribution" className={cardCls}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-lg flex items-center justify-center bg-[#A855F7]/14 border border-[#A855F7]/40">
            <Clock className="h-4 w-4 text-[#A855F7]" strokeWidth={1.8} />
          </span>
          <div>
            <Eyebrow>Task Duration Distribution</Eyebrow>
            <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">
              Tasks grouped by completion duration
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[26px] font-extrabold text-white tabular-nums leading-none">
            {AVG_TIME.value}
            <span className="text-[13px] text-slate-500 font-bold ml-1">{AVG_TIME.unit}</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-semibold">
            avg duration
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={TASK_DURATION_DISTRIBUTION}
            margin={{ top: 10, right: 8, left: -16, bottom: 0 }}
            barCategoryGap="24%"
          >
            <defs>
              <linearGradient id="durationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A855F7" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.35} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1A1D24" vertical={false} />
            <XAxis
              dataKey="range"
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
              cursor={{ fill: "#A855F714" }}
              content={(p) => {
                if (!p.active || !p.payload?.length) return null;
                const d = p.payload[0].payload;
                return tooltipBox(`${d.range} min`, [
                  { name: "Tasks", value: d.tasks, color: "#A855F7" },
                ]);
              }}
            />
            <Bar dataKey="tasks" fill="url(#durationGrad)" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ROBOT_LEADER_COLORS = ["#F59E0B", "#00C2FF", "#10B981", "#A855F7"];

const metricValue = (robot, metric) => {
  const totalTasks = robot.successTasks + robot.failedTasks;
  if (metric === "completion") return totalTasks > 0 ? robot.successTasks / totalTasks : 0;
  if (metric === "speed") return robot.avgSpeed;
  if (metric === "battery") return robot.batteryPerCycle;
  if (metric === "duration") return robot.avgTime;
  return 0;
};

const TopRobotsLeaderboard = () => {
  const candidates = ROBOT_STATS.filter((robot) => robot.successTasks > 0);
  const maxSpeed = Math.max(...candidates.map((robot) => robot.avgSpeed), 1);
  const minBattery = Math.min(...candidates.map((robot) => robot.batteryPerCycle));
  const maxBattery = Math.max(...candidates.map((robot) => robot.batteryPerCycle), minBattery + 1);
  const minDuration = Math.min(...candidates.map((robot) => robot.avgTime));
  const maxDuration = Math.max(...candidates.map((robot) => robot.avgTime), minDuration + 1);

  const topRobots = candidates
    .map((robot) => {
      const completion = metricValue(robot, "completion");
      const speed = metricValue(robot, "speed") / maxSpeed;
      const batteryEfficiency =
        1 - (metricValue(robot, "battery") - minBattery) / (maxBattery - minBattery);
      const durationEfficiency =
        1 - (metricValue(robot, "duration") - minDuration) / (maxDuration - minDuration);
      const score =
        completion * 0.35 + speed * 0.25 + batteryEfficiency * 0.2 + durationEfficiency * 0.2;

      return {
        ...robot,
        totalTasks: robot.successTasks + robot.failedTasks,
        completionPct: Math.round(completion * 100),
        score: Math.round(score * 100),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div data-testid="top-robots-leaderboard" className={cardCls}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <Eyebrow>Top Performing Robots</Eyebrow>
          <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">
            Ranked by completion, speed, battery and duration
          </div>
        </div>
        <div className="text-right">
          <div className="text-[26px] font-extrabold text-white tabular-nums leading-none">
            {topRobots.length}
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-semibold">
            robots
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-1.5">
        {topRobots.map((robot, index) => (
          <div
            key={robot.id}
            className="rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2"
          >
            <div className="grid grid-cols-[28px_minmax(110px,1fr)_92px_44px] items-center gap-2">
              <div
                className="h-6 w-6 rounded-md flex items-center justify-center text-[11px] font-extrabold"
                style={{
                  color: ROBOT_LEADER_COLORS[index],
                  background: `${ROBOT_LEADER_COLORS[index]}18`,
                  border: `1px solid ${ROBOT_LEADER_COLORS[index]}40`,
                }}
              >
                {index + 1}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-extrabold text-white">{robot.id}</span>
                  <span className="text-[11px] font-semibold text-slate-500 truncate">
                    {robot.name}
                  </span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${robot.score}%`,
                      background: ROBOT_LEADER_COLORS[index],
                      boxShadow: `0 0 8px ${ROBOT_LEADER_COLORS[index]}66`,
                    }}
                  />
                </div>
              </div>
              <div className="min-w-0 flex items-center justify-end gap-1.5 text-[10px] font-bold text-slate-400 tabular-nums">
                <span>{robot.totalTasks} tasks</span>
                <span className="text-slate-700">·</span>
                <span>{robot.completionPct}%</span>
              </div>
              <div className="text-right">
                <div className="text-[20px] font-extrabold text-white tabular-nums leading-none">
                  {robot.score}
                </div>
                <div className="text-[9px] uppercase tracking-[0.14em] text-slate-600 font-semibold">
                  score
                </div>
              </div>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold text-slate-600 tabular-nums">
              <span>Speed {robot.avgSpeed.toFixed(2)}</span>
              <span>Battery {robot.batteryPerCycle.toFixed(1)}%</span>
              <span>Duration {robot.avgTime.toFixed(1)}m</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------- main --------
export default function OverallStats() {
  const dailyScheduled = THROUGHPUT_BY_INTERVAL.reduce((sum, d) => sum + d.scheduled, 0);
  const dailyCompleted = THROUGHPUT_BY_INTERVAL.reduce((sum, d) => sum + d.completed, 0);
  const dailyFailed = THROUGHPUT_BY_INTERVAL.reduce((sum, d) => sum + d.failed, 0);

  const activeRobots = ROBOT_STATS.filter((r) => r.successTasks + r.failedTasks > 0);
  const totalTasks = activeRobots.reduce((sum, r) => sum + r.successTasks + r.failedTasks, 0);
  const totalBatteryUsed = activeRobots.reduce(
    (sum, r) => sum + (r.successTasks + r.failedTasks) * r.batteryPerCycle,
    0
  );
  const avgBatteryPerTask = totalTasks ? +(totalBatteryUsed / totalTasks).toFixed(1) : 0;

  return (
    <div data-testid="overall-stats" className="space-y-3">
      {/* Top KPI Row */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <KpiCard
            icon={ListChecks}
            color="#00C2FF"
            label="Scheduled Tasks"
            value={dailyScheduled}
            trend={12.7}
            subtext="vs 220 yesterday"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <KpiCard
            icon={CheckCircle2}
            color="#10B981"
            label="Completed Tasks"
            value={dailyCompleted}
            trend={8.4}
            subtext="vs 202 yesterday"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <KpiCard
            icon={XCircle}
            color="#F43F5E"
            label="Failed Tasks"
            value={dailyFailed}
            trend={-23.8}
            inverseTrend={true}
            subtext="vs 21 yesterday"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <KpiCard
            icon={BatteryCharging}
            color="#F59E0B"
            label="Avg Battery per Task"
            value={avgBatteryPerTask}
            unit="%"
            trend={-5.9}
            inverseTrend={true}
            subtext="vs 6.8% yesterday"
          />
        </div>
      </div>

      {/* Row 1: Throughput and fleet utilization */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-8 h-[360px]">
          <ThroughputCard />
        </div>
        <div className="col-span-12 xl:col-span-4 h-[360px]">
          <FleetUtilizationPie />
        </div>
      </div>

      {/* Row 2: Duration analytics and Leaderboard */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-6 h-[340px]">
          <TaskDurationDistribution />
        </div>
        <div className="col-span-12 xl:col-span-6 h-[340px]">
          <TopRobotsLeaderboard />
        </div>
      </div>
    </div>
  );
}
