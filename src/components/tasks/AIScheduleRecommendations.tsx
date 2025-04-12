import { useTasks } from "@/context/TaskContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Sparkles } from "lucide-react";

export const AIScheduleRecommendations = () => {
  const { getAIScheduleSuggestions } = useTasks();
  const suggestions = getAIScheduleSuggestions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
          AI Schedule Recommendations
        </CardTitle>
        <CardDescription>
          Personalized scheduling suggestions based on your mood and tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Monthly
            </TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="space-y-2">
            {suggestions.daily.length > 0 ? (
              <ul className="space-y-2">
                {suggestions.daily.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    </div>
                    <p className="ml-2 text-sm">{suggestion}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No daily suggestions available</p>
            )}
          </TabsContent>
          <TabsContent value="weekly" className="space-y-2">
            {suggestions.weekly.length > 0 ? (
              <ul className="space-y-2">
                {suggestions.weekly.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <p className="ml-2 text-sm">{suggestion}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No weekly suggestions available</p>
            )}
          </TabsContent>
          <TabsContent value="monthly" className="space-y-2">
            {suggestions.monthly.length > 0 ? (
              <ul className="space-y-2">
                {suggestions.monthly.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <p className="ml-2 text-sm">{suggestion}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No monthly suggestions available</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
