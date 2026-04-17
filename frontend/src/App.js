import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fleet" element={<Dashboard />} />
          <Route path="/tasks" element={<Dashboard />} />
          <Route path="/map" element={<Dashboard />} />
          <Route path="/charging" element={<Dashboard />} />
          <Route path="/history" element={<Dashboard />} />
          <Route path="/alerts" element={<Dashboard />} />
          <Route path="/safety" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
