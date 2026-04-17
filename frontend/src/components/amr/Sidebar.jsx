import React, { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
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

export const SIDEBAR_W = { expanded: 228, collapsed: 76 };

export const Sidebar = ({ collapsed, onCollapseChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Force expanded on mobile-open (full overlay)
  const effectiveCollapsed = collapsed && !mobileOpen;
  const width = effectiveCollapsed ? SIDEBAR_W.collapsed : SIDEBAR_W.expanded;

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile toggle */}
      <button
        data-testid="sidebar-mobile-toggle"
        onClick={() => setMobileOpen((v) => !v)}
        className="md:hidden fixed top-3 left-3 z-[70] h-10 w-10 rounded-xl border border-white/10 bg-black/70 backdrop-blur-xl flex items-center justify-center text-white"
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        data-testid="app-sidebar"
        className={`fixed left-5 top-5 bottom-5 z-[60] flex flex-col
                    rounded-2xl border border-white/10
                    bg-black/55 backdrop-blur-2xl backdrop-saturate-150
                    shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                    transition-all duration-300
                    ${mobileOpen ? "translate-x-0" : "-translate-x-[140%] md:translate-x-0"}`}
        style={{ width }}
      >
        {/* Collapse toggle — floating pill on right edge */}
        <button
          data-testid="sidebar-collapse-toggle"
          onClick={() => onCollapseChange?.(!collapsed)}
          className="hidden md:flex absolute -right-3 top-20 h-10 w-6 rounded-r-lg rounded-l-sm
                     border border-white/10 bg-[#0066FF] hover:bg-[#3385FF]
                     items-center justify-center shadow-[0_0_18px_rgba(0,102,255,0.45)]
                     transition-all z-10"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-white" strokeWidth={2.2} />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-white" strokeWidth={2.2} />
          )}
        </button>

        {/* Logo */}
        <div className={`${effectiveCollapsed ? "px-3" : "px-5"} pt-6 pb-8 transition-all`}>
          <div className="flex items-center gap-3" data-testid="logo">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00C2FF] flex items-center justify-center shadow-[0_0_24px_rgba(0,102,255,0.45)] shrink-0">
              <Bot className="h-5 w-5 text-white" strokeWidth={2} />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#00C2FF] animate-pulse" />
            </div>
            {!effectiveCollapsed && (
              <div className="leading-tight min-w-0">
                <div className="text-[17px] font-extrabold tracking-wide text-white">
                  ORBIT<span className="text-[#00C2FF]">.</span>OS
                </div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
                  AMR Control
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className={`${effectiveCollapsed ? "px-2" : "px-3"} flex-1 overflow-y-auto amr-scroll transition-all`}>
          {!effectiveCollapsed && (
            <div className="px-3 pb-2 text-[11px] uppercase tracking-[0.2em] text-slate-600 font-semibold">
              Navigation
            </div>
          )}
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  data-testid={item.testid}
                  onClick={() => setMobileOpen(false)}
                  title={effectiveCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    [
                      "group relative flex items-center rounded-lg transition-all duration-200",
                      effectiveCollapsed ? "justify-center h-11 w-11 mx-auto" : "gap-3 px-3 py-2.5 text-[14px]",
                      isActive
                        ? "bg-gradient-to-r from-[#0066FF]/22 to-transparent text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !effectiveCollapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-full bg-[#00C2FF] shadow-[0_0_8px_#00C2FF]" />
                      )}
                      {isActive && effectiveCollapsed && (
                        <span className="absolute inset-0 rounded-lg ring-1 ring-[#00C2FF]/40" />
                      )}
                      <item.icon
                        className={`h-[18px] w-[18px] shrink-0 ${
                          isActive ? "text-[#00C2FF]" : "text-slate-500 group-hover:text-slate-300"
                        }`}
                        strokeWidth={1.6}
                      />
                      {!effectiveCollapsed && <span className="font-semibold">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom card */}
        <div className={`${effectiveCollapsed ? "px-2" : "px-3"} pb-3 transition-all`}>
          {!effectiveCollapsed ? (
            <div className="rounded-xl border border-white/5 bg-gradient-to-br from-[#0066FF]/15 via-[#0A0A0B] to-[#0A0A0B] p-3 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#0066FF]/20 blur-2xl" />
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_#10B981]" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-300 font-semibold">
                  System Online
                </span>
              </div>
              <div className="text-[12.5px] text-slate-400 leading-snug mb-2.5">
                Fleet nominal. All channels synced.
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold">v4.2.1</span>
                <button
                  data-testid="logout-btn"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-[#00C2FF] transition-colors font-semibold"
                >
                  <LogOut className="h-3 w-3" /> Exit
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
              </span>
              <button
                data-testid="logout-btn-collapsed"
                className="h-9 w-9 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-[#00C2FF] transition-all"
                title="Exit"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className={`flex items-center ${effectiveCollapsed ? "justify-center" : "justify-between"} mt-2 px-1`}>
            <button
              data-testid="settings-btn"
              className="text-slate-500 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings className="h-4 w-4" strokeWidth={1.6} />
            </button>
            {!effectiveCollapsed && (
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-semibold">
                Day Shift
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
