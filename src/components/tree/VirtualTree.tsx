
import { useTree } from "@/context/TreeContext";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export const VirtualTree = () => {
  const { tree, treeHistory, galleryIndex, viewPastTree, viewLatestTree, getTreeTier } = useTree();
  const [activeTab, setActiveTab] = useState("tree");
  
  // Calculate sizes and colors based on tree state
  const treeHeight = 200 + (tree.height * 2); // Base height + growth
  const trunkWidth = 20 + Math.floor(tree.height / 10); // Trunk gets thicker as tree grows
  const canopySize = 100 + (tree.leaves * 1.5); // Tree canopy grows with leaves
  
  // Apply styled effects based on tree styling options
  const getLeafColor = () => {
    switch(tree.styles?.leafStyle || "default") {
      case "syntax":
        return `hsl(210, ${60 + (tree.health / 3)}%, ${40 + (tree.health / 5)}%)`; // Blue syntax
      case "pixel":
        return `hsl(${100 + (tree.health / 2)}, ${50 + (tree.health / 4)}%, ${30 + (tree.health / 4)}%)`; // Pixelated green
      case "binary":
        return `hsl(150, ${70 + (tree.health / 5)}%, ${35 + (tree.health / 6)}%)`; // Binary green
      default:
        return `hsl(${100 + (tree.health / 2)}, ${60 + (tree.health / 3)}%, ${40 + (tree.health / 5)}%)`; // Default green
    }
  };
  
  const getBarkColor = () => {
    switch(tree.styles?.barkTexture || "smooth") {
      case "binary":
        return "from-amber-900 to-amber-700 bg-gradient-to-b";
      case "rough":
        return "from-amber-800 to-amber-600 bg-gradient-to-r";
      default:
        return "from-alderan-green-dark to-amber-800";
    }
  };
  
  const getLightingEffect = () => {
    switch(tree.styles?.lighting || "default") {
      case "nightmode":
        return "bg-blue-900/20";
      case "lofi":
        return "bg-purple-900/10";
      case "loops":
        return "bg-gradient-to-br from-blue-500/5 to-purple-500/5";
      default:
        return "bg-transparent";
    }
  };
  
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
  
  // For pixel style, generate a grid of square leaves
  const pixelLeaves = tree.styles?.leafStyle === "pixel" ? Array.from({ length: 24 }, (_, i) => {
    const row = Math.floor(i / 6);
    const col = i % 6;
    return {
      x: (col - 2.5) * 15,
      y: (row - 2) * 15,
      size: 12,
      delay: i * 0.02
    };
  }) : [];
  
  const specialEffects = tree.styles?.special || [];
  
  const renderSpecialEffects = () => {
    return (
      <>
        {specialEffects.includes("birds") && (
          <div className="absolute right-4 top-1/3 animate-bounce-slow">
            <div className="relative">
              <div className="text-sm bg-gray-100/80 rounded p-1 mb-1">// TODO: Fix bug</div>
              <div className="text-2xl">🐦</div>
            </div>
          </div>
        )}
        {specialEffects.includes("functions") && (
          <div className="absolute bottom-4 right-8 flex flex-col items-center">
            <div className="text-sm font-mono text-purple-700 mb-1">function grow() {`{}`}</div>
            <div className="h-8 w-8 bg-purple-300 rounded-full"></div>
          </div>
        )}
        {specialEffects.includes("recursive") && (
          <div className="absolute bottom-0 left-1/4 w-1/2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute bottom-0 h-1 bg-amber-700"
                style={{
                  left: `${10 * i}%`,
                  width: `${40 - i * 8}%`,
                  height: `${4 + i}px`,
                  transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (10 + i * 5)}deg)`,
                }}
              ></div>
            ))}
          </div>
        )}
      </>
    );
  };
  
  // Get the current tier based on tree level
  const currentTier = getTreeTier();
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="mb-4 w-full max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="tree">Tree View</TabsTrigger>
            <TabsTrigger value="gallery">Tree Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tree" className="mt-0">
            <div className="flex items-center justify-center mb-4 space-x-2">
              <Badge variant="outline" className="bg-alderan-green-dark/10 text-alderan-green-dark font-semibold px-3 py-1">
                Level {tree.level}
              </Badge>
              <Badge variant="outline" className="bg-amber-100 text-amber-700 font-semibold px-3 py-1">
                {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Tier
              </Badge>
              {tree.level >= 5 && (
                <Badge variant="outline" className="bg-purple-100 text-purple-700 font-semibold px-3 py-1">
                  Thriving
                </Badge>
              )}
              {currentTier === "mature" && (
                <Badge variant="outline" className="bg-blue-100 text-blue-700 font-semibold px-3 py-1">
                  Master Coder
                </Badge>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-0">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => galleryIndex > 0 ? viewPastTree(galleryIndex - 1) : viewPastTree(0)}
                disabled={galleryIndex <= 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-center">
                {galleryIndex >= 0 ? (
                  <div className="text-sm">
                    <span className="font-semibold">
                      {treeHistory[galleryIndex]?.snapshotDate ? 
                        format(new Date(treeHistory[galleryIndex].snapshotDate), "MMM d, yyyy") : 
                        "Historical View"}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm font-semibold">Current Tree</div>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => galleryIndex < treeHistory.length - 1 ? 
                  viewPastTree(galleryIndex + 1) : 
                  viewLatestTree()
                }
                disabled={galleryIndex === -1}
              >
                {galleryIndex === treeHistory.length - 1 || galleryIndex === -1 ? 
                  "Current" : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className={`relative ${getLightingEffect()}`} style={{ height: `${treeHeight}px`, width: `${canopySize}px` }}>
        {/* Ground/soil with gradient */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-12 bg-gradient-to-r from-amber-700/30 via-amber-800/40 to-amber-700/30 rounded-full" />
        
        {/* Tree trunk with texture */}
        <motion.div
          initial={{ scaleY: 0.6, opacity: 0.7 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`absolute left-1/2 transform -translate-x-1/2 bg-gradient-to-b ${getBarkColor()}`}
          style={{
            height: `${treeHeight * 0.7}px`,
            width: `${trunkWidth}px`,
            bottom: 0,
            borderRadius: `${trunkWidth / 2}px ${trunkWidth / 2}px 0 0`,
            boxShadow: "inset -4px 0 6px rgba(0,0,0,0.2)",
          }}
        >
          {/* Binary texture overlay for bark */}
          {tree.styles?.barkTexture === "binary" && (
            <div className="absolute inset-0 overflow-hidden opacity-30">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i} 
                  className="text-[8px] font-mono text-white opacity-80 absolute"
                  style={{
                    top: `${i * 8}%`,
                    left: `${i % 2 === 0 ? 2 : trunkWidth / 2}px`,
                  }}
                >
                  {i % 2 === 0 ? '10' : '01'}
                </div>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Main tree canopy */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute left-1/2 transform -translate-x-1/2 rounded-full"
          style={{
            backgroundColor: getLeafColor(),
            height: `${canopySize}px`,
            width: `${canopySize}px`,
            bottom: `${treeHeight * 0.4}px`,
            boxShadow: "inset -15px -10px 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Syntax highlighting pattern overlay */}
          {tree.styles?.leafStyle === "syntax" && (
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-40">
              {Array.from({ length: 6 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`absolute h-2 rounded-full ${
                    i % 3 === 0 ? "bg-blue-300" : i % 3 === 1 ? "bg-green-300" : "bg-purple-300"
                  }`}
                  style={{
                    top: `${20 + i * 12}%`,
                    left: '10%',
                    width: `${30 + i * 5}%`,
                  }}
                ></div>
              ))}
            </div>
          )}
          
          {/* Binary pattern overlay */}
          {tree.styles?.leafStyle === "binary" && (
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-20">
              <div className="w-full h-full flex flex-wrap content-start pt-4 justify-center">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="text-[8px] font-mono text-white mx-1">
                    {Math.random() > 0.5 ? '1' : '0'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Pixel style leaves */}
        {tree.styles?.leafStyle === "pixel" && pixelLeaves.map((leaf, index) => (
          <motion.div
            key={`pixel-${index}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ 
              duration: 0.4,
              delay: 1 + leaf.delay,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="absolute"
            style={{
              backgroundColor: getLeafColor(),
              height: `${leaf.size}px`,
              width: `${leaf.size}px`,
              left: `calc(50% + ${leaf.x}px)`,
              bottom: `calc(${treeHeight * 0.55}px + ${leaf.y}px)`,
            }}
          />
        ))}
        
        {/* Normal leaf clusters if not pixel style */}
        {tree.styles?.leafStyle !== "pixel" && leafPositions.map((leaf, index) => (
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
              backgroundColor: getLeafColor(),
              height: `${leaf.size}px`,
              width: `${leaf.size}px`,
              left: `calc(50% + ${leaf.x}px)`,
              bottom: `calc(${treeHeight * 0.55}px + ${leaf.y}px)`,
              boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.1)",
            }}
          />
        ))}
        
        {/* Special effects */}
        {renderSpecialEffects()}
        
        {/* Loop lights animation */}
        {tree.styles?.lighting === "loops" && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full animate-pulse-glow bg-white/10"
                style={{
                  top: `${30 + i * 20}%`,
                  left: `${30 + i * 15}%`,
                  height: `${10 + i * 5}px`,
                  width: `${10 + i * 5}px`,
                  animationDelay: `${i * 0.7}s`,
                  boxShadow: '0 0 8px 2px rgba(255,255,255,0.3)'
                }}
              />
            ))}
          </div>
        )}
        
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
      {(tree.height > 40 || tree.leaves > 40 || currentTier !== "sapling") && (
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
          {currentTier === "mature" && (
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center text-purple-600 text-xl mb-1">
                👨‍💻
              </div>
              <span className="text-xs text-muted-foreground">Vibe Coder</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
