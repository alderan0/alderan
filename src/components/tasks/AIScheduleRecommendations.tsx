
import { useState, useEffect } from "react";
import { useTasks } from "@/context/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brain, Calendar, Clock, PanelTop, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const AIScheduleRecommendations = () => {
  const { tasks, projects, currentMood } = useTasks();
  const [activeTab, setActiveTab] = useState("daily");
  const [recommendations, setRecommendations] = useState<{ 
    daily: string[], 
    weekly: string[], 
    monthly: string[]
  }>({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [loading, setLoading] = useState<{
    daily: boolean,
    weekly: boolean,
    monthly: boolean
  }>({
    daily: false,
    weekly: false,
    monthly: false
  });
  
  // Define time periods and associated icons
  const periods = [
    { value: "daily", label: "Today", icon: <Clock className="h-4 w-4" /> },
    { value: "weekly", label: "This Week", icon: <Calendar className="h-4 w-4" /> },
    { value: "monthly", label: "This Month", icon: <PanelTop className="h-4 w-4" /> },
  ];

  // Generate AI recommendations when tab changes
  useEffect(() => {
    if (!recommendations[activeTab as keyof typeof recommendations].length) {
      generateRecommendations(activeTab);
    }
  }, [activeTab]);
  
  // Function to generate AI recommendations
  const generateRecommendations = async (period: string) => {
    // Skip if we already have recommendations for this period
    if (recommendations[period as keyof typeof recommendations].length > 0) {
      return;
    }
    
    setLoading(prev => ({ ...prev, [period]: true }));
    
    try {
      // Prepare data about the user's tasks and projects
      const activeTasks = tasks.filter(task => !task.completed);
      const activeProjects = projects.filter(project => !project.completed);
      
      // Prepare project data for AI
      const projectData = {
        currentMood,
        tasks: activeTasks.slice(0, 10), // Limit to avoid token limits
        projects: activeProjects.slice(0, 5), // Limit to avoid token limits
        period
      };
      
      // Call the OpenAI edge function
      const { data: result, error } = await supabase.functions.invoke('openai-assistant', {
        body: { 
          prompt: `Generate ${period} schedule recommendations for a user in a "${currentMood}" mood. Consider their active tasks and projects.`,
          type: "recommendations",
          projectData 
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (result && result.result) {
        // Parse the AI response into an array of recommendations
        const aiRecommendations = result.result
          .split(/\d+[\.\)]/)  // Split by numbered items
          .filter((item: string) => item.trim().length > 0)  // Remove empty items
          .map((item: string) => item.trim())  // Clean up whitespace
          .slice(0, 5);  // Limit to 5 recommendations
        
        setRecommendations(prev => ({ 
          ...prev, 
          [period]: aiRecommendations 
        }));
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast.error(`Failed to generate ${period} recommendations`);
      
      // Fallback to default recommendations
      const fallbackRecommendations = getFallbackRecommendations(period);
      setRecommendations(prev => ({ 
        ...prev, 
        [period]: fallbackRecommendations 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [period]: false }));
    }
  };
  
  // Fallback recommendations if API fails
  const getFallbackRecommendations = (period: string): string[] => {
    switch (period) {
      case 'daily':
        return [
          "Complete your highest priority task first thing in the morning",
          "Take short breaks every 90 minutes to maintain focus",
          "Review your progress at the end of the day"
        ];
      case 'weekly':
        return [
          "Schedule a review session to consolidate your learning",
          "Plan time for refactoring code and technical debt",
          "Allocate specific time blocks for deep work"
        ];
      case 'monthly':
        return [
          "Review completed projects to identify patterns and improvements",
          "Set aside time to learn new technologies related to your goals",
          "Plan your key objectives for the next month"
        ];
      default:
        return ["Focus on one task at a time", "Take regular breaks", "Review your progress"];
    }
  };
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-500" />
          <h2 className="text-xl font-semibold">AI Schedule Recommendations</h2>
        </div>
        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
          Based on your {currentMood} mood
        </Badge>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {periods.map((period) => (
            <TabsTrigger key={period.value} value={period.value} className="flex items-center gap-2">
              {period.icon}
              {period.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {periods.map((period) => (
          <TabsContent key={period.value} value={period.value} className="mt-0">
            <Card className={`border-l-4 ${
              period.value === "daily" ? "border-l-blue-500" :
              period.value === "weekly" ? "border-l-green-500" :
              "border-l-amber-500"
            }`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Brain className="mr-2 h-4 w-4 text-purple-500" />
                  {period.label}'s AI Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading[period.value as keyof typeof loading] ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    <p className="text-sm text-muted-foreground">Generating {period.label.toLowerCase()} recommendations...</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {recommendations[period.value as keyof typeof recommendations].length > 0 ? (
                      recommendations[period.value as keyof typeof recommendations].map((suggestion, index) => (
                        <li key={index} className="flex items-start p-3 rounded-md bg-muted/70">
                          <span className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center text-xs mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <div>
                            <p>{suggestion}</p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="p-3 rounded-md bg-muted/70 text-center text-muted-foreground">
                        No recommendations available. Tap to generate.
                      </li>
                    )}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
