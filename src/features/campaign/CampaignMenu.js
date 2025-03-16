import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CampaignMenu.css';
import villageDefense from '../../assets/images/campaign/village-defense.jpg';
import shop from '../../assets/images/campaign/shop.jpg';
import darkForest from '../../assets/images/campaign/dark-forest.jpg';
import darkForestRiver from '../../assets/images/campaign/dark-forest-with-river.jpg';
import darkForestCave from '../../assets/images/campaign/dark-forest-cave-entrence.jpg';
import mountainAmbush from '../../assets/images/campaign/mountain-ambush.jpg';
import ancientRuins from '../../assets/images/campaign/ancient-ruins.jpg';
import dragonsLair from '../../assets/images/campaign/dragons-lair.png';

const campaignNodes = [
  {
    id: 1,
    title: "Shrouded Woods",
    description: "You step into the eerie darkness of the forest, where twisted trees whisper secrets and unseen creatures stalk the shadows.",
    position: { x: 250, y: 100 },
    connections: [2],
    type: "combat",
    difficulty: "Easy",
    preview: darkForest,
    enemyTeam: "Enchanted Grove"  // Will-o'-wisps, pixies, and wood sprites
  },
  {
    id: 2,
    title: "Traveling Merchant",
    description: "A traveling merchant offers rare equipment and supplies for your journey ahead.",
    position: { x: 550, y: 200 },
    connections: [3],
    type: "shop",
    preview: shop
  },
  {
    id: 3,
    title: "River of Shadows",
    description: "A treacherous river cuts through the forest, its dark waters hiding more than just fish. Beware the lurking dangers beneath the surface.",
    position: { x: 250, y: 300 },
    connections: [4],
    type: "combat",
    difficulty: "Medium",
    preview: darkForestRiver,
    enemyTeam: "Forest Guardians"  // Treant Guardian, Wood Sprite, Pixie Trickster
  },
  {
    id: 4,
    title: "The Hollow Cavern",
    description: "A cave entrance yawns before you, the air thick with the scent of decay. Something ancient and restless stirs in the darkness within.",
    position: { x: 550, y: 400 },
    connections: [5],
    type: "combat",
    difficulty: "Medium",
    preview: darkForestCave,
    enemyTeam: "Nature's Defenders"  // Grass Golem, Sunflower Sentinel, Wood Sprite
  },
  {
    id: 5,
    title: "Mystic Trader",
    description: "A mystical merchant appears, offering powerful enchantments and magical artifacts.",
    position: { x: 250, y: 500 },
    connections: [6],
    type: "shop",
    preview: shop
  },
  {
    id: 6,
    title: "Wolf Pack Ambush",
    description: "A chilling howl echoes through the forest. Before you can react, glowing eyes emerge from the darkness—you're surrounded.",
    position: { x: 550, y: 600 },
    connections: [7],
    type: "combat",
    difficulty: "Medium",
    preview: mountainAmbush,
    enemyTeam: "Wolf Pack"  // Three Dire Wolves
  },
  {
    id: 7,
    title: "Dragon's Lair",
    description: "Face the final challenge in the dragon's lair, where ultimate power awaits.",
    position: { x: 250, y: 700 },
    connections: [],
    type: "combat",
    difficulty: "Very Hard",
    preview: dragonsLair,
    enemyTeam: "Dragon Lair"  // Ashbringer and Lyn Valken
  }
];

const CampaignMenu = () => {
  const [selectedNode, setSelectedNode] = useState(campaignNodes[0]);
  const navigate = useNavigate();

  const handleBeginBattle = () => {
    navigate('/battlefield', {
      state: {
        gameMode: 'campaign',
        level: selectedNode
      }
    });
  };

  const handleBackClick = () => {
    navigate('/select-play');
  };

  const renderConnections = () => {
    return campaignNodes.map(node => {
      return node.connections.map(targetId => {
        const targetNode = campaignNodes.find(n => n.id === targetId);
        if (!targetNode) return null;

        return (
          <line
            key={`${node.id}-${targetId}`}
            x1={node.position.x}
            y1={node.position.y}
            x2={targetNode.position.x}
            y2={targetNode.position.y}
            stroke="#fff"
            strokeWidth="2"
          />
        );
      });
    });
  };

  return (
    <div className="campaign-container">
      <button className="back-button" onClick={handleBackClick}>
        Back to Game Selection
      </button>
      
      <div className="campaign-map">
        <svg className="connections-layer">
          {renderConnections()}
        </svg>
        <div className="nodes-layer">
          {campaignNodes.map(node => (
            <div
              key={node.id}
              className={`campaign-node ${node.type} ${selectedNode.id === node.id ? 'selected' : ''}`}
              style={{ left: node.position.x, top: node.position.y }}
              onClick={() => setSelectedNode(node)}
            >
              {node.title}
            </div>
          ))}
        </div>
      </div>
      
      <div className="level-preview">
        <h2>{selectedNode.title}</h2>
        <div className="preview-image">
          <img src={selectedNode.preview} alt={`Preview of ${selectedNode.title}`} />
        </div>
        <div className="level-details">
          {selectedNode.type === 'combat' && (
            <p className="difficulty">Difficulty: {selectedNode.difficulty}</p>
          )}
          <p className="description">{selectedNode.description}</p>
          <button 
            className="start-level"
            onClick={handleBeginBattle}
          >
            {selectedNode.type === 'combat' ? 'Begin Battle' : 'Visit Shop'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignMenu;