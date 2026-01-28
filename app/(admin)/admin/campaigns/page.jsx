import { prisma } from "@/lib/prisma";
import { paiseToRupees } from "@/lib/utils/currency";
import CampaignsPage from "./CampaignsPage";

export const metadata = {
    title: "Campaigns | Admin Dashboard",
    description: "Manage all fundraising campaigns",
};

export const revalidate = 0; // Always fresh data

async function getData() {
    try {
        const campaigns = await prisma.campaign.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { donations: true },
                },
            },
        });

        // Convert paise to rupees
        const formattedCampaigns = campaigns.map((c) => ({
            ...c,
            goalAmount: paiseToRupees(c.goalAmount),
            raisedAmount: paiseToRupees(c.raisedAmount),
        }));

        return { campaigns: formattedCampaigns };
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        return { campaigns: [] };
    }
}

export default async function Page() {
    const { campaigns } = await getData();
    return <CampaignsPage initialCampaigns={campaigns} />;
}