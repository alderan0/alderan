import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trophy, ThumbsUp, Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import { VirtualTree } from "@/components/tree/VirtualTree";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const MOCK_LEADERBOARD = [
  { id: 1, username: "TreeMaster", points: 1200, treeLevel: 15, achievements: 25 },
  { id: 2, username: "EcoWarrior", points: 980, treeLevel: 12, achievements: 20 },
  { id: 3, username: "GreenThumb", points: 850, treeLevel: 10, achievements: 18 },
  // Add more mock data...
];

const MOCK_TREES = [
  { id: 1, username: "TreeMaster", votes: 156, level: 15 },
  { id: 2, username: "EcoWarrior", votes: 142, level: 12 },
  { id: 3, username: "GreenThumb", votes: 98, level: 10 },
  // Add more mock data...
];

export const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-muted-foreground">
          Connect with other tree growers and share your progress
        </p>
      </div>

      {/* Leaderboard Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Global Leaderboard
          </CardTitle>
          <CardDescription>
            Top performers in the Alderan community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_LEADERBOARD.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg",
                  index === 0 ? "bg-yellow-500/10" :
                  index === 1 ? "bg-gray-300/10" :
                  index === 2 ? "bg-amber-600/10" : "bg-muted"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold">#{index + 1}</span>
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-muted-foreground">
                      Level {user.treeLevel} • {user.achievements} Achievements
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{user.points}</p>
                  <p className="text-sm text-muted-foreground">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tree Showcase & Voting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-500" />
            Featured Trees
          </CardTitle>
          <CardDescription>
            Vote for your favorite trees in the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "grid gap-6",
            isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {MOCK_TREES.map((tree, index) => (
              <motion.div
                key={tree.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="aspect-square relative mb-4">
                      <VirtualTree />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{tree.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Level {tree.level}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {tree.votes}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityPage;
