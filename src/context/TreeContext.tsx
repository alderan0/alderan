import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Tool } from "./TaskContext";
import { toast } from "sonner";

export interface TreeState {
  height: number; // meters, from 0.1 to 10
  leaves: number; // 0-100
  health: number; // 1-100
  decorations: string[];
  tasksCompleted: number;
  points: number;
  level: number; // 1-20
  levelStatus: "beginner" | "intermediate" | "advanced" | "expert";
  styles: {
    leafStyle: "default" | "syntax" | "pixel" | "binary";
    barkTexture: "smooth" | "rough" | "binary";
    lighting: "default" | "nightmode" | "lofi" | "loops";
    special: string[];
  };
  snapshotDate?: string; // Added missing property for tree history
  lastReset?: string; // Date of last monthly reset
  rewards: PixelTreeReward[];
}

// Update reward interface to remove beauty and add visual effects
export interface PixelTreeReward {
  id: string;
  name: string;
  description: string;
  type: "growth" | "decoration";
  rarity: "common" | "uncommon" | "rare" | "exquisite";
  effect: {
    height?: number; // in meters (0.1-0.5)
    leaves?: number;
    health?: number;
    special?: string;
    style?: string;
    visualEffect?: string; // new property for visual changes
  };
  used: boolean;
  iconName: string;
}

