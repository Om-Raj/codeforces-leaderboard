import prisma from "@/lib/prisma";
import { CF_User, UserData } from "@/types/types";
import { User } from "@/generated/prisma";

export const fetchUsersData = async () => {
  try {
    const users: User[] = await prisma.user.findMany();
    const handles = users.map((user: User) => user.handle).join(";");
    if (handles.length === 0) {
      return { users: [], error: "No users found" };
    }

    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${handles}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
    );

    if (!response.ok) {
      console.error("HTTP error:", response.status);
      return { users: [], error: `HTTP ${response.status}` };
    }

    const data = await response.json();

    if (data.status === "OK") {
      const userMap = new Map(users.map((user) => [user.handle, user]));
      const mergedData: UserData[] = data.result.map((cf_user: CF_User) => ({
          ...cf_user,
          ...(userMap.get(cf_user.handle) ?? {
            name: "Unknown",
            regId: "0000DDXX000",
            year: 0,
            branch: "",
          }),
      }));
      return { users: mergedData };
    } else {
      console.error(
        "Error fetching Codeforces user data:",
        data.comment || "Unknown error",
      );
      return { users: [], error: "Error fetching Codeforces user data." };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { users: [], error: "Error fetching user data" };
  }
};
