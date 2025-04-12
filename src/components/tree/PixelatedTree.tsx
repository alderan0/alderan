
import { useTree } from "@/context/TreeContext";
import { useEffect, useState } from "react";
import { Sparkle, Leaf, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export const PixelatedTree = () => {
  const { tree, lastEffect, setLastEffect } = useTree();
  const [animation, setAnimation] = useState<string | null>(null);

  // Get visual effects from the tree
  const { leafColor, trunkColor, special } = tree.visualEffects || { 
    leafColor: 'green', 
    trunkColor: 'brown'
  };

  // Watch for changes in lastEffect to trigger animations
  useEffect(() => {
    const handleTreeChange = () => {
      if (lastEffect === 'growTaller') {
        setAnimation('grow');
        setTimeout(() => setAnimation(null), 2000);
      } else if (lastEffect === 'addLeaves') {
        setAnimation('leaves');
        setTimeout(() => setAnimation(null), 2000);
      } else if (lastEffect === 'healthGlow') {
        setAnimation('health');
        setTimeout(() => setAnimation(null), 2000);
      } else if (lastEffect === 'rainbowLeaves') {
        setAnimation('rainbow');
        setTimeout(() => setAnimation(null), 2000);
      } else if (lastEffect === 'goldenTrunk') {
        setAnimation('gold');
        setTimeout(() => setAnimation(null), 2000);
      } else if (lastEffect === 'superGrow') {
        setAnimation('superGrow');
        setTimeout(() => setAnimation(null), 2500);
      } else if (lastEffect === 'magicAura') {
        setAnimation('aura');
        setTimeout(() => setAnimation(null), 2500);
      }
      setLastEffect(null);
    };

    if (lastEffect) {
      handleTreeChange();
    }
  }, [lastEffect, setLastEffect]);

  // Calculate tree size based on height
  const treeHeight = Math.min(400, Math.max(50, tree.height * 50));
  const trunkHeight = Math.floor(treeHeight * 0.6);
  const trunkWidth = Math.floor(treeHeight * 0.15);
  const leavesSize = Math.min(250, Math.floor(treeHeight * 0.8));

  // Generate leaves based on count
  const getLeaves = () => {
    const numberOfLeaves = tree.leaves;
    const leaves = [];
    
    const baseSize = Math.max(12, Math.min(20, leavesSize / 10));
    
    for (let i = 0; i < numberOfLeaves; i++) {
      const size = baseSize + Math.random() * 10;
      const top = Math.random() * leavesSize * 0.8;
      const left = Math.random() * leavesSize;
      const rotation = Math.random() * 360;
      const delay = Math.random() * 0.5;
      
      leaves.push(
        <Leaf
          key={i}
          className={cn(
            "absolute transform transition-all duration-300",
            getLeafColor(leafColor),
            animation === 'leaves' && "animate-bounce",
            animation === 'rainbow' && "animate-pulse"
          )}
          style={{
            top: `${top}px`,
            left: `${left}px`,
            width: `${size}px`,
            height: `${size}px`,
            transform: `rotate(${rotation}deg)`,
            animationDelay: `${delay}s`
          }}
        />
      );
    }
    return leaves;
  };
  
  // Get color based on leaf type
  const getLeafColor = (color: string | undefined) => {
    switch(color) {
      case 'rainbow':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-blue-500 fill-current';
      case 'gold':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };
  
  // Get trunk color based on type
  const getTrunkColor = (color: string | undefined) => {
    switch(color) {
      case 'gold':
        return 'bg-gradient-to-b from-yellow-300 to-yellow-600';
      default:
        return 'bg-gradient-to-b from-amber-700 to-amber-900';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative pb-5">
      <div 
        className={cn(
          "relative",
          animation === 'aura' && "animate-pulse",
          special === 'aura' && "rounded-full bg-blue-200/20 border border-blue-300/30"
        )}
        style={{ 
          width: `${leavesSize}px`, 
          height: `${leavesSize}px`,
          padding: special === 'aura' ? '20px' : '0'
        }}
      >
        {/* Tree leaves */}
        <div 
          className={cn(
            "relative w-full h-full",
            animation === 'grow' && "animate-pulse",
            animation === 'superGrow' && "animate-bounce"
          )}
        >
          {getLeaves()}
          
          {/* Special effects */}
          {(animation === 'health' || animation === 'aura') && (
            Array(10).fill(0).map((_, i) => (
              <Sparkle
                key={i}
                className="absolute text-yellow-400 animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${10 + Math.random() * 15}px`,
                  height: `${10 + Math.random() * 15}px`,
                  animationDelay: `${Math.random() * 1}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                }}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Tree trunk */}
      <div 
        className={cn(
          "rounded-md transition-all",
          getTrunkColor(trunkColor),
          animation === 'grow' && "animate-pulse",
          animation === 'gold' && "animate-pulse"
        )}
        style={{
          width: `${trunkWidth}px`,
          height: `${trunkHeight}px`,
          marginTop: `-${trunkWidth / 2}px`,
        }}
      />
      
      {/* Root system */}
      <div className="flex justify-center mt-2">
        <div 
          className="bg-gradient-to-r from-amber-900 to-amber-700 rounded-full"
          style={{
            width: `${trunkWidth * 1.5}px`,
            height: `${trunkWidth / 2}px`,
          }}
        />
      </div>
      
      {/* Tree height label */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Height: <span className="font-medium">{tree.height.toFixed(1)}m</span>
        </p>
      </div>
      
      {/* Show animations for effects */}
      {animation === 'superGrow' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Flame className="text-orange-500 animate-ping w-20 h-20 opacity-50" />
        </div>
      )}
    </div>
  );
};
