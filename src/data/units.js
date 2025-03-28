// Import unit portraits and full art from new locations
import varenPortrait from "../assets/images/units/varen-stormrune-portrait-picture.png";
import ashbringerPortrait from "../assets/images/units/ashbringer-portrait-picture.png";
import lynValkenPortrait from "../assets/images/units/lyn-valken-portrait-picture.png";
import emberhowlPortrait from "../assets/images/units/emberhowl-portrait-picture.png";
import varenFullArt from "../assets/images/units/varen-stormrune-full-art.png";

// Import player unit art
import bromArt from "../assets/images/units/brom-the-bastion-full-art.png";
import juggernautArt from "../assets/images/units/juggernaut-full-art.png";
import lyraArt from "../assets/images/units/lyra-ashwyn-full-art.png";
import elyndraArt from "../assets/images/units/elyndra-the-chronomancer-full-art.png";
import sylaraArt from "../assets/images/units/sylara-starborn-full-art.png";
import bloodMageArt from "../assets/images/units/blood-mage-full-art.png";
import silasArt from "../assets/images/units/silas-steelrage-full-art.png";
import aerinArt from "../assets/images/units/aerin-twinfang-full-art.png";
import arcaneArcherArt from "../assets/images/units/arcane-archer-full-art.png";
import umbralReaperArt from "../assets/images/units/umbral-reaper-full-art.png";

// Import enemy unit art
import direWolfArt from "../assets/images/units/dire-wolf-full-art.png";
import elderTreantArt from "../assets/images/units/elder-treant-full-art.png";
import feyQueenArt from "../assets/images/units/fey-queen-full-art.png";
import grassGolemArt from "../assets/images/units/grass-golem-full-art.png";
import lordOfPrideArt from "../assets/images/units/lord-of-the-pride-full-art.png";
import nomadRaiderArt from "../assets/images/units/nomad-raider-full-art.png";
import pixieTricksterArt from "../assets/images/units/pixie-trickster-full-art.png";
import plainsShamanArt from "../assets/images/units/plains-shaman-full-art.png";
import sunflowerSentinelArt from "../assets/images/units/sunflower-sentinel-full-art.png";
import treantGuardianArt from "../assets/images/units/treant-guardian-full-art.png";
import willowispArt from "../assets/images/units/will-o-the-wisps-full-art.png";
import windfoxArt from "../assets/images/units/windfox-full-art.png";
import woodSpriteArt from "../assets/images/units/wood-sprite-full-art.png";

/**
 * Collection of all player units available in the game
 * Each unit contains complete information about stats, abilities, and image assets
 */
