
import { Leaderboard } from "@/components/community/Leaderboard";
import { TreeVoting } from "@/components/community/TreeVoting";
import { VibeCreations } from "@/components/community/VibeCreations";

const CommunityPage = () => {
  return (
    <div className="pb-20 space-y-8">
      <Leaderboard />
      <TreeVoting />
      <VibeCreations />
    </div>
  );
};

export default CommunityPage;
