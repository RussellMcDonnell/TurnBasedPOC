import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Team.css';
import { playerUnits } from '../../data/playerUnits';
import { useTeams } from './TeamContext';
import UnitCard from '../../components/unit-card/UnitCard';

function TeamEditor() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const { teams, addTeam, updateTeam } = useTeams();
  
  // Convert playerUnits object to an array for easier rendering
  const availableUnits = Object.values(playerUnits);
  
  // State for the current team being edited
  const [teamName, setTeamName] = useState('');
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewTeam, setIsNewTeam] = useState(false);
  
  // Initialize team data based on teamId param
  useEffect(() => {
    if (teamId === 'new') {
      setIsNewTeam(true);
      setTeamName('New Team');
      setSelectedUnits([]);
    } else {
      const teamIdNum = parseInt(teamId, 10);
      const team = teams.find(t => t.id === teamIdNum);
      
      if (team) {
        setTeamName(team.name);
        // Convert unit IDs to actual unit objects
        const units = team.units.map(unitId => playerUnits[unitId]).filter(Boolean);
        setSelectedUnits(units);
      } else {
        // Handle case where team is not found
        navigate('/team');
      }
    }
  }, [teamId, teams, navigate]);
  
  const handleBackClick = () => {
    navigate('/team');
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Filter units based on search term
  const filteredUnits = availableUnits.filter(unit => {
    const nameMatch = unit.name.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = unit.role?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || roleMatch;
  });
  
  const handleUnitClick = (unit) => {
    // Check if the unit is already in the selected units
    const isAlreadySelected = selectedUnits.some(u => u.id === unit.id);
    
    if (isAlreadySelected) {
      // Remove the unit if it's already selected
      setSelectedUnits(selectedUnits.filter(u => u.id !== unit.id));
    } else {
      // Add the unit to selected units if not already selected and not exceeding max team size
      if (selectedUnits.length < 5) {
        setSelectedUnits([...selectedUnits, unit]);
      } else {
        alert('Maximum team size is 5 units');
      }
    }
  };
  
  const handleRemoveUnit = (unitId) => {
    setSelectedUnits(selectedUnits.filter(unit => unit.id !== unitId));
  };
  
  const handleSaveTeam = () => {
    if (!teamName.trim()) {
      alert('Please enter a team name');
      return;
    }
    
    if (selectedUnits.length === 0) {
      alert('Please add at least one unit to the team');
      return;
    }
    
    const teamData = {
      name: teamName,
      units: selectedUnits.map(unit => unit.id)
    };
    
    if (isNewTeam) {
      // Add new team
      addTeam(teamData);
    } else {
      // Update existing team
      updateTeam({
        id: parseInt(teamId, 10),
        ...teamData
      });
    }
    
    // Navigate back to the team management page
    navigate('/team');
  };
  
  const handleDragStart = (e, unitIndex) => {
    e.dataTransfer.setData('unitIndex', unitIndex.toString());
  };
  
  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };
  
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('unitIndex'), 10);
    
    if (sourceIndex === targetIndex) return;
    
    // Reorder the units
    const newUnits = [...selectedUnits];
    const [movedUnit] = newUnits.splice(sourceIndex, 1);
    newUnits.splice(targetIndex, 0, movedUnit);
    
    setSelectedUnits(newUnits);
  };
  
  return (
    <div className="team-builder-container">
      {/* Header */}
      <header className="team-header">
        <button 
          className="back-button" 
          onClick={handleBackClick}
        >
          Back to Teams
        </button>
        <h1>{isNewTeam ? 'Create New Team' : 'Edit Team'}</h1>
      </header>
      
      <div className="unit-selection-area">
        {/* Search and filter */}
        <div className="header-bar">
          <h2>Select Units</h2>
          
          <div className="search-box">
            <input
              type="text"
              placeholder="Search units by name or role..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {/* Units Grid */}
        <div className="cards-grid">
          {filteredUnits.map((unit) => (
            <div 
              key={unit.id} 
              className={`unit-container ${selectedUnits.some(u => u.id === unit.id) ? 'selected' : ''}`}
              onClick={() => handleUnitClick(unit)}
            >
              <UnitCard 
                unit={{...unit, hp: unit.maxHP}} 
                className="unit-card" 
              />
            </div>
          ))}
        </div>
        
        {/* Current Team Panel */}
        <div className="current-team-panel">
          <div className="current-team-header">
            <div className="team-name-section">
              <input
                type="text"
                className="team-name-input"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name..."
                maxLength={30}
              />
              <span className="team-size-indicator">
                {selectedUnits.length}/5 units
              </span>
            </div>
            
            <div className="team-actions-buttons">
              <button 
                className="back-button" 
                onClick={handleBackClick}
              >
                Cancel
              </button>
              <button 
                className="edit-team-button" 
                onClick={handleSaveTeam}
                disabled={!teamName.trim() || selectedUnits.length === 0}
              >
                Save Team
              </button>
            </div>
          </div>
          
          <div className="current-team-units">
            {/* Display selected units */}
            {selectedUnits.map((unit, index) => (
                <UnitCard 
                  unit={{...unit, hp: unit.maxHP}} 
                  className="unit-card"
                />
            ))}
            
            {/* Empty slots */}
            {Array(Math.max(0, 5 - selectedUnits.length)).fill().map((_, index) => (
              <div 
                key={`empty-${index}`}
                className="team-unit-slot"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, selectedUnits.length + index)}
              >
                Drop a unit here
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamEditor;