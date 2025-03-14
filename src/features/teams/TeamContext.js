import React, { createContext, useState, useContext, useEffect } from 'react';

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
    return storedTeams ? JSON.parse(storedTeams) : [];
  });

  // Initialize campaign team from localStorage or null
  const [campaignTeam, setCampaignTeam] = useState(() => {
    const storedCampaignTeam = localStorage.getItem('campaignTeam');
    return storedCampaignTeam ? JSON.parse(storedCampaignTeam) : null;
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

  // Save campaign team to localStorage whenever it changes
  useEffect(() => {
    if (campaignTeam) {
      localStorage.setItem('campaignTeam', JSON.stringify(campaignTeam));
    } else {
      localStorage.removeItem('campaignTeam');
    }
  }, [campaignTeam]);

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

  // Set a team as the active campaign team
  const setActiveCampaignTeam = (teamId) => {
    const team = getTeam(teamId);
    if (team) {
      // Create a deep copy to avoid reference issues
      const campaignCopy = JSON.parse(JSON.stringify(team));
      // Add campaign-specific properties if they don't exist
      if (!campaignCopy.campaignStats) {
        campaignCopy.campaignStats = {
          currentLevel: 1,
          levelsCompleted: 0,
          currentHealth: {} // Map unit IDs to their current health
        };
        
        // Initialize health for all units in the team
        if (campaignCopy.units) {
          campaignCopy.units.forEach(unit => {
            campaignCopy.campaignStats.currentHealth[unit.id] = unit.maxHealth || 100;
          });
        }
      }
      setCampaignTeam(campaignCopy);
      return campaignCopy;
    }
    return null;
  };

  // Get the active campaign team
  const getActiveCampaignTeam = () => {
    return campaignTeam;
  };

  // Update campaign team stats (e.g., after a battle)
  const updateCampaignTeamStats = (updatedStats) => {
    if (campaignTeam) {
      const updatedTeam = {
        ...campaignTeam,
        campaignStats: {
          ...campaignTeam.campaignStats,
          ...updatedStats
        }
      };
      setCampaignTeam(updatedTeam);
      return updatedTeam;
    }
    return null;
  };

  // Update a specific unit's health in the campaign team
  const updateCampaignUnitHealth = (unitId, newHealth) => {
    if (campaignTeam && campaignTeam.campaignStats) {
      const updatedTeam = {
        ...campaignTeam,
        campaignStats: {
          ...campaignTeam.campaignStats,
          currentHealth: {
            ...campaignTeam.campaignStats.currentHealth,
            [unitId]: newHealth
          }
        }
      };
      setCampaignTeam(updatedTeam);
      return updatedTeam;
    }
    return null;
  };

  // Clear the campaign team (e.g., when campaign ends or player resets)
  const clearCampaignTeam = () => {
    setCampaignTeam(null);
  };

  // Create a value object that will be provided to consumers
  const value = {
    teams,
    addTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    campaignTeam,
    setActiveCampaignTeam,
    getActiveCampaignTeam,
    updateCampaignTeamStats,
    updateCampaignUnitHealth,
    clearCampaignTeam
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};