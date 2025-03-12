import React, { useState } from 'react';
import './Team.css'; // Assuming you will create a CSS file for styling

function Team({ teams = [], units = [], onSearch, onCreateTeam }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleSearch = (searchTerm) => {
    // Implement search functionality here
  };

  const handleCreateTeam = () => {
    // Implement create team functionality here
  };

  return (
    <div className="team-page">
      <div className="top-section">
        <input
          type="text"
          placeholder="Search units..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <button className="filter-button">Filter</button>
      </div>
      <div className="left-sidebar">
        <div className="team-list">
          {teams.map((team) => (
            <div key={team.id} className="team-item">
              {team.name}
            </div>
          ))}
        </div>
        <button className="create-team-button" onClick={onCreateTeam}>
          Create New Team
        </button>
      </div>
      <div className="main-content">
        <div className="unit-list">
          {units.map((unit) => (
            <div key={unit.id} className="unit-card">
              <img src={unit.image} alt={unit.name} className="unit-image" />
              <div className="unit-details">
                <h3>{unit.name}</h3>
                <p>{unit.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Team;