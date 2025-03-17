import React from "react";
import "./Sidebar.css";
function Sidebar({ unit, onClose, onAction, position = "right", isAttacking = false, hasTarget = false, isUsingAbility = false, onViewFullArt }) {
  if (!unit) return null;
  
  return (
    <div className={`sidebar ${position}`}>
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="unit-details">
        <img src={unit.image} alt={unit.name} className="unit-detail-image" />
        <h2>{unit.name}</h2>
        
        {/* Add View Full Art button below the unit image */}
        {unit.fullArt && (
          <button 
            className="view-art-btn sidebar-btn" 
            onClick={() => onViewFullArt && onViewFullArt(unit)}
          >
            🖼️ View Full Art
          </button>
        )}
        
        <div className="sidebar-unit-stats">
          <p>HP: {unit.hp}/{unit.maxHP}</p>
          <p>Damage: {unit.damage}</p>
        </div>
        
        {unit.statusEffects && unit.statusEffects.length > 0 && (
          <div className="status-effects-list">
            <h4>Status Effects</h4>
            <ul>
              {unit.statusEffects.map((effect, index) => (
                <li key={index} className={`status-effect-item ${effect.type}`}>
                  {effect.icon} {effect.name} ({effect.duration} {effect.duration === 1 ? 'turn' : 'turns'})
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {unit.ability && (
          <div className="ability-details">
            <h4>Special Ability</h4>
            <div className="ability-card">
              <div className="ability-title">
                <span className="ability-icon">{unit.ability.icon}</span>
                <span className="ability-name">{unit.ability.name}</span>
              </div>
              <p className="ability-description">{unit.ability.description}</p>
              <p className="ability-cooldown">
                Cooldown: {unit.ability.currentCooldown > 0 ? 
                  `${unit.ability.currentCooldown}/${unit.ability.maxCooldown} turns` : 
                  'Ready'}
              </p>
            </div>
          </div>
        )}
        
        {unit.actions && (
          <div className="action-list">
            <h3>Actions</h3>
            {isAttacking ? (
              <>
                {hasTarget && (
                  <button 
                    className="action-button confirm"
                    onClick={() => onAction("Confirm")}
                  >
                    Confirm Attack
                  </button>
                )}
                <button 
                  className="action-button cancel"
                  onClick={() => onAction("Cancel")}
                >
                  Cancel Attack
                </button>
              </>
            ) : isUsingAbility ? (
              <button 
                className="action-button cancel"
                onClick={() => onAction("CancelAbility")}
              >
                Cancel Ability
              </button>
            ) : (
              <>
                {unit.actions.map((action, index) => (
                  <button 
                    key={index} 
                    className="action-button"
                    onClick={() => onAction(action)}
                    disabled={action === "UseAbility" && 
                              unit.ability && 
                              unit.ability.currentCooldown > 0}
                  >
                    {action}
                  </button>
                ))}
                {unit.ability && unit.ability.currentCooldown === 0 && (
                  <button 
                    className="action-button ability"
                    onClick={() => onAction("UseAbility")}
                  >
                    {unit.ability.icon} {unit.ability.name}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default Sidebar;