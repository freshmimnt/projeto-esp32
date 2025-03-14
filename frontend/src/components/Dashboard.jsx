import StatsDisplay from "./StatsDisplay";
import ControlPanel from "./ControlPanel";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("Manual");

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    console.log(`Mode switched to: ${selectedMode}`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard - Mode: {mode}</h2>
        
        <div className="header-controls">
          <button
            className={mode === "Manual" ? "active" : ""}
            onClick={() => handleModeChange("Manual")}
          >
            Manual
          </button>
          <button
            className={mode === "Autonomous" ? "active" : ""}
            onClick={() => handleModeChange("Autonomous")}
          >
            Autonomous
          </button>
          <button onClick={() => navigate("/")} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <StatsDisplay />
        <ControlPanel />
      </div>
    </div>
  );
};

export default Dashboard;
