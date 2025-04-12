import { useTasks } from "@/context/TaskContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Coffee, Moon, Sparkles, Zap } from "lucide-react";

export const MoodBasedSuggestions = () => {
  const { getMoodBasedSuggestions, currentMood } = useTasks();
  const suggestions = getMoodBasedSuggestions();

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "Creative":
        return <Sparkles className="h-5 w-5 text-purple-500" />;
      case "Focused":
        return <Brain className="h-5 w-5 text-blue-500" />;
      case "Relaxed":
        return <Coffee className="h-5 w-5 text-green-500" />;
      case "Energetic":
        return <Zap className="h-5 w-5 text-amber-500" />;
      case "Tired":
        return <Moon className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          {getMoodIcon(currentMood)}
          <span className="ml-2">Mood-Based Suggestions</span>
        </CardTitle>
        <CardDescription>
          Tasks recommended based on your current {currentMood.toLowerCase()} mood
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length > 0 ? (
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">{suggestion.name}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No tasks match your current mood. Try adding more tasks or changing your mood.
          </p>
        )}
      </CardContent>
    </Card>
  );
}; 