import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./Sidebar";

function App() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  
  // Example unit data with images
  const [playerUnits, setPlayerUnits] = useState([
    {
      id: "p1",
      name: "Varen Stormrune",
      maxHP: 30,
      hp: 30,
      damage: 5,
      acted: false,
      isDead: false,
      image: "https://placekitten.com/100/100", // placeholder image
      actions: ["Attack", "Pass"]
    },
    {
      id: "p2",
      name: "Wolf",
      maxHP: 20,
      hp: 20,
      damage: 4,
      acted: false,
      isDead: false,
      image: "https://placekitten.com/100/100", // placeholder image
      actions: ["Attack", "Pass"]
    },
    {
      id: "p3",
      name: "Spider",
      maxHP: 15,
      hp: 15,
      damage: 3,
      acted: false,
      isDead: false,
      image: "https://placekitten.com/100/100", // placeholder image
      actions: ["Attack", "Pass"]
    },
    {
      id: "p4",
      name: "Spider",
      maxHP: 15,
      hp: 15,
      damage: 3,
      acted: false,
      isDead: false,
      image: "https://placekitten.com/100/100", // placeholder image
      actions: ["Attack", "Pass"]
    },
    {
      id: "p5",
      name: "Spell",
      maxHP: 15,
      hp: 15,
      damage: 3,
      acted: false,
      isDead: false,
      image: "https://placekitten.com/100/100", // placeholder image
      actions: ["Attack", "Pass"]
    },
    {
      id: "p6",
      name: "Wolf",
      maxHP: 20,
      hp: 20,
      damage: 4,
      acted: false,
      isDead: false,
      image: "https://placekitten.com/100/100", // placeholder image
      actions: ["Attack", "Pass"]
    },
  ]);

  const [enemyUnits, setEnemyUnits] = useState([
    {
      id: "e1",
      name: "Ashbringer (Dragon)",
      maxHP: 50,
      hp: 50,
      damage: 8,
      acted: false,
      isDead: false,
      image: "https://placekitten.com/101/101", // placeholder image
    },
    {
      id: "e2",
      name: "Lyn Valken (Human)",
      maxHP: 20,
      hp: 20,
      damage: 4,
      acted: false,
      isDead: false,
      image: "https://placekitten.com/101/101", // placeholder image
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
    if (team === "player" && activeTeam === "player" && !unit.acted && !unit.isDead) {
      setSelectedUnit(unit);
    }
  };

  // Handle action selection from sidebar
  const handleAction = (action) => {
    if (!selectedUnit) return;

    if (action === "Attack") {
      const firstAliveEnemy = enemyUnits.find(e => !e.isDead);
      if (firstAliveEnemy) {
        handleBasicAttack("player", selectedUnit.id, firstAliveEnemy.id);
      }
    } else if (action === "Pass") {
      handlePass("player", selectedUnit.id);
    }
    setSelectedUnit(null);
  };

  // UI Helpers
  function renderUnitList(units, team) {
    return (
      <div className="unit-list">
        {units.map((unit) => (
          <div
            key={unit.id}
            className={`unit-card ${unit.isDead ? "dead" : ""} ${
              unit.acted ? "acted" : ""
            } ${selectedUnit?.id === unit.id ? "selected" : ""}`}
            onClick={() => handleUnitClick(unit, team)}
          >
            <h3 className="unit-name">{unit.name}</h3>
            <img src={unit.image} alt={unit.name} className="unit-image" />
            <div className="unit-description">
              {team === "player" ? "Allied Unit" : "Enemy Unit"}
            </div>
            <div className="unit-stats">
              <div className="stat">
                <span className="stat-icon">❤️</span>
                <span>{unit.hp}/{unit.maxHP}</span>
              </div>
              <div className="stat">
                <span className="stat-icon">⚔️</span>
                <span>{unit.damage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Turn-Based Combat Demo</h1>

      {gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          {winner === "player" ? <p>You Won!</p> : <p>You Lost!</p>}
        </div>
      ) : (
        <div className="status">
          <p>Active Team: {activeTeam.toUpperCase()}</p>
          {!firstTurnUsed && activeTeam === "player" && (
            <p>First turn: You only get 1 action this round.</p>
          )}
        </div>
      )}

      <div className="game-container">
        <div className="battlefield">
          <div className="side enemy-side">
            <h2>Enemy Units</h2>
            {renderUnitList(enemyUnits, "enemy")}
          </div>
          <div className="side player-side">
            <h2>Player Units</h2>
            {renderUnitList(playerUnits, "player")}
          </div>
        </div>
        <Sidebar 
          unit={selectedUnit} 
          onClose={() => setSelectedUnit(null)}
          onAction={handleAction}
        />
      </div>
    </div>
  );
}

export default App;