export const units = {
  "varen": {
    id: "varen",
    name: "Varen Stormrune",
    maxHP: 17,
    damage: 4,
    image: varenPortrait,
    fullArt: varenFullArt,
    actions: ["Attack", "Skip"],
    ability: {
      name: "Blizzard",
      icon: "❄️",
      description: "Deals damage to all enemy units equal to ATK. Each enemy has a 25% chance to be Stunned for 1 turn (cannot act).",
      maxCooldown: 3,
    },
    description: "A powerful frost mage with area-of-effect damage potential.",
    role: "Mage",
    type: "player"
  },
  "ashbringer": {
    id: "ashbringer",
    name: "Ashbringer",
    maxHP: 75,
    hp: 75,
    damage: 8,
    image: ashbringerPortrait,
    fullArt: ashbringerPortrait,
    keywords: ["Melee", "Armored", "Taunt"],
    ability: {
      name: "Infernal Roar",
      icon: "🔥",
      description: "Unleashes a devastating blast of dragonfire, dealing damage equal to ATK to all enemies. Each enemy has a 50% chance to be Burned for 2 turns.",
      maxCooldown: 4,
    },
    type: "enemy"
  },
  "lyn": {
    id: "lyn",
    name: "Lyn Valken",
    maxHP: 35,
    hp: 35,
    damage: 7,
    image: lynValkenPortrait,
    fullArt: lynValkenPortrait,
    keywords: [],
    ability: {
      name: "Dragon's Whisper",
      icon: "🐉",
      description: "Lyn strengthens her bond with Ashbringer, granting the dragon an extra action this turn and increasing its damage by 50% for 2 turns.",
      maxCooldown: 4,
    },
    type: "enemy"
  },
  "treantGuardian": {
    id: "treantGuardian",
    name: "Treant Guardian",
    maxHP: 25,
    damage: 3,
    image: treantGuardianArt,
    fullArt: treantGuardianArt,
    keywords: ["Melee", "Armored", "Taunt"],
    ability: {
      name: "Barkskin",
      icon: "🌳",
      description: "Treant Guardian hardens its bark, gaining an (8) hit point shield. Melee attackers striking the shield are poisoned.",
      maxCooldown: 3,
    },
    type: "enemy"
  },
  "woodSprite": {
    id: "woodSprite",
    name: "Wood Sprite",
    maxHP: 10,
    damage: 2,
    image: woodSpriteArt,
    fullArt: woodSpriteArt,
    keywords: ["Ranged"],
    ability: {
      name: "Rejuvenating Spores",
      icon: "✨",
      description: "Heals all allies for 2 HP.",
      maxCooldown: 2,
    },
    type: "enemy"
  },
  "pixieTrickster": {
    id: "pixieTrickster",
    name: "Pixie Trickster",
    maxHP: 12,
    damage: 3,
    image: pixieTricksterArt,
    fullArt: pixieTricksterArt,
    keywords: ["Ranged", "Poisonous"],
    ability: {
      name: "Trickster's Tangle",
      icon: "🌀",
      description: "Confuses a target, making them use their next action to attack a random ally or enemy target.",
      maxCooldown: 2,
    },
    type: "enemy"
  },
  "willowisp": {
    id: "willowisp",
    name: "Will-o'-the-Wisps",
    maxHP: 11,
    damage: 2,
    image: willowispArt,
    fullArt: willowispArt,
    keywords: ["Last Stand"],
    ability: {
      name: "Alluring Glow",
      icon: "💫",
      description: "Mesmerizes/Stun an enemy, preventing them from acting for 1 turn.",
      maxCooldown: 1,
      execute: function (caster, target) {
        // Apply the stunned status effect to the target
        if (!target.statusEffects) target.statusEffects = [];

        // Create the stunned effect
        const stunnedEffect = {
          type: "stunned",
          name: "Mesmerized",
          icon: "💫",
          duration: 1  // Lasts for 1 turn
        };

        // Add the effect to target's status effects
        target.statusEffects.push(stunnedEffect);

        // Return a result to display in the action log
        return {
          success: true,
          damage: 0,
          status: "Mesmerized",
          message: `${target.name} is mesmerized by the alluring glow!`
        };
      }
    },
    type: "enemy"
  },
  "direWolf": {
    id: "direWolf",
    name: "Dire Wolf",
    maxHP: 13,
    damage: 3,
    image: direWolfArt,
    fullArt: direWolfArt,
    keywords: ["Melee", "First Strike"],
    ability: {
      name: "Pack Hunter",
      icon: "🐺",
      description: "Attack and gain +2 damage for each other ally Dire Wolf in combat.",
      maxCooldown: 0,
    },
    type: "enemy"
  },
  "grassGolem": {
    id: "grassGolem",
    name: "Grass Golem",
    maxHP: 25,
    damage: 4,
    image: grassGolemArt,
    fullArt: grassGolemArt,
    keywords: ["Melee", "Taunt", "Renew"],
    ability: {
      name: "Thorny Shield",
      icon: "🛡️",
      description: "Reflects 50% of damage taken back to attacker for 2 turns.",
      maxCooldown: 4,
    },
    role: "Tank",
    type: "enemy"
  },
  "sunflowerSentinel": {
    id: "sunflowerSentinel",
    name: "Sunflower Sentinel",
    maxHP: 15,
    damage: 4,
    image: sunflowerSentinelArt,
    fullArt: sunflowerSentinelArt,
    keywords: ["Ranged", "Poisonous"],
    ability: {
      name: "Petal Barrage",
      icon: "🌻",
      description: "Launches a burst of petals, hitting all enemies for 2 damage.",
      maxCooldown: 2,
    },
    role: "Ranged",
    type: "enemy"
  },
  "windfox": {
    id: "windfox",
    name: "Windfox",
    maxHP: 14,
    damage: 4,
    image: windfoxArt,
    fullArt: windfoxArt,
    keywords: ["Melee", "Preemptive Strike"],
    ability: {
      name: "Windstrike",
      icon: "💨",
      description: "Strikes twice in one turn with increased mobility.",
      maxCooldown: 2,
    },
    role: "Melee",
    type: "enemy"
  },
  "plainsShaman": {
    id: "plainsShaman",
    name: "Plains Shaman",
    maxHP: 12,
    damage: 3,
    image: plainsShamanArt,
    fullArt: plainsShamanArt,
    keywords: ["Ranged"],
    ability: {
      name: "Healing Spring",
      icon: "💧",
      description: "Creates a healing spring that restores 3 HP to nearby allies each turn.",
      maxCooldown: 3,
    },
    role: "Healer",
    type: "enemy"
  },
  "nomadRaider": {
    id: "nomadRaider",
    name: "Nomad Raider",
    maxHP: 16,
    damage: 4,
    image: nomadRaiderArt,
    fullArt: nomadRaiderArt,
    keywords: ["Melee"],
    ability: {
      name: "Raider's Charge",
      icon: "⚔️",
      description: "Charges at an enemy, dealing 150% damage and stunning them for 1 turn.",
      maxCooldown: 3,
    },
    role: "Melee",
    type: "enemy"
  },
  "elderTreant": {
    id: "elderTreant",
    name: "Elder Treant",
    maxHP: 50,
    damage: 8,
    image: elderTreantArt,
    fullArt: elderTreantArt,
    keywords: ["Melee", "Armored", "Taunt", "Renew"],
    ability: {
      name: "Forest's Wrath",
      icon: "🌳",
      description: "Channels the power of the ancient forest to deal heavy damage to all enemies.",
      maxCooldown: 5,
    },
    role: "Tank",
    type: "enemy"
  },
  "feyQueen": {
    id: "feyQueen",
    name: "Fey Queen",
    maxHP: 40,
    damage: 6,
    image: feyQueenArt,
    fullArt: feyQueenArt,
    keywords: ["Ranged", "Poisonous"],
    ability: {
      name: "Nature's Aid",
      icon: "🌿",
      description: "Fey Queen summons 1 Wood Sprite, 1 Pixie Trickster, and 1 Will-o'-the-Wisps to the battlefield.",
      maxCooldown: 3,
    },
    role: "Mage",
    type: "enemy"
  },
  "lordOfPride": {
    id: "lordOfPride",
    name: "Lord of the Pride",
    maxHP: 60,
    damage: 7,
    image: lordOfPrideArt,
    fullArt: lordOfPrideArt,
    keywords: ["Melee", "Preemptive Strike", "Blood Rage"],
    ability: {
      name: "Roar of the Wild",
      icon: "🦁",
      description: "Unleashes a mighty roar that empowers allies and intimidates enemies, increasing allies' attack power.",
      maxCooldown: 3,
    },
    role: "Melee",
    type: "enemy"
  },
  "bromTheBastion": {
    id: "bromTheBastion",
    name: "Brom the Bastion",
    maxHP: 20,
    damage: 4,
    image: bromArt, // Placeholder until specific art is available
    fullArt: bromArt, // Placeholder until specific art is available
    actions: ["Attack", "Skip"],
    keywords: ["Melee", "Armored"],
    ability: {
      name: "Iron Wall Assault",
      icon: "🛡️",
      description: "Brom charges forward with both shields, ramming the enemy, stunning them for 1 turn.",
      maxCooldown: 2,
    },
    passive: {
      name: "Aegis Bastion",
      description: "Reduces incoming damage through superior armor and defensive tactics."
    },
    description: "A stalwart defender who excels at absorbing damage.",
    role: "Tank",
    type: "player"
  },
  "lyraAshwyn": {
    id: "lyraAshwyn",
    name: "Lyra Ashwyn",
    maxHP: 13,
    damage: 3,
    image: lyraArt,
    fullArt: lyraArt,
    actions: ["Attack", "Skip"],
    ability: {
      name: "Triage Tactics",
      icon: "💉",
      description: "Remove all negative status effects from an ally, and heal them 8.",
      maxCooldown: 2,
    },
    passive: {
      name: "Combat Medic",
      description: "Healing abilities also grant a small defensive bonus."
    },
    description: "A skilled healer who excels at keeping allies alive.",
    role: "Healer",
    type: "player"
  },
  "elyndraChronomancer": {
    id: "elyndraChronomancer",
    name: "Elyndra the Chronomancer",
    maxHP: 15,
    damage: 3,
    image: elyndraArt,
    fullArt: elyndraArt,
    actions: ["Attack", "Skip"],
    keywords: ["Ranged"],
    ability: {
      name: "Temporal Reset",
      icon: "⌛",
      description: "Reverse time on a target ally, undoing the last status effect or damage taken.",
      maxCooldown: 3,
    },
    passive: {
      name: "Rewind Fate",
      description: "Chance to reduce ability cooldowns when allies take damage."
    },
    description: "A time mage who manipulates the flow of battle.",
    role: "Support",
    type: "player"
  },
  "sylaraStarborn": {
    id: "sylaraStarborn",
    name: "Sylara Starborn",
    maxHP: 17,
    damage: 4,
    image: sylaraArt,
    fullArt: sylaraArt,
    actions: ["Attack", "Skip"],
    keywords: ["Ranged"],
    ability: {
      name: "Shooting Star",
      icon: "⭐",
      description: "Call down a blazing meteor that strikes a target and their adjacent allies, dealing ATK damage. Each target has a 25% chance to be Burned.",
      maxCooldown: 3,
    },
    passive: {
      name: "Celestial Rebirth",
      description: "Upon death, has a chance to revive with partial health."
    },
    description: "A celestial mage who harnesses the power of the stars.",
    role: "Mage",
    type: "player"
  },
  "bloodMage": {
    id: "bloodMage",
    name: "Blood Mage",
    maxHP: 12,
    damage: 3,
    image: bloodMageArt,
    fullArt: bloodMageArt,
    actions: ["Attack", "Skip"],
    keywords: ["Ranged", "Lifesteal"],
    ability: {
      name: "Sanguine Pact",
      icon: "🩸",
      description: "Blood Mage sacrifices 3 hit points to grant an ally 2 damage this round",
      maxCooldown: 2,
    },
    passive: {
      name: "Vampiric Hemophage",
      description: "Heals for a portion of damage dealt to enemies."
    },
    description: "A dark mage who uses blood magic to drain life from enemies.",
    role: "Mage",
    type: "player"
  },
  "silasSteelrage": {
    id: "silasSteelrage",
    name: "Silas Steelrage",
    maxHP: 17,
    damage: 5,
    image: silasArt,
    fullArt: silasArt,
    actions: ["Attack", "Skip"],
    keywords: ["Melee", "Blood Rage"],
    ability: {
      name: "Cleave",
      icon: "⚔️",
      description: "Strike from left side to right side, or vice versa, 3 adjacent enemy units",
      maxCooldown: 4,
    },
    passive: {
      name: "Blood Rage",
      description: "Gains increased damage as health decreases."
    },
    description: "A berserker who becomes more dangerous as the battle progresses.",
    role: "Melee",
    type: "player"
  },
  "umbralReaper": {
    id: "umbralReaper",
    name: "Umbral Reaper",
    maxHP: 15,
    damage: 4,
    image: umbralReaperArt,
    fullArt: umbralReaperArt,
    actions: ["Attack", "Skip"],
    keywords: ["Melee", "First Strike"],
    ability: {
      name: "Phantom Strike",
      icon: "👻",
      description: "Umbral Reaper slashes an enemy for 2xATK. If the enemy dies, Umbral Reaper does not use an action and this cooldown resets.",
      maxCooldown: 3,
    },
    passive: {
      name: "Shadowstep",
      description: "Chance to avoid incoming attacks by phasing into shadows."
    },
    description: "A shadowy assassin who excels at reaching vulnerable targets.",
    role: "Melee",
    type: "player"
  },
  "aerinTwinfang": {
    id: "aerinTwinfang",
    name: "Aerin Twinfang",
    maxHP: 15,
    damage: 4,
    image: aerinArt,
    fullArt: aerinArt,
    actions: ["Attack", "Skip"],
    keywords: ["Ranged", "Dual Wield"],
    ability: {
      name: "Crossfire",
      icon: "🎯",
      description: "Aerin may select two targets instead of one, striking each once.",
      maxCooldown: 2,
    },
    passive: {
      name: "Quick Reload",
      description: "Chance to attack twice when using basic attacks."
    },
    description: "A skilled archer who specializes in rapid-fire attacks.",
    role: "Ranged",
    type: "player"
  },
  "arcaneArcher": {
    id: "arcaneArcher",
    name: "Arcane Archer",
    maxHP: 14,
    damage: 5,
    image: arcaneArcherArt,
    fullArt: arcaneArcherArt,
    actions: ["Attack", "Skip"],
    keywords: ["Ranged"],
    ability: {
      name: "Arcane Shot",
      icon: "🏹",
      description: "Hitting an opponent with a status effect of bleeding, burning, frozen or poisoned deals 3x damage",
      maxCooldown: 3,
    },
    passive: {
      name: "Elemental Quiver",
      description: "Basic attacks have a chance to apply elemental effects."
    },
    description: "An archer who combines magic with precision archery.",
    role: "Ranged",
    type: "player"
  }
};

