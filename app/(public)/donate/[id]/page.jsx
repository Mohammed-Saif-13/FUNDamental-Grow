import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { paiseToRupees } from "@/lib/utils/currency";
import DonationForm from "./DonationForm";

async function getCampaign(slug) {
    const campaign = await prisma.campaign.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            slug: true,
            image: true,
            goalAmount: true,
            raisedAmount: true,
            endDate: true,
            status: true,
            organizerName: true,
            _count: { select: { donations: true } },
        },
    });

    if (!campaign) return null;

    // Convert paise to rupees
    return {
        ...campaign,
        goalAmount: paiseToRupees(campaign.goalAmount),
        raisedAmount: paiseToRupees(campaign.raisedAmount),
    };
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const campaign = await getCampaign(id);

    if (!campaign) {
        return { title: "Campaign Not Found" };
    }

    return {
        title: `Donate to ${campaign.title} | FUNDamental Grow`,
        description: `Support ${campaign.title} by making a secure donation. Every contribution makes a difference.`,
        openGraph: {
            title: `Donate to ${campaign.title}`,
            description: `Support ${campaign.title} by making a secure donation.`,
            images: campaign.image ? [campaign.image] : [],
        },
    };
}

export default async function DonatePage({ params }) {
    const { id: slug } = await params;
    const campaign = await getCampaign(slug);

    if (!campaign) {
        notFound();
    }

    const isExpired = campaign.endDate && new Date(campaign.endDate) < new Date();
    const isInactive = campaign.status !== "active";

    if (isExpired || isInactive) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center p-6 sm:p-8 bg-white rounded-2xl border border-gray-100 max-w-md">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">😔</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Campaign Not Accepting Donations
                    </h1>
                    <p className="text-gray-500 mb-6 text-sm sm:text-base">
                        This campaign has ended or is no longer active.
                    </p>
                    <a
                        href="/campaigns"
                        className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                    >
                        Browse Active Campaigns
                    </a>
                </div>
            </div >
        );
    }

    return <DonationForm campaign={campaign} />;
}