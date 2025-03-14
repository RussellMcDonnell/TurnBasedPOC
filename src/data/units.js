// Import unit portraits and full art from new locations
import varenPortrait from "../assets/images/units/varen-stormrune-portrait-picture.png";
import ashbringerPortrait from "../assets/images/units/ashbringer-portrait-picture.png";
import lynValkenPortrait from "../assets/images/units/lyn-valken-portrait-picture.png";
import emberhowlPortrait from "../assets/images/units/emberhowl-portrait-picture.png";
import silkfangPortrait from "../assets/images/units/silkfang-portrait-picture.png";
import varenFullArt from "../assets/images/units/varen-stormrune-full-art.png";

// Team configurations
export const availableTeams = {
  "Classic Team": [
    {
      id: "p1",
      name: "Varen Stormrune",
      maxHP: 30,
      hp: 30,
      damage: 5,
      image: varenPortrait,
      fullArt: varenFullArt,
      actions: ["Attack", "Skip"],
      ability: {
        name: "Blizzard",
        icon: "❄️",
        description: "Deals damage to all enemy units equal to ATK. Each enemy has a 25% chance to be Stunned for 1 turn (cannot act).",
        currentCooldown: 0,
        maxCooldown: 2,
      }
    },
    {
      id: "p2",
      name: "Emberhowl",
      maxHP: 20,
      hp: 20,
      damage: 4,
      image: emberhowlPortrait,
      fullArt: emberhowlPortrait,
      actions: ["Attack", "Skip"],
      ability: {
        name: "Flame Burst",
        icon: "🔥",
        description: "Deals 150% ATK damage to one enemy.",
        currentCooldown: 0,
        maxCooldown: 1,
      }
    },
    {
      id: "p3",
      name: "Silkfang",
      maxHP: 15,
      hp: 15,
      damage: 3,
      image: silkfangPortrait,
      fullArt: silkfangPortrait,
      actions: ["Attack", "Skip"],
      ability: {
        name: "Venomous Bite",
        icon: "🦂",
        description: "Applies poison to an enemy, dealing 2 damage per turn for 2 turns.",
        currentCooldown: 0,
        maxCooldown: 3,
      }
    },
    {
      id: "p4",
      name: "Silkfang Twin",
      maxHP: 15,
      hp: 15,
      damage: 3,
      image: silkfangPortrait,
      fullArt: silkfangPortrait,
      actions: ["Attack", "Skip"],
      ability: {
        name: "Web Trap",
        icon: "🕸️",
        description: "Immobilizes an enemy for 1 turn, reducing their damage by 50%.",
        currentCooldown: 0,
        maxCooldown: 2,
      }
    }
  ],
  
  "Fast Team": [
    {
      id: "p1",
      name: "Silkfang Alpha",
      maxHP: 18,
      hp: 18,
      damage: 4,
      image: silkfangPortrait,
      fullArt: silkfangPortrait,
      actions: ["Attack", "Skip"],
      ability: {
        name: "Pack Leadership",
        icon: "🐺",
        description: "Increases all allies' damage by 2 for 2 turns.",
        currentCooldown: 0,
        maxCooldown: 3,
      }
    },
    {
      id: "p2",
      name: "Silkfang Hunter",
      maxHP: 15,
      hp: 15,
      damage: 5,
      image: silkfangPortrait,
      fullArt: silkfangPortrait,
      actions: ["Attack", "Skip"],
      ability: {
        name: "Quick Strike",
        icon: "⚡",
        description: "Attack twice in one turn.",
        currentCooldown: 0,
        maxCooldown: 2,
      }
    },
    {
      id: "p3",
      name: "Silkfang Scout",
      maxHP: 12,
      hp: 12,
      damage: 3,
      image: silkfangPortrait,
      fullArt: silkfangPortrait,
      actions: ["Attack", "Skip"],
      ability: {
        name: "Mark Prey",
        icon: "🎯",
        description: "Mark an enemy, increasing all damage they take by 50% for 2 turns.",
        currentCooldown: 0,
        maxCooldown: 2,
      }
    }
  ]
};

// Enemy configurations
export const enemyTeams = {
  "Basic Enemies": [
    {
      id: "e1",
      name: "Ashbringer",
      maxHP: 50,
      hp: 50,
      damage: 8,
      image: ashbringerPortrait,
      fullArt: ashbringerPortrait
    },
    {
      id: "e2",
      name: "Lyn Valken",
      maxHP: 20,
      hp: 20,
      damage: 4,
      image: lynValkenPortrait,
      fullArt: lynValkenPortrait
    }
  ],
  "Hard Enemies": [
    {
      id: "e1",
      name: "Elite Ashbringer",
      maxHP: 70,
      hp: 70,
      damage: 10,
      image: ashbringerPortrait,
      fullArt: ashbringerPortrait
    },
    {
      id: "e2",
      name: "Elite Lyn Valken",
      maxHP: 30,
      hp: 30,
      damage: 6,
      image: lynValkenPortrait,
      fullArt: lynValkenPortrait
    }
  ]
};