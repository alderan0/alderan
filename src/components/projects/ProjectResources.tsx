
import { ProjectResource } from "@/context/TaskContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Code, BookOpen } from "lucide-react";
import * as Icons from "lucide-react";

interface ProjectResourcesProps {
  resources: ProjectResource[];
}

export const ProjectResources = ({ resources }: ProjectResourcesProps) => {
  if (!resources || resources.length === 0) {
    return null;
  }
  
  // Dynamic icon component lookup
  const getDynamicIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="h-5 w-5" />;
    }
    return iconName === "app" ? <Code className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <span className="text-lg mr-2">🧠</span> 
          AI-Suggested Resources
        </CardTitle>
        <CardDescription>Tools and resources that might help with this project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {resources.map((resource) => (
            <Button
              key={resource.id}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-auto py-2"
              onClick={() => window.open(resource.url, "_blank")}
            >
              <div className={`p-1 rounded-md ${resource.type === "app" ? "bg-primary/10" : "bg-secondary/20"}`}>
                {getDynamicIcon(resource.iconName)}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">{resource.name}</span>
                <span className="text-xs text-muted-foreground">{resource.description}</span>
              </div>
              <ExternalLink size={14} className="ml-1 opacity-70" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
