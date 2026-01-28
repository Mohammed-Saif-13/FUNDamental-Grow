import { prisma } from "@/lib/prisma";
import VolunteersPage from "./VolunteersPage";

async function getData() {
    const volunteers = await prisma.volunteer.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                }
            },
            _count: { select: { tasks: true } },
        },
    });

    return { volunteers };
}

export const revalidate = 60;

export default async function Page() {
    const data = await getData();
    return <VolunteersPage volunteers={data.volunteers} />;
}