import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Team.css';
import { playerUnits } from './data/playerUnits';

// Example data for teams - this would come from a database or state management in a real app
const exampleTeams = [
  { id: 1, name: 'The Arcane Wardens', units: ['varen', 'emberhowl', 'silkfang'] },
  { id: 2, name: 'Blades of the Fallen', units: ['silkfangAlpha', 'silkfangHunter'] },
  { id: 3, name: 'Shadow Stalkers', units: ['silkfangTwin', 'silkfangScout'] },
];

function Team() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();

  // Convert playerUnits object to an array for easier rendering
  const unitsList = Object.values(playerUnits);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleTeamClick = (teamId) => {
    setSelectedTeam(teamId);
  };

  // Filter units based on the search term
  const filteredUnits = unitsList.filter((unit) => {
    return unit.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="team-builder-container">
      {/* Left Sidebar - Teams */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Teams</h2>
        <p className="sidebar-description">Select a team to view or edit</p>
        
        <div className="teams-list">
          {exampleTeams.map((team) => (
            <div 
              key={team.id} 
              className={`team-name ${selectedTeam === team.id ? 'selected' : ''}`}
              onClick={() => handleTeamClick(team.id)}
            >
              <h3>{team.name}</h3>
              <p className="team-unit-count">{team.units.length} units</p>
            </div>
          ))}
        </div>
        
        <button className="create-team-button">
          + Create New Team
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header Bar */}
        <header className="header-bar">
          <button 
            className="back-button" 
            onClick={handleBackClick}
          >
            Back
          </button>
          
          <h1>Unit Selection</h1>
          
          <div className="search-box">
            <input
              type="text"
              placeholder="Search units..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="filter-button">
              Filter
            </button>
          </div>
        </header>

        {/* Units Grid */}
        <div className="cards-grid">
          {filteredUnits.map((unit) => (
            <div key={unit.id} className="card unit-card">
              <h3 className="unit-name">{unit.name}</h3>
              <img 
                src={unit.image} 
                alt={unit.name} 
                className="unit-image" 
              />
              
              <div className="unit-ability">
                <div className="ability-header">
                  <span className="ability-icon">{unit.ability.icon}</span>
                  <span className="ability-name">{unit.ability.name}</span>
                </div>
              </div>
              
              <div className="unit-stats">
                <span className="stat">
                  <span className="stat-icon">❤️</span>
                  {unit.maxHP}/{unit.maxHP}
                </span>
                <span className="stat">
                  <span className="stat-icon">⚔️</span>
                  {unit.damage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Team;
