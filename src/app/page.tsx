import { LeaderBoard } from "@/components/leaderboard";
import { fetchUsersData } from "@/lib/fetch";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { users, error } = await fetchUsersData();
  return (
    <div className="flex flex-col gap-4 pt-24">
      <div className="max-w-6xl mx-auto w-full px-4">
        <h1 className="text-3xl font-bold my-4">Codeforces Leaderboard</h1>
        <LeaderBoard data={users} error={error} />
      </div>
    </div>
  );
}
