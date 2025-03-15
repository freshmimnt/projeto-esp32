import { useState } from "react";
import "../styles/controlPanel.css";

const ControlPanel = () => {
  const [mode, setMode] = useState("Manual");

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    console.log(`Mode switched to: ${selectedMode}`);
  };

  return (
    <div className="control-panel-container">
      <div className="control-container">
        <h2>Control Panel - Mode: {mode}</h2>

        <div className="mode-buttons">
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
        </div>

        <div className="control-buttons">
          <button>⬆ Forward</button>
          <div className="horizontal-buttons">
            <button>⬅ Left</button>
            <button>➡ Right</button>
          </div>
          <button>⬇ Backward</button>
          <div className="action-buttons">
            <button className="stop">Stop</button>
            <button className="start">Start</button>
          </div>
        </div>
      </div>

      <div className="route-container">
        <h2>Vehicle Route</h2>
        <div className="route-placeholder">---Map/Route---</div>
      </div>
    </div>
  );
};

export default ControlPanel;
