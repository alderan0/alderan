export type Rarity = "Common" | "Uncommon" | "Rare" | "Exquisite";

export interface Reward {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  dropRate: number; // Percentage chance (0-100)
}

export interface GrowthPromoter extends Reward {
  type: "growth";
  growthBoost: number; // Percentage boost
  duration: number; // Duration in days
  effect: "height" | "leaves" | "both";
}

export interface Decoration extends Reward {
  type: "decoration";
  position: "trunk" | "canopy" | "ground" | "floating";
  style: string; // CSS classes for styling
  animation?: string; // Optional animation effect
}

// Drop rates per rarity
const RARITY_DROP_RATES = {
  Common: 60,
  Uncommon: 25,
  Rare: 12,
  Exquisite: 3,
};

export const GROWTH_PROMOTERS: GrowthPromoter[] = [
  {
    id: "sunlight-boost",
    name: "Sunlight Boost",
    description: "Increases growth rate through enhanced photosynthesis",
    rarity: "Common",
    dropRate: RARITY_DROP_RATES.Common,
    type: "growth",
    growthBoost: 10,
    duration: 1,
    effect: "both"
  },
  {
    id: "nutrient-rich-soil",
    name: "Nutrient-Rich Soil",
    description: "Premium soil mix for better root development",
    rarity: "Common",
    dropRate: RARITY_DROP_RATES.Common,
    type: "growth",
    growthBoost: 15,
    duration: 2,
    effect: "height"
  },
  {
    id: "growth-hormone",
    name: "Growth Hormone",
    description: "Natural hormone mix for accelerated growth",
    rarity: "Uncommon",
    dropRate: RARITY_DROP_RATES.Uncommon,
    type: "growth",
    growthBoost: 20,
    duration: 2,
    effect: "both"
  },
  {
    id: "magical-water",
    name: "Magical Water",
    description: "Enchanted water that boosts leaf production",
    rarity: "Uncommon",
    dropRate: RARITY_DROP_RATES.Uncommon,
    type: "growth",
    growthBoost: 25,
    duration: 3,
    effect: "leaves"
  },
  {
    id: "crystal-fertilizer",
    name: "Crystal Fertilizer",
    description: "Rare crystalline nutrients for exceptional growth",
    rarity: "Rare",
    dropRate: RARITY_DROP_RATES.Rare,
    type: "growth",
    growthBoost: 35,
    duration: 3,
    effect: "both"
  },
  // Add more growth promoters...
];

export const DECORATIONS: Decoration[] = [
  {
    id: "fairy-lights",
    name: "Fairy Lights",
    description: "Twinkling lights that wrap around the tree",
    rarity: "Common",
    dropRate: RARITY_DROP_RATES.Common,
    type: "decoration",
    position: "trunk",
    style: "twinkle-lights",
    animation: "twinkle"
  },
  {
    id: "flower-blooms",
    name: "Flower Blooms",
    description: "Colorful flowers that bloom on branches",
    rarity: "Common",
    dropRate: RARITY_DROP_RATES.Common,
    type: "decoration",
    position: "canopy",
    style: "flower-bloom"
  },
  {
    id: "crystal-clusters",
    name: "Crystal Clusters",
    description: "Shimmering crystal formations at the base",
    rarity: "Uncommon",
    dropRate: RARITY_DROP_RATES.Uncommon,
    type: "decoration",
    position: "ground",
    style: "crystal-formation",
    animation: "shimmer"
  },
  {
    id: "spirit-orbs",
    name: "Spirit Orbs",
    description: "Mystical orbs that float around the tree",
    rarity: "Rare",
    dropRate: RARITY_DROP_RATES.Rare,
    type: "decoration",
    position: "floating",
    style: "spirit-orb",
    animation: "float"
  },
  {
    id: "ancient-runes",
    name: "Ancient Runes",
    description: "Glowing runes etched into the trunk",
    rarity: "Exquisite",
    dropRate: RARITY_DROP_RATES.Exquisite,
    type: "decoration",
    position: "trunk",
    style: "ancient-runes",
    animation: "pulse"
  },
  // Add more decorations...
];

export const getRandomReward = (taskDifficulty: number): (GrowthPromoter | Decoration) => {
  // Adjust rarity chances based on task difficulty
  const rarityChances = {
    Common: Math.max(RARITY_DROP_RATES.Common - taskDifficulty * 10, 20),
    Uncommon: RARITY_DROP_RATES.Uncommon + taskDifficulty * 5,
    Rare: RARITY_DROP_RATES.Rare + taskDifficulty * 3,
    Exquisite: RARITY_DROP_RATES.Exquisite + taskDifficulty * 2
  };

  // Determine reward type (50/50 chance for growth/decoration)
  const isGrowthPromoter = Math.random() < 0.5;
  const rewards = isGrowthPromoter ? GROWTH_PROMOTERS : DECORATIONS;

  // Roll for rarity
  const roll = Math.random() * 100;
  let rarity: Rarity;
  if (roll < rarityChances.Exquisite) {
    rarity = "Exquisite";
  } else if (roll < rarityChances.Rare + rarityChances.Exquisite) {
    rarity = "Rare";
  } else if (roll < rarityChances.Uncommon + rarityChances.Rare + rarityChances.Exquisite) {
    rarity = "Uncommon";
  } else {
    rarity = "Common";
  }

  // Filter rewards by rarity and pick random
  const possibleRewards = rewards.filter(r => r.rarity === rarity);
  return possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
}; 