import "../styles/statsDisplay.css";

const StatsDisplay = () => {
  return (
    <div className="stats-grid">
      <div className="stats-box">
        <h2>Reaction Time:</h2>
        <span>0.5s</span>
      </div>
      <div className="stats-box">
        <h2>Battery:</h2>
        <span>85%</span>
      </div>
      <div className="stats-box">
        <h2>Velocity:</h2>
        <span>2.4 m/s</span>
      </div>
      <div className="stats-box">
        <h2>Inclination:</h2>
        <span>15°</span>
      </div>
      <div className="stats-box">
        <h2>Distance to Obstacle:</h2>
        <span>30 cm</span>
      </div>
      <div className="stats-box">
        <h2>Time Taken:</h2>
        <span>1m 20s</span>
      </div>
    </div>
  );
};

export default StatsDisplay;
