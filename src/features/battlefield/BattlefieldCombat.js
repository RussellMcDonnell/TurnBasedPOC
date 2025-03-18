import React, { useState, useEffect, useRef } from "react";
import { useTeams } from "../../features/teams/TeamContext";
import { useLocation } from "react-router-dom";
import "../../App.css";
import Sidebar from "../../components/sidebar/Sidebar";
import UnitCard from "../../components/unit-card/UnitCard";
import DeveloperPanel from "./DeveloperPanel";
import GameMenu from "./GameMenu";
import Settings from "./Settings";
import { getUnitById, enemyTeams } from "../../data/units";

// Import default background image for non-campaign modes
import dragonsLairBg from "../../assets/images/battlegrounds/dragons-lair.png";

function BattlefieldCombat() {
  // Get location and campaign level data if coming from campaign
  const location = useLocation();
  const levelData = location.state;
  const isCampaignMode = levelData?.gameMode === 'campaign';
  
  // Get background image from campaign data or use default
  const backgroundImage = levelData.level?.battlegroundBackground 
    ? levelData.level.battlegroundBackground 
    : dragonsLairBg;
  
  // Add team context hook
  const { getActiveCampaignTeam } = useTeams();
  const [isInGame, setIsInGame] = useState(false);
  
  // Initialize enemy team based on campaign data or default
  const [selectedEnemyTeam, setSelectedEnemyTeam] = useState(() => {
    if (isCampaignMode && levelData.level && levelData.level.enemyTeam) {
      return levelData.level.enemyTeam;
    }
    return "Basic Enemies";
  });

  // Add game settings state
  const [gameSettings, setGameSettings] = useState({
    enableRetaliation: false,
  });

  // Add settings dialog state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Add new state for animation
  const [animatingUnitId, setAnimatingUnitId] = useState(null);
  const [damagedUnitId, setDamagedUnitId] = useState(null);

  // Add state for blizzard animation
  const [blizzardActive, setBlizzardActive] = useState(false);
  const [iceParticles, setIceParticles] = useState([]);

  const [selectedPlayerUnit, setSelectedPlayerUnit] = useState(null);
  const [selectedEnemyUnit, setSelectedEnemyUnit] = useState(null);
  const [attackingUnit, setAttackingUnit] = useState(null);
  const [currentlyAttacking, setCurrentlyAttacking] = useState(null);

  // Add new state for viewing full art
  const [viewingFullArt, setViewingFullArt] = useState(null);

  // Add new state for ability usage
  const [usingAbility, setUsingAbility] = useState(false);
  const [animatingAbility, setAnimatingAbility] = useState(false);

  // Add new state for action history log
  const [actionLog, setActionLog] = useState([]);

  // Helper function to prepare units for the game state
  const prepareUnits = (units) => {
    // First, map units to fetch player unit details
    units = units.map(unit => getUnitById(unit));

    // Track how many instances of each unit ID we've seen to create unique IDs
    const unitCounts = {};

    return units.map(unit => {
      // Generate a unique ID for all units
      if (!unitCounts[unit.id]) {
        unitCounts[unit.id] = 0;
      }
      unitCounts[unit.id]++;

      // Create a unique instance ID that includes the count for all units
      const uniqueId = `${unit.id}-${unitCounts[unit.id]}`;

      return {
        ...unit,
        instanceId: uniqueId, // Store the unique instance ID
        acted: false,
        isDead: false,
        hp: unit.maxHP,
        statusEffects: [],
        ability: unit.ability ? {
          ...unit.ability,
          currentCooldown: 0
        } : null
      };
    });
  };

  // Initialize player units from campaign team
  const [playerUnits, setPlayerUnits] = useState(() => {
    const campaignTeam = getActiveCampaignTeam();
    return prepareUnits(campaignTeam ? campaignTeam.units : []);
  });

  // Initialize enemy units based on selectedEnemyTeam
  const [enemyUnits, setEnemyUnits] = useState(() => {
    // Check if the enemy team exists in enemyTeams
    if (enemyTeams[selectedEnemyTeam]) {
      return prepareUnits(enemyTeams[selectedEnemyTeam]);
    } else {
      // Fallback to a default enemy team
      console.warn(`Enemy team "${selectedEnemyTeam}" not found, using a default team`);
      return prepareUnits(enemyTeams["Forest Guardians"]);
    }
  });

  // Track whose turn it is: "player" or "enemy"
  const [activeTeam, setActiveTeam] = useState("player");

  // For the very first turn, the player only gets 1 action.
  // We'll track that with a boolean.
  const [firstTurnUsed, setFirstTurnUsed] = useState(false);

  // Track if the game is over
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Add ref for auto-scrolling the log
  const logScrollRef = useRef(null);

  // Store the full game state in a single object
  const [gameState, setGameState] = useState({
    playerUnits,
    enemyUnits,
    activeTeam: "player",
    firstTurnUsed: false,
    gameOver: false,
    winner: null,
    selectedEnemyTeam
  });

  // Add campaign info to action log when starting a battle
  useEffect(() => {
    if (isCampaignMode && levelData.level) {
      const level = levelData.level;
      addToActionLog({
        text: `Beginning ${level.title} - ${level.difficulty} Difficulty`,
        type: "campaign"
      });
      
      addToActionLog({
        text: `Enemy Team: ${level.enemyTeam}`,
        type: "normal"
      });
    }
  }, []);

  // Effect to update player units when campaign team changes
  useEffect(() => {
    const campaignTeam = getActiveCampaignTeam();
    if (campaignTeam) {
      setPlayerUnits(prepareUnits(campaignTeam.units));
    }
  }, [getActiveCampaignTeam]);

  // Effect to update enemy units when enemy team changes
  useEffect(() => {
    if (enemyTeams[selectedEnemyTeam]) {
      setEnemyUnits(prepareUnits(enemyTeams[selectedEnemyTeam]));
    }
  }, [selectedEnemyTeam]);

  // Function to change enemy teams
  const handleEnemyTeamChange = (teamName) => {
    if (enemyTeams[teamName]) {
      setSelectedEnemyTeam(teamName);
    }
  };

  // Modified function to add an entry to the action log with structured format
  const addToActionLog = (entry) => {
    const timestamp = new Date().toLocaleTimeString();

    // Add timestamp to all log entries
    if (typeof entry === 'string') {
      // Simple turn markers or text-only logs
      setActionLog(prev => [...prev, {
        text: entry,
        time: timestamp,
        type: entry.includes("turn ends") ? "turn-end" :
          entry.includes("turn begins") ? "turn-start" : "normal"
      }]);
    } else {
      // Entry is already an object with appropriate format
      setActionLog(prev => [...prev, {
        ...entry,
        time: timestamp
      }]);
    }

    // Scroll to bottom of log when new entries are added
    setTimeout(() => {
      if (logScrollRef.current) {
        logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
      }
    }, 100);
  };

  // Update gameState whenever relevant pieces change
  useEffect(() => {
    setGameState({
      playerUnits,
      enemyUnits,
      activeTeam,
      firstTurnUsed,
      gameOver,
      winner,
      selectedEnemyTeam
    });
  }, [playerUnits, enemyUnits, activeTeam, firstTurnUsed, gameOver, winner, selectedEnemyTeam]);

  // Handle imported game state
  const handleImportGameState = (importedState) => {
    try {
      // Set team selections if present
      if (importedState.selectedEnemyTeam) setSelectedEnemyTeam(importedState.selectedEnemyTeam);

      // Set all the game state from imported data
      if (importedState.playerUnits) setPlayerUnits(importedState.playerUnits);
      if (importedState.enemyUnits) setEnemyUnits(importedState.enemyUnits);
      if (importedState.activeTeam) setActiveTeam(importedState.activeTeam);
      if (importedState.firstTurnUsed !== undefined) setFirstTurnUsed(importedState.firstTurnUsed);
      if (importedState.gameOver !== undefined) setGameOver(importedState.gameOver);
      if (importedState.winner !== undefined) setWinner(importedState.winner);

      // Reset UI states
      setSelectedPlayerUnit(null);
      setSelectedEnemyUnit(null);
      setAttackingUnit(null);
      setUsingAbility(false);

      addToActionLog({
        text: `Game state imported successfully`,
        type: "normal"
      });
    } catch (error) {
      addToActionLog({
        text: `Error importing game state: ${error.message}`,
        type: "error"
      });
      console.error("Error importing game state:", error);
    }
  };

  // Handle game setting changes
  const handleSettingsChange = (setting, value) => {
    setGameSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    addToActionLog({
      text: `Game setting changed: ${setting} = ${value}`,
      type: "normal"
    });
  };

  // Support returning to main menu
  const handleSurrender = () => {
    setGameOver(true);
    setWinner("enemy");
    addToActionLog({
      text: "You have surrendered the battle!",
      type: "defeat"
    });

    // Return to main menu after a delay
    setTimeout(() => {
      setIsInGame(false);
    }, 2000);
  };

  // This effect checks after every action if someone won.
  useEffect(() => {
    checkVictoryCondition();
  }, [playerUnits, enemyUnits]);

  // Check if all enemies or all players are defeated
  function checkVictoryCondition() {
    const allEnemiesDead = enemyUnits.every((unit) => unit.isDead);
    const allPlayersDead = playerUnits.every((unit) => unit.isDead);

    if (allEnemiesDead && !gameOver) {
      setGameOver(true);
      setWinner("player");
      addToActionLog({
        text: "Victory! All enemies have been defeated!",
        type: "victory"
      });
    } else if (allPlayersDead && !gameOver) {
      setGameOver(true);
      setWinner("enemy");
      addToActionLog({
        text: "Defeat! Your party has been wiped out!",
        type: "defeat"
      });
    }
  }

  // Function to apply retaliation damage
  function applyRetaliationDamage(attacker, target, attackerTeam) {
    if (!gameSettings.enableRetaliation || target.isDead) return;

    // Add retaliation to action log
    addToActionLog({
      unit: target.name,
      type: "retaliation",
      targets: [{
        unit: attacker.name,
        Damage: target.damage.toString()
      }]
    });

    // Apply retaliation damage after a delay
    setTimeout(() => {
      if (attackerTeam === "player") {
        // Apply damage to player unit
        setPlayerUnits(prev =>
          prev.map(unit => {
            if (unit.instanceId === attacker.instanceId || unit.id === attacker.id) {
              const newHP = unit.hp - target.damage;

              if (newHP <= 0) {
                addToActionLog({
                  text: `${unit.name} is defeated by retaliation!`,
                  type: "defeat"
                });
              }

              return {
                ...unit,
                hp: Math.max(0, newHP),
                isDead: newHP <= 0
              };
            }
            return unit;
          })
        );
      } else {
        // Apply damage to enemy unit
        setEnemyUnits(prev =>
          prev.map(unit => {
            if (unit.instanceId === attacker.instanceId || unit.id === attacker.id) {
              const newHP = unit.hp - target.damage;

              if (newHP <= 0) {
                addToActionLog({
                  text: `${unit.name} is defeated by retaliation!`,
                  type: "defeat"
                });
              }

              return {
                ...unit,
                hp: Math.max(0, newHP),
                isDead: newHP <= 0
              };
            }
            return unit;
          })
        );
      }
    }, 750); // Apply retaliation damage after the main attack animation completes
  }

  // Check if all player units have acted and end turn automatically
  useEffect(() => {
    if (activeTeam === "player" && !gameOver && firstTurnUsed) {
      // Check if all alive player units have acted
      const allActed = playerUnits
        .filter(unit => !unit.isDead)
        .every(unit => unit.acted);

      if (allActed && playerUnits.some(unit => !unit.isDead)) {
        // All alive units have acted, end the player's turn
        setTimeout(() => {
          endPlayerTurn();
        }, 500);
      }
    }
  }, [playerUnits, activeTeam, gameOver, firstTurnUsed]);

  // Function to handle basic attack
  function handleBasicAttack(attackerTeam, attackerId, targetId) {
    if (gameOver) return;

    if (attackerTeam === "player") {
      const attacker = playerUnits.find((u) => u.instanceId === attackerId || u.id === attackerId);
      if (!attacker || attacker.acted || attacker.isDead) return;

      const target = enemyUnits.find((u) => u.instanceId === targetId || u.id === targetId);
      if (!target) return;

      // Add to action log with new format
      addToActionLog({
        unit: attacker.name,
        type: "attack",
        targets: [{
          unit: target.name,
          Damage: attacker.damage.toString()
        }]
      });

      // Clear any existing animations
      setAnimatingUnitId(null);
      setDamagedUnitId(null);

      // Start attack animation immediately
      setAnimatingUnitId(attacker.instanceId || attacker.id);

      // Apply damage after animation starts
      setTimeout(() => {
        setDamagedUnitId(target.instanceId || target.id);
        setEnemyUnits((prev) =>
          prev.map((unit) => {
            // Important fix: only compare instanceId, not the original id
            if (unit.instanceId === target.instanceId && !unit.isDead) {
              const newHP = unit.hp - attacker.damage;

              if (newHP <= 0) {
                addToActionLog({
                  text: `${unit.name} is defeated!`,
                  type: "defeat"
                });
              }

              return {
                ...unit,
                hp: newHP,
                isDead: newHP <= 0,
              };
            }
            return unit;
          })
        );

        // Process retaliation if enabled
        if (gameSettings.enableRetaliation && !target.isDead) {
          // Apply retaliation damage from target to attacker
          applyRetaliationDamage(attacker, target, attackerTeam);
        }

        // Clear animations after damage
        setTimeout(() => {
          setAnimatingUnitId(null);
          setDamagedUnitId(null);
        }, 500);
      }, 250);

      setPlayerUnits((prev) =>
        prev.map((u) => ((u.instanceId === attacker.instanceId) ? { ...u, acted: true } : u))
      );

      if (!firstTurnUsed) {
        setFirstTurnUsed(true);
        endPlayerTurn();
      }
    } else {
      // Enemy attack with similar timing
      const attacker = enemyUnits.find((u) => u.instanceId === attackerId || u.id === attackerId);
      if (!attacker || attacker.acted || attacker.isDead) return;

      const target = playerUnits.find((u) => u.instanceId === targetId || u.id === targetId);
      if (!target) return;

      // Add to action log with new format
      addToActionLog({
        unit: attacker.name,
        type: "attack",
        targets: [{
          unit: target.name,
          Damage: attacker.damage.toString()
        }]
      });

      // Clear any existing animations
      setAnimatingUnitId(null);
      setDamagedUnitId(null);

      // Start attack animation immediately
      setAnimatingUnitId(attacker.instanceId || attacker.id);

      setTimeout(() => {
        setDamagedUnitId(target.instanceId || target.id);
        setPlayerUnits((prev) =>
          prev.map((unit) => {
            // Important fix: only compare instanceId, not the original id
            if (unit.instanceId === target.instanceId && !unit.isDead) {
              const newHP = unit.hp - attacker.damage;

              if (newHP <= 0) {
                addToActionLog({
                  text: `${unit.name} is defeated!`,
                  type: "defeat"
                });
              }

              return {
                ...unit,
                hp: newHP,
                isDead: newHP <= 0,
              };
            }
            return unit;
          })
        );

        // Process retaliation if enabled
        if (gameSettings.enableRetaliation && !target.isDead) {
          // Apply retaliation damage from target to attacker
          applyRetaliationDamage(attacker, target, attackerTeam);
        }

        // Clear animations after damage
        setTimeout(() => {
          setAnimatingUnitId(null);
          setDamagedUnitId(null);
        }, 500);
      }, 250);

      setEnemyUnits((prev) =>
        prev.map((u) => ((u.instanceId === attacker.instanceId) ? { ...u, acted: true } : u))
      );
    }
  }

  // Function to create ice particles for blizzard animation
  const generateIceParticles = () => {
    const particles = [];

    // Create 30 ice particles
    for (let i = 0; i < 30; i++) {
      const isRegularIce = Math.random() > 0.3; // 70% regular ice particles, 30% ice shards
      particles.push({
        id: `ice-${i}`,
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 10}%`, // Start slightly above the element
        animationDuration: `${1 + Math.random() * 3}s`,
        animationDelay: `${Math.random() * 2}s`,
        type: isRegularIce ? 'ice-particle' : 'ice-shard',
      });
    }

    return particles;
  };

  // Activate blizzard animation effect
  const activateBlizzard = () => {
    setBlizzardActive(true);
    setIceParticles(generateIceParticles());

    // End the effect after animation completes
    setTimeout(() => {
      setBlizzardActive(false);
      setIceParticles([]);
    }, 3000); // Match this time with the CSS animation duration
  };

  // New function to handle ability usage
  function handleAbilityUse(unitId) {
    if (gameOver) return;

    const unit = playerUnits.find(u => u.instanceId === unitId || u.id === unitId);
    if (!unit || unit.acted || unit.isDead || unit.ability.currentCooldown > 0) return;

    setAnimatingUnitId(unit.instanceId || unit.id);
    setAnimatingAbility(true);

    // Track if this ability requires targeting
    let requiresTargetSelection = false;

    // Handle specific abilities
    switch (unit.name) {
      case "Varen Stormrune":
        // Create a log entry object for the ability
        const abilityLogEntry = {
          unit: unit.name,
          type: "ability",
          abilityName: unit.ability.name,
          targets: []
        };

        // Activate blizzard animation effect
        activateBlizzard();

        // Blizzard ability - damages all enemies with chance to stun
        setTimeout(() => {
          const aliveEnemies = enemyUnits.filter(enemy => !enemy.isDead);

          // Apply damage to all enemies
          setEnemyUnits(prev =>
            prev.map(enemy => {
              if (enemy.isDead) return enemy;

              const newHP = enemy.hp - unit.damage;
              const isStunned = Math.random() < 0.25; // 25% chance to stun

              // Add target to the ability log entry
              abilityLogEntry.targets.push({
                unit: enemy.name,
                Damage: unit.damage.toString(),
                Status: isStunned ? "Frozen" : "None"
              });

              const newStatusEffects = [...enemy.statusEffects];

              if (isStunned) {
                // Add stunned status effect with consistent typing
                newStatusEffects.push({
                  type: "frozen",
                  name: "Frozen",
                  icon: "❄️",
                  duration: 1
                });
              }

              if (newHP <= 0) {
                addToActionLog({
                  text: `${enemy.name} is defeated!`,
                  type: "defeat"
                });
              }

              return {
                ...enemy,
                hp: newHP,
                isDead: newHP <= 0,
                statusEffects: newStatusEffects
              };
            })
          );

          // Add the complete ability log after processing all effects
          addToActionLog(abilityLogEntry);

          // Set ability on cooldown
          setPlayerUnits(prev =>
            prev.map(u => {
              if (u.instanceId === unitId || u.id === unitId) {
                return {
                  ...u,
                  acted: true,
                  ability: {
                    ...u.ability,
                    currentCooldown: u.ability.maxCooldown
                  }
                };
              }
              return u;
            })
          );

          // Clear animations
          setTimeout(() => {
            setAnimatingUnitId(null);
            setAnimatingAbility(false);
          }, 800);
        }, 500);
        break;

      case "Brom the Bastion":
        // Create a log entry object for the ability
        const ironWallLogEntry = {
          unit: unit.name,
          type: "ability",
          abilityName: unit.ability.name,
          targets: []
        };

        // Set ability mode to allow player to select an enemy target
        requiresTargetSelection = true;
        setUsingAbility(true);
        
        // Add a message to the action log to guide the player
        addToActionLog({
          text: `Select an enemy to stun with ${unit.ability.name}`,
          type: "normal"
        });
        
        // The ability execution will happen when the player clicks an enemy
        break;

      case "Lyra Ashwyn":
        // Create a log entry for Triage Tactics ability
        const triageLogEntry = {
          unit: unit.name,
          type: "ability",
          abilityName: unit.ability.name,
          targets: []
        };

        // Set ability mode to allow player to select an ally target
        requiresTargetSelection = true;
        setUsingAbility(true);
        
        // Add a message to the action log to guide the player
        addToActionLog({
          text: `Select an ally to heal and remove negative status effects`,
          type: "normal"
        });
        
        // The ability execution will happen when the player clicks an ally
        break;

      case "Sylara Starborn":
        // Create a log entry for Shooting Star ability
        const shootingStarLogEntry = {
          unit: unit.name,
          type: "ability",
          abilityName: unit.ability.name,
          targets: []
        };
        
        // For simplicity, choose the first non-dead enemy as the primary target
        // In a complete implementation, this would allow player to choose the target
        const primaryTarget = enemyUnits.find(enemy => !enemy.isDead);
        
        if (primaryTarget) {
          // Find index of primary target to determine adjacent enemies
          const primaryTargetIndex = enemyUnits.findIndex(enemy => enemy.instanceId === primaryTarget.instanceId || enemy.id === primaryTarget.id);
          
          // Get adjacent enemies (ones to the left and right of the primary target)
          // Only include non-dead adjacent enemies
          const adjacentEnemies = [];
          
          // Check enemy to the left
          if (primaryTargetIndex > 0 && !enemyUnits[primaryTargetIndex - 1].isDead) {
            adjacentEnemies.push(enemyUnits[primaryTargetIndex - 1]);
          }
          
          // Check enemy to the right
          if (primaryTargetIndex < enemyUnits.length - 1 && !enemyUnits[primaryTargetIndex + 1].isDead) {
            adjacentEnemies.push(enemyUnits[primaryTargetIndex + 1]);
          }
          
          // All targets (primary + adjacent)
          const allTargets = [primaryTarget, ...adjacentEnemies];
          
          // Visual effect: Create a meteor animation
          const meteorAnimation = () => {
            // This would be more elaborate in a full implementation
            // For now, we'll just set a timeout to simulate the animation
            setTimeout(() => {
              // Update enemy units to apply damage and burn effect
              setEnemyUnits(prev => 
                prev.map(enemy => {
                  // Check if this enemy is one of our targets
                  const isTarget = allTargets.some(target => target.instanceId === enemy.instanceId || target.id === enemy.id);
                  
                  if (isTarget && !enemy.isDead) {
                    // Apply damage equal to the caster's attack
                    const newHP = enemy.hp - unit.damage;
                    
                    // Create a new status effects array
                    const newStatusEffects = [...enemy.statusEffects];
                    
                    // Add burn effect (avoiding duplicates)
                    const hasBurn = newStatusEffects.some(effect => effect.type === "burn");
                    
                    if (!hasBurn) {
                      newStatusEffects.push({
                        type: "burn",
                        name: "Burned",
                        icon: "🔥",
                        duration: 2 // Burn lasts for 2 turns
                      });
                      
                      // Log status effect application
                      addToActionLog({
                        text: `${enemy.name} is now Burned!`,
                        type: "status"
                      });
                    }
                    
                    // Add to ability log
                    shootingStarLogEntry.targets.push({
                      unit: enemy.name,
                      Damage: unit.damage.toString(),
                      Status: "Burned"
                    });
                    
                    // Check if enemy is defeated
                    if (newHP <= 0) {
                      addToActionLog({
                        text: `${enemy.name} is defeated!`,
                        type: "defeat"
                      });
                    }
                    
                    return {
                      ...enemy,
                      hp: Math.max(0, newHP),
                      isDead: newHP <= 0,
                      statusEffects: newStatusEffects
                    };
                  }
                  return enemy;
                })
              );
              
              // Add the complete ability log
              addToActionLog(shootingStarLogEntry);
              
              // Set ability on cooldown
              setPlayerUnits(prev =>
                prev.map(u => {
                  if (u.instanceId === unitId || u.id === unitId) {
                    return {
                      ...u,
                      acted: true,
                      ability: {
                        ...u.ability,
                        currentCooldown: u.ability.maxCooldown
                      }
                    };
                  }
                  return u;
                })
              );
              
              // Clear animations
              setTimeout(() => {
                setAnimatingUnitId(null);
                setAnimatingAbility(false);
              }, 800);
            }, 600);
          };
          
          // Start the meteor animation
          addToActionLog({
            text: `${unit.name} calls down a blazing meteor!`,
            type: "ability"
          });
          
          // Execute animation after a delay
          setTimeout(meteorAnimation, 300);
          
        } else {
          // No valid target
          addToActionLog({
            text: `${unit.name} has no valid target for ${unit.ability.name}`,
            type: "normal"
          });
          
          setAnimatingUnitId(null);
          setAnimatingAbility(false);
        }
        break;

      case "Blood Mage":
        // Create a log entry for Sanguine Pact ability
        const sanguinePactLogEntry = {
          unit: unit.name,
          type: "ability",
          abilityName: unit.ability.name,
          targets: []
        };
        
        // Set ability mode to allow player to select an ally target
        requiresTargetSelection = true;
        setUsingAbility(true);
        
        // Add a message to the action log to guide the player
        addToActionLog({
          text: `Select an ally to empower with blood magic`,
          type: "normal"
        });
        
        // The ability execution will happen when the player clicks an ally
        break;

      default:
        // Generic ability handling
        requiresTargetSelection = true;
        setUsingAbility(true);
    }

    // Set first turn as used if it's the first turn
    if (!firstTurnUsed) {
      
      // Only automatically end turn for abilities that don't require target selection
      if (!requiresTargetSelection) {
        setFirstTurnUsed(true);
        endPlayerTurn();
      }
      // For abilities that need targeting, the turn will end after the target is selected and ability is executed
    }
  }

  // Skip action
  function handleSkip(team, unitId) {
    if (gameOver) return;

    if (team === "player") {
      const unit = playerUnits.find(u => u.instanceId === unitId || u.id === unitId);
      if (!unit) return;

      addToActionLog({
        unit: unit.name,
        type: "skip",
        targets: []
      });

      setPlayerUnits((prev) =>
        prev.map((u) => ((u.instanceId === unitId || u.id === unitId) ? { ...u, acted: true } : u))
      );

      if (!firstTurnUsed) {
        setFirstTurnUsed(true);
        endPlayerTurn();
      }
    } else {
      const unit = enemyUnits.find(u => u.instanceId === unitId || u.id === unitId);
      if (!unit) return;

      addToActionLog({
        unit: unit.name,
        type: "skip",
        targets: []
      });

      setEnemyUnits((prev) =>
        prev.map((u) => ((u.instanceId === unitId || u.id === unitId) ? { ...u, acted: true } : u))
      );
    }
  }

  // After the player has either used all units or (on first turn) done 1 action, switch to enemy
  function endPlayerTurn() {
    addToActionLog("--- Player turn ends ---");
    setActiveTeam("enemy");
    resetActedStatus("player");
    setCurrentlyAttacking(null); // Reset currentlyAttacking state

    // Clear any selected units and attack state when ending turn
    setSelectedPlayerUnit(null);
    setSelectedEnemyUnit(null);
    setAttackingUnit(null);
    setUsingAbility(false);

    // Process cooldowns at turn end
    setPlayerUnits(prev =>
      prev.map(unit => {
        const newCooldown = unit.ability ? Math.max(0, unit.ability.currentCooldown - 1) : 0;
        if (unit.ability && unit.ability.currentCooldown > 0 && newCooldown === 0) {
          addToActionLog({
            text: `${unit.name}'s ${unit.ability.name} is ready!`,
            type: "cooldown"
          });
        }
        return {
          ...unit,
          ability: unit.ability ? {
            ...unit.ability,
            currentCooldown: newCooldown
          } : null
        };
      })
    );

    // Process damage-over-time effects (burn, poison) at turn end for enemies
    setEnemyUnits(prev =>
      prev.map(unit => {
        if (unit.isDead) return unit;
        
        let unitHP = unit.hp;
        const updatedStatusEffects = [...unit.statusEffects];
        const dotEffects = updatedStatusEffects.filter(effect => 
          effect.type === "burn" || effect.type === "poison");
        const ccEffects = updatedStatusEffects.filter(effect => 
          effect.type === "frozen" || effect.type === "stunned");
        
        // Process DoT effects
        dotEffects.forEach(effect => {
          // Apply damage for DoT effects
          if (effect.type === "burn") {
            const burnDamage = 2; // Set burn damage value
            unitHP -= burnDamage;
            
            addToActionLog({
              text: `${unit.name} takes ${burnDamage} burn damage`,
              type: "damage"
            });
          } else if (effect.type === "poison") {
            const poisonDamage = 1; // Set poison damage value
            unitHP -= poisonDamage;
            
            addToActionLog({
              text: `${unit.name} takes ${poisonDamage} poison damage`,
              type: "damage"
            });
          }
          
          // Reduce duration for DoT effects
          effect.duration -= 1;
          
          // Log expired effects
          if (effect.duration === 0) {
            addToActionLog({
              text: `${effect.name} on ${unit.name} has worn off`,
              type: "status"
            });
          }
        });
        
        // Check if unit died from DoT
        const isDead = unitHP <= 0;
        if (isDead && !unit.isDead) {
          addToActionLog({
            text: `${unit.name} is defeated!`,
            type: "defeat"
          });
        }
        
        return {
          ...unit,
          hp: Math.max(0, unitHP),
          isDead: isDead,
          statusEffects: [
            ...ccEffects, // Keep CC effects unchanged
            ...dotEffects.filter(effect => effect.duration > 0) // Only keep active DoT effects
          ]
        };
      })
    );

    addToActionLog("--- Enemy turn begins ---");
  }

  // After the enemy acts, switch to player
  function endEnemyTurn() {
    addToActionLog("--- Enemy turn ends ---");
    setActiveTeam("player");
    resetActedStatus("enemy");

    // Process damage-over-time effects (burn, poison) at turn end for players
    setPlayerUnits(prev =>
      prev.map(unit => {
        if (unit.isDead) return unit;
        
        let unitHP = unit.hp;
        const updatedStatusEffects = [...unit.statusEffects];
        const dotEffects = updatedStatusEffects.filter(effect => 
          effect.type === "burn" || effect.type === "poison");
        const ccEffects = updatedStatusEffects.filter(effect => 
          effect.type === "frozen" || effect.type === "stunned");
        
        // Process DoT effects
        dotEffects.forEach(effect => {
          // Apply damage for DoT effects
          if (effect.type === "burn") {
            const burnDamage = 2; // Set burn damage value
            unitHP -= burnDamage;
            
            addToActionLog({
              text: `${unit.name} takes ${burnDamage} burn damage`,
              type: "damage"
            });
          } else if (effect.type === "poison") {
            const poisonDamage = 1; // Set poison damage value
            unitHP -= poisonDamage;
            
            addToActionLog({
              text: `${unit.name} takes ${poisonDamage} poison damage`,
              type: "damage"
            });
          }
          
          // Reduce duration for DoT effects
          effect.duration -= 1;
          
          // Log expired effects
          if (effect.duration === 0) {
            addToActionLog({
              text: `${effect.name} on ${unit.name} has worn off`,
              type: "status"
            });
          }
        });
        
        // Check if unit died from DoT
        const isDead = unitHP <= 0;
        if (isDead && !unit.isDead) {
          addToActionLog({
            text: `${unit.name} is defeated!`,
            type: "defeat"
          });
        }
        
        return {
          ...unit,
          hp: Math.max(0, unitHP),
          isDead: isDead,
          statusEffects: [
            ...ccEffects, // Keep CC effects unchanged
            ...dotEffects.filter(effect => effect.duration > 0) // Only keep active DoT effects
          ]
        };
      })
    );

    addToActionLog("--- Player turn begins ---");
  }

  // Reset the "acted" field so that each unit can act again in the new round
  function resetActedStatus(team) {
    if (team === "player") {
      setPlayerUnits((prev) =>
        prev.map((u) => {
          return { ...u, acted: false };
        })
      );
    } else {
      setEnemyUnits((prev) =>
        prev.map((u) => {
          return { ...u, acted: false };
        })
      );
    }
  }

  // Modified enemy turn logic for sequential attacks
  useEffect(() => {
    if (activeTeam === "enemy" && !gameOver) {
      // Check for enemies that should skip their turns (stunned or frozen)
      const skippingEnemies = enemyUnits.filter(
        enemy => !enemy.isDead && 
          !enemy.acted && 
          enemy.statusEffects.some(effect => effect.type === "stunned" || effect.type === "frozen")
      );

      // Automatically skip turns for stunned or frozen enemies and reduce CC duration
      if (skippingEnemies.length > 0) {
        // Process each stunned/frozen enemy
        skippingEnemies.forEach(enemy => {
          // Find the CC effect (stunned/frozen)
          const ccEffect = enemy.statusEffects.find(e => 
            e.type === "stunned" || e.type === "frozen");
          
          // Log the skip action
          addToActionLog({
            text: `${enemy.name} is ${ccEffect.name} and skips their turn!`,
            type: "status"
          });

          // Process the CC effect - reduce duration
          setEnemyUnits(prev => 
            prev.map(unit => {
              // Make sure we only affect this specific enemy instance
              if (unit.instanceId === enemy.instanceId) {
                const updatedStatusEffects = unit.statusEffects.map(effect => {
                  // Only reduce duration for the CC effect that caused the skip
                  if (effect.type === ccEffect.type) {
                    const newDuration = effect.duration - 1;
                    
                    // Log if the effect expires
                    if (newDuration === 0) {
                      addToActionLog({
                        text: `${effect.name} on ${unit.name} has expired`,
                        type: "status"
                      });
                    }
                    
                    return {
                      ...effect,
                      duration: newDuration
                    };
                  }
                  return effect;
                }).filter(effect => effect.duration > 0);
                
                return {
                  ...unit,
                  statusEffects: updatedStatusEffects,
                  acted: true // Mark as having acted
                };
              }
              return unit;
            })
          );
        });
      }

      // Check for active enemies who can still act
      const activeEnemies = enemyUnits.filter(
        enemy => !enemy.isDead &&
          !enemy.acted &&
          !enemy.statusEffects.some(effect => effect.type === "stunned" || effect.type === "frozen")
      );

      if (activeEnemies.length === 0) {
        // All enemies are either dead, stunned, or have acted, end turn
        setTimeout(() => {
          endEnemyTurn();
        }, 200);
        return;
      }

      // Let each active enemy unit do a basic attack on the first alive player unit, then end turn
      const alivePlayerUnits = playerUnits.filter((u) => !u.isDead);
      const targetId = alivePlayerUnits.length ? alivePlayerUnits[0].instanceId || alivePlayerUnits[0].id : null;

      if (targetId && activeEnemies.length > 0) {
        const performEnemyAttack = (index) => {
          const enemy = activeEnemies[index];
          if (!enemy) {
            // All enemies have attacked, end turn
            setCurrentlyAttacking(null);
            setTimeout(() => {
              endEnemyTurn();
            }, 500);
            return;
          }

          setCurrentlyAttacking(enemy.instanceId || enemy.id);
          setTimeout(() => {
            handleBasicAttack("enemy", enemy.instanceId || enemy.id, targetId);
            // Move to next enemy after attack
            setTimeout(() => {
              performEnemyAttack(index + 1);
            }, 500);
          }, 1000);
        };

        // Start the sequential attacks
        performEnemyAttack(0);
      } else {
        // No valid attacks possible, end turn
        endEnemyTurn();
      }
    }
  }, [activeTeam, gameOver]);

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver || activeTeam !== "player" || !selectedPlayerUnit) return;

      switch (event.key.toLowerCase()) {
        case 'q':
          // Ability
          if (selectedPlayerUnit.ability && selectedPlayerUnit.ability.currentCooldown === 0) {
            handleAction("UseAbility");
          }
          break;
        case 'a':
          // Attack
          handleAction("Attack");
          break;
        case 's':
          // Skip
          handleAction("Skip");
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPlayerUnit, gameOver, activeTeam]); // Dependencies for the effect

  // Handle unit selection
  const handleUnitClick = (unit, team) => {
    if (gameOver) return;

    // For player units, check if they're CC'd before allowing selection
    if (team === "player" && activeTeam === "player") {
      // Check if unit has stun/freeze effect
      const hasCCEffect = unit.statusEffects?.some(effect => 
        effect.type === "stunned" || effect.type === "frozen");
        
      if (hasCCEffect && !unit.acted) {
        // Find the CC effect
        const ccEffect = unit.statusEffects.find(e => 
          e.type === "stunned" || e.type === "frozen");
        
        // Log and process the skip
        addToActionLog({
          text: `${unit.name} is ${ccEffect.name} and skips their turn!`,
          type: "status"
        });
        
        // Process the CC effect - reduce duration
        setPlayerUnits(prev => 
          prev.map(u => {
            if (u.instanceId === unit.instanceId || u.id === unit.id) {
              const updatedStatusEffects = u.statusEffects.map(effect => {
                // Only reduce duration for the CC effect that caused the skip
                if (effect.type === ccEffect.type) {
                  const newDuration = effect.duration - 1;
                  
                  // Log if the effect expires
                  if (newDuration === 0) {
                    addToActionLog({
                      text: `${effect.name} on ${unit.name} has expired`,
                      type: "status"
                    });
                  }
                  
                  return {
                    ...effect,
                    duration: newDuration
                  };
                }
                return effect;
              }).filter(effect => effect.duration > 0);
              
              return {
                ...u,
                statusEffects: updatedStatusEffects,
                acted: true // Mark as having acted
              };
            }
            return u;
          })
        );
        
        // Don't allow selection of CC'd unit
        return;
      }
    }

    if (usingAbility) {
      // When using an ability, allow clicking on allies for player targeting abilities
      if (team === "player" && !unit.isDead) {
        // Get the caster (selected player unit)
        const caster = selectedPlayerUnit;
        if (!caster) return;
        
        // Handle different abilities based on the caster's name
        switch (caster.name) {
          case "Lyra Ashwyn":
            // Execute Triage Tactics ability - heal and cleanse target
            setTimeout(() => {
              // Create ability log entry
              const triageLogEntry = {
                unit: caster.name,
                type: "ability",
                abilityName: caster.ability.name,
                targets: [{
                  unit: unit.name,
                  Damage: "-8", // Negative damage indicates healing
                  Status: "Cleansed"
                }]
              };
              
              // Update the player units to heal and cleanse status effects
              setPlayerUnits(prev =>
                prev.map(ally => {
                  if (ally.instanceId === unit.instanceId || ally.id === unit.id) {
                    // Calculate new HP with healing
                    const newHP = Math.min(ally.hp + 8, ally.maxHP);
                    
                    // Remove all negative status effects (keeping only positive ones if any)
                    const positiveEffects = ally.statusEffects.filter(effect => 
                      effect.type !== "burn" && 
                      effect.type !== "poison" && 
                      effect.type !== "stunned" && 
                      effect.type !== "frozen"
                    );
                    
                    // Log removed effects
                    const removedEffects = ally.statusEffects.filter(effect => 
                      effect.type === "burn" || 
                      effect.type === "poison" || 
                      effect.type === "stunned" || 
                      effect.type === "frozen"
                    );
                    
                    if (removedEffects.length > 0) {
                      addToActionLog({
                        text: `${removedEffects.length} negative effects removed from ${ally.name}`,
                        type: "status"
                      });
                    }
                    
                    // Log healing
                    addToActionLog({
                      text: `${ally.name} is healed for 8 HP`,
                      type: "heal"
                    });
                    
                    return {
                      ...ally,
                      hp: newHP,
                      statusEffects: positiveEffects
                    };
                  }
                  return ally;
                })
              );
              
              // Add the complete ability log
              addToActionLog(triageLogEntry);
              
              // Set ability on cooldown and mark caster as acted
              setPlayerUnits(prev =>
                prev.map(u => {
                  if (u.instanceId === caster.instanceId || u.id === caster.id) {
                    return {
                      ...u,
                      acted: true,
                      ability: {
                        ...u.ability,
                        currentCooldown: u.ability.maxCooldown
                      }
                    };
                  }
                  return u;
                })
              );
              
              // Check if this is the first turn and end it if so
              if (!firstTurnUsed) {
                setFirstTurnUsed(true);
                setTimeout(() => endPlayerTurn(), 800);
              }
              
              // Clear animations and ability mode
              setTimeout(() => {
                setAnimatingUnitId(null);
                setAnimatingAbility(false);
                setUsingAbility(false);
                setSelectedPlayerUnit(null);
              }, 800);
            }, 500);
            break;
            
          case "Blood Mage":
            // Don't allow targeting self with Sanguine Pact
            if (unit.id === caster.id) {
              addToActionLog({
                text: `${caster.name} cannot target themselves with ${caster.ability.name}`,
                type: "normal"
              });
              return;
            }
            
            // Execute Sanguine Pact - sacrifice HP to grant damage boost
            setTimeout(() => {
              // Create ability log entry
              const sanguinePactLogEntry = {
                unit: caster.name,
                type: "ability",
                abilityName: caster.ability.name,
                targets: []
              };
              
              // First, blood mage sacrifices 2 HP
              setPlayerUnits(prev => 
                prev.map(u => {
                  if (u.id === caster.id) {
                    // Calculate new HP after sacrifice (minimum 1)
                    const newHP = Math.max(1, u.hp - 2);
                    
                    // Log the blood sacrifice
                    addToActionLog({
                      text: `${u.name} sacrifices 2 HP in a blood ritual!`,
                      type: "ability"
                    });
                    
                    return {
                      ...u,
                      hp: newHP,
                      acted: true,
                      ability: {
                        ...u.ability,
                        currentCooldown: u.ability.maxCooldown
                      }
                    };
                  }
                  return u;
                })
              );
              
              // Then, grant the ally a temporary damage buff
              setPlayerUnits(prev => 
                prev.map(ally => {
                  if (ally.instanceId === unit.instanceId || ally.id === unit.id) {
                    // Add buff to log entry
                    sanguinePactLogEntry.targets.push({
                      unit: ally.name,
                      Damage: "+6", // Indicates a buff rather than damage
                      Status: "Damage Boost"
                    });
                    
                    // Log the damage boost
                    addToActionLog({
                      text: `${ally.name} gains +6 attack power this round!`,
                      type: "status"
                    });
                    
                    // Add a temporary damage boost status effect
                    const newStatusEffects = [...ally.statusEffects];
                    
                    // Add damage boost effect (removing any existing ones first)
                    const filteredEffects = newStatusEffects.filter(effect => 
                      effect.type !== "damage-boost"
                    );
                    
                    filteredEffects.push({
                      type: "damage-boost",
                      name: "Blood Empowered",
                      icon: "🩸",
                      duration: 1, // Lasts until the end of the round
                      amount: 6    // +6 damage
                    });
                    
                    return {
                      ...ally,
                      statusEffects: filteredEffects,
                      // Also directly increase the damage for the current round
                      damage: ally.damage + 6
                    };
                  }
                  return ally;
                })
              );
              
              // Add the complete ability log
              addToActionLog(sanguinePactLogEntry);
              
              // Check if this is the first turn and end it if so
              if (!firstTurnUsed) {
                setFirstTurnUsed(true);
                setTimeout(() => endPlayerTurn(), 800);
              }
              
              // Clear animations and ability mode
              setTimeout(() => {
                setAnimatingUnitId(null);
                setAnimatingAbility(false);
                setUsingAbility(false);
                setSelectedPlayerUnit(null);
              }, 800);
            }, 500);
            break;
            
          default:
            // For other abilities, cancel ability mode when clicking an ally
            addToActionLog({
              text: `This ability cannot target allies`,
              type: "normal"
            });
            setUsingAbility(false);
        }
      } else if (team === "enemy" && !unit.isDead) {
        // Get the caster (selected player unit)
        const caster = selectedPlayerUnit;
        if (!caster) return;
        
        // Handle different abilities based on the caster's name
        switch (caster.name) {
          case "Brom the Bastion":
            // Execute Iron Wall Assault ability - damage and stun target
            setTimeout(() => {
              // Create ability log entry
              const ironWallLogEntry = {
                unit: caster.name,
                type: "ability",
                abilityName: caster.ability.name,
                targets: [{
                  unit: unit.name,
                  Damage: caster.damage.toString(),
                  Status: "Stunned"
                }]
              };
              
              // Apply damage and stun effect to the target
              setEnemyUnits(prev =>
                prev.map(enemy => {
                  if (enemy.instanceId === unit.instanceId) {
                    const newHP = enemy.hp - caster.damage;
                    const newStatusEffects = [...enemy.statusEffects];
                    
                    // Add stunned status effect
                    newStatusEffects.push({
                      type: "stunned",
                      name: "Stunned",
                      icon: "🛡️",
                      duration: 1
                    });
                    
                    // Log stun effect
                    addToActionLog({
                      text: `${enemy.name} is stunned by ${caster.name}'s ${caster.ability.name}!`,
                      type: "status"
                    });
                    
                    // Check if enemy is defeated
                    if (newHP <= 0) {
                      addToActionLog({
                        text: `${enemy.name} is defeated!`,
                        type: "defeat"
                      });
                    }
                    
                    return {
                      ...enemy,
                      hp: Math.max(0, newHP),
                      isDead: newHP <= 0,
                      statusEffects: newStatusEffects
                    };
                  }
                  return enemy;
                })
              );
              
              // Add the complete ability log
              addToActionLog(ironWallLogEntry);
              
              // Set ability on cooldown and mark caster as acted
              setPlayerUnits(prev =>
                prev.map(u => {
                  if (u.instanceId === caster.instanceId || u.id === caster.id) {
                    return {
                      ...u,
                      acted: true,
                      ability: {
                        ...u.ability,
                        currentCooldown: u.ability.maxCooldown
                      }
                    };
                  }
                  return u;
                })
              );
              
              // Clear animations and ability mode
              setTimeout(() => {
                setAnimatingUnitId(null);
                setAnimatingAbility(false);
                setUsingAbility(false);
                setSelectedPlayerUnit(null);
              }, 800);
            }, 500);
            break;
            
          default:
            // For other abilities, cancel ability mode when clicking an enemy
            addToActionLog({
              text: `This ability cannot target enemies`,
              type: "normal"
            });
            setUsingAbility(false);
        }
      }

      // Check if this is the first turn and end it if so
      if (!firstTurnUsed) {
        setFirstTurnUsed(true);
        setTimeout(() => endPlayerTurn(), 1500);
      }

      return;
    }

    if (attackingUnit) {
      // If we're in attack mode and clicked an enemy
      if (team === "enemy" && !unit.isDead) {
        handleBasicAttack("player", attackingUnit.id, unit.id);
        setAttackingUnit(null);
        setSelectedPlayerUnit(null);
      }
      return;
    }

    if (team === "player") {
      if (selectedPlayerUnit?.instanceId === unit.instanceId) {
        // Deselect if clicking the same unit
        setSelectedPlayerUnit(null);
      } else if (activeTeam === "player" && !unit.acted && !unit.isDead) {
        // Select new unit if valid
        setSelectedPlayerUnit(unit);
        setSelectedEnemyUnit(null);
      }
    } else if (team === "enemy") {
      if (selectedEnemyUnit?.instanceId === unit.instanceId) {
        // Deselect if clicking the same unit
        setSelectedEnemyUnit(null);
      } else {
        // Select new enemy unit
        setSelectedEnemyUnit(unit);
      }
    }
  };

  // Handle action selection from sidebar
  const handleAction = (action) => {
    if (!selectedPlayerUnit) return;

    switch (action) {
      case "Attack":
        setAttackingUnit(selectedPlayerUnit);
        addToActionLog({
          text: `${selectedPlayerUnit.name} prepares to attack`,
          type: "normal"
        });
        break;

      case "UseAbility":
        handleAbilityUse(selectedPlayerUnit.id);
        break;

      case "Confirm":
        handleBasicAttack("player", attackingUnit.id, selectedEnemyUnit.id);
        setAttackingUnit(null);
        setSelectedPlayerUnit(null);
        setSelectedEnemyUnit(null);
        break;

      case "Cancel":
        addToActionLog({
          text: `${selectedPlayerUnit.name} cancels their action`,
          type: "normal"
        });
        setAttackingUnit(null);
        break;

      case "CancelAbility":
        addToActionLog({
          text: `${selectedPlayerUnit.name} cancels their ability`,
          type: "normal"
        });
        setUsingAbility(false);
        break;

      case "Skip":
        handleSkip("player", selectedPlayerUnit.id);
        setSelectedPlayerUnit(null);
        break;

      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  // Modified renderUnitList to include animation classes and handle full art button
  function renderUnitList(units, team) {
    return (
      <div className="unit-list">
        {units.map((unit) => (
          <UnitCard
            key={unit.instanceId || unit.id}
            unit={unit}
            team={team}
            isSelected={
              (team === "player" && selectedPlayerUnit?.instanceId === unit.instanceId) ||
              (team === "enemy" && selectedEnemyUnit?.instanceId === unit.instanceId)
            }
            isAttacking={attackingUnit?.instanceId === unit.instanceId}
            className={`
              ${animatingUnitId === unit.instanceId ? (animatingAbility ? 'using-ability' : 'attacking') : ''}
              ${damagedUnitId === unit.instanceId ? 'taking-damage' : ''}
              ${selectedEnemyUnit && attackingUnit ? 'target-selected' : ''}
            `}
            onClick={() => handleUnitClick(unit, team)}
            onViewArt={handleViewFullArt}
          />
        ))}
      </div>
    );
  }

  // Function to handle viewing full art
  const handleViewFullArt = (unit) => {
    setViewingFullArt(unit);
  };

  // Function to close full art view
  const closeFullArt = () => {
    setViewingFullArt(null);
  };

  return (
    <div className="BattlefieldCombat" style={{ background: `url(${backgroundImage}) center/cover no-repeat` }}>
      <>
        <GameMenu
          selectedEnemyTeam={selectedEnemyTeam}
          enemyTeams={Object.keys(enemyTeams)}
          onEnemyTeamChange={isCampaignMode ? null : handleEnemyTeamChange}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isGameOver={gameOver}
          onSurrender={handleSurrender}
          isCampaignMode={isCampaignMode}
          campaignLevel={levelData?.level?.title}
        />

        <Settings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          gameSettings={gameSettings}
          onSettingsChange={handleSettingsChange}
        />

        <div className="game-container">
          <div className={`turn-indicator ${activeTeam}-turn`}>
            <span className="turn-icon">⚔️</span>
            <span>
              {activeTeam === "player"
                ? "Your Turn"
                : currentlyAttacking
                  ? `${enemyUnits.find(u => u.instanceId === currentlyAttacking || u.id === currentlyAttacking)?.name} is attacking!`
                  : "Enemy Turn"
              }
            </span>
          </div>
          {selectedPlayerUnit ? (
            <Sidebar
              unit={selectedPlayerUnit}
              onClose={() => {
                setSelectedPlayerUnit(null);
                setAttackingUnit(null);
                setUsingAbility(false);
              }}
              onAction={handleAction}
              onViewFullArt={handleViewFullArt}
              position="left"
              isAttacking={!!attackingUnit}
              hasTarget={!!selectedEnemyUnit}
              isUsingAbility={usingAbility}
            />
          ) : (
            <div className="sidebar-placeholder" />
          )}
          <div className="battlefield" data-attacking={!!attackingUnit}>
            {attackingUnit && selectedEnemyUnit && (
              <div
                className="attack-line"
                style={{
                  "--start-x": `${attackingUnit.cardPosition?.x || 0}px`,
                  "--start-y": `${attackingUnit.cardPosition?.y || 0}px`,
                  "--end-x": `${selectedEnemyUnit.cardPosition?.x || 0}px`,
                  "--end-y": `${selectedEnemyUnit.cardPosition?.y || 0}px`,
                }}
              />
            )}
            <div className={`side enemy-side ${blizzardActive ? 'blizzard-active' : ''}`}>
              {blizzardActive && (
                <>
                  <div className="blizzard-overlay" />
                  {iceParticles.map((particle) => (
                    <div
                      key={particle.id}
                      className={particle.type}
                      style={{
                        left: particle.left,
                        top: particle.top,
                        animationDuration: particle.animationDuration,
                        animationDelay: particle.animationDelay
                      }}
                    />
                  ))}
                </>
              )}
              {renderUnitList(enemyUnits, "enemy")}
            </div>
            <div className="side player-side">{renderUnitList(playerUnits, "player")}</div>
          </div>
          {selectedEnemyUnit ? (
            <Sidebar
              unit={selectedEnemyUnit}
              onClose={() => setSelectedEnemyUnit(null)}
              onViewFullArt={handleViewFullArt}
              position="right"
            />
          ) : (
            <div className="sidebar-placeholder" />
          )}
        </div>

        {gameOver && (
          <div className="game-over">
            <h2>{winner === "player" ? "Victory!" : "Defeat!"}</h2>
            <p>{winner === "player" ? "You have defeated all enemies!" : "Your party has been defeated."}</p>
            <button className="return-to-menu" onClick={() => setIsInGame(false)}>
              Return to Main Menu
            </button>
          </div>
        )}

        {/* Show status effects on units */}
        {playerUnits.concat(enemyUnits).map(unit =>
          unit.statusEffects && unit.statusEffects.length > 0 && (
            <div key={`status-${unit.instanceId || unit.id}`} className="status-effects">
              {unit.statusEffects.map((effect, idx) => (
                <div key={`${unit.instanceId || unit.id}-effect-${idx}`} className={`status-effect ${effect.type}`}>
                  {effect.icon}
                </div>
              ))}
            </div>
          )
        )}

        {/* Display full art if applicable */}
        {viewingFullArt && (
          <div className="full-art-overlay" onClick={closeFullArt}>
            <div className="full-art-container">
              <button className="close-full-art" onClick={closeFullArt}>×</button>
              <img src={viewingFullArt.fullArt} alt={viewingFullArt.name} />
              <h3 className="full-art-title">{viewingFullArt.name}</h3>
            </div>
          </div>
        )}

        {/* Updated Developer Panel with new props */}
        <DeveloperPanel
          actionLog={actionLog}
          gameState={gameState}
          onImportGameState={handleImportGameState}
          gameSettings={gameSettings}
          onSettingsChange={handleSettingsChange}
        />
      </>
    </div>
  );
}

export default BattlefieldCombat;