import { prisma } from "@/lib/prisma";
import NewsletterPage from "./NewsletterPage";

export const metadata = {
    title: "Newsletter Subscribers | Admin",
    description: "Manage newsletter subscribers",
};

async function getData() {
    try {
        const [subscribers, stats] = await Promise.all([
            prisma.newsletter.findMany({
                orderBy: { subscribedAt: "desc" },
            }),
            prisma.newsletter.groupBy({
                by: ["status"],
                _count: true,
            }),
        ]);

        const statsMap = {
            total: subscribers.length,
            active: 0,
            unsubscribed: 0,
        };

        stats.forEach((s) => {
            if (s.status === "active") statsMap.active = s._count;
            if (s.status === "unsubscribed") statsMap.unsubscribed = s._count;
        });

        return { subscribers, stats: statsMap };
    } catch (error) {
        console.error("Error fetching newsletter data:", error);
        return { subscribers: [], stats: { total: 0, active: 0, unsubscribed: 0 } };
    }
}

export default async function Page() {
    const data = await getData();
    return <NewsletterPage initialData={data} />;
}