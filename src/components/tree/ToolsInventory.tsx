
import { useTasks } from "@/context/TaskContext";
import { useTree } from "@/context/TreeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ToolsInventory = () => {
  const { tools } = useTasks();
  const { applyTool } = useTree();
  
  const unusedTools = tools.filter(tool => !tool.used);
  
  if (unusedTools.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Tools</CardTitle>
          <CardDescription>Complete tasks to earn tools</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No tools available. Complete tasks to earn tools for your tree!</p>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tools</CardTitle>
        <CardDescription>Use these to grow your tree</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {unusedTools.map(tool => (
            <div 
              key={tool.id} 
              className="flex items-center justify-between p-3 bg-muted rounded-md"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getToolIcon(tool.type)}</span>
                <div>
                  <p className="font-medium text-sm">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">{getToolEffectText(tool)}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => applyTool(tool)}
              >
                Use
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
