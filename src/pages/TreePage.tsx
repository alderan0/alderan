
import { PixelatedTree } from "@/components/tree/PixelatedTree";
import { ToolsInventory } from "@/components/tree/ToolsInventory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { TreeDeciduous, Award, Star, TrendingUp, Zap } from "lucide-react";
import { useTree } from "@/context/TreeContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";

const TreePage = () => {
  const { tree } = useTree();
  const isMobile = useIsMobile();
  
  // Calculate progress to next level using the exponential curve
  const currentLevelThreshold = Math.floor(100 * Math.pow(1.4, tree.level - 1));
  const nextLevelThreshold = Math.floor(100 * Math.pow(1.4, tree.level));
  const pointsNeeded = nextLevelThreshold - currentLevelThreshold;
  const progressPoints = tree.points - currentLevelThreshold;
  const progressPercent = Math.min(100, Math.max(0, Math.floor((progressPoints / pointsNeeded) * 100)));
  
  // Calculate days until next reset
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysUntilReset = lastDay - today.getDate() + 1;
  
  return (
    <div className="pb-20 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center">
              <TreeDeciduous className="mr-2 h-5 w-5 text-alderan-green-light" />
              Your Virtual Tree
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                Level {tree.level}/20
              </Badge>
              <Badge className="bg-gradient-to-r from-alderan-green-dark to-alderan-green-light">
                {tree.levelStatus.charAt(0).toUpperCase() + tree.levelStatus.slice(1)} Coder
              </Badge>
            </div>
          </div>
          <CardDescription className="flex items-center justify-between">
            <span>A visual representation of your productivity growing over time</span>
            <span className="text-xs text-muted-foreground flex items-center">
              <Zap size={12} className="mr-1 text-amber-500" />
              {daysUntilReset} day{daysUntilReset !== 1 ? 's' : ''} until monthly reset
            </span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Replace VirtualTree with PixelatedTree */}
          <PixelatedTree />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                <span className="text-sm font-medium">Progress to Level {tree.level + 1}</span>
              </div>
              <span className="text-sm text-muted-foreground">{progressPoints} / {pointsNeeded} points</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
          
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
            <StatCard 
              icon={<Award className="h-4 w-4 text-amber-500" />}
              title="Points"
              value={tree.points}
            />
            <StatCard 
              icon={<Star className="h-4 w-4 text-blue-500" />}
              title="Tasks Completed"
              value={tree.tasksCompleted}
            />
            <StatCard 
              icon={<TreeDeciduous className="h-4 w-4 text-green-500" />}
              title="Tree Height"
              value={`${tree.height}%`}
            />
            <StatCard 
              icon={<TreeDeciduous className="h-4 w-4 text-emerald-500" />}
              title="Foliage"
              value={`${tree.leaves}%`}
            />
          </div>
        </CardContent>
      </Card>
      
      <ToolsInventory />
    </div>
  );
};

const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string | number }) => {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-1">{icon}</div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TreePage;
