import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import UnitCard from "./UnitCard";
import DeveloperPanel from "./DeveloperPanel";
import GameMenu from "./GameMenu";
import Settings from "./Settings";
import varenPortrait from "./images/varen-stormrune-portrait-picture.png";
import ashbringerPortrait from "./images/ashbringer-portrait-picture.png";
import lynValkenPortrait from "./images/lyn-valken-portrait-picture.png";
import emberhowlPortrait from "./images/emberhowl-portrait-picture.png";
import silkfangPortrait from "./images/silkfang-portrait-picture.png";
import varenFullArt from "./images/varen-stormrune-full-art.png";

function App() {
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

  // Store the full game state in a single object
  const [gameState, setGameState] = useState({
    playerUnits: [],
    enemyUnits: [],
    activeTeam: "player",
    firstTurnUsed: false,
    gameOver: false,
    winner: null
  });

  const [playerUnits, setPlayerUnits] = useState([
    {
      id: "p1",
      name: "Varen Stormrune",
      maxHP: 30,
      hp: 30,
      damage: 5,
      acted: false,
      isDead: false,
      image: varenPortrait,
      fullArt: varenFullArt, // Add fullArt property
      actions: ["Attack", "Pass"],
      ability: {
        name: "Blizzard",
        icon: "❄️",
        description: "Deals damage to all enemy units equal to ATK. Each enemy has a 25% chance to be Stunned for 1 turn (cannot act).",
        currentCooldown: 0,
        maxCooldown: 2,
      },
      statusEffects: []
    },
    {
      id: "p2",
      name: "Emberhowl",
      maxHP: 20,
      hp: 20,
      damage: 4,
      acted: false,
      isDead: false,
      image: emberhowlPortrait,
      fullArt: emberhowlPortrait, // Temporarily using portrait as full art
      actions: ["Attack", "Pass"],
      ability: {
        name: "Flame Burst",
        icon: "🔥",
        description: "Deals 150% ATK damage to one enemy.",
        currentCooldown: 0,
        maxCooldown: 1,
      },
      statusEffects: []
    },
    {
      id: "p3",
      name: "Silkfang",
      maxHP: 15,
      hp: 15,
      damage: 3,
      acted: false,
      isDead: false,
      image: silkfangPortrait,
      fullArt: silkfangPortrait, // Temporarily using portrait as full art
      actions: ["Attack", "Pass"],
      ability: {
        name: "Venomous Bite",
        icon: "🦂",
        description: "Applies poison to an enemy, dealing 2 damage per turn for 2 turns.",
        currentCooldown: 0,
        maxCooldown: 3,
      },
      statusEffects: []
    },
    {
      id: "p4",
      name: "Silkfang Twin",
      maxHP: 15,
      hp: 15,
      damage: 3,
      acted: false,
      isDead: false,
      image: silkfangPortrait,
      fullArt: silkfangPortrait, // Temporarily using portrait as full art
      actions: ["Attack", "Pass"],
      ability: {
        name: "Web Trap",
        icon: "🕸️",
        description: "Immobilizes an enemy for 1 turn, reducing their damage by 50%.",
        currentCooldown: 0,
        maxCooldown: 2,
      },
      statusEffects: []
    },
  ]);

  const [enemyUnits, setEnemyUnits] = useState([
    {
      id: "e1",
      name: "Ashbringer",
      maxHP: 50,
      hp: 50,
      damage: 8,
      acted: false,
      isDead: false,
      image: ashbringerPortrait,
      fullArt: ashbringerPortrait, // Temporarily using portrait as full art
      statusEffects: []
    },
    {
      id: "e2",
      name: "Lyn Valken",
      maxHP: 20,
      hp: 20,
      damage: 4,
      acted: false,
      isDead: false,
      image: lynValkenPortrait,
      fullArt: lynValkenPortrait, // Temporarily using portrait as full art
      statusEffects: []
    },
  ]);

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
      winner
    });
  }, [playerUnits, enemyUnits, activeTeam, firstTurnUsed, gameOver, winner]);

  // Handle imported game state
  const handleImportGameState = (importedState) => {
    try {
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

  // Handle game reset
  const handleResetGame = () => {
    // Reset player units
    setPlayerUnits(prev =>
      prev.map(unit => ({
        ...unit,
        hp: unit.maxHP,
        acted: false,
        isDead: false,
        statusEffects: [],
        ability: unit.ability ? {
          ...unit.ability,
          currentCooldown: 0
        } : null
      }))
    );
    
    // Reset enemy units
    setEnemyUnits(prev =>
      prev.map(unit => ({
        ...unit,
        hp: unit.maxHP,
        acted: false,
        isDead: false,
        statusEffects: []
      }))
    );
    
    // Reset game state
    setActiveTeam("player");
    setFirstTurnUsed(false);
    setGameOver(false);
    setWinner(null);
    
    // Reset UI states
    setSelectedPlayerUnit(null);
    setSelectedEnemyUnit(null);
    setAttackingUnit(null);
    setUsingAbility(false);
    
    // Log the reset
    addToActionLog({
      text: "Game has been reset. A new battle begins!",
      type: "normal"
    });
    
    // Add new battle start log
    addToActionLog("--- Player turn begins ---");
  };
  
  // Handle surrender
  const handleSurrender = () => {
    setGameOver(true);
    setWinner("enemy");
    addToActionLog({
      text: "You have surrendered the battle!",
      type: "defeat"
    });
  };
  
  // This effect checks after every action if someone won.
  useEffect(() => {
    checkVictoryCondition();
  }, [playerUnits, enemyUnits]);

  // Add new effect to check if all player units have acted and end turn automatically
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
            if (unit.id === attacker.id) {
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
            if (unit.id === attacker.id) {
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

  // Modified handleBasicAttack to use new log format and include retaliation
  function handleBasicAttack(attackerTeam, attackerId, targetId) {
    if (gameOver) return;

    if (attackerTeam === "player") {
      const attacker = playerUnits.find((u) => u.id === attackerId);
      if (!attacker || attacker.acted || attacker.isDead) return;

      const target = enemyUnits.find((u) => u.id === targetId);
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
      setAnimatingUnitId(attackerId);

      // Apply damage after animation starts
      setTimeout(() => {
        setDamagedUnitId(targetId);
        setEnemyUnits((prev) =>
          prev.map((unit) => {
            if (unit.id === targetId && !unit.isDead) {
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
        prev.map((u) => (u.id === attackerId ? { ...u, acted: true } : u))
      );

      if (!firstTurnUsed) {
        setFirstTurnUsed(true);
        endPlayerTurn();
      }
    } else {
      // Enemy attack with similar timing
      const attacker = enemyUnits.find((u) => u.id === attackerId);
      if (!attacker || attacker.acted || attacker.isDead) return;

      const target = playerUnits.find((u) => u.id === targetId);
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
      setAnimatingUnitId(attackerId);

      setTimeout(() => {
        setDamagedUnitId(targetId);
        setPlayerUnits((prev) =>
          prev.map((unit) => {
            if (unit.id === targetId && !unit.isDead) {
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
        prev.map((u) => (u.id === attackerId ? { ...u, acted: true } : u))
      );
    }
  }

  // Function to create ice particles for the blizzard animation
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

  // Activate the blizzard animation effect
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

    const unit = playerUnits.find(u => u.id === unitId);
    if (!unit || unit.acted || unit.isDead || unit.ability.currentCooldown > 0) return;

    setAnimatingUnitId(unitId);
    setAnimatingAbility(true);

    // Handle specific abilities
    switch(unit.name) {
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
                // Add stunned status effect
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
              if (u.id === unitId) {
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

      case "Emberhowl":
        // Log ability use
        addToActionLog({
          unit: unit.name,
          type: "ability",
          abilityName: unit.ability.name,
          targets: []
        });
        // For now, we'll handle other abilities generically
        setUsingAbility(true);
        break;

      case "Silkfang":
        addToActionLog({
          unit: unit.name,
          type: "ability",
          abilityName: unit.ability.name,
          targets: []
        });
        setUsingAbility(true);
        break;

      case "Silkfang Twin":
        addToActionLog({
          unit: unit.name,
          type: "ability",
          abilityName: unit.ability.name,
          targets: []
        });
        setUsingAbility(true);
        break;

      default:
        // Generic ability handling
        setUsingAbility(true);
    }

    if (!firstTurnUsed) {
      setFirstTurnUsed(true);
      setTimeout(() => endPlayerTurn(), 1500);
    }
  }

  // Pass action
  function handlePass(team, unitId) {
    if (gameOver) return;

    if (team === "player") {
      const unit = playerUnits.find(u => u.id === unitId);
      if (!unit) return;
      
      addToActionLog({
        unit: unit.name,
        type: "skip",
        targets: []
      });
      
      setPlayerUnits((prev) =>
        prev.map((u) => (u.id === unitId ? { ...u, acted: true } : u))
      );
      
      if (!firstTurnUsed) {
        setFirstTurnUsed(true);
        endPlayerTurn();
      }
    } else {
      const unit = enemyUnits.find(u => u.id === unitId);
      if (!unit) return;
      
      addToActionLog({
        unit: unit.name,
        type: "skip",
        targets: []
      });
      
      setEnemyUnits((prev) =>
        prev.map((u) => (u.id === unitId ? { ...u, acted: true } : u))
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

    // Process status effects at turn end
    setEnemyUnits(prev =>
      prev.map(unit => {
        const expiredEffects = unit.statusEffects.filter(effect => effect.duration === 1);
        if (expiredEffects.length > 0) {
          expiredEffects.forEach(effect => {
            addToActionLog({
              text: `${effect.name} on ${unit.name} has expired`,
              type: "status"
            });
          });
        }
        
        return {
          ...unit,
          statusEffects: unit.statusEffects
            .map(effect => ({ ...effect, duration: effect.duration - 1 }))
            .filter(effect => effect.duration > 0)
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

    // Process status effects at turn end
    setPlayerUnits(prev =>
      prev.map(unit => {
        const expiredEffects = unit.statusEffects.filter(effect => effect.duration === 1);
        if (expiredEffects.length > 0) {
          expiredEffects.forEach(effect => {
            addToActionLog({
              text: `${effect.name} on ${unit.name} has expired`,
              type: "status"
            });
          });
        }
        
        return {
          ...unit,
          statusEffects: unit.statusEffects
            .map(effect => ({ ...effect, duration: effect.duration - 1 }))
            .filter(effect => effect.duration > 0)
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
      // Check for stunned enemies first
      const activeEnemies = enemyUnits.filter(
        enemy => !enemy.isDead &&
                !enemy.acted &&
                !enemy.statusEffects.some(effect => effect.type === "frozen")
      );

      // Log frozen enemies
      const frozenEnemies = enemyUnits.filter(
        enemy => !enemy.isDead && 
                !enemy.acted && 
                enemy.statusEffects.some(effect => effect.type === "frozen")
      );
      
      if (frozenEnemies.length > 0) {
        frozenEnemies.forEach(enemy => {
          addToActionLog({
            text: `${enemy.name} is Frozen and cannot act!`,
            type: "status"
          });
        });
      }

      if (activeEnemies.length === 0) {
        // All enemies are either dead or stunned, end turn
        setTimeout(() => {
          endEnemyTurn();
        }, 500);
        return;
      }

      // Let each enemy unit do a basic attack on the first alive player unit, then end turn.
      const alivePlayerUnits = playerUnits.filter((u) => !u.isDead);
      const targetId = alivePlayerUnits.length ? alivePlayerUnits[0].id : null;

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

          setCurrentlyAttacking(enemy.id);
          setTimeout(() => {
            handleBasicAttack("enemy", enemy.id, targetId);
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
          handleAction("Pass");
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

    if (usingAbility) {
      if (team === "enemy" && !unit.isDead) {
        // Implement target selection for abilities that need targets
        // For now, cancel ability mode when clicking an enemy during ability use
        setUsingAbility(false);
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
      if (selectedPlayerUnit?.id === unit.id) {
        // Deselect if clicking the same unit
        setSelectedPlayerUnit(null);
      } else if (activeTeam === "player" && !unit.acted && !unit.isDead) {
        // Select new unit if valid
        setSelectedPlayerUnit(unit);
        setSelectedEnemyUnit(null);
      }
    } else if (team === "enemy") {
      if (selectedEnemyUnit?.id === unit.id) {
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

      case "Pass":
        handlePass("player", selectedPlayerUnit.id);
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
            key={unit.id}
            unit={unit}
            team={team}
            isSelected={
              (team === "player" && selectedPlayerUnit?.id === unit.id) ||
              (team === "enemy" && selectedEnemyUnit?.id === unit.id)
            }
            isAttacking={attackingUnit?.id === unit.id}
            className={`
              ${animatingUnitId === unit.id ? (animatingAbility ? 'using-ability' : 'attacking') : ''}
              ${damagedUnitId === unit.id ? 'taking-damage' : ''}
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
    <div className="App">
      {/* Add Game Menu */}
      <GameMenu 
        onSurrender={handleSurrender}
        onResetGame={handleResetGame}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isGameOver={gameOver}
      />
      
      {/* Add Settings Dialog */}
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
                ? `${enemyUnits.find(u => u.id === currentlyAttacking)?.name} is attacking!`
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
            {/* Blizzard animation elements */}
            {blizzardActive && (
              <>
                <div className="blizzard-overlay"></div>
                {iceParticles.map(particle => (
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
        </div>
      )}

      {/* Show status effects on units */}
      {playerUnits.concat(enemyUnits).map(unit =>
        unit.statusEffects && unit.statusEffects.length > 0 && (
          <div key={`status-${unit.id}`} className="status-effects">
            {unit.statusEffects.map((effect, idx) => (
              <div key={`${unit.id}-effect-${idx}`} className={`status-effect ${effect.type}`}>
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
    </div>
  );
}

export default App;
