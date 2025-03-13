import React, { createContext, useState, useContext, useEffect } from 'react';

// Initial default teams data - used only if localStorage is empty
const defaultTeams = [
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
  // Initialize state from localStorage or fallback to default teams
  const [teams, setTeams] = useState(() => {
    const storedTeams = localStorage.getItem('teams');
    return storedTeams ? JSON.parse(storedTeams) : defaultTeams;
  });

  // Initialize nextId by finding the highest existing ID + 1
  const [nextId, setNextId] = useState(() => {
    const storedNextId = localStorage.getItem('nextTeamId');
    if (storedNextId) {
      return parseInt(storedNextId, 10);
    }
    // Calculate from existing teams
    const maxId = teams.reduce((max, team) => Math.max(max, team.id), 0);
    return maxId + 1;
  });

  // Save teams to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  // Save nextId to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nextTeamId', nextId.toString());
  }, [nextId]);

  // Add a new team
  const addTeam = (team) => {
    const newTeam = {
      ...team,
      id: nextId
    };
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    setNextId(nextId + 1);
    return newTeam;
  };

  // Update an existing team
  const updateTeam = (team) => {
    const updatedTeams = teams.map(t => t.id === team.id ? team : t);
    setTeams(updatedTeams);
    return team;
  };

  // Delete a team
  const deleteTeam = (teamId) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  // Get a team by ID
  const getTeam = (teamId) => {
    return teams.find(team => team.id === parseInt(teamId, 10));
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