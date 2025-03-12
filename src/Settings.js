import React from "react";

function Settings({ isOpen, onClose, gameSettings, onSettingsChange }) {
  if (!isOpen) return null;

  return (
    <div className="settings-dialog">
      <div className="settings-dialog-content">
        <h2>Game Settings</h2>
        
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-item-content">
              <span className="setting-label">Enable Retaliation</span>
              <p className="setting-description">
                When enabled, units will automatically counter-attack when they are attacked, 
                dealing their full damage to the attacker.
              </p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={gameSettings.enableRetaliation || false}
                onChange={(e) => onSettingsChange('enableRetaliation', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <h3>Keyboard Shortcuts</h3>
          <div className="setting-item">
            <div className="shortcuts-list">
              <div className="shortcut">
                <kbd>A</kbd>
                <span>Attack with selected unit</span>
              </div>
              <div className="shortcut">
                <kbd>Q</kbd>
                <span>Use ability (if available)</span>
              </div>
              <div className="shortcut">
                <kbd>S</kbd>
                <span>Skip turn</span>
              </div>
            </div>
          </div>
        </div>
        
        <button className="settings-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Settings;