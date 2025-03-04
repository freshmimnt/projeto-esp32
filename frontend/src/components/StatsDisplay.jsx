import "../styles/statsDisplay.css";

const StatsDisplay = () => {
  return (
    <div className="stats-container">
      <h2>Vehicle Stats</h2>
      <ul>
        <li>Reaction Time: <span>0.5s</span></li>
        <li>Battery: <span>85%</span></li>
        <li>Velocity: <span>2.4 m/s</span></li>
        <li>Inclination: <span>15°</span></li>
        <li>Distance to Obstacle: <span>30 cm</span></li>
        <li>Time Taken: <span>1m 20s</span></li>
      </ul>
    </div>
  );
};

export default StatsDisplay;
