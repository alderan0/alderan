import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Tool } from "./TaskContext";
import { toast } from "sonner";

export interface TreeState {
  height: number; // 1-100
  leaves: number; // 0-100
  health: number; // 1-100
  beauty: number; // 1-100
  level: number; // 1-20
  decorations: string[];
  tasksCompleted: number;
  points: number;
  levelStatus: "beginner" | "intermediate" | "advanced" | "expert";
  styles: {
    leafStyle: "default" | "syntax" | "pixel" | "binary";
    barkTexture: "smooth" | "rough" | "binary";
    lighting: "default" | "nightmode" | "lofi" | "loops";
    special: string[];
  };
  snapshotDate?: string; // Added missing property for tree history
  lastReset?: string; // Date of last monthly reset
}

interface TreeContextType {
  tree: TreeState;
  applyTool: (tool: Tool) => void;
  resetTree: () => void;
  getCurrentLevel: () => number;
  treeHistory: TreeState[];
  galleryIndex: number;
  viewPastTree: (index: number) => void;
  viewLatestTree: () => void;
  calculateTaskDifficulty: (taskName: string, description: string, 
    estimatedTime: number, userRating?: "easy" | "medium" | "hard") => number;
  addPoints: (points: number) => void;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

const initialTreeState: TreeState = {
  height: 10,
  leaves: 5,
  health: 50,
  beauty: 30,
  level: 1,
  decorations: [],
  tasksCompleted: 0,
  points: 0,
  levelStatus: "beginner",
  styles: {
    leafStyle: "default",
    barkTexture: "smooth",
    lighting: "default",
    special: []
  }
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
  
  // Exponential difficulty increase
  return Math.floor(basePoints * Math.pow(1.4, level - 1));
};

export const TreeProvider = ({ children }: { children: ReactNode }) => {
  const [tree, setTree] = useState<TreeState>(() => {
    const saved = localStorage.getItem('tree');
    if (saved) {
      try {
        return JSON.parse(saved);
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

  // Function to calculate task difficulty based on multiple factors
  const calculateTaskDifficulty = (
    taskName: string, 
    description: string,
    estimatedTime: number,
    userRating?: "easy" | "medium" | "hard"
  ): number => {
    // Base difficulty from estimated time (0-40 points)
    const timeBasedDifficulty = Math.min(40, Math.floor(estimatedTime / 3));
    
    // Difficulty based on task name complexity (0-20 points)
    const difficultyKeywords = [
      'complex', 'difficult', 'challenging', 'hard', 'advanced', 'refactor',
      'optimize', 'implement', 'debug', 'fix', 'create', 'develop', 'design'
    ];
    
    const complexityScore = difficultyKeywords.reduce((score, keyword) => {
      if (taskName.toLowerCase().includes(keyword) || 
          (description && description.toLowerCase().includes(keyword))) {
        return score + 3;
      }
      return score;
    }, 0);
    
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
      
      return {
        ...prev,
        points: newPoints
      };
    });
  };

  const applyTool = (tool: Tool) => {
    if (tool.used) {
      toast.error("This tool has already been used");
      return;
    }
    
    setTree(prev => {
      const newTree = { ...prev };
      
      // Apply the tool effects to tree stats
      if (tool.effect.height) newTree.height = Math.min(100, newTree.height + tool.effect.height);
      if (tool.effect.leaves) newTree.leaves = Math.min(100, newTree.leaves + tool.effect.leaves);
      if (tool.effect.health) newTree.health = Math.min(100, newTree.health + tool.effect.health);
      if (tool.effect.beauty) newTree.beauty = Math.min(100, newTree.beauty + tool.effect.beauty);
      
      // Apply style changes based on tool
      if (tool.effect.style) {
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
    
    toast.success(`Applied ${tool.name} to your tree!`);
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
      tree: galleryIndex >= 0 ? treeHistory[galleryIndex] : tree,
      applyTool, 
      resetTree,
      getCurrentLevel,
      treeHistory,
      galleryIndex,
      viewPastTree,
      viewLatestTree,
      calculateTaskDifficulty,
      addPoints
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
