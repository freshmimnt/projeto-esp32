import "../styles/statsDisplay.css";
import React, { useState, useEffect } from 'react';
import socket from '../socket';

const StatsDisplay = () => {

  const [distance, setDistance] = useState(null);

  useEffect(() => {
    socket.on('ultrasonicData', (data) => {
      setDistance(data.distance);
    });

    return () => {
      socket.off('ultrasonicData');
    };
  }, []);

  return (
    <div className="stats-grid">
      <div className="stats-box">
        <h2>Battery:</h2>
        <span>85%</span>
      </div>
      <div className="stats-box">
        <h2>Speed:</h2>
        <span>2.4 m/s</span>
      </div>
      <div className="stats-box">
        <h2>Inclination:</h2>
        <span>15°</span>
      </div>
      <div className="stats-box">
        <h2>Distance to Obstacle:</h2>
        <span>Distance: {distance} cm</span>
      </div>
    </div>
  );
};

export default StatsDisplay;
