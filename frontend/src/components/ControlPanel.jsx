import "../styles/controlPanel.css";

const ControlPanel = () => {
  return (
    <div className="control-panel-container">
      <div className="control-container">
        <h2>Control Panel</h2>
        <div className="control-buttons">
          <button>⬆ Forward</button>
          <div className="horizontal-buttons">
            <button>⬅ Left</button>
            <button>➡ Right</button>
          </div>
          <button>⬇ Backward</button>
          <div className="action-buttons">
            <button className="stop">⏹ Stop</button>
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
