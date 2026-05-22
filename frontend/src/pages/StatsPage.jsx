import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import Sidebar, { SIDEBAR_W } from "../components/amr/Sidebar";
import TopHeader from "../components/amr/TopHeader";
import OverallStats from "../components/amr/stats/OverallStats";
import RobotStats from "../components/amr/stats/RobotStats";
import SystemLogs from "../components/amr/stats/SystemLogs";
import { BarChart3, Bot, ScrollText, Calendar, Download } from "lucide-react";

const STORAGE_KEY = "amr-sidebar-collapsed";

const SUBNAV = [
  { to: "/stats/overall", label: "Overall Stats", icon: BarChart3, testid: "tab-overall" },
  { to: "/stats/robots", label: "Robot Stats", icon: Bot, testid: "tab-robots" },
  { to: "/stats/logs", label: "Logs", icon: ScrollText, testid: "tab-logs" },
];

export default function StatsPage() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  return (
    <div className="amr-dashboard min-h-screen bg-[#0A0A0B] text-white relative overflow-x-hidden text-[16px]">
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[10%] h-[520px] w-[520px] rounded-full bg-[#0066FF]/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[420px] w-[420px] rounded-full bg-[#00C2FF]/5 blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <Sidebar collapsed={collapsed} onCollapseChange={setCollapsed} />

      <main
        data-collapsed={collapsed ? "1" : "0"}
        className="amr-main relative z-10 min-h-screen flex flex-col transition-[padding] duration-300"
      >
        <style>{`
          .amr-main { padding-left: 0; }
          @media (min-width: 768px) {
            .amr-main[data-collapsed="1"] { padding-left: ${SIDEBAR_W.collapsed + 30}px; }
            .amr-main[data-collapsed="0"] { padding-left: ${SIDEBAR_W.expanded + 30}px; }
          }
        `}</style>

        <TopHeader breadcrumb={["Pages", "Stats"]} title="Analytics" />

        {/* Subnav tabs */}
        <div className="px-[10px] md:px-[12px] pt-[10px]">
          <div className="rounded-2xl border border-white/[0.12] bg-[#15171D] shadow-[0_4px_24px_rgba(0,0,0,0.4)] px-3 py-2 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/5">
              {SUBNAV.map((s) => (
                <NavLink
                  key={s.to}
                  to={s.to}
                  data-testid={s.testid}
                  className={({ isActive }) =>
                    [
                      "px-3 h-9 rounded-md flex items-center gap-2 text-[13px] font-semibold transition-all",
                      isActive
                        ? "bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.4)]"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]",
                    ].join(" ")
                  }
                >
                  <s.icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {s.label}
                </NavLink>
              ))}
            </div>

            <div className="flex-1" />

            {/* Date range + export (visual only) */}
            <button
              data-testid="stats-range"
              className="h-9 px-3 rounded-lg border border-white/10 bg-white/[0.02] text-[12px] font-semibold text-slate-300 hover:text-white hover:border-[#0066FF]/40 transition-all flex items-center gap-2"
            >
              <Calendar className="h-3.5 w-3.5" />
              Last 7 days
            </button>
            <button
              data-testid="stats-export"
              className="h-9 px-3 rounded-lg border border-white/10 bg-white/[0.02] text-[12px] font-semibold text-slate-300 hover:text-white hover:border-[#0066FF]/40 transition-all flex items-center gap-2"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-[10px] md:px-[12px] py-3 flex-1">
          <Routes>
            <Route index element={<Navigate to="/stats/overall" replace />} />
            <Route path="overall" element={<OverallStats />} />
            <Route path="robots" element={<RobotStats />} />
            <Route path="logs" element={<SystemLogs />} />
            <Route path="*" element={<Navigate to="/stats/overall" replace />} />
          </Routes>

          <div className="flex items-center justify-between px-1 pt-4 pb-2 text-[11px] uppercase tracking-[0.2em] text-slate-600 border-t border-white/5 font-semibold mt-3">
            <span>Orbit.OS · Analytics</span>
            <span className="hidden sm:inline">Window · last 7 days · refreshed live</span>
          </div>
        </div>
      </main>
    </div>
  );
}
