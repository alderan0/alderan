
import { useTree } from "@/context/TreeContext";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export const VirtualTree = () => {
  const { tree } = useTree();
  
  // Calculate sizes and colors based on tree state
  const treeHeight = 200 + (tree.height * 2); // Base height + growth
  const trunkWidth = 20 + Math.floor(tree.height / 10); // Trunk gets thicker as tree grows
  const canopySize = 100 + (tree.leaves * 1.5); // Tree canopy grows with leaves
  const leafColor = `hsl(${100 + (tree.health / 2)}, ${60 + (tree.health / 3)}%, ${40 + (tree.health / 5)}%)`; // Healthier = more vibrant green
  
  // Calculate leaf positions for a more natural look
  const leafPositions = Array.from({ length: Math.min(12, Math.max(5, Math.floor(tree.leaves / 8))) }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 30,
      size: 20 + Math.random() * 15,
      delay: i * 0.05
    };
  });
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="mb-4 flex items-center space-x-2">
        <Badge variant="outline" className="bg-alderan-green-dark/10 text-alderan-green-dark font-semibold px-3 py-1">
          Level {tree.level}
        </Badge>
        {tree.level >= 5 && (
          <Badge variant="outline" className="bg-purple-100 text-purple-700 font-semibold px-3 py-1">
            Thriving
          </Badge>
        )}
      </div>
      
      <div className="relative" style={{ height: `${treeHeight}px`, width: `${canopySize}px` }}>
        {/* Ground/soil with gradient */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-12 bg-gradient-to-r from-amber-700/30 via-amber-800/40 to-amber-700/30 rounded-full" />
        
        {/* Tree trunk with texture */}
        <motion.div
          initial={{ scaleY: 0.6, opacity: 0.7 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-alderan-green-dark to-amber-800"
          style={{
            height: `${treeHeight * 0.7}px`,
            width: `${trunkWidth}px`,
            bottom: 0,
            borderRadius: `${trunkWidth / 2}px ${trunkWidth / 2}px 0 0`,
            boxShadow: "inset -4px 0 6px rgba(0,0,0,0.2)",
          }}
        />
        
        {/* Main tree canopy */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute left-1/2 transform -translate-x-1/2 rounded-full"
          style={{
            backgroundColor: leafColor,
            height: `${canopySize}px`,
            width: `${canopySize}px`,
            bottom: `${treeHeight * 0.4}px`,
            boxShadow: "inset -15px -10px 20px rgba(0,0,0,0.1)",
          }}
        />
        
        {/* Additional leaf clusters for texture */}
        {leafPositions.map((leaf, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ 
              duration: 0.6, 
              delay: 1 + leaf.delay,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="absolute rounded-full"
            style={{
              backgroundColor: `${leafColor}`,
              height: `${leaf.size}px`,
              width: `${leaf.size}px`,
              left: `calc(50% + ${leaf.x}px)`,
              bottom: `calc(${treeHeight * 0.55}px + ${leaf.y}px)`,
              boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.1)",
            }}
          />
        ))}
        
        {/* Decorations */}
        {tree.decorations.map((decoration, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 1.5 + (index * 0.1),
              type: "spring",
              stiffness: 300,
              damping: 15
            }}
            className="absolute rounded-full animate-float"
            style={{
              height: "15px",
              width: "15px",
              backgroundColor: decoration.includes("Lights") ? "#FFD700" : "#FF69B4",
              left: `${20 + (Math.random() * 60)}%`,
              top: `${20 + (Math.random() * 60)}%`,
              boxShadow: "0 0 8px 2px rgba(255,255,255,0.6)",
              animationDelay: `${index * 0.3}s`
            }}
          />
        ))}
      </div>
      
      {/* Tree stats */}
      <div className="mt-12 grid grid-cols-2 gap-4 max-w-xs w-full">
        <motion.div 
          className="bg-muted rounded-lg p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-xs text-muted-foreground">Height</div>
          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-alderan-green-dark"
              initial={{ width: 0 }}
              animate={{ width: `${tree.height}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="text-right text-xs mt-1">{tree.height}%</div>
        </motion.div>
        
        <motion.div 
          className="bg-muted rounded-lg p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-xs text-muted-foreground">Leaves</div>
          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-alderan-leaf"
              initial={{ width: 0 }}
              animate={{ width: `${tree.leaves}%` }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </div>
          <div className="text-right text-xs mt-1">{tree.leaves}%</div>
        </motion.div>
        
        <motion.div 
          className="bg-muted rounded-lg p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-xs text-muted-foreground">Health</div>
          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${tree.health}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
          <div className="text-right text-xs mt-1">{tree.health}%</div>
        </motion.div>
        
        <motion.div 
          className="bg-muted rounded-lg p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-xs text-muted-foreground">Beauty</div>
          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${tree.beauty}%` }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
          <div className="text-right text-xs mt-1">{tree.beauty}%</div>
        </motion.div>
      </div>
      
      {/* Achievement badges */}
      {(tree.height > 40 || tree.leaves > 40) && (
        <motion.div 
          className="mt-8 grid grid-cols-3 gap-3 max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {tree.height > 40 && (
            <div className="flex flex-col items-center">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center text-amber-600 text-xl mb-1">
                🌲
              </div>
              <span className="text-xs text-muted-foreground">Growing Tall</span>
            </div>
          )}
          {tree.leaves > 40 && (
            <div className="flex flex-col items-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center text-green-600 text-xl mb-1">
                🍃
              </div>
              <span className="text-xs text-muted-foreground">Leafy</span>
            </div>
          )}
          {tree.decorations.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center text-purple-600 text-xl mb-1">
                🎨
              </div>
              <span className="text-xs text-muted-foreground">Designer</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
