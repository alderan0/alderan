
import React from 'react';
import { useTree } from '@/context/TreeContext';

interface Decoration {
  id: string;
  type: string;
  name: string;
  active: boolean;
}

export const VirtualTree = () => {
  // Use the correct properties from tree context
  const { tree, treeHistory, galleryIndex } = useTree();
  const currentTree = galleryIndex >= 0 && galleryIndex < treeHistory.length 
    ? treeHistory[galleryIndex] 
    : tree;
  
  // Get background style based on tree level
  const getBackgroundStyle = () => {
    if (currentTree.level < 5) return 'bg-gradient-to-b from-blue-100 to-blue-200';
    if (currentTree.level < 10) return 'bg-gradient-to-b from-green-100 to-blue-100';
    if (currentTree.level < 15) return 'bg-gradient-to-b from-amber-100 to-green-100';
    return 'bg-gradient-to-b from-purple-100 to-amber-100';
  };
  
  // Get tree style based on level and points
  const getTreeStyle = () => {
    let baseHeight = 120 + (currentTree.height || 0);
    let baseWidth = 80 + (currentTree.level * 5);
    
    return {
      height: `${baseHeight}px`,
      width: `${baseWidth}px`
    };
  };

  // Check if decoration is active
  const isDecorationActive = (decoration: Decoration) => {
    if (!decoration || !currentTree.rewards) return false;
    return currentTree.rewards.some(reward => reward?.id === decoration.id && !reward.used);
  };
  
  return (
    <div className={`w-full h-72 rounded-lg relative overflow-hidden ${getBackgroundStyle()}`}>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        {/* Tree trunk */}
        <div 
          className="bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-lg mx-auto" 
          style={{ width: '20px', height: `${40 + currentTree.level * 2}px` }}
        />
        
        {/* Tree foliage */}
        <div 
          className="bg-gradient-to-t from-green-600 to-green-500 rounded-full mx-auto -mt-8"
          style={getTreeStyle()}
        >
          {/* Tree decorations would go here */}
        </div>
        
        {/* Tree level indicator */}
        <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded-full text-xs font-medium">
          Level {currentTree.level}
        </div>
      </div>
    </div>
  );
};

export default VirtualTree;
