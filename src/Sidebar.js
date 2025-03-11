import React from "react";
import "./Sidebar.css";

function Sidebar({ unit, onClose, onAction, position = "right", isAttacking = false, hasTarget = false }) {
  if (!unit) return null;

  return (
    <div className={`sidebar ${position}`}>
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="unit-details">
        <img src={unit.image} alt={unit.name} className="unit-detail-image" />
        <h2>{unit.name}</h2>
        <div className="unit-stats">
          <p>HP: {unit.hp}/{unit.maxHP}</p>
          <p>Damage: {unit.damage}</p>
        </div>
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
            ) : (
              unit.actions.map((action, index) => (
                <button 
                  key={index} 
                  className="action-button"
                  onClick={() => onAction(action)}
                >
                  {action}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