interface TreeContextType {
  tree: TreeState;
  applyTool: (tool: Tool) => void;
  resetTree: () => void;
  getCurrentLevel: () => number;
  getTreeTier: () => "sapling" | "young" | "mature"; // Added this function
  treeHistory: TreeState[];
  galleryIndex: number;
  viewPastTree: (index: number) => void;
  viewLatestTree: () => void;
  calculateTaskDifficulty: (taskName: string, description: string, 
    estimatedTime: number, userRating?: "easy" | "medium" | "hard") => number;
  addPoints: (points: number) => void;
  applyReward: (reward: PixelTreeReward) => void;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

// Update growth promoter rewards database with meters for height and visual effects
const growthPromoterRewards: Omit<PixelTreeReward, "id" | "used">[] = [
  {
    name: "Water Droplet",
    description: "Basic tree growth enhancer",
    type: "growth",
    rarity: "common",
    effect: { height: 0.1, health: 2, visualEffect: "dripping-water" },
    iconName: "droplet"
  },
  {
    name: "Code Fertilizer",
    description: "Promotes leaf growth through code nutrition",
    type: "growth",
    rarity: "common",
    effect: { leaves: 5, health: 1, visualEffect: "glowing-soil" },
    iconName: "leaf"
  },
  {
    name: "Bug Spray",
    description: "Improves tree health by removing code bugs",
    type: "growth",
    rarity: "common",
    effect: { health: 4, visualEffect: "bug-protection" },
    iconName: "bug"
  },
  {
    name: "Sunburst Algorithm",
    description: "Provides algorithmic sunlight to your tree",
    type: "growth",
    rarity: "common",
    effect: { height: 0.1, health: 3, visualEffect: "sun-rays" },
    iconName: "sun"
  },
  {
    name: "Nutrient Commit",
    description: "Commits nutrients directly to the tree root",
    type: "growth",
    rarity: "common",
    effect: { height: 0.2, visualEffect: "root-glow" },
    iconName: "git-commit"
  },
  {
    name: "Function Pruner",
    description: "Prunes the tree to optimize growth",
    type: "growth",
    rarity: "uncommon",
    effect: { health: 3, visualEffect: "neat-branches" },
    iconName: "scissors"
  },
  {
    name: "Loop Accelerator",
    description: "Accelerates growth through recursive loops",
    type: "growth",
    rarity: "uncommon",
    effect: { height: 0.3, health: 2, visualEffect: "spiral-growth" },
    iconName: "repeat"
  },
  {
    name: "Branch Merger",
    description: "Merges branches to create stronger limbs",
    type: "growth",
    rarity: "uncommon",
    effect: { height: 0.2, leaves: 5, visualEffect: "merged-branches" },
    iconName: "git-merge"
  },
  {
    name: "Code Rain",
    description: "Special rain that nourishes the pixel tree",
    type: "growth",
    rarity: "uncommon",
    effect: { health: 6, leaves: 4, visualEffect: "binary-rain" },
    iconName: "cloud-rain"
  },
  {
    name: "Parser Enzyme",
    description: "Breaks down complex bugs into nutrients",
    type: "growth",
    rarity: "uncommon",
    effect: { health: 8, visualEffect: "enzyme-bubbles" },
    iconName: "workflow"
  },
  {
    name: "Quantum Nutrients",
    description: "Superposition of all essential tree nutrients",
    type: "growth",
    rarity: "rare",
    effect: { height: 0.4, health: 5, leaves: 5, visualEffect: "quantum-particles" },
    iconName: "atom"
  },
  {
    name: "Algorithm Sunlight",
    description: "Advanced sunlight algorithm for optimal growth",
    type: "growth",
    rarity: "rare",
    effect: { height: 0.5, leaves: 8, visualEffect: "golden-light" },
    iconName: "sun-medium"
  },
  {
    name: "Root Optimizer",
    description: "Strengthens the core foundation of your tree",
    type: "growth",
    rarity: "rare",
    effect: { health: 12, height: 0.3, visualEffect: "expanding-roots" },
    iconName: "database"
  },
  {
    name: "Syntax Sugar",
    description: "Sweet growth improvement for elegant trees",
    type: "growth",
    rarity: "rare",
    effect: { leaves: 8, visualEffect: "sugar-crystals" },
    iconName: "candy"
  },
  {
    name: "CI/CD Growth Pipeline",
    description: "Continuous integration of growth factors",
    type: "growth",
    rarity: "rare",
    effect: { height: 0.4, health: 8, leaves: 4, visualEffect: "pipeline-flow" },
    iconName: "git-pull-request"
  },
  {
    name: "Mythical Dev Tears",
    description: "Legendary growth elixir made from developer frustration",
    type: "growth",
    rarity: "exquisite",
    effect: { height: 0.5, health: 12, leaves: 12, visualEffect: "tear-sparkles" },
    iconName: "sparkles"
  },
  {
    name: "Quantum Compiler",
    description: "Compiles growth potential from multiple dimensions",
    type: "growth",
    rarity: "exquisite",
    effect: { height: 0.5, health: 10, leaves: 10, visualEffect: "quantum-compilation" },
    iconName: "cpu"
  },
  {
    name: "Founder's Seed",
    description: "Original seed from the first coding tree",
    type: "growth",
    rarity: "exquisite",
    effect: { height: 0.5, health: 15, visualEffect: "seed-aura" },
    iconName: "award"
  },
  {
    name: "Complexity Tamer",
    description: "Harnesses complexity for extraordinary growth",
    type: "growth",
    rarity: "exquisite",
    effect: { health: 20, leaves: 15, visualEffect: "complexity-web" },
    iconName: "wand"
  }
];

// Update decoration rewards with visual effects
const decorationRewards: Omit<PixelTreeReward, "id" | "used">[] = [
  {
    name: "Bug Ornament",
    description: "Small bug decoration for your tree",
    type: "decoration",
    rarity: "common",
    effect: { special: "bugs", visualEffect: "bug-ornaments" },
    iconName: "bug"
  },
  {
    name: "Comment Tag",
    description: "Hanging comment decoration",
    type: "decoration",
    rarity: "common",
    effect: { special: "comments", visualEffect: "hanging-comments" },
    iconName: "message-square"
  },
  {
    name: "Variable String",
    description: "String of variable names that wrap around the tree",
    type: "decoration",
    rarity: "common",
    effect: { special: "variables", visualEffect: "variable-strings" },
    iconName: "variable"
  },
  {
    name: "Curly Brace Lights",
    description: "Small curly brace-shaped lights",
    type: "decoration",
    rarity: "common",
    effect: { special: "braces", visualEffect: "brace-lights" },
    iconName: "braces"
  },
  {
    name: "Rainbow Leaves",
    description: "Turn your leaves into a rainbow pattern",
    type: "decoration",
    rarity: "uncommon",
    effect: { special: "rainbow", visualEffect: "rainbow-foliage" },
    iconName: "rainbow"
  },
  {
    name: "Function Bells",
    description: "Bell-shaped function decorations",
    type: "decoration",
    rarity: "common",
    effect: { special: "functions", visualEffect: "function-bells" },
    iconName: "bell"
  },
  {
    name: "Array Garland",
    description: "Garland made of array brackets",
    type: "decoration",
    rarity: "uncommon",
    effect: { special: "arrays", visualEffect: "array-garland" },
    iconName: "brackets"
  },
  {
    name: "Pixel Star",
    description: "Star-shaped decoration for the tree top",
    type: "decoration",
    rarity: "uncommon",
    effect: { special: "star", visualEffect: "pixel-star-top" },
    iconName: "star"
  },
  {
    name: "Loop Ornaments",
    description: "Circular loop decorations",
    type: "decoration",
    rarity: "uncommon",
    effect: { special: "loops", visualEffect: "loop-circles" },
    iconName: "repeat"
  },
  {
    name: "Object Baubles",
    description: "Object-shaped hanging decorations",
    type: "decoration",
    rarity: "uncommon",
    effect: { special: "objects", visualEffect: "object-baubles" },
    iconName: "circle"
  },
  {
    name: "Binary Tinsel",
    description: "Tinsel made of 0s and 1s",
    type: "decoration",
    rarity: "uncommon",
    effect: { style: "binary", visualEffect: "binary-tinsel" },
    iconName: "binary"
  },
  {
    name: "RGB Lights",
    description: "Colorful lighting effect for your tree",
    type: "decoration",
    rarity: "rare",
    effect: { special: "rgb", visualEffect: "rgb-glow" },
    iconName: "palette"
  },
  {
    name: "Algorithm Animations",
    description: "Sorting algorithm animations on the tree",
    type: "decoration",
    rarity: "rare",
    effect: { special: "algorithm", visualEffect: "algo-animation" },
    iconName: "bar-chart"
  },
  {
    name: "Holographic Interface",
    description: "Holographic UI elements around the tree",
    type: "decoration",
    rarity: "rare",
    effect: { special: "hologram", visualEffect: "holographic-ui" },
    iconName: "layers"
  },
  {
    name: "API Birds",
    description: "Small bird decorations that fetch data",
    type: "decoration",
    rarity: "rare",
    effect: { special: "birds", visualEffect: "api-birds" },
    iconName: "bird"
  },
  {
    name: "Code Snowflakes",
    description: "Unique snowflake patterns made of code",
    type: "decoration",
    rarity: "rare",
    effect: { special: "snowflakes", visualEffect: "code-snowflakes" },
    iconName: "snowflake"
  },
  {
    name: "Quantum Ornament",
    description: "Exists in multiple states simultaneously",
    type: "decoration",
    rarity: "exquisite",
    effect: { special: "quantum", visualEffect: "quantum-shimmer" },
    iconName: "atom"
  },
  {
    name: "Legendary Compiler",
    description: "Ancient artifact that compiles any code",
    type: "decoration",
    rarity: "exquisite",
    effect: { special: "compiler", visualEffect: "compiler-glow" },
    iconName: "cpu"
  },
  {
    name: "Neural Network",
    description: "Self-improving decoration that learns",
    type: "decoration",
    rarity: "exquisite",
    effect: { special: "neural", visualEffect: "neural-connections" },
    iconName: "network"
  },
  {
    name: "Time Complexity Portal",
    description: "Shows glimpses of O(n) and beyond",
    type: "decoration",
    rarity: "exquisite",
    effect: { special: "portal", visualEffect: "complexity-portal" },
    iconName: "timer"
  },
  {
    name: "Legacy Code Shrine",
    description: "Ancient code that still runs perfectly",
    type: "decoration",
    rarity: "exquisite",
    effect: { special: "shrine", visualEffect: "legacy-shrine" },
    iconName: "landmark"
  }
];

const initialTreeState: TreeState = {
  height: 0.5,  // Start at 0.5 meters
  leaves: 5,
  health: 50,
  decorations: [],
  tasksCompleted: 0,
  points: 0,
  level: 1,
  levelStatus: "beginner",
  styles: {
    leafStyle: "default",
    barkTexture: "smooth",
    lighting: "default",
    special: []
  },
  rewards: []
};

// Helper function to check if a reset is needed (first day of the month)
const isMonthlyResetNeeded = (lastReset?: string): boolean => {
  const today = new Date();
  
  // If it's the first day of the month
  if (today.getDate() === 1) {
    if (!lastReset) return true;
    
    const lastResetDate = new Date(lastReset);
    const lastResetMonth = lastResetDate.getMonth();
    const lastResetYear = lastResetDate.getFullYear();
    
    // Check if we've already reset this month
    return !(lastResetMonth === today.getMonth() && lastResetYear === today.getFullYear());
  }
  
  return false;
};

// Calculate level thresholds with increasing difficulty
const getLevelThreshold = (level: number): number => {
  // Base points needed for level 1
  const basePoints = 100;
  
  // Exponential difficulty increase - each level gets progressively harder
  return Math.floor(basePoints * Math.pow(1.4, level - 1));
};

// Generate a random reward based on task difficulty
const generateRandomReward = (taskDifficulty: number): PixelTreeReward => {
  // Determine rarity based on task difficulty and randomness
  let rarity: "common" | "uncommon" | "rare" | "exquisite";
  const rarityRoll = Math.random() * 100;
  
  // Higher task difficulty increases chance of better rewards
  const difficultyBonus = taskDifficulty / 10; // 0-10 bonus
  
  if (rarityRoll + difficultyBonus > 97) {
    rarity = "exquisite"; // ~3% chance + difficulty bonus
  } else if (rarityRoll + difficultyBonus > 85) {
    rarity = "rare"; // ~12% chance + difficulty bonus
  } else if (rarityRoll + difficultyBonus > 60) {
    rarity = "uncommon"; // ~25% chance + difficulty bonus
  } else {
    rarity = "common"; // ~60% chance
  }
  
  // Determine if it's a growth or decoration reward (50/50 chance)
  const isGrowth = Math.random() > 0.5;
  
  // Filter rewards by type and rarity
  const potentialRewards = isGrowth 
    ? growthPromoterRewards.filter(r => r.rarity === rarity)
    : decorationRewards.filter(r => r.rarity === rarity);
  
  // If no rewards match criteria, fall back to common rewards
  const rewardsPool = potentialRewards.length > 0 
    ? potentialRewards 
    : (isGrowth ? growthPromoterRewards : decorationRewards).filter(r => r.rarity === "common");
  
  // Select a random reward from the pool
  const selectedReward = rewardsPool[Math.floor(Math.random() * rewardsPool.length)];
  
  // Create a new reward instance with a unique ID
  return {
    ...selectedReward,
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
    used: false
  };
};

export const TreeProvider = ({ children }: { children: ReactNode }) => {
  const [tree, setTree] = useState<TreeState>(() => {
    const saved = localStorage.getItem('tree');
    if (saved) {
      try {
        const savedTree = JSON.parse(saved);
        // Convert old height % to meters if needed
        if (savedTree.height > 10) {
          savedTree.height = parseFloat((savedTree.height / 20).toFixed(1));
        }
        // Remove beauty property if it exists
        if ('beauty' in savedTree) {
          const { beauty, ...restTree } = savedTree;
          return restTree;
        }
        return savedTree;
      } catch (e) {
        return initialTreeState;
      }
    }
    return initialTreeState;
  });
  
  const [treeHistory, setTreeHistory] = useState<TreeState[]>(() => {
    const saved = localStorage.getItem('treeHistory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [galleryIndex, setGalleryIndex] = useState(-1); // -1 means showing current tree

  // Check for monthly reset
  useEffect(() => {
    if (isMonthlyResetNeeded(tree.lastReset)) {
      // Create a snapshot before resetting
      const snapshot = {
        ...tree,
        snapshotDate: new Date().toISOString()
      };
      
      setTreeHistory(prev => [...prev, snapshot]);
      
      // Reset tree but keep the history
      setTree({
        ...initialTreeState,
        lastReset: new Date().toISOString()
      });
      
      toast.info("Monthly reset: Your tree has been reset for the new month! Your previous tree is saved in your gallery.");
    }
  }, [tree.lastReset]);

  useEffect(() => {
    localStorage.setItem('tree', JSON.stringify(tree));
    
    // Calculate level status based on level
    let newLevelStatus: "beginner" | "intermediate" | "advanced" | "expert" = "beginner";
    if (tree.level > 15) {
      newLevelStatus = "expert";
    } else if (tree.level > 10) {
      newLevelStatus = "advanced";
    } else if (tree.level > 5) {
      newLevelStatus = "intermediate";
    }
    
    // Update level status if needed
    if (newLevelStatus !== tree.levelStatus) {
      setTree(prev => ({ ...prev, levelStatus: newLevelStatus }));
      toast.success(`Your expertise has increased to ${newLevelStatus} level!`);
    }
    
    // Save tree history snapshot weekly
    const lastSnapshot = treeHistory[treeHistory.length - 1];
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    if (!lastSnapshot || new Date(lastSnapshot.snapshotDate || "") < oneWeekAgo) {
      // Create a snapshot with timestamp
      const snapshot = {
        ...tree,
        snapshotDate: now.toISOString()
      };
      
      setTreeHistory(prev => [...prev, snapshot]);
    }
    
    localStorage.setItem('treeHistory', JSON.stringify(treeHistory));
  }, [tree, treeHistory]);

  // Enhanced AI algorithm to calculate task difficulty based on multiple factors
  const calculateTaskDifficulty = (
    taskName: string, 
    description: string,
    estimatedTime: number,
    userRating?: "easy" | "medium" | "hard"
  ): number => {
    // Base difficulty from estimated time (0-40 points)
    const timeBasedDifficulty = Math.min(40, Math.floor(estimatedTime / 3));
    
    // Difficulty based on task name and description complexity (0-20 points)
    const difficultyKeywords = [
      'complex', 'difficult', 'challenging', 'hard', 'advanced', 'refactor',
      'optimize', 'implement', 'debug', 'fix', 'create', 'develop', 'design',
      'algorithm', 'architecture', 'database', 'security', 'performance'
    ];
    
    const complexKeywords = [
      'authentication', 'authorization', 'encryption', 'concurrency', 
      'distributed', 'scalable', 'microservice', 'integration', 'deployment',
      'infrastructure', 'kubernetes', 'docker', 'cloud', 'devops',
      'machine learning', 'ai', 'neural', 'blockchain', 'graphql'
    ];
    
    let complexityScore = 0;
    const taskText = (taskName + ' ' + (description || '')).toLowerCase();
    
    // Regular difficulty keywords add 3 points each
    difficultyKeywords.forEach(keyword => {
      if (taskText.includes(keyword)) {
        complexityScore += 3;
      }
    });
    
    // Complex technical keywords add 5 points each
    complexKeywords.forEach(keyword => {
      if (taskText.includes(keyword)) {
        complexityScore += 5;
      }
    });
    
    // Check for patterns that indicate complexity
    if (taskText.includes('rewrite') || taskText.includes('from scratch')) {
      complexityScore += 8;
    }
    
    if (taskText.includes('urgent') || taskText.includes('asap')) {
      complexityScore += 5;
    }
    
    if (taskText.includes('research') || taskText.includes('investigate')) {
      complexityScore += 4;
    }
    
    const nameBasedDifficulty = Math.min(20, complexityScore);
    
    // User-supplied difficulty rating (0-40 points)
    let userRatingScore = 20; // Default medium
    if (userRating === "easy") userRatingScore = 10;
    if (userRating === "hard") userRatingScore = 40;
    
    // Total difficulty (0-100)
    return Math.min(100, timeBasedDifficulty + nameBasedDifficulty + userRatingScore);
  };
  
  // Add points to the tree based on task completion
  const addPoints = (points: number) => {
    setTree(prev => {
      const newPoints = prev.points + points;
      
      // Check if we should level up
      let newLevel = prev.level;
      while (newLevel < 20 && newPoints >= getLevelThreshold(newLevel)) {
        newLevel++;
      }
      
      // If leveled up
      if (newLevel !== prev.level) {
        toast.success(`Level up! You've reached level ${newLevel}!`);
        
        // Tree grows more with each level
        const growthFactor = Math.min(10, newLevel);
        return {
          ...prev,
          points: newPoints,
          level: newLevel,
          height: Math.min(100, prev.height + growthFactor),
          leaves: Math.min(100, prev.leaves + growthFactor),
          health: Math.min(100, prev.health + 5),
          beauty: Math.min(100, prev.beauty + 5)
        };
      }
      
      // Generate a reward based on points earned
      const shouldGetReward = Math.random() < 0.7; // 70% chance to get a reward
      if (shouldGetReward) {
        const newReward = generateRandomReward(points);
        toast.success(`You earned a ${newReward.rarity} ${newReward.type} reward: ${newReward.name}!`, {
          duration: 5000
        });
        
        return {
          ...prev,
          points: newPoints,
          rewards: [...prev.rewards, newReward]
        };
      }
      
      return {
        ...prev,
        points: newPoints
      };
    });
  };

  const applyReward = (reward: PixelTreeReward) => {
    if (reward.used) {
      toast.error("This reward has already been used");
      return;
    }
    
    setTree(prev => {
      const newTree = { ...prev };
      
      // Apply the reward effects to tree stats
      if (reward.effect?.height) newTree.height = parseFloat((newTree.height + reward.effect.height).toFixed(1));
      if (reward.effect?.leaves) newTree.leaves = Math.min(100, newTree.leaves + reward.effect.leaves);
      if (reward.effect?.health) newTree.health = Math.min(100, newTree.health + reward.effect.health);
      
      // Apply special effects or styles
      if (reward.effect?.special) {
        newTree.styles.special.push(reward.effect.special);
      }
      
      if (reward.effect?.style) {
        switch(reward.effect.style) {
          case "syntax":
          case "pixel":
          case "binary":
            newTree.styles.leafStyle = reward.effect.style;
            break;
          case "nightmode":
          case "lofi":
          case "loops":
            newTree.styles.lighting = reward.effect.style;
            break;
        }
      }
      
      // Update the rewards list to mark this one as used
      const updatedRewards = newTree.rewards.map(r => 
        r.id === reward.id ? { ...r, used: true } : r
      );
      
      return {
        ...newTree,
        rewards: updatedRewards,
        decorations: reward.type === "decoration" ? 
          [...newTree.decorations, reward.name] : newTree.decorations
      };
    });
    
    // Show a visual notification based on the visual effect
    const visualEffect = reward.effect?.visualEffect;
    if (visualEffect) {
      toast.success(`Applied ${reward.name} to your tree! The tree now has ${visualEffect}!`);
    } else {
      toast.success(`Applied ${reward.name} to your tree!`);
    }
  };

  const applyTool = (tool: Tool) => {
    if (tool.used) {
      toast.error("This tool has already been used");
      return;
    }
    
    setTree(prev => {
      const newTree = { ...prev };
      
      // Apply the tool effects to tree stats
      if (tool.effect?.height) {
        // Convert old % values to meters if needed
        const heightIncrease = tool.effect.height > 5 ? tool.effect.height / 20 : tool.effect.height;
        newTree.height = parseFloat((newTree.height + heightIncrease).toFixed(1));
      }
      
      if (tool.effect?.leaves) newTree.leaves = Math.min(100, newTree.leaves + tool.effect.leaves);
      if (tool.effect?.health) newTree.health = Math.min(100, newTree.health + tool.effect.health);
      
      // Apply style changes based on tool
      if (tool.effect?.style) {
        switch(tool.effect.style) {
          case "syntax":
          case "pixel":
          case "binary":
            newTree.styles.leafStyle = tool.effect.style;
            break;
          case "binary":
            newTree.styles.barkTexture = "binary";
            break;
          case "nightmode":
          case "lofi":
          case "loops":
            newTree.styles.lighting = tool.effect.style;
            break;
          case "birds":
          case "functions":
          case "recursive":
          case "rainbow":
            newTree.styles.special.push(tool.effect.style);
            break;
        }
      }
      
      // Add decoration if it's a decorate tool
      if (tool.type === "decorate") {
        newTree.decorations = [...newTree.decorations, tool.name];
      }
      
      return newTree;
    });
    
    // Mark tool as used
    tool.used = true;
    localStorage.setItem('tools', JSON.stringify(JSON.parse(localStorage.getItem('tools') || '[]').map((t: Tool) => 
      t.id === tool.id ? { ...t, used: true } : t
    )));
    
    // Visual effect notification
    if (tool.effect?.style === "rainbow") {
      toast.success(`Applied ${tool.name} to your tree! Your tree now has rainbow-colored leaves!`);
    } else if (tool.effect?.visualEffect) {
      toast.success(`Applied ${tool.name} to your tree! Added ${tool.effect.visualEffect} visual effect!`);
    } else {
      toast.success(`Applied ${tool.name} to your tree!`);
    }
  };

  const resetTree = () => {
    setTree({
      ...initialTreeState,
      lastReset: new Date().toISOString()
    });
    toast.info("Tree has been reset");
  };
  
  const getCurrentLevel = () => {
    return tree.level;
  };
  
  // Add getTreeTier function to determine tree tier based on task count
  const getTreeTier = (): "sapling" | "young" | "mature" => {
    if (tree.tasksCompleted >= 150) return "mature";
    if (tree.tasksCompleted >= 50) return "young";
    return "sapling";
  };
  
  const viewPastTree = (index: number) => {
    if (index >= 0 && index < treeHistory.length) {
      setGalleryIndex(index);
    }
  };
  
  const viewLatestTree = () => {
    setGalleryIndex(-1);
  };

  return (
    <TreeContext.Provider value={{ 
      tree, 
      applyTool, 
      resetTree,
      getCurrentLevel,
      getTreeTier,
      treeHistory,
      galleryIndex,
      viewPastTree,
      viewLatestTree,
      calculateTaskDifficulty,
      addPoints,
      applyReward
    }}>
      {children}
    </TreeContext.Provider>
  );
};

export const useTree = () => {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};
