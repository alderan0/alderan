
import { useTasks } from "@/context/TaskContext";
import { useTree } from "@/context/TreeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const ToolsInventory = () => {
  const { tools } = useTasks();
  const { applyTool } = useTree();
  
  const unusedTools = tools.filter(tool => !tool.used);
  
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
            Your Tools
          </CardTitle>
          <CardDescription>Complete tasks to earn tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-sm text-muted-foreground">No tools available. Complete tasks to earn tools for your tree!</p>
            <Button variant="outline" className="mt-4">Go to tasks</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getToolIcon = (type: string) => {
    switch (type) {
      case 'water':
        return '💧';
      case 'fertilize':
        return '🌱';
      case 'prune':
        return '✂️';
      case 'decorate':
        return '🎨';
      default:
        return '🔧';
    }
  };
  
  const getToolEffectText = (tool: any) => {
    const effects = [];
    if (tool.effect.height) effects.push(`+${tool.effect.height} Height`);
    if (tool.effect.leaves) effects.push(`+${tool.effect.leaves} Leaves`);
    if (tool.effect.health) effects.push(`+${tool.effect.health} Health`);
    if (tool.effect.beauty) effects.push(`+${tool.effect.beauty} Beauty`);
    return effects.join(', ');
  };

  const handleUseTool = (tool: any) => {
    applyTool(tool);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-alderan-green-light" />
          Your Tools
        </CardTitle>
        <CardDescription>Use these to grow your tree</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {unusedTools.map(tool => (
            <motion.div 
              key={tool.id} 
              className="flex items-center justify-between p-4 bg-muted rounded-md hover:bg-muted/80 transition-colors"
              variants={item}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-alderan-leaf/30 to-alderan-sand/30 flex items-center justify-center text-2xl mr-3">
                  {getToolIcon(tool.type)}
                </div>
                <div>
                  <p className="font-medium text-sm">{tool.name}</p>
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
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="default" 
                className="bg-gradient-to-r from-alderan-green-dark to-alderan-green-light hover:opacity-90 transition-opacity"
                onClick={() => handleUseTool(tool)}
              >
                Use
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};
