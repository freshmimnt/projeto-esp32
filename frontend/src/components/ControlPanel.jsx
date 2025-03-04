import "../styles/controlPanel.css";

const ControlPanel = () => {
  return (
    <div className="control-container">
      <h2>Control Panel</h2>
      <div className="control-buttons">
        <button>⬆ Forward</button>
        <button>⬅ Left</button>
        <button>➡ Right</button>
        <button>⬇ Backward</button>
        <button className="stop">⏹ Stop</button>
        <button className="start">Start</button>
      </div>
    </div>
  );
};

export default ControlPanel;
