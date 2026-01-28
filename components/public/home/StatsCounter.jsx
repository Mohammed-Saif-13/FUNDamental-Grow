import { TrendingUp, Users, Heart, HandHeart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { paiseToRupees } from "@/lib/utils/currency";
import Container from "@/components/public/layout/Container";
import AnimatedCounter from "./AnimatedCounter";

export const revalidate = 3600; // Cache for 1 hour

async function getStats() {
    try {
        const [campaignStats, donorsCount, volunteersCount] = await Promise.all([
            prisma.campaign.aggregate({
                where: { status: "active", isPublic: true },
                _sum: { raisedAmount: true },
                _count: true,
            }),
            prisma.donation.groupBy({
                by: ["donorEmail"],
                where: { paymentStatus: "completed" },
            }),
            prisma.volunteer.count({
                where: { status: "approved" },
            }),
        ]);

        return {
            totalRaised: paiseToRupees(campaignStats._sum.raisedAmount || 0),
            totalCampaigns: campaignStats._count || 0,
            totalDonors: donorsCount.length || 0,
            totalVolunteers: volunteersCount || 0,
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback values
        return {
            totalRaised: 5000000,
            totalCampaigns: 100,
            totalDonors: 5000,
            totalVolunteers: 200,
        };
    }
}

export default async function StatsCounter() {
    const stats = await getStats();

    const STATS = [
        {
            icon: TrendingUp,
            value: stats.totalRaised,
            suffix: "+",
            prefix: "₹",
            label: "Total Raised",
            color: "text-green-500",
            bgColor: "bg-green-100",
        },
        {
            icon: Heart,
            value: stats.totalCampaigns,
            suffix: "+",
            label: "Campaigns Funded",
            color: "text-orange-500",
            bgColor: "bg-orange-100",
        },
        {
            icon: Users,
            value: stats.totalDonors,
            suffix: "+",
            label: "Happy Donors",
            color: "text-blue-500",
            bgColor: "bg-blue-100",
        },
        {
            icon: HandHeart,
            value: stats.totalVolunteers,
            suffix: "+",
            label: "Volunteers",
            color: "text-purple-500",
            bgColor: "bg-purple-100",
        },
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-white to-orange-50 opacity-50" />

            <Container className="relative z-10 px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    {STATS.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-sm transition-shadow duration-300 hover:shadow-lg"
                        >
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                                <stat.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
                            </div>
                            <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${stat.color} mb-1 sm:mb-2`}>
                                <AnimatedCounter
                                    value={stat.value}
                                    prefix={stat.prefix}
                                    suffix={stat.suffix}
                                />
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}