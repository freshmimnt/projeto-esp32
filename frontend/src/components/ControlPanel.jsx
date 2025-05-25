import "../styles/controlPanel.css";
import React, { useState, useEffect } from 'react';
import "../styles/controlPanel.css";
import socket from '../socket';

const ControlPanel = () => {
  return (
    <div className="control-panel-container">
      <div className="control-container">
        <h2>Control Panel</h2>

        <div className="mode-buttons">
          <button onClick={() => socket.emit('mode', 'MANUAL')} >
            Manual
          </button>
          <button onClick={() => socket.emit('mode', 'AUTONOMOUS')} >
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
        <div className="speed-buttons">
          <h3>Select Speed</h3>
          <div className="speed-options">
            <button onClick={() => socket.emit('speed', 'SLOW')}>Slow</button>
            <button onClick={() => socket.emit('speed', 'NORMAL')}>Normal</button>
           <button onClick={() => socket.emit('speed', 'TURBO')}>Turbo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
