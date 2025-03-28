import "../styles/controlPanel.css";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const ControlPanel = () => {
  return (
    <div className="control-panel-container">
      <div className="control-container">
        <h2>Control Panel</h2>
        <div className="control-buttons">
          <button value={"esp32/FORWARD"}>⬆ Forward</button>
          <div className="horizontal-buttons">
            <button value={"esp32/LEFT"}>⬅ Left</button>
            <button value={"esp32/RIGHT"}>➡ Right</button>
          </div>
          <button value={"esp32/BACKWARD"}>⬇ Backward</button>
          <div className="action-buttons">
            <button className="stop" value={"esp32/STOP"}>⏹ Stop</button>
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
