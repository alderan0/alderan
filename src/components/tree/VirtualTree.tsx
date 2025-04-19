
import { useTree } from "@/context/TreeContext";

export const VirtualTree = () => {
  const { tree } = useTree();
  
  // Calculate sizes and colors based on tree state
  const treeHeight = 200 + (tree.height * 2); // Base height + growth
  const trunkWidth = 20 + Math.floor(tree.height / 10); // Trunk gets thicker as tree grows
  const canopySize = 100 + (tree.leaves * 1.5); // Tree canopy grows with leaves
  const leafColor = `hsl(${100 + (tree.health / 2)}, ${60 + (tree.health / 3)}%, ${40 + (tree.health / 5)}%)`; // Healthier = more vibrant green
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative" style={{ height: `${treeHeight}px`, width: `${canopySize}px` }}>
        {/* Tree trunk */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 bg-alderan-green-dark animate-tree-grow"
          style={{
            height: `${treeHeight * 0.7}px`,
            width: `${trunkWidth}px`,
            bottom: 0,
            borderRadius: `${trunkWidth / 2}px ${trunkWidth / 2}px 0 0`,
          }}
        />
        
        {/* Tree canopy - multiple layers for fullness */}
        {Array.from({ length: Math.max(1, Math.floor(tree.leaves / 10)) }).map((_, index) => (
          <div
            key={index}
            className="absolute left-1/2 transform -translate-x-1/2 rounded-full animate-leaf-appear"
            style={{
              backgroundColor: leafColor,
              height: `${canopySize - (index * 20)}px`,
              width: `${canopySize - (index * 15)}px`,
              bottom: `${(treeHeight * 0.4) + (index * 25)}px`,
              opacity: 0.85 - (index * 0.1),
              animationDelay: `${index * 0.15}s`,
            }}
          />
        ))}
        
        {/* Decorations */}
        {tree.decorations.map((decoration, index) => (
          <div
            key={index}
            className="absolute rounded-full animate-float"
            style={{
              height: "15px",
              width: "15px",
              backgroundColor: decoration.includes("Lights") ? "#FFD700" : "#FF69B4",
              left: `${20 + (Math.random() * 60)}%`,
              top: `${20 + (Math.random() * 60)}%`,
              animationDelay: `${index * 0.3}s`
            }}
          />
        ))}
        
        {/* Level indicator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 bg-alderan-blue text-white px-3 py-1 rounded-full text-sm font-medium">
          Level {tree.level}
        </div>
      </div>
      
      {/* Tree stats */}
      <div className="mt-12 grid grid-cols-2 gap-4 max-w-xs">
        <div className="bg-muted rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Height</div>
          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-alderan-green-dark"
              style={{ width: `${tree.height}%` }}
            />
          </div>
          <div className="text-right text-xs mt-1">{tree.height}%</div>
        </div>
        
        <div className="bg-muted rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Leaves</div>
          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-alderan-leaf"
              style={{ width: `${tree.leaves}%` }}
            />
          </div>
          <div className="text-right text-xs mt-1">{tree.leaves}%</div>
        </div>
        
        <div className="bg-muted rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Health</div>
          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${tree.health}%` }}
            />
          </div>
          <div className="text-right text-xs mt-1">{tree.health}%</div>
        </div>
        
        <div className="bg-muted rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Beauty</div>
          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500"
              style={{ width: `${tree.beauty}%` }}
            />
          </div>
          <div className="text-right text-xs mt-1">{tree.beauty}%</div>
        </div>
      </div>
    </div>
  );
};
