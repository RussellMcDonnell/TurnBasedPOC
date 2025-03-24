import React from "react";

function Settings({ isOpen, onClose, gameSettings, onSettingsChange }) {
  if (!isOpen) return null;

  return (
    <div className="settings-dialog">
      <div className="settings-dialog-content">
        <h2>Game Settings</h2>
        
        <div className="settings-list">
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
              <div className="shortcut">
                <kbd>E</kbd>
                <span>Confirm</span>
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