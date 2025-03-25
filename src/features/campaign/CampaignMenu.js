import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CampaignMenu.css';
import villageDefense from '../../assets/images/campaign/village-defense.jpg';
import shop from '../../assets/images/campaign/shop.jpg';
import healer from '../../assets/images/campaign/heal.jpg';
import darkForest from '../../assets/images/campaign/dark-forest.jpg';
import darkForestRiver from '../../assets/images/campaign/dark-forest-with-river.jpg';
import darkForestCave from '../../assets/images/campaign/dark-forest-cave-entrence.jpg';
import mountainAmbush from '../../assets/images/campaign/mountain-ambush.jpg';
import ancientRuins from '../../assets/images/campaign/ancient-ruins.jpg';
import dragonsLair from '../../assets/images/campaign/dragons-lair.png';
import dragonsLairBattleground from '../../assets/images/battlegrounds/dragons-lair.png';
import darkForestBattleground from '../../assets/images/battlegrounds/dark-forest.jpg';
import mountainAmbushBattleground from '../../assets/images/battlegrounds/ice-mountain-clifs.jpg';
import darkForestWithRiverBattleground from '../../assets/images/battlegrounds/dark-forest-with-river.jpg';
import darkForestWithCaveBattleground from '../../assets/images/battlegrounds/dark-forest-cave.jpg';

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
    battlegroundBackground: darkForestBattleground,
    enemyTeam: "Shrouded Woods"
  },
  {
    id: 2,
    title: "Forest Shrine",
    description: "A serene shrine nestled among ancient trees. The healing waters here can restore your team's vitality.",
    position: { x: 550, y: 200 },
    connections: [3],
    type: "healing",
    preview: healer
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
    battlegroundBackground: darkForestWithRiverBattleground,
    enemyTeam: "River of Shadows"
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
    battlegroundBackground: darkForestWithCaveBattleground,
    enemyTeam: "The Hollow Cavern"
  },
  {
    id: 5,
    title: "Wolf Pack Ambush",
    description: "A chilling howl echoes through the forest. Before you can react, glowing eyes emerge from the darkness—you're surrounded.",
    position: { x: 250, y: 500 },
    connections: [6],
    type: "combat",
    difficulty: "Medium",
    preview: mountainAmbush,
    battlegroundBackground: mountainAmbushBattleground,
    enemyTeam: "Wolf Pack Ambush"  // Four Dire Wolves
  },
  {
    id: 6,
    title: "Sacred Spring",
    description: "A mystical spring with restorative powers. Your team can rest here and recover their strength before continuing the journey.",
    position: { x: 550, y: 600 },
    connections: [7],
    type: "healing",
    preview: healer
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
    battlegroundBackground: dragonsLairBattleground,
    enemyTeam: "Dragon Lair"  // Ashbringer and Lyn Valken
  }
];

const CampaignMenu = () => {
  const [selectedNode, setSelectedNode] = useState(campaignNodes[0]);
  const navigate = useNavigate();

  const handleNodeAction = () => {
    if (selectedNode.type === 'combat') {
      // Navigate to battlefield for combat nodes
      navigate('/battlefield', {
        state: {
          gameMode: 'campaign',
          level: selectedNode
        }
      });
    } else if (selectedNode.type === 'healing') {
      // Handle healing - this would interact with your team state/context
      handleHeal();
    } else if (selectedNode.type === 'shop') {
      // Navigate to shop page (not implemented yet)
      navigate('/shop');
    }
  };

  const handleHeal = () => {
    // This function would heal all units in the player's team
    // You would need to access your team state or context here
    // For example, if using TeamContext:
    // const { team, updateTeam } = useContext(TeamContext);
    // const healedTeam = team.map(unit => ({
    //   ...unit,
    //   currentHealth: unit.maxHealth
    // }));
    // updateTeam(healedTeam);
    
    // For now, just show an alert
    alert("Your team has been fully healed!");
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
            onClick={handleNodeAction}
          >
            {selectedNode.type === 'combat' 
              ? 'Begin Battle' 
              : selectedNode.type === 'healing' 
                ? 'Rest and Heal' 
                : 'Visit Shop'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignMenu;