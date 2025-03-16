import React from "react";
import "./UnitCard.css";

function UnitCard({ unit, team, isSelected, isAttacking, className = "", onClick, onViewArt }) {
  // Ensure className is trimmed and properly formatted
  const trimmedClassName = className.replace(/\s+/g, ' ').trim();
  
  // Only apply 'attacking' class when both conditions are met: 
  // 1. This is the attacking unit 
  // 2. A target has been selected (passed through className)
  const classes = `
    unit-card
    ${isSelected ? "selected" : ""}
    ${unit.acted ? "acted" : ""}
    ${unit.isDead ? "dead" : ""}
    ${isAttacking && className.includes('target-selected') ? "attacking" : ""}
    ${trimmedClassName}
  `.trim();
  
  return (
    <div className={classes} onClick={onClick}>
      <h3 className="unit-name">{unit.name}</h3>
      <img src={unit.image} alt={unit.name} className="unit-image" />
      
      {/* Status Effect Indicators */}
      {unit.statusEffects && unit.statusEffects.length > 0 && (
        <div className="status-indicators">
          {unit.statusEffects.map((effect, idx) => (
            <div 
              key={`status-${idx}`} 
              className={`status-icon ${effect.type}`} 
              title={effect.name}
            >
              {effect.icon}
            </div>
          ))}
        </div>
      )}
      
      {unit.ability && (
        <div className="unit-ability">
          <div className="ability-header">
            <span className="ability-icon">{unit.ability.icon}</span>
            <span className="ability-name">{unit.ability.name}</span>
          </div>
          {unit.ability.currentCooldown > 0 && (
            <div className="cooldown-indicator">
              CD: {unit.ability.currentCooldown}/{unit.ability.maxCooldown}
            </div>
          )}
        </div>
      )}
      
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
      
      {onViewArt && (
        <button 
          className="view-art-button"
          onClick={(e) => {
            e.stopPropagation();
            onViewArt(unit);
          }}
        >
          View Art
        </button>
      )}
    </div>
  );
}
export default UnitCard;