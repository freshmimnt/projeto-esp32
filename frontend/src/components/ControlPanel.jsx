import "../styles/controlPanel.css";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

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
          <button onClick={() => socket.emit('command', 'FORWARD')}>⬆ Forward</button>
          <div className="horizontal-buttons">
            <button onClick={() => socket.emit('command','LEFT')}>⬅ Left</button>
            <button onClick={() => socket.emit('command','RIGHT')}> Right</button>
          </div>
          <button onClick={() => socket.emit('command','BACKWARD')}>⬇ Backward</button>
          <div className="action-buttons">
            <button className="stop" onClick={() => socket.emit('command','STOP')}>⏹ Stop</button>
            <button className="start" onClick={() => socket.emit('command','START')}> Start</button>
          </div>
        </div>
      </div>

      <div className="route-container">
        <h2>Vehicle Route</h2>
        <div className="route-placeholder">
          <svg width="400" height="120">
            <rect x="10" y="10" width="200" height="100" stroke="red" stroke-width="6" fill="blue" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
