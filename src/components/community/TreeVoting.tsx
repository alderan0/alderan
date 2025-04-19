
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ThumbsUp, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

// Placeholder data for community trees to vote on
const treesToVoteOn = [
  { 
    id: 1, 
    owner: "ProductivityGuru", 
    level: 7, 
    description: "Been growing this tree for 2 weeks. Love the colorful decorations!",
    votes: 87,
    alreadyVoted: false,
    image: "🌳"
  },
  { 
    id: 2, 
    owner: "TimeManager", 
    level: 5, 
    description: "Just reached level 5! Going to add more decorations soon.",
    votes: 42,
    alreadyVoted: false,
    image: "🌲"
  },
  { 
    id: 3, 
    owner: "TaskMaster", 
    level: 9, 
    description: "My pride and joy. Been consistently completing tasks for a month.",
    votes: 156,
    alreadyVoted: true,
    image: "🌴"
  }
];

export const TreeVoting = () => {
  const [trees, setTrees] = useState(treesToVoteOn);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const handleVote = (id: number) => {
    setTrees(trees.map(tree => 
      tree.id === id ? { ...tree, votes: tree.votes + 1, alreadyVoted: true } : tree
    ));
    
    toast.success("Vote submitted! You can vote for more trees tomorrow.", {
      icon: "👍",
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-alderan-blue" />
          Vote for Trees
        </CardTitle>
        <CardDescription>Support other members by voting for their trees</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {trees.map(tree => (
            <motion.div 
              key={tree.id} 
              className="pb-5 border-b last:border-0"
              variants={item}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{tree.owner}'s Tree</h3>
                    <Badge variant="outline" className="ml-2 bg-alderan-green-light/10 text-alderan-green-dark border-alderan-green-dark/20">
                      Level {tree.level}
                    </Badge>
                    {tree.level >= 8 && (
                      <Badge className="ml-2 bg-amber-500">
                        <Award className="mr-1 h-3 w-3" /> Top Grower
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{tree.description}</p>
                </div>
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1 bg-alderan-blue/10 text-alderan-blue border-alderan-blue/20"
                >
                  <ThumbsUp className="h-3 w-3" />
                  {tree.votes} votes
                </Badge>
              </div>
              
              {/* Stylized tree representation */}
              <div className="bg-gradient-to-b from-alderan-sand/30 to-alderan-green-light/20 h-40 rounded-md flex items-center justify-center mb-4 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-amber-800/20 to-transparent" />
                  <div className="absolute bottom-5 w-20 h-[60%] bg-gradient-to-t from-alderan-green-dark to-amber-800 rounded-md transform translate-x-1" />
                  <div className="absolute bottom-[40%] left-1/2 transform -translate-x-1/2 w-32 h-32 bg-green-500 rounded-full opacity-80" />
                  <div className="absolute bottom-[45%] left-[40%] transform -translate-x-1/2 w-24 h-24 bg-green-600 rounded-full opacity-80" />
                  <div className="absolute bottom-[50%] left-[60%] transform -translate-x-1/2 w-28 h-28 bg-green-400 rounded-full opacity-80" />
                </div>
                <div className="text-6xl z-10 animate-bounce-slow">{tree.image}</div>
              </div>
              
              <Button
                onClick={() => handleVote(tree.id)}
                disabled={tree.alreadyVoted}
                variant={tree.alreadyVoted ? "outline" : "default"}
                className={tree.alreadyVoted ? "" : "bg-gradient-to-r from-alderan-blue to-blue-400 hover:opacity-90 transition-opacity"}
                size="lg"
                style={{ width: "100%" }}
              >
                {tree.alreadyVoted ? (
                  <span className="flex items-center">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Already voted
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Vote for this tree
                  </span>
                )}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};
