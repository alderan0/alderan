
import React from "react";
import { useTree } from "@/context/TreeContext";
import { Card, CardContent } from "@/components/ui/card";
import { PixelTreeReward } from "@/context/TreeContext";
import { Button } from "@/components/ui/button";
import { 
  Droplet, 
  Leaf, 
  Heart, 
  Sparkles,
  Award,
  Gift
} from "lucide-react";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export const PixelatedTree = () => {
  const { tree, applyReward } = useTree();
  
  // Safely handle rewards - Add null check before filtering
  const unusedRewards = tree?.rewards?.filter(reward => !reward.used) || [];
  const growthRewards = unusedRewards.filter(reward => reward.type === "growth");
  const decorationRewards = unusedRewards.filter(reward => reward.type === "decoration");
  
  // Function to get color based on rarity
  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case "common": return "bg-slate-200 text-slate-700";
      case "uncommon": return "bg-green-100 text-green-800";
      case "rare": return "bg-blue-100 text-blue-800";
      case "exquisite": return "bg-purple-100 text-purple-800";
      default: return "bg-slate-200 text-slate-700";
    }
  };
  
  // Function to get tailwind class for the tree based on its size
  const getTreeSizeClass = () => {
    if (tree.height < 30) return "h-24";
    if (tree.height < 60) return "h-32";
    return "h-40";
  };
  
  // Function to get tailwind classes for the tree appearance
  const getTreeAppearanceClasses = () => {
    const baseClasses = "mx-auto transition-all duration-500";
    let styleClasses = "";
    
    // Leaf style
    switch(tree?.styles?.leafStyle) {
      case "syntax":
        styleClasses += " bg-gradient-to-tr from-green-700 to-emerald-400";
        break;
      case "pixel":
        styleClasses += " bg-gradient-to-tr from-emerald-600 to-green-400";
        break;
      case "binary":
        styleClasses += " bg-gradient-to-tr from-green-900 to-emerald-600";
        break;
      default:
        styleClasses += " bg-gradient-to-tr from-green-600 to-lime-400";
    }
    
    // Lighting effects
    switch(tree?.styles?.lighting) {
      case "nightmode":
        styleClasses += " shadow-lg shadow-blue-700/30";
        break;
      case "lofi":
        styleClasses += " shadow-md shadow-slate-400/50";
        break;
      case "loops":
        styleClasses += " shadow-xl shadow-amber-400/30";
        break;
      default:
        styleClasses += " shadow-md shadow-green-800/20";
    }
    
    return `${baseClasses} ${styleClasses}`;
  };
  
  // Pixel art representation of the tree
  const renderPixelatedTree = () => {
    const leaves = Math.min(100, tree?.leaves || 0);
    const health = tree?.health || 0;
    
    let leafColor = "bg-emerald-300";
    if (health < 30) leafColor = "bg-yellow-300";
    if (health < 15) leafColor = "bg-orange-300";
    
    return (
      <div className="flex flex-col items-center justify-end h-60 relative">
        {/* Tree trunk */}
        <div className={`w-6 ${tree?.height < 50 ? 'h-16' : 'h-24'} bg-amber-800 rounded-sm`}></div>
        
        {/* Tree leaves - pixelated style */}
        <div className="absolute bottom-16 flex flex-col items-center">
          {/* Base large leaf area */}
          <div className={`w-32 ${getTreeSizeClass()} ${getTreeAppearanceClasses()} rounded-lg`} 
            style={{ clipPath: "polygon(50% 0%, 100% 70%, 80% 100%, 20% 100%, 0% 70%)" }}>
            
            {/* Pixelated overlay pattern */}
            <div className="w-full h-full grid grid-cols-8 grid-rows-8 opacity-30">
              {Array.from({ length: 64 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`${Math.random() > 0.7 ? 'bg-white/20' : 'bg-transparent'}`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Decorations based on special styles */}
          {tree?.styles?.special?.includes('birds') && (
            <div className="absolute top-1/4 -right-4">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="w-6 h-2 bg-blue-600 -mt-1 ml-3 transform rotate-45"></div>
            </div>
          )}
          
          {tree?.styles?.special?.includes('functions') && (
            <div className="absolute top-1/3 -left-8">
              <div className="text-xs bg-white/70 rounded px-1 font-mono">fn()</div>
            </div>
          )}
          
          {tree?.styles?.special?.includes('recursive') && (
            <div className="absolute bottom-1/4 left-full">
              <div className="w-16 h-16 border border-green-200 rounded-full animate-ping opacity-30"></div>
            </div>
          )}
          
          {/* Decorations based on tree state */}
          {tree?.decorations?.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {tree.decorations.map((decoration, i) => (
                <div 
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${Math.random() * 80}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                >
                  <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Your Pixelated Tree</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                Level {tree?.level || 1}/20
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Your tree's current level</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Card className="overflow-hidden">
        <ContextMenuTrigger className="focus:outline-none">
          <CardContent className="p-6 bg-gradient-to-b from-blue-50 to-white">
            {renderPixelatedTree()}
            
            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="flex flex-col items-center">
                <Droplet className="h-5 w-5 text-blue-500 mb-1" />
                <div className="text-xs text-center">Height</div>
                <div className="font-medium">{tree?.height || 0}%</div>
              </div>
              <div className="flex flex-col items-center">
                <Leaf className="h-5 w-5 text-green-500 mb-1" />
                <div className="text-xs text-center">Leaves</div>
                <div className="font-medium">{tree?.leaves || 0}%</div>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="h-5 w-5 text-red-500 mb-1" />
                <div className="text-xs text-center">Health</div>
                <div className="font-medium">{tree?.health || 0}%</div>
              </div>
              <div className="flex flex-col items-center">
                <Sparkles className="h-5 w-5 text-amber-500 mb-1" />
                <div className="text-xs text-center">Beauty</div>
                <div className="font-medium">{tree?.beauty || 0}%</div>
              </div>
            </div>
          </CardContent>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>View Details</ContextMenuItem>
          <ContextMenuItem>Take Screenshot</ContextMenuItem>
        </ContextMenuContent>
      </Card>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold flex items-center">
              <Award className="h-4 w-4 mr-1 text-green-600" />
              Growth Promoters
            </h3>
            <span className="text-xs text-muted-foreground">{growthRewards.length} available</span>
          </div>
          
          {growthRewards.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
              {growthRewards.map(reward => (
                <Button
                  key={reward.id}
                  variant="outline"
                  size="sm"
                  className={`flex flex-col h-auto text-xs p-2 ${getRarityColor(reward.rarity)}`}
                  onClick={() => applyReward(reward)}
                >
                  <span className="truncate w-full text-center">{reward.name}</span>
                  <span className="text-[10px] opacity-70 capitalize">{reward.rarity}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-sm text-center text-muted-foreground py-4">
              Complete tasks to earn growth promoters
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold flex items-center">
              <Gift className="h-4 w-4 mr-1 text-purple-600" />
              Decorations
            </h3>
            <span className="text-xs text-muted-foreground">{decorationRewards.length} available</span>
          </div>
          
          {decorationRewards.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
              {decorationRewards.map(reward => (
                <Button
                  key={reward.id}
                  variant="outline"
                  size="sm"
                  className={`flex flex-col h-auto text-xs p-2 ${getRarityColor(reward.rarity)}`}
                  onClick={() => applyReward(reward)}
                >
                  <span className="truncate w-full text-center">{reward.name}</span>
                  <span className="text-[10px] opacity-70 capitalize">{reward.rarity}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-sm text-center text-muted-foreground py-4">
              Complete tasks to earn decorations
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
