import React from 'react';
import './MainMenu.css';
import mainMenuArt from './images/main-menu-full-art.jpg';

function MainMenu({ onStartGame }) {
  return (
    <div className="main-menu" style={{ backgroundImage: `url(${mainMenuArt})` }}>
      <div className="menu-content">
        <h1>Turn-Based Combat</h1>
        <div className="menu-buttons">
          <button className="menu-button play-button" onClick={onStartGame}>
            Play Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;