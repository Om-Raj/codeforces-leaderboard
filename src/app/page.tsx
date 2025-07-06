import { LeaderBoard } from "@/components/leaderboard";
import { fetchUsersData } from "@/lib/fetch";
import { useToast } from "@/hooks/use-toast";

export default async function Home() {
  const { error: showError } = useToast();
  const { users, error } = await fetchUsersData();
  if (!!error && showError) {
    showError(error);
  }
  return (
    <div className="flex flex-col gap-4 pt-24">
      <div className="max-w-6xl mx-auto w-full px-4">
        <h1 className="text-3xl font-bold my-4">Codeforces Leaderboard</h1>
        <LeaderBoard data={users} />
      </div>
    </div>
  );
}
