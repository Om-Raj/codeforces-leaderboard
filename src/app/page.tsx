import { LeaderBoard } from "@/components/leaderboard";
import prisma from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();
  return (
    <div>
      <LeaderBoard />
    </div>
  );
}
