
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Tool } from "./TaskContext";
import { toast } from "sonner";

export interface TreeState {
  height: number; // 1-100
  leaves: number; // 0-100
  health: number; // 1-100
  beauty: number; // 1-100
  level: number; // 1-10
  decorations: string[];
  tasksCompleted: number;
  tier: "sapling" | "young" | "mature";
  styles: {
    leafStyle: "default" | "syntax" | "pixel" | "binary";
    barkTexture: "smooth" | "rough" | "binary";
    lighting: "default" | "nightmode" | "lofi" | "loops";
    special: string[];
  }
}

interface TreeContextType {
  tree: TreeState;
  applyTool: (tool: Tool) => void;
  resetTree: () => void;
  getTreeTier: () => "sapling" | "young" | "mature";
  treeHistory: TreeState[];
  galleryIndex: number;
  viewPastTree: (index: number) => void;
  viewLatestTree: () => void;
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
  tier: "sapling",
  styles: {
    leafStyle: "default",
    barkTexture: "smooth",
    lighting: "default",
    special: []
  }
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

  useEffect(() => {
    localStorage.setItem('tree', JSON.stringify(tree));
    
    // Calculate level based on tree stats
    const totalStats = tree.height + tree.leaves + tree.health + tree.beauty;
    const newLevel = Math.min(10, Math.max(1, Math.floor(totalStats / 40) + 1));
    
    // Determine tree tier based on tasks completed
    let newTier: "sapling" | "young" | "mature" = "sapling";
    if (tree.tasksCompleted > 150) {
      newTier = "mature";
    } else if (tree.tasksCompleted > 50) {
      newTier = "young";
    }
    
    if (newLevel !== tree.level || newTier !== tree.tier) {
      setTree(prev => ({ ...prev, level: newLevel, tier: newTier }));
      if (newLevel > tree.level) {
        toast.success(`Your tree grew to level ${newLevel}!`);
      }
      if (newTier !== tree.tier) {
        toast.success(`Your tree evolved to ${newTier} tier! New customization options unlocked.`);
      }
    }
    
    // Save tree history snapshot weekly
    const lastSnapshot = treeHistory[treeHistory.length - 1];
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    if (!lastSnapshot || new Date(lastSnapshot.tasksCompleted) < oneWeekAgo) {
      // Create a snapshot with timestamp
      const snapshot = {
        ...tree,
        snapshotDate: now.toISOString()
      };
      
      setTreeHistory(prev => [...prev, snapshot]);
    }
    
    localStorage.setItem('treeHistory', JSON.stringify(treeHistory));
  }, [tree, treeHistory]);

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
    setTree(initialTreeState);
    toast.info("Tree has been reset");
  };
  
  const getTreeTier = () => {
    return tree.tier;
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
      getTreeTier,
      treeHistory,
      galleryIndex,
      viewPastTree,
      viewLatestTree
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
