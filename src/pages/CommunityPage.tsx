
import { Leaderboard } from "@/components/community/Leaderboard";
import { TreeVoting } from "@/components/community/TreeVoting";

const CommunityPage = () => {
  return (
    <div className="pb-20 space-y-8">
      <Leaderboard />
      <TreeVoting />
    </div>
  );
};

export default CommunityPage;
