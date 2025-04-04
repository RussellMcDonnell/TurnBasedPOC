import React, { useState } from 'react';
import { useTeams } from '../teams/TeamContext';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/globals.css';
import './SelectPlay.css'; // We'll create this file next

const SelectPlay = () => {
  const [gameMode, setGameMode] = useState('campaign'); // Default to campaign
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const { teams, setActiveCampaignTeam } = useTeams();
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

    if (gameMode === 'campaign') {
      // Save the selected team as the active campaign team using context function
      const activeCampaignTeam = setActiveCampaignTeam(selectedTeamId);
      
      if (!activeCampaignTeam) {
        alert('Failed to set active campaign team. Please try again.');
        return;
      }
      
      navigate('/campaign', { 
        state: { 
          teamId: selectedTeamId 
        } 
      });
    } else {
      navigate('/battlefield', { 
        state: { 
          gameMode: gameMode, 
          teamId: selectedTeamId 
        } 
      });
    }
    
    console.log(`Starting ${gameMode} mode with team ID: ${selectedTeamId}`);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="select-play-container">
      <button className="back-button" onClick={handleBackClick}>
        Back to Main Menu
      </button>
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
          className={`game-mode-card locked ${gameMode === 'adventure' ? 'selected' : ''}`}
          onClick={() => alert('Complete the Campaign mode to unlock Adventure mode!')}
        >
          <h2>Adventure 🔒</h2>
          <p>Explore random encounters and challenges across the realm.</p>
          <div className="locked-overlay">Complete Campaign to Unlock</div>
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