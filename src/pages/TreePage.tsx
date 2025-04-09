
import { VirtualTree } from "@/components/tree/VirtualTree";
import { ToolsInventory } from "@/components/tree/ToolsInventory";

const TreePage = () => {
  return (
    <div className="pb-20 space-y-8">
      <VirtualTree />
      <ToolsInventory />
    </div>
  );
};

export default TreePage;
