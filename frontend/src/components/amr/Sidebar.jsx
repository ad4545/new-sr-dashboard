import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  Map,
  History,
  Bell,
  Bot,
  Settings,
  BatteryCharging,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, testid: "nav-dashboard" },
  { to: "/fleet", label: "Fleet", icon: Bot, testid: "nav-fleet" },
  { to: "/tasks", label: "Tasks", icon: ListTodo, testid: "nav-tasks" },
  { to: "/map", label: "Live Map", icon: Map, testid: "nav-map" },
  { to: "/charging", label: "Charging", icon: BatteryCharging, testid: "nav-charging" },
  { to: "/history", label: "History", icon: History, testid: "nav-history" },
  { to: "/alerts", label: "Alerts", icon: Bell, testid: "nav-alerts" },
  { to: "/safety", label: "Safety", icon: ShieldCheck, testid: "nav-safety" },
];

export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        data-testid="sidebar-mobile-toggle"
        onClick={() => setMobileOpen((v) => !v)}
        className="md:hidden fixed top-3 left-3 z-[60] h-10 w-10 rounded-lg border border-white/10 bg-black/70 backdrop-blur-xl flex items-center justify-center text-white"
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Backdrop on mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        data-testid="app-sidebar"
        className={`fixed left-0 top-0 bottom-0 w-[260px] z-50 flex flex-col
                   bg-black/40 backdrop-blur-2xl backdrop-saturate-150
                   border-r border-white/10 transition-transform duration-300
                   ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
      {/* Logo */}
      <div className="px-6 pt-8 pb-10">
        <div className="flex items-center gap-3" data-testid="logo">
          <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00C2FF] flex items-center justify-center shadow-[0_0_24px_rgba(0,102,255,0.45)]">
            <Bot className="h-5 w-5 text-white" strokeWidth={2} />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#00C2FF] animate-pulse" />
          </div>
          <div className="leading-tight">
            <div className="font-[Chivo] text-[17px] font-bold tracking-wide text-white">
              ORBIT<span className="text-[#00C2FF]">.</span>OS
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
              AMR Control
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 flex-1 overflow-y-auto">
        <div className="px-3 pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
          Navigation
        </div>
        <ul className="space-y-1">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                data-testid={item.testid}
                className={({ isActive }) =>
                  [
                    "group relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-[#0066FF]/20 to-transparent text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-full bg-[#00C2FF] shadow-[0_0_8px_#00C2FF]" />
                    )}
                    <item.icon
                      className={`h-[18px] w-[18px] ${
                        isActive ? "text-[#00C2FF]" : "text-slate-500 group-hover:text-slate-300"
                      }`}
                      strokeWidth={1.6}
                    />
                    <span className="font-[IBM_Plex_Sans]">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom system card */}
      <div className="p-4">
        <div className="rounded-xl border border-white/5 bg-gradient-to-br from-[#0066FF]/15 via-[#0A0A0B] to-[#0A0A0B] p-4 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#0066FF]/20 blur-2xl" />
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_#10B981]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300">
              System Online
            </span>
          </div>
          <div className="text-[13px] text-slate-300 leading-snug mb-3">
            Fleet nominal. All channels synced.
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">v4.2.1</span>
            <button
              data-testid="logout-btn"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-[#00C2FF] transition-colors"
            >
              <LogOut className="h-3 w-3" /> Exit
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 px-2">
          <button
            data-testid="settings-btn"
            className="text-slate-500 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4" strokeWidth={1.6} />
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
            Ops · Day Shift
          </span>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
