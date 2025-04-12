
import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brain, Calendar, Clock, PanelTop } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const AIScheduleRecommendations = () => {
  const { getAIScheduleSuggestions, currentMood } = useTasks();
  const [activeTab, setActiveTab] = useState("daily");
  
  // Get AI recommendations 
  const suggestions = getAIScheduleSuggestions();
  
  // Define time periods and associated icons
  const periods = [
    { value: "daily", label: "Today", icon: <Clock className="h-4 w-4" /> },
    { value: "weekly", label: "This Week", icon: <Calendar className="h-4 w-4" /> },
    { value: "monthly", label: "This Month", icon: <PanelTop className="h-4 w-4" /> },
  ];
  
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
                <ul className="space-y-2">
                  {suggestions[period.value as keyof typeof suggestions].map((suggestion, index) => (
                    <li key={index} className="flex items-start p-3 rounded-md bg-muted/70">
                      <span className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center text-xs mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <div>
                        <p>{suggestion}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
