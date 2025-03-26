import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './GridCombat.css';

const GridCombat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract level data from location state
  const gameMode = location.state?.gameMode;
  const level = location.state?.level;

  const handleBackClick = () => {
    // Navigate back to campaign menu
    navigate('/campaign');
  };

  return (
    <div className="grid-combat-container">
      <button className="back-button" onClick={handleBackClick}>
        Back to Campaign
      </button>
      
      <div className="grid-placeholder">
        <h1>Grid Combat Mode</h1>
        <p>This is a placeholder for the grid-based combat system.</p>
        <p>Level: {level?.title || 'Unknown'}</p>
        <p>Game Mode: {gameMode || 'Unknown'}</p>
        <p>Implementation coming soon!</p>
      </div>
    </div>
  );
};

export default GridCombat;