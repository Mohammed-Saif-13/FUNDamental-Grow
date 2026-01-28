import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { paiseToRupees } from "@/lib/utils/currency";
import EditCampaignForm from "./EditCampaignForm";

export const metadata = {
    title: "Edit Campaign | Admin Dashboard",
    description: "Edit fundraising campaign details",
};

async function getCampaign(id) {
    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { donations: true },
                },
            },
        });

        if (!campaign) return null;

        // Convert paise to rupees for display
        return {
            ...campaign,
            goalAmount: paiseToRupees(campaign.goalAmount),
            raisedAmount: paiseToRupees(campaign.raisedAmount),
        };
    } catch (error) {
        console.error("Error fetching campaign:", error);
        return null;
    }
}

export default async function Page({ params }) {
    const { id } = await params;
    const campaign = await getCampaign(id);

    if (!campaign) {
        notFound();
    }

    return <EditCampaignForm campaign={campaign} />;
}