import React, { useRef, useState } from "react";
import "./DeveloperPanel.css";
function DeveloperPanel({ 
  actionLog, 
  gameState, 
  onImportGameState,
  onExpandCollapse,
  gameSettings = {}, // Add gameSettings prop with default empty object
  onSettingsChange // Add onSettingsChange prop
}) {
  const [activeTab, setActiveTab] = useState("log");
  const [isExpanded, setIsExpanded] = useState(false);
  const logScrollRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Toggle panel expansion
  const toggleExpand = () => {
    const newExpandState = !isExpanded;
    setIsExpanded(newExpandState);
    if (onExpandCollapse) {
      onExpandCollapse(newExpandState);
    }
  };
  // Function to export action log as JSON
  const exportActionLog = () => {
    const logData = JSON.stringify(actionLog, null, 2);
    downloadJson(logData, `battle-log-${new Date().toISOString().split('T')[0]}.json`);
  };
  // Function to export entire game state
  const exportGameState = () => {
    const gameStateData = JSON.stringify(gameState, null, 2);
    downloadJson(gameStateData, `game-state-${new Date().toISOString().split('T')[0]}.json`);
  };
  
  // Helper function for JSON downloads
  const downloadJson = (data, filename) => {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };
  // Handle the file import
  const handleImportClick = () => {
    fileInputRef.current.click();
  };
  // Process the imported file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        onImportGameState(importedData);
      } catch (error) {
        alert("Error importing game state: " + error.message);
      }
    };
    reader.readAsText(file);
    // Reset the file input so the same file can be selected again
    event.target.value = null;
  };
  
  // Handle settings changes
  const handleSettingChange = (setting, value) => {
    if (onSettingsChange) {
      onSettingsChange(setting, value);
    }
  };
  
  // Function to render log entries with appropriate text
  const renderLogEntry = (entry, index) => {
    let content = <span className="log-text">{entry.text}</span>;
    
    // Handle different log entry types
    if (entry.type === "attack" && entry.targets) {
      content = (
        <>
          <span className="log-text">
            {entry.unit} attacks {entry.targets.map(t => `${t.unit} (${t.Damage} dmg)`).join(", ")}
          </span>
        </>
      );
    } else if (entry.type === "ability" && entry.targets) {
      content = (
        <>
          <span className="log-text">
            {entry.unit} uses {entry.abilityName} on {entry.targets.map(t => 
              `${t.unit} (${t.Damage} dmg${t.Status !== "None" ? `, ${t.Status}` : ''})`
            ).join(", ")}
          </span>
        </>
      );
    } else if (entry.type === "skip") {
      content = <span className="log-text">{entry.unit} skips their turn</span>;
    } else if (entry.type === "ability") {
      content = (
        <>
          <span className="log-text">{entry.text}</span>
        </>
      );
    }

    return (
      <div key={index} className={`log-entry ${entry.type}`}>
        <span className="log-time">{entry.time}</span>
        {content}
      </div>
    );
  };
  return (
    <div className={`developer-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="developer-header">
        <div className="panel-title">
          <span className="dev-icon">⚙️</span>
          <h2>Developer Tools</h2>
        </div>
        <button 
          className="expand-toggle" 
          onClick={toggleExpand}
        >
          {isExpanded ? '◀' : '▶'}
        </button>
      </div>
      
      <div className="developer-tabs">
        <button 
          className={`tab-button ${activeTab === 'log' ? 'active' : ''}`}
          onClick={() => setActiveTab('log')}
        >
          Battle Log
        </button>
        <button 
          className={`tab-button ${activeTab === 'gamestate' ? 'active' : ''}`}
          onClick={() => setActiveTab('gamestate')}
        >
          Game State
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
      
      <div className={`tab-content ${isExpanded ? 'show' : 'hide'}`}>
        {activeTab === 'log' && (
          <div className="battle-log-tab">
            <div className="tab-actions">
              <button 
                className="dev-button export-btn" 
                onClick={exportActionLog}
                title="Export log as JSON"
              >
                📥 Export Log
              </button>
            </div>
            <div className="action-log-scroll" ref={logScrollRef}>
              {actionLog.map((entry, index) => renderLogEntry(entry, index))}
            </div>
          </div>
        )}
        
        {activeTab === 'gamestate' && (
          <div className="game-state-tab">
            <div className="tab-description">
              <p>Export the current game state to a JSON file or import a previously saved game state.</p>
            </div>
            <div className="tab-actions">
              <button 
                className="dev-button export-btn" 
                onClick={exportGameState}
              >
                📤 Export Game State
              </button>
              <button 
                className="dev-button import-btn" 
                onClick={handleImportClick}
              >
                📥 Import Game State
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                style={{ display: 'none' }} 
              />
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="tab-description">
              <p>Configure game behavior and mechanics.</p>
            </div>
            <div className="settings-options">
              <div className="setting-item">
                <div className="setting-item-content">
                  <span className="setting-label">Enable Retaliation Damage</span>
                  <p className="setting-description">
                    When enabled, units will automatically counter-attack when they are attacked, dealing their full damage to the attacker.
                  </p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={gameSettings.enableRetaliation || false}
                    onChange={(e) => handleSettingChange('enableRetaliation', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default DeveloperPanel;