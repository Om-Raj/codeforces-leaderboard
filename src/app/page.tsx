import { LeaderBoard } from "@/components/leaderboard";
import { fetchUsersData } from "@/lib/fetch";

export default async function Home() {
  const users = await fetchUsersData();
  console.log(users);
  return (
    <div>
      <LeaderBoard data={users || []} />
    </div>
  );
}
