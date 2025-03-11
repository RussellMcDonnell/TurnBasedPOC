import React, { useEffect, useRef } from 'react';

function UnitCard({ unit, team, isSelected, isAttacking, onClick }) {
  const cardRef = useRef(null);
          
  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const battlefield = document.querySelector('.battlefield');
      const battlefieldRect = battlefield.getBoundingClientRect();
      const centerX = rect.left - battlefieldRect.left;
      const centerY = rect.top - battlefieldRect.top;
      unit.cardPosition = { x: centerX, y: centerY };
    }
  }, [unit]);

  return (
    <div
      ref={cardRef}
      className={`unit-card ${unit.isDead ? "dead" : ""} ${
        unit.acted ? "acted" : ""
      } ${isSelected ? "selected" : ""}
      ${isAttacking ? "attacking" : ""}`}
      onClick={onClick}
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
  );
}

export default UnitCard;