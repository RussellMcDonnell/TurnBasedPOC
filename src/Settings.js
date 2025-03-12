import React from "react";

function Settings({ isOpen, onClose, gameSettings, onSettingsChange }) {
  if (!isOpen) return null;
  
  const handleToggleChange = (setting) => {
    onSettingsChange(setting, !gameSettings[setting]);
  };

  return (
    <div className="settings-dialog">
      <div className="settings-dialog-content">
        <h2>Game Settings</h2>
        
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-label">Enable Retaliation Damage</div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={gameSettings.enableRetaliation || false}
                  onChange={() => handleToggleChange('enableRetaliation')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          <p className="setting-description">
            When enabled, units will automatically counter-attack when they are attacked, dealing their full damage to the attacker.
          </p>
        </div>
        
        <button className="settings-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Settings;