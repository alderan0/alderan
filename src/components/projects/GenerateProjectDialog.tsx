
import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkle, FileText, LayoutList, FileSymlink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface GenerateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GenerateProjectDialog = ({ open, onOpenChange }: GenerateProjectDialogProps) => {
  const { generateProjectFromRequirements } = useTasks();
  const [requirements, setRequirements] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!requirements.trim()) {
      toast.error("Please enter project requirements");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if OPENAI_API_KEY is set in environment variables
      if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error(
          "OPENAI_API_KEY is not configured. Please set it in your environment variables."
        );
      }
      
      // Call the OpenAI edge function to process the PRD
      const { data, error } = await supabase.functions.invoke('openai-assistant', {
        body: { 
          prompt: requirements,
          type: "generate_project" 
        }
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Error calling AI service");
      }
      
      console.log("AI response:", data);
      
      if (!data || !data.parsedTasks || data.parsedTasks.length === 0) {
        throw new Error("Could not generate tasks from the PRD. Please try again with more detailed requirements.");
      }
      
      // Format for project name
      const projectName = requirements.split('\n')[0].substring(0, 50) || "New AI Generated Project";
      
      // Extract project description (use first few sentences)
      const projectDesc = requirements.substring(0, 250) + (requirements.length > 250 ? "..." : "");
      
      // Generate the project with the AI-generated tasks
      await generateProjectFromRequirements(projectName, projectDesc, data.parsedTasks);
      
      toast.success("Project successfully generated from your PRD!");
      
      // Reset form fields
      setRequirements("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error generating project:", error);
      toast.error(`Failed to generate project: ${error.message || "Please try again"}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkle className="h-5 w-5 text-purple-500" />
            Generate Project from PRD
          </DialogTitle>
          <DialogDescription>
            Paste your Project Requirements Document (PRD) and Alderan's AI will create a complete project with tasks and subtasks
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Enter your project requirements or PRD content..."
              className="h-64 resize-none font-mono"
            />
            <div className="text-xs text-muted-foreground space-y-2">
              <p>
                For best results, include detailed requirements with clear features, timelines, and priorities.
              </p>
              <div className="flex flex-col gap-1 mt-2">
                <span className="font-medium text-sm">AI will automatically:</span>
                <div className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-blue-500" />
                  <span>Parse your PRD into actionable components</span>
                </div>
                <div className="flex items-center gap-1">
                  <LayoutList className="h-3.5 w-3.5 text-green-500" />
                  <span>Create tasks organized by priority and timeline</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileSymlink className="h-3.5 w-3.5 text-amber-500" />
                  <span>Break down complex tasks into subtasks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading || !requirements.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing PRD...
              </>
            ) : (
              <>
                <Sparkle className="mr-2 h-4 w-4" />
                Generate Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
