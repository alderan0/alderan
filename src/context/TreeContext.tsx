
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
}

interface TreeContextType {
  tree: TreeState;
  applyTool: (tool: Tool) => void;
  resetTree: () => void;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

const initialTreeState: TreeState = {
  height: 10,
  leaves: 5,
  health: 50,
  beauty: 30,
  level: 1,
  decorations: []
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

  useEffect(() => {
    localStorage.setItem('tree', JSON.stringify(tree));
    
    // Calculate level based on tree stats
    const totalStats = tree.height + tree.leaves + tree.health + tree.beauty;
    const newLevel = Math.min(10, Math.max(1, Math.floor(totalStats / 40) + 1));
    
    if (newLevel !== tree.level) {
      setTree(prev => ({ ...prev, level: newLevel }));
      if (newLevel > 1) {
        toast.success(`Your tree grew to level ${newLevel}!`);
      }
    }
  }, [tree]);

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
      
      // Add decoration if it's a decoration tool
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

  return (
    <TreeContext.Provider value={{ tree, applyTool, resetTree }}>
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
