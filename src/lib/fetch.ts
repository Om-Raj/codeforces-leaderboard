import prisma from "@/lib/prisma";
import { CF_User, UserData } from "@/types/types";
import { User } from "@/generated/prisma";

export const fetchUsersData = async () => {
    try {
        const users: User[] = await prisma.user.findMany();
        const handles = users.map((user: User) => user.handle).join(';');
        if (handles.length === 0) {
            return [];
        }

        const response = await fetch(`https://codeforces.com/api/user.info?handles=${handles}`);
        const data = await response.json();

        if (data.status === 'OK') {
            const mergedData: UserData[] = data.result.map((cf_user: CF_User) => {
                const matchingUser = users.find((user: User) => user.handle === cf_user.handle);
                if (matchingUser) {
                    return { 
                      ...matchingUser,
                      ...cf_user,
                    };
                }
                return {...cf_user, name: "Unknown", regId: "0000DDXX000", year: 0, branch: ""};
            });
            return mergedData;
        } else {
            console.error('Error fetching user data:', data.comment || 'Unknown error');
            return [];
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
    }
};