import StatsDisplay from "./StatsDisplay";
import ControlPanel from "./ControlPanel";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Vehicle Dashboard</h1>
        <button onClick={() => navigate("/")} className="logout-btn">
          Logout
        </button>
      </div>
      <div className="dashboard-content">
        <StatsDisplay />
        <ControlPanel />
      </div>
    </div>
  );
};

export default Dashboard;
