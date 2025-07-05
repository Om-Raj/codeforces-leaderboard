"use client";

import { useEffect, useState } from "react";
import { LeaderBoard } from "./leaderboard";
import { UserData } from "@/types/types";
import { useFetchWithToast } from "@/hooks/use-fetch-with-toast";
import { useToast } from "@/hooks/use-toast";

export function ClientLeaderBoard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchWithToast } = useFetchWithToast();
  const { error } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchWithToast<{ users: UserData[] }>("/api/users", {
          showErrorToast: true,
          errorMessage: "Failed to load leaderboard data",
        });
        
        if (data?.users) {
          setUsers(data.users);
        }
      } catch (err) {
        error("An error occurred while fetching leaderboard data");
        console.error("Error fetching leaderboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <LeaderBoard data={users} />;
} 