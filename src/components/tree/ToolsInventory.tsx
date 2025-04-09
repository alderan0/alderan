
import { useTasks } from "@/context/TaskContext";
import { useTree } from "@/context/TreeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Code, Filter, Scissors, Droplet, Lamp, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ToolsInventory = () => {
  const { tools } = useTasks();
  const { applyTool, tree, getTreeTier } = useTree();
  
  const unusedTools = tools.filter(tool => !tool.used);
  const currentTier = getTreeTier();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };
  
  if (unusedTools.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-alderan-green-light" />
            Your Coding Tools
          </CardTitle>
          <CardDescription>Complete tasks to earn coding-themed tools for your tree</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-sm text-muted-foreground">No tools available. Complete tasks to earn creative coding tools for your tree!</p>
            <Button variant="outline" className="mt-4">Go to tasks</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getToolIcon = (type: string) => {
    switch (type) {
      case 'water':
        return <Droplet className="h-6 w-6 text-blue-500" />;
      case 'fertilize':
        return <Filter className="h-6 w-6 text-green-500" />;
      case 'prune':
        return <Scissors className="h-6 w-6 text-amber-500" />;
      case 'decorate':
      case 'customize':
        return <PlusCircle className="h-6 w-6 text-purple-500" />;
      case 'illuminate':
        return <Lamp className="h-6 w-6 text-yellow-500" />;
      default:
        return <Code className="h-6 w-6 text-alderan-blue" />;
    }
  };
  
  // Get available tools based on tree tier
  const getEligibleTools = () => {
    if (currentTier === "sapling") {
      return unusedTools.filter(tool => tool.tier === "sapling");
    }
    if (currentTier === "young") {
      return unusedTools.filter(tool => tool.tier === "sapling" || tool.tier === "young");
    }
    // Mature tier has access to all tools
    return unusedTools;
  };
  
  const eligibleTools = getEligibleTools();
  const lockedTools = unusedTools.filter(tool => !eligibleTools.includes(tool));

  const handleUseTool = (tool: any) => {
    applyTool(tool);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="mr-2 h-5 w-5 text-alderan-blue" />
          Your Coding Tools
        </CardTitle>
        <CardDescription>
          {currentTier === "sapling" && "You're a beginner coder. Reach Young tier (50+ tasks) to unlock more tools!"}
          {currentTier === "young" && "You're advancing as a coder. Reach Mature tier (150+ tasks) for elite tools!"}
          {currentTier === "mature" && "You're a master coder with access to all tools!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {eligibleTools.map(tool => (
            <motion.div 
              key={tool.id} 
              className="flex items-center justify-between p-4 bg-muted rounded-md hover:bg-muted/80 transition-colors"
              variants={item}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-alderan-leaf/30 to-alderan-sand/30 flex items-center justify-center mr-3">
                  {getToolIcon(tool.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{tool.name}</p>
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5">
                      {tool.tier}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tool.effect.height && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">+{tool.effect.height} Height</span>
                    )}
                    {tool.effect.leaves && (
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">+{tool.effect.leaves} Leaves</span>
                    )}
                    {tool.effect.health && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">+{tool.effect.health} Health</span>
                    )}
                    {tool.effect.beauty && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">+{tool.effect.beauty} Beauty</span>
                    )}
                    {tool.effect.style && (
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">{tool.effect.style} Style</span>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="default" 
                className="bg-gradient-to-r from-alderan-green-dark to-alderan-green-light hover:opacity-90 transition-opacity"
                onClick={() => handleUseTool(tool)}
              >
                Apply
              </Button>
            </motion.div>
          ))}
          
          {/* Locked tools section */}
          {lockedTools.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Locked Tools (Tier Restricted)</h3>
              {lockedTools.map(tool => (
                <motion.div 
                  key={tool.id} 
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-md border border-dashed border-muted-foreground/30 mb-2"
                  variants={item}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mr-3">
                      {getToolIcon(tool.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-muted-foreground">{tool.name}</p>
                        <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5">
                          {tool.tier} tier
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Unlocks at {tool.tier} tier</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled
                  >
                    Locked
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};
