import React, { createContext, useState, useContext } from 'react';

// Initial teams data
const initialTeams = [
  { id: 1, name: 'The Arcane Wardens', units: ['varen', 'emberhowl', 'silkfang'] },
  { id: 2, name: 'Blades of the Fallen', units: ['silkfangAlpha', 'silkfangHunter'] },
  { id: 3, name: 'Shadow Stalkers', units: ['silkfangTwin', 'silkfangScout'] },
];

// Create the context
export const TeamContext = createContext();

// Custom hook to use the team context
export const useTeams = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeams must be used within a TeamProvider');
  }
  return context;
};

// Provider component
export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState(initialTeams);
  const [nextId, setNextId] = useState(4); // For generating new team IDs

  // Add a new team
  const addTeam = (team) => {
    const newTeam = {
      ...team,
      id: nextId
    };
    setTeams([...teams, newTeam]);
    setNextId(nextId + 1);
    return newTeam;
  };

  // Update an existing team
  const updateTeam = (team) => {
    setTeams(teams.map(t => t.id === team.id ? team : t));
    return team;
  };

  // Delete a team
  const deleteTeam = (teamId) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  // Get a team by ID
  const getTeam = (teamId) => {
    return teams.find(team => team.id === teamId);
  };

  // Create a value object that will be provided to consumers
  const value = {
    teams,
    addTeam,
    updateTeam,
    deleteTeam,
    getTeam
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};