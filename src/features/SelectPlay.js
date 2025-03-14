import React, { useState } from 'react';
import { useTeams } from '../TeamContext';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/globals.css';
import './SelectPlay.css'; // We'll create this file next

const SelectPlay = () => {
  const [gameMode, setGameMode] = useState('campaign'); // Default to campaign
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const { teams } = useTeams();
  const navigate = useNavigate();

  // Set the first team as selected by default if teams are available
  React.useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  const handleBeginGame = () => {
    if (!selectedTeamId) {
      alert('Please select a team to continue');
      return;
    }
    
    // Here you would navigate to the appropriate battle page with the selected team and game mode
    // For now, we'll just navigate to a placeholder route
    navigate('/battlefield', { 
      state: { 
        gameMode: gameMode, 
        teamId: selectedTeamId 
      } 
    });
    
    console.log(`Starting ${gameMode} mode with team ID: ${selectedTeamId}`);
  };

  return (
    <div className="select-play-container">
      <h1>Select Game Mode</h1>
      
      <div className="game-mode-selection">
        <div 
          className={`game-mode-card ${gameMode === 'campaign' ? 'selected' : ''}`}
          onClick={() => setGameMode('campaign')}
        >
          <h2>Campaign</h2>
          <p>Follow the story and defeat enemies to progress through the campaign.</p>
        </div>
        
        <div 
          className={`game-mode-card ${gameMode === 'adventure' ? 'selected' : ''}`}
          onClick={() => setGameMode('adventure')}
        >
          <h2>Adventure</h2>
          <p>Explore random encounters and challenges across the realm.</p>
        </div>
      </div>
      
      <div className="team-selection-container">
        <h2>Select Your Team</h2>
        
        {teams.length === 0 ? (
          <p className="no-teams-message">
            You haven't created any teams yet. Visit the Team Editor to create one.
          </p>
        ) : (
          <div className="team-list">
            {teams.map(team => (
              <div 
                key={team.id} 
                className={`team-card ${selectedTeamId === team.id ? 'selected' : ''}`}
                onClick={() => setSelectedTeamId(team.id)}
              >
                <h3>{team.name}</h3>
                <p>{team.units.length} Units</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button 
        className="begin-button" 
        onClick={handleBeginGame}
        disabled={!selectedTeamId}
      >
        Begin
      </button>
    </div>
  );
};

export default SelectPlay;