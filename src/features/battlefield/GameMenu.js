import React, { useState } from "react";

function GameMenu({ 
  onSurrender,
  onOpenSettings,
  isGameOver
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSurrenderDialog, setShowSurrenderDialog] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSurrenderClick = () => {
    setShowSurrenderDialog(true);
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
            <div className="menu-option" onClick={handleSettingsClick}>
              <span className="menu-option-icon">⚙️</span>
              <span className="menu-option-text">Settings</span>
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
    </>
  );
}

export default GameMenu;