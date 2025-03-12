import React, { useState } from "react";

function GameMenu({ 
  onSurrender, 
  onResetGame, 
  onOpenSettings,
  isGameOver,
  selectedTeam,
  selectedEnemyTeam,
  availableTeams,
  enemyTeams,
  onTeamChange,
  onEnemyTeamChange
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSurrenderDialog, setShowSurrenderDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSurrenderClick = () => {
    setShowSurrenderDialog(true);
    setIsMenuOpen(false);
  };
  
  const handleResetClick = () => {
    setShowResetDialog(true);
    setIsMenuOpen(false);
  };
  
  const handleSettingsClick = () => {
    onOpenSettings();
    setIsMenuOpen(false);
  };
  
  const confirmSurrender = () => {
    setShowSurrenderDialog(false);
    onSurrender();
  };
  
  const confirmReset = () => {
    setShowResetDialog(false);
    onResetGame();
  };

  return (
    <>
      <button className="game-menu-button" onClick={toggleMenu}>
        <span className="menu-option-icon">🎮</span>
        Menu
      </button>
      
      {isMenuOpen && (
        <div className="game-menu-panel">
          <div className="game-menu-header">
            <span className="menu-option-icon">🎮</span>
            Game Menu
          </div>
          <div className="menu-options">
            <div className="menu-section">
              <h4>Team Selection</h4>
              <select 
                value={selectedTeam}
                onChange={(e) => onTeamChange(e.target.value)}
                className="team-select"
              >
                {availableTeams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
              
              <h4>Enemy Selection</h4>
              <select 
                value={selectedEnemyTeam}
                onChange={(e) => onEnemyTeamChange(e.target.value)}
                className="team-select"
              >
                {enemyTeams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            
            <div className="menu-option" onClick={handleSettingsClick}>
              <span className="menu-option-icon">⚙️</span>
              <span className="menu-option-text">Settings</span>
            </div>
            
            <div className="menu-option" onClick={handleResetClick}>
              <span className="menu-option-icon">🔄</span>
              <span className="menu-option-text">Reset Game</span>
            </div>
            
            {!isGameOver && (
              <div className="menu-option danger" onClick={handleSurrenderClick}>
                <span className="menu-option-icon">🏳️</span>
                <span className="menu-option-text">Surrender</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {showSurrenderDialog && (
        <div className="surrender-dialog">
          <div className="surrender-dialog-content">
            <h2>Surrender Battle?</h2>
            <p>
              Are you sure you want to surrender this battle? Your party will be defeated and the battle will end.
            </p>
            <div className="surrender-buttons">
              <button 
                className="surrender-button confirm-surrender" 
                onClick={confirmSurrender}
              >
                Surrender
              </button>
              <button 
                className="surrender-button cancel-surrender" 
                onClick={() => setShowSurrenderDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showResetDialog && (
        <div className="reset-dialog">
          <div className="reset-dialog-content">
            <h2>Reset Game?</h2>
            <p>
              Are you sure you want to reset the game? All progress will be lost and the battle will start from the beginning.
            </p>
            <div className="reset-buttons">
              <button 
                className="reset-button confirm-reset" 
                onClick={confirmReset}
              >
                Reset Game
              </button>
              <button 
                className="reset-button cancel-reset" 
                onClick={() => setShowResetDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GameMenu;