import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { paiseToRupees } from "@/lib/utils/currency";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";
import CampaignCard from "@/components/public/campaigns/CampaignCard";

export const revalidate = 3600;

async function getFeaturedCampaigns() {
    try {
        const campaigns = await prisma.campaign.findMany({
            where: {
                status: "active",
                featured: true,
                isPublic: true,
            },
            orderBy: { createdAt: "desc" },
            take: 4,
            select: {
                id: true,
                title: true,
                slug: true,
                image: true,
                category: true,
                description: true,
                raisedAmount: true,
                goalAmount: true,
                endDate: true,
                location: true,
                _count: { select: { donations: true } },
            },
        });

        // Convert paise to rupees
        return campaigns.map((c) => ({
            ...c,
            goalAmount: paiseToRupees(c.goalAmount),
            raisedAmount: paiseToRupees(c.raisedAmount),
        }));
    } catch (error) {
        console.error("Error fetching featured campaigns:", error);
        return [];
    }
}

export default async function FeaturedCampaigns() {
    const campaigns = await getFeaturedCampaigns();

    if (campaigns.length === 0) return null;

    return (
        <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
            <Container className="px-4">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                        Make a Difference
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Campaigns That Need Your Support
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                        These verified campaigns are making real impact. Your donation, no matter the size, can change lives.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {campaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </div>

                <div className="text-center mt-8 sm:mt-10">
                    <Link href="/campaigns">
                        <Button variant="outline" size="lg" className="cursor-pointer w-full sm:w-auto">
                            View All Campaigns
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                    </Link>
                </div>
            </Container>
        </section>
    );
}