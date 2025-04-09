
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Placeholder data for community trees to vote on
const treesToVoteOn = [
  { 
    id: 1, 
    owner: "ProductivityGuru", 
    level: 7, 
    description: "Been growing this tree for 2 weeks. Love the colorful decorations!",
    votes: 87,
    alreadyVoted: false
  },
  { 
    id: 2, 
    owner: "TimeManager", 
    level: 5, 
    description: "Just reached level 5! Going to add more decorations soon.",
    votes: 42,
    alreadyVoted: false
  },
  { 
    id: 3, 
    owner: "TaskMaster", 
    level: 9, 
    description: "My pride and joy. Been consistently completing tasks for a month.",
    votes: 156,
    alreadyVoted: true
  }
];

export const TreeVoting = () => {
  const [trees, setTrees] = useState(treesToVoteOn);
  
  const handleVote = (id: number) => {
    setTrees(trees.map(tree => 
      tree.id === id ? { ...tree, votes: tree.votes + 1, alreadyVoted: true } : tree
    ));
    
    toast.success("Vote submitted! You can vote for more trees tomorrow.");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vote for Trees</CardTitle>
        <CardDescription>Support other members by voting for their trees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {trees.map(tree => (
            <div key={tree.id} className="pb-5 border-b last:border-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{tree.owner}'s Tree</h3>
                    <Badge variant="outline" className="ml-2">Level {tree.level}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{tree.description}</p>
                </div>
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1"
                >
                  {tree.votes} votes
                </Badge>
              </div>
              
              {/* Simplified tree representation */}
              <div className="bg-alderan-green-dark/10 h-32 rounded-md flex items-center justify-center mb-3">
                <div className="text-4xl">🌳</div>
              </div>
              
              <Button
                onClick={() => handleVote(tree.id)}
                disabled={tree.alreadyVoted}
                variant={tree.alreadyVoted ? "outline" : "default"}
                className="w-full"
              >
                {tree.alreadyVoted ? "Already voted" : "Vote for this tree"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
