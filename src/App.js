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
  const [selectedPlayerUnit, setSelectedPlayerUnit] = useState(null);
  const [selectedEnemyUnit, setSelectedEnemyUnit] = useState(null);
  const [attackingUnit, setAttackingUnit] = useState(null);
  
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
      actions: ["Attack", "Pass"]
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
      actions: ["Attack", "Pass"]
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
      actions: ["Attack", "Pass"]
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
      actions: ["Attack", "Pass"]
    }
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

  // Basic Attack action
  // attackerTeam is either "player" or "enemy"
  // attackerId is the ID of the unit attacking
  // targetId is the ID of the enemy unit
  function handleBasicAttack(attackerTeam, attackerId, targetId) {
    if (gameOver) return;

    if (attackerTeam === "player") {
      const attacker = playerUnits.find((u) => u.id === attackerId);
      if (!attacker || attacker.acted || attacker.isDead) return;

      // Attack an enemy
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

      // Mark attacker as having acted
      setPlayerUnits((prev) =>
        prev.map((u) => (u.id === attackerId ? { ...u, acted: true } : u))
      );

      // If it's the first turn, switch to enemy after one action
      if (!firstTurnUsed) {
        setFirstTurnUsed(true);
        endPlayerTurn();
      }

    } else {
      // Enemy is attacking
      const attacker = enemyUnits.find((u) => u.id === attackerId);
      if (!attacker || attacker.acted || attacker.isDead) return;

      // Attack a player unit (for simplicity, pick first alive unit)
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

      // Mark attacker as having acted
      setEnemyUnits((prev) =>
        prev.map((u) => (u.id === attackerId ? { ...u, acted: true } : u))
      );
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
  }

  // After the enemy acts, switch to player
  function endEnemyTurn() {
    setActiveTeam("player");
    resetActedStatus("enemy");
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

  // Simple AI for the enemy: If it's enemy's turn, each alive enemy unit attacks once.
  useEffect(() => {
    if (activeTeam === "enemy" && !gameOver) {
      // Let each enemy unit do a basic attack on the first alive player unit, then end turn.
      const alivePlayerUnits = playerUnits.filter((u) => !u.isDead);
      const targetId = alivePlayerUnits.length ? alivePlayerUnits[0].id : null;

      if (targetId) {
        // Go through each enemy unit that is alive & hasn't acted
        enemyUnits.forEach((enemy) => {
          if (!enemy.isDead && !enemy.acted) {
            handleBasicAttack("enemy", enemy.id, targetId);
          }
        });
      }
      // End enemy turn
      setTimeout(() => {
        endEnemyTurn();
      }, 500); // small delay to simulate turn
    }
  }, [activeTeam, enemyUnits, playerUnits, gameOver]);

  // Handle unit selection
  const handleUnitClick = (unit, team) => {
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

    if (action === "Attack") {
      setAttackingUnit(selectedPlayerUnit);
    } else if (action === "Confirm") {
      handleBasicAttack("player", attackingUnit.id, selectedEnemyUnit.id);
      setAttackingUnit(null);
      setSelectedPlayerUnit(null);
      setSelectedEnemyUnit(null);
    } else if (action === "Cancel") {
      setAttackingUnit(null);
    } else if (action === "Pass") {
      handlePass("player", selectedPlayerUnit.id);
      setSelectedPlayerUnit(null);
    }
  };

  // UI Helpers
  function renderUnitList(units, team) {
    return (
      <div className="unit-list">
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            team={team}
            isSelected={(team === "player" && selectedPlayerUnit?.id === unit.id) || 
                      (team === "enemy" && selectedEnemyUnit?.id === unit.id)}
            isAttacking={attackingUnit?.id === unit.id}
            onClick={() => handleUnitClick(unit, team)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="App">
      <div className="game-container">
        {selectedPlayerUnit ? (
          <Sidebar 
            unit={selectedPlayerUnit} 
            onClose={() => {
              setSelectedPlayerUnit(null);
              setAttackingUnit(null);
            }}
            onAction={handleAction}
            position="left"
            isAttacking={!!attackingUnit}
            hasTarget={!!selectedEnemyUnit}
          />
        ) : (
          <div className="sidebar-placeholder" />
        )}
        <div className="battlefield" data-attacking={!!attackingUnit}>
          {attackingUnit && selectedEnemyUnit && (
            <div className="attack-line" style={{
              '--start-x': `${attackingUnit.cardPosition?.x || 0}px`,
              '--start-y': `${attackingUnit.cardPosition?.y || 0}px`,
              '--end-x': `${selectedEnemyUnit.cardPosition?.x || 0}px`,
              '--end-y': `${selectedEnemyUnit.cardPosition?.y || 0}px`,
            }} />
          )}
          <div className="side enemy-side">
            {renderUnitList(enemyUnits, "enemy")}
          </div>
          <div className="side player-side">
            {renderUnitList(playerUnits, "player")}
          </div>
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
    </div>
  );
}

export default App;
