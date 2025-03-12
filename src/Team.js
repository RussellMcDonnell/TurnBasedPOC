import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Team.css'; // Import the CSS file below

// Example data for teams
const teams = ['The Arcane Wardens', 'Blades of the Fallen'];

// Example card data
const initialCards = [
  {
    id: 1,
    name: 'Silkfang',
    type: 'Spider',
    image: 'https://via.placeholder.com/100?text=Spider',
    stats: [
      { label: 'Armor', value: 1, icon: '🛡️' },
      { label: 'Damage', value: 2, icon: '⚔️' },
    ],
  },
  {
    id: 2,
    name: 'Einhørhowl',
    type: 'Wolf',
    image: 'https://via.placeholder.com/100?text=Wolf',
    stats: [
      { label: 'Renew', value: 1, icon: '➕' },
      { label: 'Damage', value: 2, icon: '⚔️' },
    ],
  },
  {
    id: 3,
    name: 'Varre Stormrune',
    type: 'Mage',
    image: 'https://via.placeholder.com/100?text=Mage',
    stats: [
      { label: 'First Strike', value: 1, icon: '⚡' },
      { label: 'Damage', value: 3, icon: '⚔️' },
    ],
  },
  {
    id: 4,
    name: 'Lyphaxos',
    type: 'Wolf',
    image: 'https://via.placeholder.com/100?text=Wolf',
    stats: [
      { label: 'Armor', value: 2, icon: '🛡️' },
      { label: 'Damage', value: 3, icon: '⚔️' },
    ],
  },
  {
    id: 5,
    name: 'Nightmare',
    type: 'Demon',
    image: 'https://via.placeholder.com/100?text=Demon',
    stats: [
      { label: 'Damage', value: 4, icon: '⚔️' },
      { label: 'Fear', value: 2, icon: '😱' },
    ],
  },
  {
    id: 6,
    name: 'Scorchwing',
    type: 'Dragon',
    image: 'https://via.placeholder.com/100?text=Dragon',
    stats: [
      { label: 'Armor', value: 3, icon: '🛡️' },
      { label: 'Damage', value: 5, icon: '⚔️' },
    ],
  },
];

function Team() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cards] = useState(initialCards);
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  // Filter cards based on the search term (by name or type)
  const filteredCards = cards.filter((card) => {
    const combinedText = (card.name + card.type).toLowerCase();
    return combinedText.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="team-builder-container">
      {/* Sidebar with team names */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Teams</h2>
        {teams.map((team) => (
          <div key={team} className="team-name">
            {team}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="header-bar">
          <button className="back-button" onClick={handleBackClick}>Back</button>
          <h1>Default Team View</h1>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </header>

        {/* Cards grid */}
        <section className="cards-grid">
          {filteredCards.map((card) => (
            <div key={card.id} className="card">
              <img src={card.image} alt={card.name} className="card-image" />
              <h2 className="card-name">{card.name}</h2>
              <p className="card-type">{card.type}</p>
              <div className="card-stats">
                {card.stats.map((stat, index) => (
                  <div key={index} className="stat">
                    <span className="stat-icon">{stat.icon}</span>
                    <span className="stat-label">{stat.label}</span>
                    <span className="stat-value">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Team;
