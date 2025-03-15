import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Team.css';
import { getPlayerUnits } from '../../data/units';
import { useTeams } from './TeamContext';
import UnitCard from '../../components/unit-card/UnitCard';
import teamEditorBackground from '../../assets/images/team-editor-full-art.jpg';

function Team() {
  const { teams, deleteTeam } = useTeams();
  const navigate = useNavigate();
  const playerUnits = getPlayerUnits();

  const handleBackClick = () => {
    navigate('/');
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
    }
  };

  return (
    <div className="team-management-container"
      style={{
        backgroundImage: `url(${teamEditorBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
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

      {/* Teams List */}
      <div className="teams-list-container">

        {/* Display all teams with their details */}
        <div className="teams-all-view">
          {teams.map((team) => {
            // Get the actual unit objects for the team's units
            const teamUnits = team.units
              .map(unitId => playerUnits.find(unit => unit.id === unitId))
              .filter(Boolean);

            return (
              <div key={team.id} className="team-block">
                <div className="team-block-header">
                  <h3 className="team-block-name">{team.name}</h3>
                  <div className="team-actions-buttons">
                    <button
                      className="edit-team-button"
                      onClick={() => handleEditTeam(team.id)}
                    >
                      Edit Team
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="team-preview">
                  <div className="team-units-grid">
                    {teamUnits.map((unit, index) => (
                      <UnitCard
                        key={`unit-${unit.id}-${index}`}
                        unit={{ ...unit, hp: unit.maxHP }}
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
              </div>
            );
          })}
        </div>

        {/* Create New Team button at the bottom with old style */}
        <button
          className="create-team-button"
          onClick={handleCreateTeam}
        >
          + Create New Team
        </button>
      </div>
    </div>
  );
}

export default Team;
