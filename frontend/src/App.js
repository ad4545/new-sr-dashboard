import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import StatsPage from "@/pages/StatsPage";
import VideoStreamPage from "@/pages/VideoStreamPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fleet" element={<Dashboard />} />
          <Route path="/tasks" element={<Dashboard />} />
          <Route path="/map" element={<Dashboard />} />
          <Route path="/video" element={<VideoStreamPage />} />
          <Route path="/charging" element={<Dashboard />} />
          <Route path="/stats/*" element={<StatsPage />} />
          <Route path="/history" element={<Dashboard />} />
          <Route path="/alerts" element={<Dashboard />} />
          <Route path="/safety" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#0E0F13",
            border: "1px solid rgba(0,102,255,0.3)",
            color: "#F8FAFC",
            fontFamily: "Nunito, sans-serif",
          },
        }}
      />
    </div>
  );
}

export default App;
