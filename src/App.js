import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import UnitCard from "./UnitCard";
import varenPortrait from "./images/varen-stormrune-portrait-picture.png";
import ashbringerPortrait from "./images/ashbringer-portrait-picture.png";
import lynValkenPortrait from "./images/lyn-valken-portrait-picture.png";
import emberhowlPortrait from "./images/emberhowl-portrait-picture.png";
import silkfangPortrait from "./images/silkfang-portrait-picture.png";

function App() {
  // Add new state for animation
  const [animatingUnitId, setAnimatingUnitId] = useState(null);
  const [damagedUnitId, setDamagedUnitId] = useState(null);

  const [selectedPlayerUnit, setSelectedPlayerUnit] = useState(null);
  const [selectedEnemyUnit, setSelectedEnemyUnit] = useState(null);
  const [attackingUnit, setAttackingUnit] = useState(null);
  const [currentlyAttacking, setCurrentlyAttacking] = useState(null);

  // Add new state for ability usage
  const [usingAbility, setUsingAbility] = useState(false);
  const [animatingAbility, setAnimatingAbility] = useState(false);

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
    } else if (allPlayersDead && !gameOver) {
      setGameOver(true);
      setWinner("enemy");
    }
  }

  // Modified handleBasicAttack to play animation only after target selection
  function handleBasicAttack(attackerTeam, attackerId, targetId) {
    if (gameOver) return;

    if (attackerTeam === "player") {
      const attacker = playerUnits.find((u) => u.id === attackerId);
      if (!attacker || attacker.acted || attacker.isDead) return;

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
              return {
                ...unit,
                hp: newHP,
                isDead: newHP <= 0,
              };
            }
            return unit;
          })
        );

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
              return {
                ...unit,
                hp: newHP,
                isDead: newHP <= 0,
              };
            }
            return unit;
          })
        );

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
        // Blizzard ability - damages all enemies with chance to stun
        setTimeout(() => {
          const aliveEnemies = enemyUnits.filter(enemy => !enemy.isDead);

          // Apply damage to all enemies
          setEnemyUnits(prev =>
            prev.map(enemy => {
              if (enemy.isDead) return enemy;

              const newHP = enemy.hp - unit.damage;
              const isStunned = Math.random() < 0.25; // 25% chance to stun

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

              return {
                ...enemy,
                hp: newHP,
                isDead: newHP <= 0,
                statusEffects: newStatusEffects
              };
            })
          );

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
        // For now, we'll handle other abilities generically
        // In a real implementation, each ability would have specific effects
        setUsingAbility(true);
        break;

      case "Silkfang":
        setUsingAbility(true);
        break;

      case "Silkfang Twin":
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
      setPlayerUnits((prev) =>
        prev.map((u) => (u.id === unitId ? { ...u, acted: true } : u))
      );
      if (!firstTurnUsed) {
        setFirstTurnUsed(true);
        endPlayerTurn();
      }
    } else {
      setEnemyUnits((prev) =>
        prev.map((u) => (u.id === unitId ? { ...u, acted: true } : u))
      );
    }
  }

  // After the player has either used all units or (on first turn) done 1 action, switch to enemy
  function endPlayerTurn() {
    setActiveTeam("enemy");
    resetActedStatus("player");
    setCurrentlyAttacking(null); // Reset currentlyAttacking state

    // Process cooldowns at turn end
    setPlayerUnits(prev =>
      prev.map(unit => ({
        ...unit,
        ability: unit.ability ? {
          ...unit.ability,
          currentCooldown: Math.max(0, unit.ability.currentCooldown - 1)
        } : null
      }))
    );

    // Process status effects at turn end
    setEnemyUnits(prev =>
      prev.map(unit => ({
        ...unit,
        statusEffects: unit.statusEffects
          .map(effect => ({ ...effect, duration: effect.duration - 1 }))
          .filter(effect => effect.duration > 0)
      }))
    );
  }

  // After the enemy acts, switch to player
  function endEnemyTurn() {
    setActiveTeam("player");
    resetActedStatus("enemy");

    // Process status effects at turn end
    setPlayerUnits(prev =>
      prev.map(unit => ({
        ...unit,
        statusEffects: unit.statusEffects
          .map(effect => ({ ...effect, duration: effect.duration - 1 }))
          .filter(effect => effect.duration > 0)
      }))
    );
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
        setAttackingUnit(null);
        break;

      case "CancelAbility":
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

  // Modified renderUnitList to include animation classes
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
            `}
            onClick={() => handleUnitClick(unit, team)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="App">
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
          <div className="side enemy-side">{renderUnitList(enemyUnits, "enemy")}</div>
          <div className="side player-side">{renderUnitList(playerUnits, "player")}</div>
        </div>
        {selectedEnemyUnit ? (
          <Sidebar
            unit={selectedEnemyUnit}
            onClose={() => setSelectedEnemyUnit(null)}
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
    </div>
  );
}

export default App;
