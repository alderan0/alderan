
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, ThumbsUp, Eye, TreeDeciduous } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

// Placeholder data for vibe creations
const vibeCreations = [
  {
    id: 1,
    owner: "MidnightCoder",
    treeLevel: 8,
    treeTier: "mature",
    votes: 47,
    title: "Lo-Fi Pixel Tree",
    description: "Built during my late night coding sessions while listening to lo-fi beats.",
    codeSnippet: `function growTree() {
  const growth = mood === 'creative' 
    ? Math.random() * 10
    : 5;
  return growth;
}`,
    styles: {
      leafStyle: "pixel",
      lighting: "lofi"
    }
  },
  {
    id: 2,
    owner: "SyntaxJedi",
    treeLevel: 7,
    treeTier: "young",
    votes: 35,
    title: "Syntax Highlighted Beauty",
    description: "My tree reflects my love for well-formatted code. Grew this while refactoring a major project.",
    codeSnippet: `// Tree growing algorithm
const calculateGrowth = (productivity) => {
  return tasks.completed
    .filter(t => t.onTime)
    .reduce((acc, task) => acc + task.value, 0);
};`,
    styles: {
      leafStyle: "syntax",
      lighting: "default"
    }
  },
  {
    id: 3,
    owner: "MoonlightDev",
    treeLevel: 9,
    treeTier: "mature",
    votes: 62,
    title: "Night Mode Binary Tree",
    description: "Created during my most productive hours (11pm-3am). The recursive patterns represent my workflow.",
    codeSnippet: `/**
 * Recursive tree growth pattern
 */
function recursiveGrow(level) {
  if (level === 0) return 1;
  return 1 + recursiveGrow(level - 1);
}`,
    styles: {
      leafStyle: "binary",
      lighting: "nightmode"
    }
  }
];

export const VibeCreations = () => {
  const [activeTab, setActiveTab] = useState("popular");
  
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
  
  const getStyleName = (leafStyle: string, lighting: string) => {
    let name = "";
    
    if (leafStyle === "syntax") name += "Syntax Highlighted ";
    if (leafStyle === "pixel") name += "Pixelated ";
    if (leafStyle === "binary") name += "Binary ";
    
    name += "Tree";
    
    if (lighting === "lofi") name += " with Lo-Fi Lighting";
    if (lighting === "nightmode") name += " in Night Mode";
    if (lighting === "loops") name += " with Loop Animation";
    
    return name;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TreeDeciduous className="mr-2 h-5 w-5 text-alderan-green-light" />
          Vibe Creations
        </CardTitle>
        <CardDescription>Check out trees created by other vibe coders</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="popular" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="popular">
            <motion.div
              className="space-y-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {vibeCreations
                .sort((a, b) => b.votes - a.votes)
                .map(creation => (
                <motion.div key={creation.id} variants={item}>
                  <VibeCreationItem creation={creation} />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="recent">
            <motion.div
              className="space-y-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {vibeCreations
                .sort((a, b) => b.id - a.id)
                .map(creation => (
                <motion.div key={creation.id} variants={item}>
                  <VibeCreationItem creation={creation} />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface VibeCreationItemProps {
  creation: {
    id: number;
    owner: string;
    treeLevel: number;
    treeTier: string;
    votes: number;
    title: string;
    description: string;
    codeSnippet: string;
    styles: {
      leafStyle: string;
      lighting: string;
    };
  };
}

const VibeCreationItem = ({ creation }: VibeCreationItemProps) => {
  const [showCode, setShowCode] = useState(false);
  
  // Calculate background gradient based on tree style
  const getBackgroundStyle = () => {
    if (creation.styles.lighting === "nightmode") {
      return "bg-gradient-to-b from-blue-900/30 to-purple-900/30";
    } else if (creation.styles.lighting === "lofi") {
      return "bg-gradient-to-b from-purple-400/20 to-pink-300/20";
    } else {
      return "bg-gradient-to-b from-alderan-green-light/20 to-alderan-sand/20";
    }
  };
  
  return (
    <div className="pb-6 border-b last:border-0">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center">
            <h3 className="font-medium">{creation.title}</h3>
            <Badge variant="outline" className="ml-2 bg-alderan-green-light/10 text-alderan-green-dark border-alderan-green-dark/20">
              Level {creation.treeLevel}
            </Badge>
            <Badge className="ml-2 bg-amber-500 text-white">
              {creation.treeTier}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">By {creation.owner}</p>
          <p className="text-sm mt-2">{creation.description}</p>
        </div>
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1 bg-alderan-blue/10 text-alderan-blue border-alderan-blue/20"
        >
          <ThumbsUp className="h-3 w-3" />
          {creation.votes} votes
        </Badge>
      </div>
      
      {/* Tree visualization */}
      <div className={`h-40 rounded-md flex items-center justify-center mb-4 overflow-hidden relative ${getBackgroundStyle()}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-amber-800/20 to-transparent" />
          {/* Trunk */}
          <div className="absolute bottom-5 w-16 h-[60%] bg-gradient-to-t from-alderan-green-dark to-amber-800 rounded-md transform translate-x-1" />
          
          {/* Canopy style based on leaf style */}
          {creation.styles.leafStyle === "pixel" ? (
            // Pixel style leaves
            <>
              {Array.from({ length: 20 }).map((_, i) => {
                const row = Math.floor(i / 5);
                const col = i % 5;
                return (
                  <div 
                    key={i}
                    className="absolute bg-green-500 opacity-80"
                    style={{
                      width: '14px',
                      height: '14px',
                      left: `calc(50% + ${(col - 2) * 16}px)`,
                      bottom: `calc(55% + ${(row - 2) * 16}px)`,
                    }}
                  />
                );
              })}
            </>
          ) : creation.styles.leafStyle === "binary" ? (
            // Binary style
            <div className="absolute bottom-[40%] left-1/2 transform -translate-x-1/2 w-32 h-32 bg-green-500 rounded-full opacity-80">
              <div className="absolute inset-0 rounded-full overflow-hidden opacity-40">
                <div className="w-full h-full flex flex-wrap content-start pt-2 justify-center">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="text-[8px] font-mono text-white mx-1">
                      {Math.random() > 0.5 ? '1' : '0'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Syntax highlighting style
            <div className="absolute bottom-[40%] left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-500 rounded-full opacity-80">
              <div className="absolute inset-0 rounded-full overflow-hidden opacity-40">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`absolute h-2 rounded-full ${
                      i % 3 === 0 ? "bg-blue-300" : i % 3 === 1 ? "bg-green-300" : "bg-purple-300"
                    }`}
                    style={{
                      top: `${20 + i * 12}%`,
                      left: '10%',
                      width: `${30 + i * 5}%`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Code snippet toggle */}
      <div className="mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowCode(prev => !prev)}
          className="flex items-center text-xs"
        >
          {showCode ? 'Hide' : 'View'} Code Snippet <Code className="h-3 w-3 ml-1" />
        </Button>
        
        {showCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 rounded bg-gray-100 p-2 overflow-auto font-mono text-xs"
          >
            <pre>{creation.codeSnippet}</pre>
          </motion.div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between">
        <Button variant="ghost" size="sm" className="text-xs flex items-center">
          <Eye className="h-3 w-3 mr-1" />
          View Full Tree
        </Button>
        <Button variant="default" size="sm" className="text-xs bg-alderan-blue hover:bg-alderan-blue/90">
          <ThumbsUp className="h-3 w-3 mr-1" />
          Vote
        </Button>
      </div>
    </div>
  );
};
