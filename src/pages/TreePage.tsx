
import { VirtualTree } from "@/components/tree/VirtualTree";
import { ToolsInventory } from "@/components/tree/ToolsInventory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TreeDeciduous } from "lucide-react";
import { useState } from "react";
import { useTree } from "@/context/TreeContext";
import { Badge } from "@/components/ui/badge";

const TreePage = () => {
  const { tree } = useTree();
  
  return (
    <div className="pb-20 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <TreeDeciduous className="mr-2 h-5 w-5 text-alderan-green-light" />
              Your Virtual Tree
            </CardTitle>
            <Badge className="bg-gradient-to-r from-alderan-green-dark to-alderan-green-light">
              {tree.tier.charAt(0).toUpperCase() + tree.tier.slice(1)} Tier
            </Badge>
          </div>
          <CardDescription>
            A visual representation of your productivity growing over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VirtualTree />
        </CardContent>
      </Card>
      
      <ToolsInventory />
    </div>
  );
};

export default TreePage;
