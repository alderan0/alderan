
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
import { Loader2, Sparkle } from "lucide-react";
import { toast } from "sonner";

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
      await generateProjectFromRequirements(requirements);
      toast.success("Project generated successfully!");
      
      // Reset form fields
      setRequirements("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error generating project:", error);
      toast.error("Failed to generate project. Please try again.");
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
            Generate Project with AI
          </DialogTitle>
          <DialogDescription>
            Paste your project requirements document and AI will create a project with tasks automatically
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Enter your project requirements or user stories..."
              className="h-64 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              For best results, include detailed requirements with clear features, timelines, and priorities.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading || !requirements.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
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
