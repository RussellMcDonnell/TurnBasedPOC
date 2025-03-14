import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CampainMenu.css';

const campaignNodes = [
  {
    id: 1,
    title: "Village Defense",
    description: "Your journey begins here. Face off against a small band of mercenaries threatening the local village.",
    position: { x: 250, y: 100 },
    connections: [2],
    type: "combat",
    difficulty: "Easy",
    preview: "/images/battlegrounds/infernos-reckoning.png"
  },
  {
    id: 2,
    title: "Traveling Merchant",
    description: "A traveling merchant offers rare equipment and supplies for your journey ahead.",
    position: { x: 550, y: 200 },
    connections: [3],
    type: "shop",
    preview: "/images/battlegrounds/infernos-reckoning.png"
  },
  {
    id: 3,
    title: "Mountain Ambush",
    description: "Navigate through treacherous mountain paths while dealing with hostile forces lying in wait.",
    position: { x: 250, y: 300 },
    connections: [4],
    type: "combat",
    difficulty: "Medium",
    preview: "/images/battlegrounds/infernos-reckoning.png"
  },
  {
    id: 4,
    title: "Dark Forest",
    description: "Battle through the mysterious dark forest where ancient enemies lurk in the shadows.",
    position: { x: 550, y: 400 },
    connections: [5],
    type: "combat",
    difficulty: "Medium",
    preview: "/images/battlegrounds/infernos-reckoning.png"
  },
  {
    id: 5,
    title: "Mystic Trader",
    description: "A mystical merchant appears, offering powerful enchantments and magical artifacts.",
    position: { x: 250, y: 500 },
    connections: [6],
    type: "shop",
    preview: "/images/battlegrounds/infernos-reckoning.png"
  },
  {
    id: 6,
    title: "Ancient Ruins",
    description: "Explore dangerous ruins filled with powerful guardians protecting ancient treasures.",
    position: { x: 550, y: 600 },
    connections: [7],
    type: "combat",
    difficulty: "Hard",
    preview: "/images/battlegrounds/infernos-reckoning.png"
  },
  {
    id: 7,
    title: "Dragon's Lair",
    description: "Face the final challenge in the dragon's lair, where ultimate power awaits.",
    position: { x: 250, y: 700 },
    connections: [],
    type: "combat",
    difficulty: "Very Hard",
    preview: "/images/battlegrounds/infernos-reckoning.png"
  }
];

const CampainMenu = () => {
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

export default CampainMenu;