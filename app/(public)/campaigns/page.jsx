import { prisma } from "@/lib/prisma";
import { paiseToRupees } from "@/lib/utils/currency";
import CampaignsPage from "./CampaignsPage";

export const metadata = {
    title: "Browse Campaigns | FUNDamental Grow",
    description: "Explore verified fundraising campaigns for medical emergencies, education, NGOs, and community causes. Find a cause you care about and make a difference.",
    keywords: ["fundraising campaigns", "donate online", "charity", "medical help", "education fund"],
};

async function getData() {
    try {
        const [campaigns, stats] = await Promise.all([
            prisma.campaign.findMany({
                where: {
                    status: { in: ["active", "pending"] },
                    isPublic: true,
                },
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true, image: true } },
                    _count: { select: { donations: true } },
                },
            }),
            prisma.campaign.aggregate({
                where: {
                    status: { in: ["active", "pending"] },
                    isPublic: true,
                },
                _sum: { raisedAmount: true },
                _count: true,
            }),
        ]);

        const categories = [...new Set(campaigns.map((c) => c.category))].sort();

        const donorsCount = await prisma.donation.count({
            where: { paymentStatus: "completed" },
        });

        // Convert paise to rupees
        const formattedCampaigns = campaigns.map((c) => ({
            ...c,
            goalAmount: paiseToRupees(c.goalAmount),
            raisedAmount: paiseToRupees(c.raisedAmount),
        }));

        return {
            campaigns: formattedCampaigns,
            categories,
            stats: {
                totalCampaigns: stats._count,
                totalRaised: paiseToRupees(stats._sum.raisedAmount || 0),
                totalDonors: donorsCount,
            },
        };
    } catch (error) {
        console.error("Error fetching campaigns data:", error);
        return {
            campaigns: [],
            categories: [],
            stats: { totalCampaigns: 0, totalRaised: 0, totalDonors: 0 },
        };
    }
}

export default async function Page({ searchParams }) {
    const data = await getData();
    const params = await searchParams;

    return (
        <CampaignsPage
            campaigns={data.campaigns}
            categories={data.categories}
            stats={data.stats}
            initialCategory={params?.category || ""}
            initialSort={params?.sort || "newest"}
            initialPage={parseInt(params?.page) || 1}
        />
    );
}