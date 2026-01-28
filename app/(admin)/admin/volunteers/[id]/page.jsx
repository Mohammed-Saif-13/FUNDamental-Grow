import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VolunteerDetailPage from "./VolunteerDetailPage";

async function getVolunteerDetails(id) {
    const volunteer = await prisma.volunteer.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            tasks: {
                include: {
                    campaign: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!volunteer) return null;

    const campaigns = await prisma.campaign.findMany({
        where: { status: "active" },
        select: {
            id: true,
            title: true,
            slug: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return { volunteer, campaigns };
}

export default async function VolunteerDetailServerPage({ params }) {
    const { id } = await params;
    const data = await getVolunteerDetails(id);

    if (!data) {
        notFound();
    }

    return <VolunteerDetailPage volunteer={data.volunteer} campaigns={data.campaigns} />;
}