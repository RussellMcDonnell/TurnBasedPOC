import React from 'react';
import './MainMenu.css';
import mainMenuArt from '../../assets/images/main-menu-full-art.jpg';
import { useNavigate } from 'react-router-dom';

function MainMenu() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/select-play');
  };

  const handleTeamClick = () => {
    navigate('/team');
  };

  const handleStoreClick = () => {
    navigate('/store');
  };

  return (
    <div className="main-menu" style={{ backgroundImage: `url(${mainMenuArt})` }}>
      <div className="menu-content">
        <h1>Project232</h1>
        <div className="menu-buttons">
          <button className="menu-button play-button" onClick={handlePlayClick}>
            Play Game
          </button>
          <button className="menu-button" onClick={handleTeamClick}>
            Team
          </button>
          <button className="menu-button" onClick={handleStoreClick}>
            Store
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;