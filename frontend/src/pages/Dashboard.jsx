import React, { useState, useCallback, useEffect } from "react";
import Sidebar, { SIDEBAR_W } from "../components/amr/Sidebar";
import TopHeader from "../components/amr/TopHeader";
import ThreeWarehouseMap from "../components/amr/ThreeWarehouseMap";
import TasksScheduler from "../components/amr/TasksScheduler";
import LiveActivities from "../components/amr/LiveActivities";
import ActivityLog from "../components/amr/ActivityLog";
import NotificationsPanel from "../components/amr/NotificationsPanel";
import MaintenanceSchedule from "../components/amr/MaintenanceSchedule";
import RobotDrawer from "../components/amr/RobotDrawer";

const STORAGE_KEY = "amr-sidebar-collapsed";

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);
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

  const handleRobotClick = useCallback((id) => {
    setSelectedRobot(id);
    setDrawerOpen(true);
  }, []);

  return (
    <div className="amr-dashboard min-h-screen bg-[#0A0A0B] text-white relative overflow-x-hidden text-[16px]">
      {/* Background ambient */}
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

        <TopHeader breadcrumb={["Pages", "Dashboard"]} title="Fleet Operations" />

        <div className="px-[6px] md:px-[8px] pb-2 flex-1">
          {/* Row 1: Map (7) | Live Activities (5) */}
          <div className="grid grid-cols-12 gap-[5px] mb-[5px] h-[520px]">
            <div className="col-span-12 xl:col-span-7">
              <ThreeWarehouseMap onRobotClick={handleRobotClick} />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <LiveActivities />
            </div>
          </div>

          {/* Row 2: Task Scheduler (7) | Activity Log (5) */}
          <div className="grid grid-cols-12 gap-[5px] mb-[5px] h-[480px]">
            <div className="col-span-12 xl:col-span-7">
              <TasksScheduler />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <ActivityLog />
            </div>
          </div>

          {/* Row 3: Maintenance (7) | Alerts (5) */}
          <div className="grid grid-cols-12 gap-[5px] mb-[5px] h-[420px]">
            <div className="col-span-12 xl:col-span-7">
              <MaintenanceSchedule />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <NotificationsPanel />
            </div>
          </div>

          <div className="flex items-center justify-between px-1 pt-2 pb-1 text-[11px] uppercase tracking-[0.2em] text-slate-600 border-t border-white/5 font-semibold">
            <span>Orbit.OS · AMR Control Plane</span>
            <span className="hidden sm:inline">Telemetry stream nominal · 120ms avg</span>
          </div>
        </div>
      </main>

      <RobotDrawer
        open={drawerOpen}
        robotId={selectedRobot}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