// Helper function to get a unit by ID
export const getUnitById = (id) => {
  return units[id] ? {
    ...units[id],
    hp: units[id].maxHP,
    currentCooldown: 0,
    statusEffects: [],
    getActions() {
      // If unit is stunned or frozen, they can only skip their turn
      if (this.statusEffects.some(effect =>
        effect.type === 'stunned' || effect.type === 'frozen')) {
        return ["Skip"];
      }
      // Otherwise return normal actions
      return this.actions;
    }
  } : null;
};

// Helper function to get all player units
export const getPlayerUnits = () => {
  return Object.values(units).filter(unit => unit.type === "player");
};

// Enemy configurations
export const enemyTeams = {
  "Shrouded Woods": [
    "treantGuardian",
    "woodSprite",
    "pixieTrickster",
    "willowisp",
  ],
  "River of Shadows": [
    "treantGuardian",
    "woodSprite",
    "pixieTrickster",
    "woodSprite",
    "pixieTrickster",
    "willowisp"
  ],
  "The Hollow Cavern": [
    "treantGuardian",
    "feyQueen",
    
  ],
  "Wolf Pack Ambush": [
    "direWolf",
    "direWolf",
    "direWolf",
    "direWolf",
  ],
  "Dragon Lair": [
    "ashbringer",
    "lyn",
  ],
};