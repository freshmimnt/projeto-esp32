import StatsDisplay from "./StatsDisplay";
import ControlPanel from "./ControlPanel";
import { useNavigate } from "react-router-dom";

import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="header-controls">
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
