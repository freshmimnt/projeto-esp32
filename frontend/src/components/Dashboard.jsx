import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatsDisplay from "./StatsDisplay";
import ControlPanel from "./ControlPanel";
import "../styles/dashboard.css";

const Dashboard = () => {


  const handleLogout = () => {
    // to clear the localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="header-controls">
          <button onClick={handleLogout} className="logout-btn">
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





/*import StatsDisplay from "./StatsDisplay";
import ControlPanel from "./ControlPanel";
import { useNavigate } from "react-router-dom";

import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="header-controls">
          <button onClick={handleLogout} className="logout-btn">
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
*/
