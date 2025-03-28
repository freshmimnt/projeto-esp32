import "../styles/statsDisplay.css";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

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
        <span>Distance: {distance} cm</span>
      </div>
      <div className="stats-box">
        <h2>Time Taken:</h2>
        <span>1m 20s</span>
      </div>
    </div>
  );
};

export default StatsDisplay;
