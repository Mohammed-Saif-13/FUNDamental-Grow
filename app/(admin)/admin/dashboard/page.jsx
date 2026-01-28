import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
    DollarSign,
    Target,
    TrendingUp,
    Users,
    Plus,
    UserCheck,
    Mail,
    Eye,
    ArrowUpRight,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";

async function getStats() {
    const [
        totalCampaigns,
        activeCampaigns,
        totalDonations,
        totalRaised,
        totalVolunteers,
        pendingVolunteers,
        unreadContacts,
        recentDonations,
    ] = await Promise.all([
        prisma.campaign.count(),
        prisma.campaign.count({ where: { status: "active" } }),
        prisma.donation.count({ where: { paymentStatus: "completed" } }),
        prisma.donation.aggregate({
            where: { paymentStatus: "completed" },
            _sum: { amount: true },
        }),
        prisma.volunteer.count(),
        prisma.volunteer.count({ where: { status: "pending" } }),
        prisma.contact.count({ where: { status: "unread" } }),
        prisma.donation.findMany({
            where: { paymentStatus: "completed" },
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                campaign: { select: { title: true } },
                user: { select: { name: true } }
            },
        }),
    ]);

    return {
        totalCampaigns,
        activeCampaigns,
        totalDonations,
        totalRaised: Math.floor((totalRaised._sum.amount || 0) / 100), // FIXED: Paise to Rupees
        totalVolunteers,
        pendingVolunteers,
        unreadContacts,
        recentDonations: recentDonations.map(d => ({
            ...d,
            amount: Math.floor(d.amount / 100), // FIXED: Paise to Rupees
        })),
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">
                        Welcome back! Here's what's happening today.
                        <span className="text-gray-400 ml-2">• Updated just now</span>
                    </p>
                </div>
                <Button>
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={DollarSign}
                    value={formatCurrency(stats.totalRaised)}
                    title="Total Raised"
                    badge="↑ 100%"
                    color="green"
                />
                <StatCard
                    icon={Target}
                    value={stats.totalCampaigns}
                    title="Total Campaigns"
                    badge={`${stats.activeCampaigns} Active`}
                    color="orange"
                />
                <StatCard
                    icon={TrendingUp}
                    value={stats.totalDonations}
                    title="Total Donations"
                    color="blue"
                />
                <StatCard
                    icon={Users}
                    value={stats.totalVolunteers}
                    title="Volunteers"
                    badge={stats.pendingVolunteers > 0 ? `${stats.pendingVolunteers} Pending` : null}
                    color="purple"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/campaigns/create"
                        className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group"
                    >
                        <div className="p-3 bg-orange-100 rounded-xl text-orange-600 group-hover:bg-orange-200">
                            <Plus className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">New Campaign</p>
                            <p className="text-sm text-gray-500">Create fundraiser</p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/volunteers?status=pending"
                        className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group relative"
                    >
                        <div className="p-3 bg-purple-100 rounded-xl text-purple-600 group-hover:bg-purple-200">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Review Volunteers</p>
                            <p className="text-sm text-gray-500">Pending approvals</p>
                        </div>
                        {stats.pendingVolunteers > 0 && (
                            <span className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {stats.pendingVolunteers}
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/admin/contacts"
                        className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group relative"
                    >
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600 group-hover:bg-blue-200">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Messages</p>
                            <p className="text-sm text-gray-500">Unread contacts</p>
                        </div>
                        {stats.unreadContacts > 0 && (
                            <span className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {stats.unreadContacts}
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/admin/reports"
                        className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                    >
                        <div className="p-3 bg-green-100 rounded-xl text-green-600 group-hover:bg-green-200">
                            <Eye className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">View Reports</p>
                            <p className="text-sm text-gray-500">Analytics & stats</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donation Trend - Placeholder */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-orange-500" />
                            Donation Trend
                        </h2>
                        <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Last 6 Months</span>
                    </div>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        Chart coming soon...
                    </div>
                </div>

                {/* Recent Donations */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-orange-500" />
                            Recent Donations
                        </h2>
                        <Link
                            href="/admin/donations"
                            className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
                        >
                            View all <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {stats.recentDonations.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentDonations.map((donation) => (
                                <div
                                    key={donation.id}
                                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">
                                            {donation.anonymous ? "A" : donation.donorName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {donation.anonymous ? "Anonymous" : donation.donorName}
                                            </p>
                                            <p className="text-sm text-gray-500">yesterday</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-green-600">
                                        {formatCurrency(donation.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            No donations yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}