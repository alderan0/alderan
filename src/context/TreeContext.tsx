
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Define types
interface TreeContextProps {
  children: React.ReactNode;
}

export interface Tool {
  id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
  used?: boolean;
  effect?: {
    height?: number;
    leaves?: number;
    health?: number;
    special?: string;
    style?: string;
    visualEffect?: string;
  };
  minLevel?: number;
}

interface TreeState {
  level: number;
  levelStatus: string;
  points: number;
  height: number;
  leaves: number;
  health: number;
  tasksCompleted: number;
  visualEffects: {
    leafColor?: string;
    trunkColor?: string;
    special?: string;
  };
}

interface TreeContextType {
  tree: TreeState;
  tools: Tool[];
  applyTool: (toolId: string) => void;
  addPoints: (points: number) => void;
  completeTask: () => void;
  activeTools: Tool[];
  availableTools: Tool[];
}

// Create context
const TreeContext = createContext<TreeContextType | undefined>(undefined);

// Provider component
export const TreeProvider: React.FC<TreeContextProps> = ({ children }) => {
  const [tree, setTree] = useState<TreeState>(() => {
    const savedTree = localStorage.getItem('tree');
    return savedTree ? JSON.parse(savedTree) : {
      level: 1,
      levelStatus: 'beginner',
      points: 0,
      height: 1.0,
      leaves: 10,
      health: 100,
      tasksCompleted: 0,
      visualEffects: {
        leafColor: 'green',
        trunkColor: 'brown',
      }
    };
  });

  const [tools, setTools] = useState<Tool[]>(() => {
    const savedTools = localStorage.getItem('tools');
    return savedTools ? JSON.parse(savedTools) : [
      {
        id: uuidv4(),
        name: 'Growth Promoter',
        type: 'growth',
        description: 'Increases tree height by 0.3m',
        isActive: true,
        effect: {
          height: 0.3,
          visualEffect: 'growTaller'
        },
        minLevel: 1
      },
      {
        id: uuidv4(),
        name: 'Leaf Booster',
        type: 'growth',
        description: 'Adds 5 leaves to your tree',
        isActive: true,
        effect: {
          leaves: 5,
          visualEffect: 'addLeaves'
        },
        minLevel: 1
      },
      {
        id: uuidv4(),
        name: 'Health Potion',
        type: 'health',
        description: 'Restores 10 health points',
        isActive: true,
        effect: {
          health: 10,
          visualEffect: 'healthGlow'
        },
        minLevel: 1
      },
      {
        id: uuidv4(),
        name: 'Rainbow Leaves',
        type: 'decoration',
        description: 'Gives your tree beautiful rainbow colored leaves',
        isActive: false,
        effect: {
          special: 'rainbow',
          visualEffect: 'rainbowLeaves'
        },
        minLevel: 3
      },
      {
        id: uuidv4(),
        name: 'Golden Trunk',
        type: 'decoration',
        description: 'Transforms your trunk into gold',
        isActive: false,
        effect: {
          special: 'gold',
          visualEffect: 'goldenTrunk'
        },
        minLevel: 5
      },
      {
        id: uuidv4(),
        name: 'Super Growth',
        type: 'growth',
        description: 'Increases tree height by 0.5m',
        isActive: false,
        effect: {
          height: 0.5,
          visualEffect: 'superGrow'
        },
        minLevel: 7
      },
      {
        id: uuidv4(),
        name: 'Magical Aura',
        type: 'decoration',
        description: 'Surrounds your tree with a magical aura',
        isActive: false,
        effect: {
          special: 'aura',
          visualEffect: 'magicAura'
        },
        minLevel: 10
      }
    ];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('tree', JSON.stringify(tree));
  }, [tree]);

  useEffect(() => {
    localStorage.setItem('tools', JSON.stringify(tools));
  }, [tools]);

  // Calculate level status based on level
  useEffect(() => {
    let status = 'beginner';
    if (tree.level >= 15) {
      status = 'master';
    } else if (tree.level >= 10) {
      status = 'expert';
    } else if (tree.level >= 5) {
      status = 'intermediate';
    }
    
    if (status !== tree.levelStatus) {
      setTree(prev => ({
        ...prev,
        levelStatus: status
      }));
    }
  }, [tree.level]);

  // Apply a tool to the tree
  const applyTool = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return;
    
    // Mark the tool as used
    setTools(prevTools => prevTools.map(t => 
      t.id === toolId ? { ...t, used: true } : t
    ));
    
    // Apply the effects to the tree
    if (tool.effect) {
      let updatedTree = { ...tree };
      let toastMessage = `Applied ${tool.name}`;
      
      // Apply height change
      if (typeof tool.effect.height === 'number') {
        updatedTree.height += tool.effect.height;
        toastMessage += `, height +${tool.effect.height}m`;
      }
      
      // Apply leaves change
      if (typeof tool.effect.leaves === 'number') {
        updatedTree.leaves += tool.effect.leaves;
        toastMessage += `, leaves +${tool.effect.leaves}`;
      }
      
      // Apply health change
      if (typeof tool.effect.health === 'number') {
        updatedTree.health = Math.min(100, updatedTree.health + tool.effect.health);
        toastMessage += `, health +${tool.effect.health}`;
      }
      
      // Apply special effects
      if (tool.effect.special) {
        let updatedVisualEffects = { ...updatedTree.visualEffects };
        
        switch (tool.effect.special) {
          case 'rainbow':
            updatedVisualEffects.leafColor = 'rainbow';
            break;
          case 'gold':
            updatedVisualEffects.trunkColor = 'gold';
            break;
          case 'aura':
            updatedVisualEffects.special = 'aura';
            break;
          default:
            break;
        }
        
        updatedTree.visualEffects = updatedVisualEffects;
      }
      
      setTree(updatedTree);
      toast.success(toastMessage);
    }
  };

  // Add points to the tree
  const addPoints = (points: number) => {
    setTree(prev => {
      const newPoints = prev.points + points;
      
      // Check if level up (every 100 * 1.4^(level-1) points)
      const currentLevelThreshold = Math.floor(100 * Math.pow(1.4, prev.level - 1));
      const nextLevelThreshold = Math.floor(100 * Math.pow(1.4, prev.level));
      
      if (newPoints >= nextLevelThreshold) {
        toast.success(`Level Up! You are now level ${prev.level + 1}`);
        return {
          ...prev,
          points: newPoints,
          level: prev.level + 1
        };
      }
      
      return {
        ...prev,
        points: newPoints
      };
    });
  };

  // Complete a task
  const completeTask = () => {
    // Add points
    addPoints(10);
    
    // Increment tasks completed
    setTree(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted + 1
    }));
  };

  // Filter active tools
  const activeTools = tools.filter(tool => tool.isActive && !tool.used);
  
  // Filter available tools based on level
  const availableTools = tools.filter(tool => {
    const minLevel = tool.minLevel || 1;
    return tree.level >= minLevel;
  });

  return (
    <TreeContext.Provider value={{ 
      tree, 
      tools, 
      applyTool, 
      addPoints, 
      completeTask,
      activeTools,
      availableTools
    }}>
      {children}
    </TreeContext.Provider>
  );
};

// Custom hook for using the tree context
export const useTree = () => {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};
