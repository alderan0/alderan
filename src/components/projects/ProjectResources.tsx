import { useTasks } from "@/context/TaskContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  BookOpen, 
  ExternalLink, 
  Sparkles,
  Brain,
  Coffee,
  Zap,
  Moon
} from "lucide-react";

interface ProjectResourcesProps {
  projectId: string;
}

export const ProjectResources = ({ projectId }: ProjectResourcesProps) => {
  const { getProjectResources } = useTasks();
  const resources = getProjectResources(projectId);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "app":
        return <Code className="h-4 w-4 mr-2 text-blue-500" />;
      case "resource":
        return <BookOpen className="h-4 w-4 mr-2 text-green-500" />;
      default:
        return null;
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "Creative": return <Sparkles size={16} className="mr-1 text-purple-500" />;
      case "Focused": return <Brain size={16} className="mr-1 text-blue-500" />;
      case "Relaxed": return <Coffee size={16} className="mr-1 text-green-500" />;
      case "Energetic": return <Zap size={16} className="mr-1 text-amber-500" />;
      case "Tired": return <Moon size={16} className="mr-1 text-gray-500" />;
      default: return null;
    }
  };

  if (resources.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
          Recommended Tools
        </CardTitle>
        <CardDescription>
          AI-suggested resources to help you complete your project tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center">
                {getResourceIcon(resource.type)}
                <div>
                  <div className="font-medium">{resource.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {resource.description}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(resource.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
