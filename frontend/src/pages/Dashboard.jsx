import React from "react";
import Sidebar from "../components/amr/Sidebar";
import TopHeader from "../components/amr/TopHeader";
import ThreeWarehouseMap from "../components/amr/ThreeWarehouseMap";
import TasksScheduler from "../components/amr/TasksScheduler";
import LiveActivities from "../components/amr/LiveActivities";
import ActivityLog from "../components/amr/ActivityLog";
import NotificationsPanel from "../components/amr/NotificationsPanel";
import MaintenanceSchedule from "../components/amr/MaintenanceSchedule";
import ShiftHandover from "../components/amr/ShiftHandover";

export default function Dashboard() {
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

        {/* Content: 12-col grid; reference-like 5 / 7 split on xl */}
        <div className="p-4 md:p-6 flex-1">
          {/* Row 1: Scheduler + Live Activities (LEFT 5) | Map with overlay (RIGHT 7) */}
          <div className="grid grid-cols-12 gap-4 md:gap-5 mb-4 md:mb-5">
            <div className="col-span-12 xl:col-span-5 space-y-4 md:space-y-5">
              <TasksScheduler />
              <LiveActivities />
            </div>
            <div className="col-span-12 xl:col-span-7">
              <div className="h-[420px] md:h-[500px] xl:h-full xl:min-h-[580px]">
                <ThreeWarehouseMap />
              </div>
            </div>
          </div>

          {/* Row 2: Maintenance + Alerts (LEFT 5) | Activity Log (RIGHT 7) */}
          <div className="grid grid-cols-12 gap-4 md:gap-5 mb-4 md:mb-5">
            <div className="col-span-12 xl:col-span-5 space-y-4 md:space-y-5">
              <MaintenanceSchedule />
              <NotificationsPanel />
            </div>
            <div className="col-span-12 xl:col-span-7">
              <ActivityLog />
            </div>
          </div>

          {/* Row 3: Shift Handover full width */}
          <div className="grid grid-cols-12 gap-4 md:gap-5 mb-4">
            <div className="col-span-12">
              <ShiftHandover />
            </div>
          </div>

          {/* Footer strip */}
          <div className="flex items-center justify-between px-1 pt-4 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600 border-t border-white/5">
            <span>Orbit.OS · AMR Control Plane</span>
            <span className="hidden sm:inline">Telemetry stream nominal · 120ms avg</span>
          </div>
        </div>
      </main>
    </div>
  );
}
