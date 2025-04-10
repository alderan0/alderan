
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, Brain, Sparkles, Coffee, Zap, Moon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export const AddTaskDialog = ({ open, onOpenChange, projectId }: AddTaskDialogProps) => {
  const { addTask } = useTasks();
  
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [estimatedHours, setEstimatedHours] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [mood, setMood] = useState<"Creative" | "Focused" | "Relaxed" | "Energetic" | "Tired" | "">("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "">("");
  
  const handleSubmit = () => {
    if (!name.trim() || !date) return;
    
    const hours = parseInt(estimatedHours) || 0;
    const minutes = parseInt(estimatedMinutes) || 0;
    
    // Convert to total minutes
    const totalMinutes = (hours * 60) + minutes;
    
    addTask({
      name,
      deadline: date,
      estimatedTime: totalMinutes || 30, // Default to 30 mins if not specified
      mood: mood as any || undefined,
      userRating: difficulty as "easy" | "medium" | "hard" | undefined,
      projectId
    });
    
    // Reset form fields
    setName("");
    setDate(new Date());
    setEstimatedHours("");
    setEstimatedMinutes("");
    setMood("");
    setDifficulty("");
    
    onOpenChange(false);
  };
  
  // Get mood icon
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "Creative": return <Sparkles size={16} className="mr-2 text-purple-500" />;
      case "Focused": return <Brain size={16} className="mr-2 text-blue-500" />;
      case "Relaxed": return <Coffee size={16} className="mr-2 text-green-500" />;
      case "Energetic": return <Zap size={16} className="mr-2 text-amber-500" />;
      case "Tired": return <Moon size={16} className="mr-2 text-gray-500" />;
      default: return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Add a task to your project
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="taskName">Task name</Label>
            <Input
              id="taskName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Design homepage mockup"
            />
          </div>
          <div className="grid gap-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Choose a deadline"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>Estimated Time</Label>
            <div className="flex gap-2 items-center">
              <Clock size={16} className="text-muted-foreground" />
              <Input
                type="number"
                min="0"
                placeholder="Hours"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="flex-1"
              />
              <span className="text-muted-foreground">h</span>
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="Minutes"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="flex-1"
              />
              <span className="text-muted-foreground">m</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mood">Best Mood for this Task (optional)</Label>
            <Select value={mood} onValueChange={(value) => setMood(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a mood">
                  {mood && (
                    <div className="flex items-center">
                      {getMoodIcon(mood)}
                      <span>{mood}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Creative">
                  <div className="flex items-center">
                    <Sparkles size={16} className="mr-2 text-purple-500" />
                    <span>Creative</span>
                  </div>
                </SelectItem>
                <SelectItem value="Focused">
                  <div className="flex items-center">
                    <Brain size={16} className="mr-2 text-blue-500" />
                    <span>Focused</span>
                  </div>
                </SelectItem>
                <SelectItem value="Relaxed">
                  <div className="flex items-center">
                    <Coffee size={16} className="mr-2 text-green-500" />
                    <span>Relaxed</span>
                  </div>
                </SelectItem>
                <SelectItem value="Energetic">
                  <div className="flex items-center">
                    <Zap size={16} className="mr-2 text-amber-500" />
                    <span>Energetic</span>
                  </div>
                </SelectItem>
                <SelectItem value="Tired">
                  <div className="flex items-center">
                    <Moon size={16} className="mr-2 text-gray-500" />
                    <span>Tired</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Task Difficulty Rating */}
          <div className="grid gap-2">
            <Label htmlFor="taskDifficulty">Task Difficulty (optional)</Label>
            <RadioGroup 
              value={difficulty} 
              onValueChange={(value) => setDifficulty(value as "easy" | "medium" | "hard")}
              className="flex justify-between pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="dialog-easy" />
                <Label htmlFor="dialog-easy" className="text-green-500">Easy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="dialog-medium" />
                <Label htmlFor="dialog-medium" className="text-amber-500">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="dialog-hard" />
                <Label htmlFor="dialog-hard" className="text-red-500">Hard</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!name.trim() || !date}>
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
