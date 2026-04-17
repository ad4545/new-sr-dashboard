import React from "react";
import Sidebar from "../components/amr/Sidebar";
import TopHeader from "../components/amr/TopHeader";
import ThreeWarehouseMap from "../components/amr/ThreeWarehouseMap";
import TasksScheduler from "../components/amr/TasksScheduler";
import LiveActivities from "../components/amr/LiveActivities";
import FleetStatus from "../components/amr/FleetStatus";
import TasksHistory from "../components/amr/TasksHistory";
import NotificationsPanel from "../components/amr/NotificationsPanel";
import ChargingStations from "../components/amr/ChargingStations";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-x-hidden">
      {/* Background ambient */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[10%] h-[520px] w-[520px] rounded-full bg-[#0066FF]/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[420px] w-[420px] rounded-full bg-[#00C2FF]/05 blur-[160px]" />
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

      <main className="relative z-10 ml-[260px] min-h-screen flex flex-col">
        <TopHeader breadcrumb={["Pages", "Dashboard"]} title="Fleet Operations" />

        <div className="p-8 flex-1">
          {/* Row 1: Live Map (span 8) + Fleet Status (span 4) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
            <div className="xl:col-span-8 min-h-[520px]">
              <ThreeWarehouseMap />
            </div>
            <div className="xl:col-span-4 min-h-[520px]">
              <FleetStatus />
            </div>
          </div>

          {/* Row 2: Scheduler (span 5) + Live Activities (span 4) + Notifications (span 3) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
            <div className="xl:col-span-5 min-h-[480px]">
              <TasksScheduler />
            </div>
            <div className="xl:col-span-4 min-h-[480px]">
              <LiveActivities />
            </div>
            <div className="xl:col-span-3 min-h-[480px]">
              <NotificationsPanel />
            </div>
          </div>

          {/* Row 3: Task History (span 8) + Charging Stations (span 4) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
            <div className="xl:col-span-8 min-h-[420px]">
              <TasksHistory />
            </div>
            <div className="xl:col-span-4 min-h-[420px]">
              <ChargingStations />
            </div>
          </div>

          {/* Footer strip */}
          <div className="flex items-center justify-between px-2 pt-4 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600 border-t border-white/5">
            <span>Orbit.OS · AMR Control Plane</span>
            <span>Telemetry stream nominal · 120ms avg</span>
          </div>
        </div>
      </main>
    </div>
  );
}
