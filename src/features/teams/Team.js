import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Team.css';
import { getPlayerUnits } from '../../data/units';
import { useTeams } from './TeamContext';
import UnitCard from '../../components/unit-card/UnitCard';

function Team() {
  const { teams, deleteTeam } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  const handleTeamClick = (teamId) => {
    setSelectedTeamId(teamId);
  };

  const handleEditTeam = (teamId) => {
    navigate(`/team-editor/${teamId}`);
  };

  const handleCreateTeam = () => {
    navigate('/team-editor/new');
  };

  const handleDeleteTeam = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      deleteTeam(teamId);
      if (selectedTeamId === teamId) {
        setSelectedTeamId(null);
      }
    }
  };

  // Get the actual unit objects for the selected team's units
  const selectedTeam = teams.find(team => team.id === selectedTeamId);
  const playerUnits = getPlayerUnits();
  const teamUnits = selectedTeam 
    ? selectedTeam.units
        .map(unitId => playerUnits.find(unit => unit.id === unitId))
        .filter(Boolean)
    : [];

  return (
    <div className="team-management-container">
      {/* Header Bar */}
      <header className="team-header">
        <button 
          className="back-button" 
          onClick={handleBackClick}
        >
          Back to Main Menu
        </button>
        <h1>Team Management</h1>
      </header>
      
      <div className="team-content">
        {/* Left Sidebar - Teams List */}
        <aside className="teams-sidebar">
          <h2 className="sidebar-title">Your Teams</h2>
          <p className="sidebar-description">Select a team to view details</p>
          
          <div className="teams-list">
            {teams.map((team) => (
              <div 
                key={team.id} 
                className={`team-item ${selectedTeamId === team.id ? 'selected' : ''}`}
                onClick={() => handleTeamClick(team.id)}
              >
                <h3 className="team-item-name">{team.name}</h3>
                <p className="team-unit-count">{team.units.length} units</p>
              </div>
            ))}
          </div>
          
          <button 
            className="create-team-button"
            onClick={handleCreateTeam}
          >
            + Create New Team
          </button>
        </aside>

        {/* Main Content - Team Details */}
        <main className="team-details">
          {selectedTeam ? (
            <>
              <div className="team-details-header">
                <h2>{selectedTeam.name}</h2>
                <div className="team-actions-buttons">
                  <button 
                    className="edit-team-button"
                    onClick={() => handleEditTeam(selectedTeam.id)}
                  >
                    Edit Team
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => handleDeleteTeam(selectedTeam.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="team-preview">
                <div className="team-units-grid">
                  {teamUnits.map((unit) => (
                      <UnitCard 
                        unit={{...unit, hp: unit.maxHP}} 
                        className="unit-card"
                      />
                  ))}
                  
                  {teamUnits.length === 0 && (
                    <div className="empty-team-message">
                      <p>This team has no units yet</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="no-team-selected">
              <p>Select a team from the list or create a new one</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Team;
