
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Placeholder data for community trees
const communityTrees = [
  { id: 1, owner: "GreenThumb", level: 8, votes: 142, beauty: 87, height: 92 },
  { id: 2, owner: "TreeLover", level: 7, votes: 98, beauty: 92, height: 78 },
  { id: 3, owner: "EcoWarrior", level: 9, votes: 203, beauty: 76, height: 95 },
  { id: 4, owner: "GardenGuru", level: 6, votes: 65, beauty: 79, height: 82 },
  { id: 5, owner: "PlantParent", level: 10, votes: 288, beauty: 95, height: 89 },
  { id: 6, owner: "TaskMaster", level: 5, votes: 47, beauty: 68, height: 73 },
  { id: 7, owner: "EcoFriend", level: 8, votes: 173, beauty: 85, height: 88 },
  { id: 8, owner: "ProdQueen", level: 7, votes: 112, beauty: 83, height: 77 },
];

export const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("popular");

  // Sort trees based on different criteria
  const sortedByVotes = [...communityTrees].sort((a, b) => b.votes - a.votes);
  const sortedByBeauty = [...communityTrees].sort((a, b) => b.beauty - a.beauty);
  const sortedByHeight = [...communityTrees].sort((a, b) => b.height - a.height);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Community Leaderboard</CardTitle>
        <CardDescription>Vote for other trees and climb the ranks</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="popular" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
            <TabsTrigger value="beautiful">Most Beautiful</TabsTrigger>
            <TabsTrigger value="tallest">Tallest Trees</TabsTrigger>
          </TabsList>
          
          <TabsContent value="popular">
            <div className="space-y-2 mt-4">
              {sortedByVotes.map((tree, index) => (
                <LeaderboardItem 
                  key={tree.id}
                  rank={index + 1}
                  name={tree.owner}
                  level={tree.level}
                  value={tree.votes}
                  label="votes"
                  highlight={index < 3}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="beautiful">
            <div className="space-y-2 mt-4">
              {sortedByBeauty.map((tree, index) => (
                <LeaderboardItem 
                  key={tree.id}
                  rank={index + 1}
                  name={tree.owner}
                  level={tree.level}
                  value={tree.beauty}
                  label="beauty"
                  highlight={index < 3}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tallest">
            <div className="space-y-2 mt-4">
              {sortedByHeight.map((tree, index) => (
                <LeaderboardItem 
                  key={tree.id}
                  rank={index + 1}
                  name={tree.owner}
                  level={tree.level}
                  value={tree.height}
                  label="height"
                  highlight={index < 3}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface LeaderboardItemProps {
  rank: number;
  name: string;
  level: number;
  value: number;
  label: string;
  highlight?: boolean;
}

const LeaderboardItem = ({ 
  rank, 
  name, 
  level,
  value, 
  label, 
  highlight = false 
}: LeaderboardItemProps) => {
  return (
    <div 
      className={`flex items-center p-3 rounded-md ${
        highlight ? 'bg-alderan-sand/20' : 'bg-muted'
      }`}
    >
      <div className={`
        w-8 h-8 flex items-center justify-center rounded-full mr-3
        ${rank === 1 ? 'bg-yellow-500' : 
          rank === 2 ? 'bg-gray-300' :
          rank === 3 ? 'bg-amber-600' : 'bg-muted-foreground/20'
        }
        ${rank <= 3 ? 'text-white' : 'text-muted-foreground'}
        font-bold
      `}>
        {rank}
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <span className="font-medium">{name}</span>
          <Badge variant="outline" className="ml-2">
            Lvl {level}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {value} {label}
        </div>
      </div>
      {rank <= 3 && (
        <div className="text-2xl">
          {rank === 1 ? '🏆' : rank === 2 ? '🥈' : '🥉'}
        </div>
      )}
    </div>
  );
};
