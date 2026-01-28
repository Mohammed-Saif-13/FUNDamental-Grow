import { prisma } from "@/lib/prisma";
import UsersPage from "./UsersPage";

async function getData() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            emailVerified: true, // ADDED
            createdAt: true,
            _count: {
                select: {
                    campaigns: true,
                    donations: true,
                },
            },
            volunteer: {
                select: {
                    status: true,
                },
            },
        },
    });

    return { users };
}

export const revalidate = 60;

export default async function Page() {
    const data = await getData();
    return <UsersPage users={data.users} />;
}