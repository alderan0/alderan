
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
import { Mic, MicOff, Plus, Sparkles, Brain, Coffee, Zap, Moon, FolderKanban, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

export const AddTaskForm = () => {
  const { addTask, currentMood, projects } = useTasks();
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
  const [selectedProjectId, setSelectedProjectId] = useState("");
  
  useEffect(() => {
    if (isOpen) {
      setTaskMood(currentMood);
    }
  }, [isOpen, currentMood]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName || !deadlineDate) {
      return;
    }
    
    const dateString = `${deadlineDate}${deadlineTime ? 'T' + deadlineTime : 'T23:59'}`;
    const deadline = new Date(dateString);
    
    const hours = parseInt(estimatedHours) || 0;
    const minutes = parseInt(estimatedMinutes) || 0;
    const totalMinutes = (hours * 60) + minutes;
    
    addTask({
      name: taskName,
      deadline,
      estimatedTime: totalMinutes || 30,
      mood: taskMood as any,
      projectId: selectedProjectId || undefined
    });
    
    setTaskName("");
    setDeadlineDate("");
    setDeadlineTime("");
    setEstimatedHours("");
    setEstimatedMinutes("");
    setSelectedProjectId("");
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
      // Simulate AI processing with a timeout
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
    
    // Check for project reference
    const projectPattern = /for\s+project\s+["']?([^"']+)["']?/i;
    const projectMatch = input.match(projectPattern);
    if (projectMatch) {
      projectName = projectMatch[1].trim();
      taskText = taskText.replace(projectPattern, '');
      
      // Find matching project
      const matchingProject = projects.find(p => 
        p.name.toLowerCase().includes(projectName.toLowerCase())
      );
      
      if (matchingProject) {
        setSelectedProjectId(matchingProject.id);
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
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-20 right-4 rounded-full h-14 w-14 shadow-lg">
            <Plus size={24} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Add New Task</span>
              <Button 
                variant={isRecording ? "destructive" : "outline"} 
                size="sm"
                className="h-8 w-8 p-0"
                onClick={isRecording ? stopVoiceRecognition : startVoiceRecognition}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </Button>
            </DialogTitle>
            {isRecording && (
              <div className="text-sm text-center mt-2 animate-pulse text-red-500">
                Listening... speak your task
              </div>
            )}
          </DialogHeader>
          
          {/* Transcription Box */}
          {transcription && (
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
                  <Alert variant="outline" className="bg-background">
                    <AlertDescription className="text-sm">{transcription}</AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}
          
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
            
            {/* Project Selector */}
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
                    <SelectItem value="">No Project</SelectItem>
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
            
            <DialogFooter>
              <Button type="submit" className="w-full">Add Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Button 
        variant="outline"
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
    </>
  );
};
