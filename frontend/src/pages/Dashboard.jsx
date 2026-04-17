import React, { useState, useCallback } from "react";
import Sidebar from "../components/amr/Sidebar";
import TopHeader from "../components/amr/TopHeader";
import ThreeWarehouseMap from "../components/amr/ThreeWarehouseMap";
import TasksScheduler from "../components/amr/TasksScheduler";
import LiveActivities from "../components/amr/LiveActivities";
import ActivityLog from "../components/amr/ActivityLog";
import NotificationsPanel from "../components/amr/NotificationsPanel";
import MaintenanceSchedule from "../components/amr/MaintenanceSchedule";
import ShiftHandover from "../components/amr/ShiftHandover";
import RobotDrawer from "../components/amr/RobotDrawer";

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);

  const handleRobotClick = useCallback((id) => {
    setSelectedRobot(id);
    setDrawerOpen(true);
  }, []);

  return (
    <div className="amr-dashboard min-h-screen bg-[#0A0A0B] text-white relative overflow-x-hidden">
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

      <Sidebar />

      <main className="relative z-10 ml-0 md:ml-[260px] min-h-screen flex flex-col">
        <TopHeader breadcrumb={["Pages", "Dashboard"]} title="Fleet Operations" />

        <div className="p-4 md:p-6 flex-1">
          {/* Row 1: Map (7) | Task Scheduler (5) — map now on LEFT to match reference */}
          <div className="grid grid-cols-12 gap-4 md:gap-5 mb-4 md:mb-5">
            <div className="col-span-12 xl:col-span-7">
              <ThreeWarehouseMap onRobotClick={handleRobotClick} />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <TasksScheduler />
            </div>
          </div>

          {/* Row 2: Activity Log (7) | Live Activities (5) */}
          <div className="grid grid-cols-12 gap-4 md:gap-5 mb-4 md:mb-5">
            <div className="col-span-12 xl:col-span-7">
              <ActivityLog />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <LiveActivities />
            </div>
          </div>

          {/* Row 3: Maintenance (7) | Alerts (5) */}
          <div className="grid grid-cols-12 gap-4 md:gap-5 mb-4 md:mb-5">
            <div className="col-span-12 xl:col-span-7">
              <MaintenanceSchedule />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <NotificationsPanel />
            </div>
          </div>

          {/* Row 4: Shift Handover full width */}
          <div className="grid grid-cols-12 gap-4 md:gap-5 mb-4">
            <div className="col-span-12">
              <ShiftHandover />
            </div>
          </div>

          <div className="flex items-center justify-between px-1 pt-4 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600 border-t border-white/5">
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
