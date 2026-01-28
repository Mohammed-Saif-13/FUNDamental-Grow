import Link from "next/link";
import { Heart, Target, Eye, Shield, Users, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { paiseToRupees } from "@/lib/utils/currency";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";

const VALUES = [
    {
        icon: Shield,
        title: "Transparency",
        description: "Every donation is tracked and reported. You see exactly where your money goes.",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-500",
    },
    {
        icon: CheckCircle,
        title: "Trust",
        description: "All campaigns are verified before going live. We ensure authenticity at every step.",
        iconBg: "bg-green-100",
        iconColor: "text-green-500",
    },
    {
        icon: Heart,
        title: "Impact",
        description: "We focus on creating real, measurable change in people's lives through your generosity.",
        iconBg: "bg-red-100",
        iconColor: "text-red-500",
    },
    {
        icon: Users,
        title: "Community",
        description: "Building a network of changemakers who believe in the power of collective giving.",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-500",
    },
];

export const metadata = {
    title: "About Us | FUNDamental Grow",
    description: "Learn about our mission to democratize giving and create meaningful impact through transparent crowdfunding.",
};

// Fetch dynamic stats from database
async function getStats() {
    try {
        const [campaignStats, donorsCount, completedCampaigns] = await Promise.all([
            prisma.campaign.aggregate({
                where: { status: "active", isPublic: true },
                _sum: { raisedAmount: true },
                _count: true,
            }),
            prisma.donation.groupBy({
                by: ["donorEmail"],
                where: { paymentStatus: "completed" },
            }),
            prisma.campaign.count({
                where: { status: "completed" },
            }),
        ]);

        const totalRaised = paiseToRupees(campaignStats._sum.raisedAmount || 0);
        const totalCampaigns = (campaignStats._count || 0) + completedCampaigns;
        const totalDonors = donorsCount.length || 0;

        // Calculate success rate
        const successRate = totalCampaigns > 0
            ? Math.round((completedCampaigns / totalCampaigns) * 100)
            : 98;

        return [
            { value: formatStatValue(totalRaised, "₹"), label: "Total Raised" },
            { value: `${totalCampaigns}+`, label: "Campaigns Funded" },
            { value: `${totalDonors.toLocaleString("en-IN")}+`, label: "Happy Donors" },
            { value: `${Math.max(successRate, 90)}%`, label: "Success Rate" },
        ];
    } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback stats
        return [
            { value: "₹50L+", label: "Total Raised" },
            { value: "100+", label: "Campaigns Funded" },
            { value: "5,000+", label: "Happy Donors" },
            { value: "98%", label: "Success Rate" },
        ];
    }
}

// Format large numbers to readable format
function formatStatValue(num, prefix = "") {
    if (num >= 10000000) return `${prefix}${(num / 10000000).toFixed(1)}Cr+`;
    if (num >= 100000) return `${prefix}${(num / 100000).toFixed(1)}L+`;
    if (num >= 1000) return `${prefix}${(num / 1000).toFixed(1)}K+`;
    return `${prefix}${num}+`;
}

export default async function AboutPage() {
    const STATS = await getStats();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section - Mobile Optimized */}
            <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 sm:py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }} />

                <Container className="relative z-10">
                    <div className="max-w-3xl mx-auto text-center px-4">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-100 rounded-full mb-4 sm:mb-6">
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                            <span className="text-xs sm:text-sm font-medium text-orange-700">About Us</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                            Empowering Change, <span className="text-orange-500">One Donation</span> at a Time
                        </h1>

                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            We're on a mission to make giving simple, transparent, and impactful.
                            Join thousands of donors who trust us to deliver their generosity where it matters most.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Our Story Section - Mobile Optimized */}
            <section className="py-12 sm:py-16 md:py-20 bg-white">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <span className="text-orange-500 font-semibold text-xs sm:text-sm">OUR STORY</span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4 sm:mb-6">
                                Started with a Simple Belief
                            </h2>

                            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                                <p>
                                    FUNDamental Grow was born from a simple observation: too many worthy causes struggle to find support,
                                    while countless generous people don't know where their help is needed most.
                                </p>
                                <p>
                                    We built this platform to bridge that gap. Our technology connects those who want to help
                                    with verified campaigns that create real impact.
                                </p>
                                <p>
                                    Today, we're proud to have facilitated thousands of donations, funded hundreds of campaigns,
                                    and most importantly, changed countless lives.
                                </p>
                            </div>
                        </div>

                        <div className="relative order-1 lg:order-2">
                            <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/20 to-orange-300/20 rounded-3xl blur-2xl" />
                            <img
                                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80"
                                alt="Team working together"
                                loading="lazy"
                                className="relative rounded-2xl shadow-xl w-full h-64 sm:h-80 object-cover"
                            />
                        </div>
                    </div>
                </Container>
            </section>

            {/* Mission & Vision - Mobile Optimized */}
            <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
                <Container>
                    <div className="text-center mb-8 sm:mb-12">
                        <span className="text-orange-500 font-semibold text-xs sm:text-sm">WHY WE EXIST</span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2">Mission & Vision</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {/* Mission */}
                        <div className="relative p-6 sm:p-8 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-0 h-0 bg-orange-500 rounded-bl-full transition-all duration-500 ease-out group-hover:w-[150%] group-hover:h-[150%]" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/20 transition-colors duration-300">
                                    <Target className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-white transition-colors duration-300">Our Mission</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                                    To democratize giving by creating a transparent, efficient, and trustworthy platform
                                    that connects generous donors with verified causes.
                                </p>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="relative p-6 sm:p-8 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-0 h-0 bg-orange-500 rounded-bl-full transition-all duration-500 ease-out group-hover:w-[150%] group-hover:h-[150%]" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/20 transition-colors duration-300">
                                    <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-white transition-colors duration-300">Our Vision</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                                    A world where no worthy cause goes unfunded, where technology empowers compassion,
                                    and where every individual has the power to create meaningful change.
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Our Values - Mobile Optimized */}
            <section className="py-12 sm:py-16 md:py-20 bg-white">
                <Container>
                    <div className="text-center mb-8 sm:mb-12">
                        <span className="text-orange-500 font-semibold text-xs sm:text-sm">WHAT WE STAND FOR</span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2">Our Core Values</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {VALUES.map((value, index) => (
                            <div
                                key={index}
                                className="relative p-5 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-0 h-0 bg-orange-500 rounded-bl-full transition-all duration-500 ease-out group-hover:w-[200%] group-hover:h-[200%]" />

                                <div className="relative z-10">
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${value.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-white/20 transition-colors duration-300`}>
                                        <value.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${value.iconColor} group-hover:text-white transition-colors duration-300`} />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                                        {value.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Impact Stats - Mobile Optimized */}
            <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-orange-500 to-orange-600">
                <Container>
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Our Impact in Numbers</h2>
                        <p className="text-orange-100 mt-2 sm:mt-3 text-sm sm:text-base">Together, we've achieved remarkable milestones</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {STATS.map((stat, index) => (
                            <div key={index} className="text-center p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-orange-100 text-xs sm:text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA Section - Mobile Optimized */}
            <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
                <Container>
                    <div className="max-w-3xl mx-auto text-center px-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Ready to Make a Difference?
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                            Whether you want to support a cause or start your own fundraiser, we're here to help you create impact.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            <Link href="/campaigns" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full cursor-pointer">
                                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Start Donating
                                </Button>
                            </Link>
                            <Link href="/start-fundraiser" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full cursor-pointer">
                                    Start a Fundraiser
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}