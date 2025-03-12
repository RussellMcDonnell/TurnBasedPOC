import React from "react";

function UnitCard({ unit, team, isSelected, isAttacking, className = "", onClick }) {
  // Ensure className is trimmed and properly formatted
  const trimmedClassName = className.replace(/\s+/g, ' ').trim();
  
  const classes = `
    unit-card
    ${isSelected ? "selected" : ""}
    ${unit.acted ? "acted" : ""}
    ${unit.isDead ? "dead" : ""}
    ${isAttacking ? "attacking" : ""}
    ${trimmedClassName}
  `.trim();

  return (
    <div className={classes} onClick={onClick}>
      <h3 className="unit-name">{unit.name}</h3>
      <img src={unit.image} alt={unit.name} className="unit-image" />
      <div className="unit-stats">
        <span className="stat">
          <span className="stat-icon">❤️</span>
          {unit.hp}/{unit.maxHP}
        </span>
        <span className="stat">
          <span className="stat-icon">⚔️</span>
          {unit.damage}
        </span>
      </div>
    </div>
  );
}

export default UnitCard;