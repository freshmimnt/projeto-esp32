import "../styles/statsDisplay.css";
import React, { useState, useEffect } from 'react';
import socket from '../socket';

const StatsDisplay = () => {

  const [distance, setDistance] = useState(null);
  const [battery, setBattery] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [inclination, setInclination] = useState(null);

  useEffect(() => {
    socket.on('vehicleData', (data) => {
      setDistance(data.distance);
      setBattery(data.battery);
      setSpeed(data.speed);
      setInclination(data.inclination);
    });

    return () => {
      socket.off('vehicleData');
    };
  }, []);

  return (
    <div className="stats-grid">
      <div className="stats-box">
        <h2>Distance Travelled:</h2>
        <span>0.5 cm</span>
      </div>
      <div className="stats-box">
        <h2>Battery:</h2>
        <span>{battery} %</span>
      </div>
      <div className="stats-box">
        <h2>Speed:</h2>
        <span>{speed} m/s</span>
      </div>
      <div className="stats-box">
        <h2>Inclination:</h2>
        <span>{inclination} °</span>
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
