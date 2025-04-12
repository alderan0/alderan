import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/context/TaskContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Sheet,
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mic, MicOff, Plus, Sparkles, Brain, Coffee, Zap, Moon, FolderKanban, Loader2, CheckCircle, CirclePlus, CircleDashed } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { MoodSelector } from "./MoodSelector";
import { TimePickerDemo } from "../ui/time-picker";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard", "Very Hard"] as const;
const TASK_TYPES = ["Task", "Subtask", "Project"] as const;

export const AddTaskForm = () => {
  const { addTask, currentMood, projects, addProject, addSubtask, tasks } = useTasks();
  const [taskName, setTaskName] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [taskMood, setTaskMood] = useState(currentMood);
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("none");
  const [taskDifficulty, setTaskDifficulty] = useState<"easy" | "medium" | "hard" | "">("");
  const [formType, setFormType] = useState<"task" | "subtask" | "project">("task");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [subtaskName, setSubtaskName] = useState("");
  
  const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false);
  
  const [taskType, setTaskType] = useState<typeof TASK_TYPES[number]>("Task");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    difficulty: "Medium",
    deadline: null as Date | null,
    deadlineTime: "",
    estimatedTime: "",
    userRating: 3,
    mood: "Neutral",
  });
  
  useEffect(() => {
    if (isOpen) {
      setTaskMood(currentMood);
    }
  }, [isOpen, currentMood]);
  
  useEffect(() => {
    if (formType === "task") {
      setTaskName("");
      setDeadlineDate("");
      setDeadlineTime("");
      setEstimatedHours("");
      setEstimatedMinutes("");
      setSelectedProjectId("none");
      setTaskDifficulty("");
    } else if (formType === "subtask") {
      setSubtaskName("");
      setSelectedTaskId("");
    } else if (formType === "project") {
      setProjectName("");
      setProjectDescription("");
      setProjectDeadline("");
    }
  }, [formType]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      createdAt: new Date(),
      completed: false,
    };

    switch (taskType) {
      case "Task":
        await addTask(taskData);
        break;
      case "Subtask":
        await addSubtask(taskData);
        break;
      case "Project":
        await addProject(taskData);
        break;
    }

    setFormData({
      name: "",
      description: "",
      difficulty: "Medium",
      deadline: null,
      deadlineTime: "",
      estimatedTime: "",
      userRating: 3,
      mood: "Neutral",
    });
    setIsOpen(false);
  };
  
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Your browser doesn't support speech recognition.");
      return;
    }
    
    setIsRecording(true);
    setTranscription("");
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscription(speechResult);
      setIsRecording(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      toast.error("Couldn't understand. Please try again.");
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.start();
  };
  
  const stopVoiceRecognition = () => {
    setIsRecording(false);
  };
  
  const processTranscription = async () => {
    if (!transcription) return;
    
    setIsProcessing(true);
    
    try {
      setTimeout(() => {
        const processedInput = processVoiceInput(transcription);
        setIsProcessing(false);
        toast.success("Voice input processed!");
      }, 1000);
    } catch (error) {
      setIsProcessing(false);
      toast.error("Error processing voice input.");
    }
  };
  
  const processVoiceInput = (input: string) => {
    let taskText = input;
    let deadline = "";
    let mood = "";
    let projectName = "";
    
    const datePatterns = [
      { regex: /by\s(tomorrow)/i, handler: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
      }},
      { regex: /by\s(next\s\w+)/i, handler: (match: string) => {
        const days = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };
        const today = new Date();
        const dayOfWeek = today.getDay();
        const targetDay = (match.toLowerCase().includes('monday') ? days.monday :
                          match.toLowerCase().includes('tuesday') ? days.tuesday :
                          match.toLowerCase().includes('wednesday') ? days.wednesday :
                          match.toLowerCase().includes('thursday') ? days.thursday :
                          match.toLowerCase().includes('friday') ? days.friday : 
                          match.toLowerCase().includes('saturday') ? days.saturday : days.sunday);
        
        let daysToAdd = (7 - dayOfWeek + targetDay) % 7;
        if (daysToAdd === 0) daysToAdd = 7;
        
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + daysToAdd);
        return targetDate.toISOString().split('T')[0];
      }},
      { regex: /by\s(today)/i, handler: () => {
        return new Date().toISOString().split('T')[0];
      }},
      { regex: /by\s(this\s\w+)/i, handler: (match: string) => {
        const days = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };
        const today = new Date();
        const dayOfWeek = today.getDay();
        const targetDay = (match.toLowerCase().includes('monday') ? days.monday :
                          match.toLowerCase().includes('tuesday') ? days.tuesday :
                          match.toLowerCase().includes('wednesday') ? days.wednesday :
                          match.toLowerCase().includes('thursday') ? days.thursday :
                          match.toLowerCase().includes('friday') ? days.friday : 
                          match.toLowerCase().includes('saturday') ? days.saturday : days.sunday);
        
        let daysToAdd = (7 + targetDay - dayOfWeek) % 7;
        
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + daysToAdd);
        return targetDate.toISOString().split('T')[0];
      }}
    ];
    
    for (const pattern of datePatterns) {
      const match = input.match(pattern.regex);
      if (match) {
        deadline = pattern.handler(match[1]);
        taskText = taskText.replace(match[0], '');
        break;
      }
    }
    
    const moodPatterns = [
      { regex: /(when|while|if)\s+i('m|'m|\s+am)?\s+(creative)/i, mood: "Creative" },
      { regex: /(when|while|if)\s+i('m|'m|\s+am)?\s+(focused)/i, mood: "Focused" },
      { regex: /(when|while|if)\s+i('m|'m|\s+am)?\s+(relaxed)/i, mood: "Relaxed" },
      { regex: /(when|while|if)\s+i('m|'m|\s+am)?\s+(energetic|energized)/i, mood: "Energetic" },
      { regex: /(when|while|if)\s+i('m|'m|\s+am)?\s+(tired)/i, mood: "Tired" },
    ];
    
    for (const pattern of moodPatterns) {
      if (input.match(pattern.regex)) {
        mood = pattern.mood;
        taskText = taskText.replace(pattern.regex, '');
        break;
      }
    }
    
    const projectPattern = /for\s+project\s+["']?([^"']+)["']?/i;
    const projectMatch = input.match(projectPattern);
    if (projectMatch) {
      projectName = projectMatch[1].trim();
      taskText = taskText.replace(projectPattern, '');
      
      const matchingProject = projects.find(p => 
        p.name.toLowerCase().includes(projectName.toLowerCase())
      );
      
      if (matchingProject) {
        setSelectedProjectId(matchingProject.id);
      }
    }
    
    const difficultyPatterns = [
      { regex: /(this is|it's|its|it is)\s+(easy|simple)/i, difficulty: "easy" },
      { regex: /(this is|it's|its|it is)\s+(medium|moderate)/i, difficulty: "medium" },
      { regex: /(this is|it's|its|it is)\s+(hard|difficult|challenging)/i, difficulty: "hard" },
    ];
    
    for (const pattern of difficultyPatterns) {
      if (input.match(pattern.regex)) {
        setTaskDifficulty(pattern.difficulty as "easy" | "medium" | "hard");
        taskText = taskText.replace(pattern.regex, '');
        break;
      }
    }
    
    taskText = taskText.replace(/^(add|create|make)(\s+a)?(\s+task)?/i, '');
    taskText = taskText.trim().replace(/\.+$/, '');
    taskText = taskText.charAt(0).toUpperCase() + taskText.slice(1);
    
    setTaskName(taskText);
    
    if (deadline) {
      setDeadlineDate(deadline);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDeadlineDate(tomorrow.toISOString().split('T')[0]);
    }
    
    if (mood) {
      setTaskMood(mood);
    }
    
    return {
      taskText,
      deadline,
      mood,
      projectName
    };
  };
  
  const today = new Date().toISOString().split('T')[0];
  
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

  const handleTypeSelection = (type: "task" | "subtask" | "project") => {
    setFormType(type);
    setIsTypeSelectionOpen(false);
    setIsOpen(true);
  };
  
  const renderTaskForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="taskName">Task Name</Label>
        <Input
          id="taskName"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="What do you need to do?"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="project">Project (Optional)</Label>
        <Select
          value={selectedProjectId}
          onValueChange={setSelectedProjectId}
        >
          <SelectTrigger>
            <SelectValue placeholder="No Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none">No Project</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center">
                    <FolderKanban className="h-4 w-4 mr-2 text-blue-500" />
                    {project.name}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mood">Mood</Label>
        <Select
          value={taskMood}
          onValueChange={setTaskMood}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Creative" className="flex items-center">
                <div className="flex items-center">
                  <Sparkles size={16} className="mr-2 text-purple-500" /> 
                  Creative
                </div>
              </SelectItem>
              <SelectItem value="Focused">
                <div className="flex items-center">
                  <Brain size={16} className="mr-2 text-blue-500" /> 
                  Focused
                </div>
              </SelectItem>
              <SelectItem value="Relaxed">
                <div className="flex items-center">
                  <Coffee size={16} className="mr-2 text-green-500" /> 
                  Relaxed
                </div>
              </SelectItem>
              <SelectItem value="Energetic">
                <div className="flex items-center">
                  <Zap size={16} className="mr-2 text-amber-500" /> 
                  Energetic
                </div>
              </SelectItem>
              <SelectItem value="Tired">
                <div className="flex items-center">
                  <Moon size={16} className="mr-2 text-gray-500" /> 
                  Tired
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deadline">Deadline Date</Label>
        <Input
          id="deadline"
          type="date"
          value={deadlineDate}
          min={today}
          onChange={(e) => setDeadlineDate(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deadlineTime">Deadline Time (Optional)</Label>
        <Input
          id="deadlineTime"
          type="time"
          value={deadlineTime}
          onChange={(e) => setDeadlineTime(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Estimated Time</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id="estimatedHours"
              type="number"
              min="0"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="Hours"
            />
          </div>
          <div className="flex-1">
            <Input
              id="estimatedMinutes"
              type="number"
              min="0"
              max="59"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(e.target.value)}
              placeholder="Minutes"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="taskDifficulty">Task Difficulty</Label>
        <RadioGroup 
          value={taskDifficulty} 
          onValueChange={(value) => setTaskDifficulty(value as "easy" | "medium" | "hard")}
          className="flex justify-between pt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="easy" id="easy" />
            <Label htmlFor="easy" className="text-green-500">Easy</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="text-amber-500">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hard" id="hard" />
            <Label htmlFor="hard" className="text-red-500">Hard</Label>
          </div>
        </RadioGroup>
      </div>
      
      <DialogFooter>
        <Button type="submit" className="w-full">Add Task</Button>
      </DialogFooter>
    </form>
  );
  
  const renderSubtaskForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="taskSelect">Parent Task</Label>
        <Select
          value={selectedTaskId}
          onValueChange={setSelectedTaskId}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a task" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {tasks.filter(task => !task.completed).map(task => (
                <SelectItem key={task.id} value={task.id}>
                  {task.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subtaskName">Subtask Name</Label>
        <Input
          id="subtaskName"
          value={subtaskName}
          onChange={(e) => setSubtaskName(e.target.value)}
          placeholder="Enter subtask name"
          required
        />
      </div>
      
      <DialogFooter>
        <Button type="submit" className="w-full">Add Subtask</Button>
      </DialogFooter>
    </form>
  );
  
  const renderProjectForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="projectDescription">Description (Optional)</Label>
        <Input
          id="projectDescription"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="Brief description of the project"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="projectDeadline">Deadline (Optional)</Label>
        <Input
          id="projectDeadline"
          type="date"
          value={projectDeadline}
          min={today}
          onChange={(e) => setProjectDeadline(e.target.value)}
        />
      </div>
      
      <DialogFooter>
        <Button type="submit" className="w-full">Create Project</Button>
      </DialogFooter>
    </form>
  );
  
  return (
    <>
      <Dialog open={isTypeSelectionOpen} onOpenChange={setIsTypeSelectionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>What would you like to create?</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 items-center justify-center"
              onClick={() => handleTypeSelection("task")}
            >
              <CheckCircle size={24} />
              <span>Task</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 items-center justify-center"
              onClick={() => handleTypeSelection("subtask")}
            >
              <CirclePlus size={24} />
              <span>Subtask</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 items-center justify-center"
              onClick={() => handleTypeSelection("project")}
            >
              <FolderKanban size={24} />
              <span>Project</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {formType === "task" ? "Add New Task" : 
                 formType === "subtask" ? "Add New Subtask" : 
                 "Create New Project"}
              </span>
              {formType === "task" && (
                <Button 
                  variant={isRecording ? "destructive" : "secondary"} 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={isRecording ? stopVoiceRecognition : startVoiceRecognition}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                </Button>
              )}
            </DialogTitle>
            {isRecording && (
              <div className="text-sm text-center mt-2 animate-pulse text-red-500">
                Listening... speak your task
              </div>
            )}
          </DialogHeader>
          
          {formType === "task" && transcription && (
            <Card className="mb-4 bg-muted/20 border border-primary/20">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Transcription</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={processTranscription}
                      disabled={isProcessing}
                      className="h-8 px-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Process"
                      )}
                    </Button>
                  </div>
                  <Alert variant="default" className="bg-background">
                    <AlertDescription className="text-sm">{transcription}</AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}
          
          {formType === "task" && renderTaskForm()}
          {formType === "subtask" && renderSubtaskForm()}
          {formType === "project" && renderProjectForm()}
        </DialogContent>
      </Dialog>
      
      <Button 
        variant="secondary"
        className="fixed bottom-20 left-4 rounded-full h-14 w-14 shadow-lg bg-white"
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => {
            startVoiceRecognition();
          }, 500);
        }}
      >
        <Mic size={24} className="text-alderan-blue" />
      </Button>
      
      <Button 
        className="fixed bottom-20 right-4 rounded-full h-14 w-14 shadow-lg" 
        onClick={() => setIsTypeSelectionOpen(true)}
      >
        <Plus size={24} />
      </Button>
    </>
  );
};
