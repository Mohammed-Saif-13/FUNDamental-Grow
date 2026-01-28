import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { paiseToRupees } from "@/lib/utils/currency";
import CampaignDetails from "./CampaignDetails";

const decodeSlug = (slug) => decodeURIComponent(slug);

async function getCampaign(slug) {
    try {
        const decodedSlug = decodeSlug(slug);

        const campaign = await prisma.campaign.findUnique({
            where: { slug: decodedSlug },
            include: {
                donations: {
                    where: { paymentStatus: "completed" },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
                updates: {
                    orderBy: { createdAt: "desc" },
                },
                _count: {
                    select: { donations: true },
                },
            },
        });

        if (!campaign) return null;

        // Convert paise to rupees
        return {
            ...campaign,
            goalAmount: paiseToRupees(campaign.goalAmount),
            raisedAmount: paiseToRupees(campaign.raisedAmount),
            donations: campaign.donations.map((d) => ({
                ...d,
                amount: paiseToRupees(d.amount),
            })),
        };
    } catch (error) {
        console.error("Database Error in getCampaign:", error);
        return null;
    }
}

async function getSimilarCampaigns(category, excludeId) {
    try {
        const campaigns = await prisma.campaign.findMany({
            where: {
                category,
                status: "active",
                isPublic: true,
                id: { not: excludeId },
            },
            take: 4,
            orderBy: { createdAt: "desc" },
        });

        // Convert paise to rupees
        return campaigns.map((c) => ({
            ...c,
            goalAmount: paiseToRupees(c.goalAmount),
            raisedAmount: paiseToRupees(c.raisedAmount),
        }));
    } catch (error) {
        console.error("Database Error in getSimilarCampaigns:", error);
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const campaign = await getCampaign(slug);

    if (!campaign) {
        return { title: "Campaign Not Found" };
    }

    return {
        title: `${campaign.title} | FUNDamental Grow`,
        description: campaign.description.slice(0, 160),
        openGraph: {
            title: campaign.title,
            description: campaign.description.slice(0, 160),
            images: campaign.image ? [campaign.image] : [],
        },
    };
}

export default async function Page({ params }) {
    const { slug } = await params;
    const session = await auth();

    if (!slug) return notFound();

    const campaign = await getCampaign(slug);

    if (!campaign || !campaign.isPublic) {
        notFound();
    }

    const isOwner = session?.user?.id === campaign.userId;
    const similarCampaigns = await getSimilarCampaigns(campaign.category, campaign.id);

    return (
        <CampaignDetails
            campaign={campaign}
            similarCampaigns={similarCampaigns}
            isOwner={isOwner}
        />
    );
}