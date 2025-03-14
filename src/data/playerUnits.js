// Import unit portraits and full art
import varenPortrait from "../assets/images/units/varen-stormrune-portrait-picture.png";
import ashbringerPortrait from "../assets/images/units/ashbringer-portrait-picture.png";
import lynValkenPortrait from "../assets/images/units/lyn-valken-portrait-picture.png";
import emberhowlPortrait from "../assets/images/units/emberhowl-portrait-picture.png";
import silkfangPortrait from "../assets/images/units/silkfang-portrait-picture.png";
import varenFullArt from "../assets/images/units/varen-stormrune-full-art.png";

/**
 * Collection of all player units available in the game
 * Each unit contains complete information about stats, abilities, and image assets
 */
export const playerUnits = {
  "varen": {
    id: "varen",
    name: "Varen Stormrune",
    maxHP: 30,
    damage: 5,
    image: varenPortrait,
    fullArt: varenFullArt,
    actions: ["Attack", "Skip"],
    ability: {
      name: "Blizzard",
      icon: "❄️",
      description: "Deals damage to all enemy units equal to ATK. Each enemy has a 25% chance to be Stunned for 1 turn (cannot act).",
      maxCooldown: 2,
    },
    description: "A powerful frost mage with area-of-effect damage potential.",
    role: "Mage"
  },
  
  "emberhowl": {
    id: "emberhowl",
    name: "Emberhowl",
    maxHP: 20,
    damage: 4,
    image: emberhowlPortrait,
    fullArt: emberhowlPortrait,
    actions: ["Attack", "Skip"],
    ability: {
      name: "Flame Burst",
      icon: "🔥",
      description: "Deals 150% ATK damage to one enemy.",
      maxCooldown: 1,
    },
    description: "A fierce fire elemental with high single-target damage.",
    role: "Damage Dealer"
  },
  
  "silkfang": {
    id: "silkfang",
    name: "Silkfang",
    maxHP: 15,
    damage: 3,
    image: silkfangPortrait,
    fullArt: silkfangPortrait,
    actions: ["Attack", "Skip"],
    ability: {
      name: "Venomous Bite",
      icon: "🦂",
      description: "Applies poison to an enemy, dealing 2 damage per turn for 2 turns.",
      maxCooldown: 3,
    },
    description: "A swift hunter that excels at dealing damage over time.",
    role: "Assassin"
  },
  
  "silkfangTwin": {
    id: "silkfangTwin",
    name: "Silkfang Twin",
    maxHP: 15,
    damage: 3,
    image: silkfangPortrait,
    fullArt: silkfangPortrait,
    actions: ["Attack", "Skip"],
    ability: {
      name: "Web Trap",
      icon: "🕸️",
      description: "Immobilizes an enemy for 1 turn, reducing their damage by 50%.",
      maxCooldown: 2,
    },
    description: "The tactical twin that specializes in crowd control.",
    role: "Controller"
  },
  
  "silkfangAlpha": {
    id: "silkfangAlpha",
    name: "Silkfang Alpha",
    maxHP: 18,
    damage: 4,
    image: silkfangPortrait,
    fullArt: silkfangPortrait,
    actions: ["Attack", "Skip"],
    ability: {
      name: "Pack Leadership",
      icon: "🐺",
      description: "Increases all allies' damage by 2 for 2 turns.",
      maxCooldown: 3,
    },
    description: "The pack leader who empowers allies with greater strength.",
    role: "Support"
  },
  
  "silkfangHunter": {
    id: "silkfangHunter",
    name: "Silkfang Hunter",
    maxHP: 15,
    damage: 5,
    image: silkfangPortrait,
    fullArt: silkfangPortrait,
    actions: ["Attack", "Skip"],
    ability: {
      name: "Quick Strike",
      icon: "⚡",
      description: "Attack twice in one turn.",
      maxCooldown: 2,
    },
    description: "A nimble hunter capable of striking with unprecedented speed.",
    role: "Damage Dealer"
  },

  "silkfangScout": {
    id: "silkfangScout",
    name: "Silkfang Scout",
    maxHP: 12,
    damage: 3,
    image: silkfangPortrait,
    fullArt: silkfangPortrait,
    actions: ["Attack", "Skip"],
    ability: {
      name: "Mark Prey",
      icon: "🎯",
      description: "Mark an enemy, increasing all damage they take by 50% for 2 turns.",
      maxCooldown: 2,
    },
    description: "A stealthy scout that can identify enemy weaknesses.",
    role: "Support"
  }
};

// Helper function to get a unit by ID
export const getPlayerUnitById = (id) => {
  return playerUnits[id] ? { ...playerUnits[id], hp: playerUnits[id].maxHP, currentCooldown: 0 } : null;
};

// Helper function to get a fresh instance of a unit (with full health and reset cooldowns)
export const getFreshPlayerUnit = (unitId) => {
  const unit = playerUnits[unitId];
  if (!unit) return null;
  
  return {
    ...unit,
    hp: unit.maxHP,
    currentCooldown: 0
  };
};