"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Target,
    Heart,
    Mail,
    ArrowUpRight,
    Calendar,
    Download,
    RefreshCw,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/components/ui/StatsGrid";
import Button from "@/components/ui/Button";

export default function ReportsPage({ data }) {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        window.location.reload();
    };

    const stats = [
        {
            icon: DollarSign,
            value: formatCurrency(data.overview.totalRaised),
            title: "Total Raised",
            badge: data.trends.growthPercentage >= 0
                ? `+${data.trends.growthPercentage}%`
                : `${data.trends.growthPercentage}%`,
            color: "green",
        },
        {
            icon: Target,
            value: data.overview.totalCampaigns,
            title: "Total Campaigns",
            badge: `${data.overview.activeCampaigns} Active`,
            color: "orange",
        },
        {
            icon: Heart,
            value: data.overview.totalDonations,
            title: "Total Donations",
            badge: `${data.trends.last30Days.donations} this month`,
            color: "blue",
        },
        {
            icon: Users,
            value: data.overview.totalUsers,
            title: "Registered Users",
            color: "purple",
        },
    ];

    const maxMonthlyAmount = Math.max(...data.monthlyData.map((m) => m.total), 1);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <PageHeader
                    title="Reports & Analytics"
                    subtitle="Track performance and insights"
                />
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <StatsGrid stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Donations Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-orange-500" />
                                Monthly Donations
                            </h3>
                            <p className="text-sm text-gray-500">Last 6 months</p>
                        </div>
                        <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            6 Months
                        </span>
                    </div>

                    {data.monthlyData.length > 0 ? (
                        <div className="space-y-4">
                            {data.monthlyData.map((month, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-700">{month.month}</span>
                                        <span className="text-gray-900 font-semibold">
                                            {formatCurrency(month.total)}
                                            <span className="text-gray-400 font-normal ml-2">
                                                ({month.count} donations)
                                            </span>
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${(month.total / maxMonthlyAmount) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-gray-400">
                            No donation data available
                        </div>
                    )}
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Target className="h-5 w-5 text-orange-500" />
                                Category Distribution
                            </h3>
                            <p className="text-sm text-gray-500">Active campaigns by category</p>
                        </div>
                    </div>

                    {data.categoryStats.length > 0 ? (
                        <div className="space-y-4">
                            {data.categoryStats.slice(0, 6).map((cat, index) => {
                                const colors = [
                                    "bg-orange-500",
                                    "bg-blue-500",
                                    "bg-green-500",
                                    "bg-purple-500",
                                    "bg-pink-500",
                                    "bg-yellow-500",
                                ];
                                const totalCampaigns = data.categoryStats.reduce((sum, c) => sum + c.count, 0);
                                const percentage = Math.round((cat.count / totalCampaigns) * 100);

                                return (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                                                <span className="text-sm text-gray-500">
                                                    {cat.count} campaigns ({percentage}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className={`${colors[index % colors.length]} h-2 rounded-full`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Raised: {formatCurrency(cat.raised)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-gray-400">
                            No category data available
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 30-Day Comparison */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                        30-Day Performance
                    </h3>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                            <p className="text-sm text-green-700 mb-1">This Month</p>
                            <p className="text-2xl font-bold text-green-800">
                                {formatCurrency(data.trends.last30Days.amount)}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                {data.trends.last30Days.donations} donations
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">Previous Month</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {formatCurrency(data.trends.previous30Days.amount)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {data.trends.previous30Days.donations} donations
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Growth Rate</span>
                            <div className={`flex items-center gap-1 ${data.trends.growthPercentage >= 0 ? "text-green-600" : "text-red-600"
                                }`}>
                                {data.trends.growthPercentage >= 0 ? (
                                    <TrendingUp className="h-4 w-4" />
                                ) : (
                                    <TrendingDown className="h-4 w-4" />
                                )}
                                <span className="font-bold">
                                    {data.trends.growthPercentage >= 0 ? "+" : ""}
                                    {data.trends.growthPercentage}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Campaigns */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Target className="h-5 w-5 text-orange-500" />
                            Top Performing Campaigns
                        </h3>
                        <Link
                            href="/admin/campaigns"
                            className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
                        >
                            View all <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {data.topCampaigns.length > 0 ? (
                        <div className="space-y-4">
                            {data.topCampaigns.map((campaign, index) => (
                                <div key={campaign.id} className="flex items-center gap-4">
                                    <div className="h-8 w-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/admin/campaigns/${campaign.id}/edit`}
                                            className="text-sm font-medium text-gray-900 hover:text-orange-600 truncate block"
                                        >
                                            {campaign.title}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                                <div
                                                    className="bg-orange-500 h-1.5 rounded-full"
                                                    style={{ width: `${Math.min(campaign.progress, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">{campaign.progress}%</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatCurrency(campaign.raisedAmount)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            of {formatCurrency(campaign.goalAmount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-gray-400">
                            No campaigns yet
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Donations Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-orange-500" />
                        Recent Donations
                    </h3>
                    <Link
                        href="/admin/donations"
                        className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
                    >
                        View all <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>

                {data.recentDonations.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Donor</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Campaign</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentDonations.map((donation) => (
                                    <tr key={donation.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                                    {donation.donorName.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {donation.donorName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-600 truncate max-w-[200px] block">
                                                {donation.campaign}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-semibold text-green-600">
                                                {formatCurrency(donation.amount)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-500">
                                                {formatDateTime(donation.createdAt)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="h-32 flex items-center justify-center text-gray-400">
                        No donations yet
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Active Campaigns</p>
                    <p className="text-2xl font-bold text-gray-900">{data.overview.activeCampaigns}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Approved Volunteers</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {data.overview.approvedVolunteers}/{data.overview.totalVolunteers}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Unread Messages</p>
                    <p className="text-2xl font-bold text-gray-900">{data.overview.unreadContacts}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Total Contacts</p>
                    <p className="text-2xl font-bold text-gray-900">{data.overview.totalContacts}</p>
                </div>
            </div>
        </div>
    );
}
