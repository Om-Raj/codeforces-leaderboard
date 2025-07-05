import { LeaderBoard } from "@/components/leaderboard";
import { fetchUsersData } from "@/lib/fetch";

export default async function Home() {
  const users = await fetchUsersData();
  return (
    <div className="flex flex-col gap-4 pt-24">
      <div className="max-w-6xl mx-auto w-full px-4">
        <LeaderBoard data={users} />
      </div>
    </div>
  );
}
