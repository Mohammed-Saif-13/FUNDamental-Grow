"use client";

import React, { useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import {
    Gift,
    DollarSign,
    TrendingUp,
    Repeat,
    Calendar,
    ChevronDown,
    ChevronUp,
    Eye,
    FileText,
    Trash2,
    Loader2,
    Phone,
    Mail,
    CreditCard,
    User,
    Building,
    Download,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { DONATION_STATUS } from "@/lib/constants/ui";
import usePagination from "@/hooks/usePagination";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/components/ui/StatsGrid";
import DataTable from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import ActionButton from "@/components/ui/ActionButton";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

// Status badge variant helper
const getStatusVariant = (status) => {
    switch (status) {
        case "completed": return "success";
        case "pending": return "warning";
        case "failed": return "danger";
        default: return "default";
    }
};

// Get ordinal suffix (1st, 2nd, 3rd, etc.)
const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export default function DonationsPage({ initialDonations, campaigns }) {
    const [donations, setDonations] = useState(initialDonations);
    const [viewMode, setViewMode] = useState("all");
    const [expandedDonors, setExpandedDonors] = useState(new Set());
    const [detailsModal, setDetailsModal] = useState({ open: false, donation: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, donation: null });
    const [campaignFilter, setCampaignFilter] = useState("all");
    const [amountFilter, setAmountFilter] = useState("all");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCleaningUp, setIsCleaningUp] = useState(false);

    // Count donations per donor email (for repeat donor indicator)
    const donorDonationCounts = useMemo(() => {
        const counts = {};
        const sorted = [...donations].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        sorted.forEach((d) => {
            const email = d.donorEmail;
            if (!counts[email]) counts[email] = { total: 0, ordinals: {} };
            counts[email].total += 1;
            counts[email].ordinals[d.id] = counts[email].total;
        });
        return counts;
    }, [donations]);

    // Filter donations
    const filteredDonations = useMemo(() => {
        return donations.filter((d) => {
            const matchesCampaign = campaignFilter === "all" || d.campaign?.id === campaignFilter;
            let matchesAmount = true;
            if (amountFilter === "small") matchesAmount = d.amount < 1000;
            else if (amountFilter === "medium") matchesAmount = d.amount >= 1000 && d.amount < 10000;
            else if (amountFilter === "large") matchesAmount = d.amount >= 10000 && d.amount < 50000;
            else if (amountFilter === "vip") matchesAmount = d.amount >= 50000;
            return matchesCampaign && matchesAmount;
        });
    }, [donations, campaignFilter, amountFilter]);

    // Group donations by donor email
    const groupedDonations = useMemo(() => {
        const groups = {};
        filteredDonations.forEach((donation) => {
            const key = donation.donorEmail;
            if (!groups[key]) {
                groups[key] = {
                    id: key,
                    donorName: donation.donorName,
                    donorEmail: donation.donorEmail,
                    donorPhone: donation.donorPhone,
                    anonymous: donation.anonymous,
                    totalAmount: 0,
                    donationCount: 0,
                    lastDonation: donation.createdAt,
                    donations: [],
                };
            }
            groups[key].totalAmount += donation.amount;
            groups[key].donationCount += 1;
            groups[key].donations.push(donation);
            if (new Date(donation.createdAt) > new Date(groups[key].lastDonation)) {
                groups[key].lastDonation = donation.createdAt;
            }
        });
        return Object.values(groups).sort((a, b) => new Date(b.lastDonation) - new Date(a.lastDonation));
    }, [filteredDonations]);

    // Pagination for grouped view
    const groupedPagination = usePagination(groupedDonations, 10);

    // Calculate stats
    const stats = useMemo(() => {
        const completedDonations = filteredDonations.filter((d) => d.paymentStatus === "completed");
        const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0);
        const avgDonation = completedDonations.length > 0 ? totalAmount / completedDonations.length : 0;
        const uniqueDonors = new Set(completedDonations.map((d) => d.donorEmail)).size;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayDonations = completedDonations.filter((d) => new Date(d.createdAt) >= today);
        const todayAmount = todayDonations.reduce((sum, d) => sum + d.amount, 0);

        return [
            { icon: Gift, value: completedDonations.length, title: "Total Donations", color: "blue" },
            { icon: DollarSign, value: formatCurrency(totalAmount), title: "Total Amount", color: "green" },
            { icon: TrendingUp, value: formatCurrency(avgDonation), title: "Avg Donation", color: "orange" },
            { icon: Repeat, value: uniqueDonors, title: "Unique Donors", color: "purple" },
            { icon: Calendar, value: `${todayDonations.length} (${formatCurrency(todayAmount)})`, title: "Today", color: "cyan" },
        ];
    }, [filteredDonations]);

    // Export CSV
    const exportCSV = useCallback(() => {
        const headers = ["Donor Name", "Email", "Phone", "Amount", "Campaign", "Category", "Payment Status", "Transaction ID", "Date"];
        const rows = filteredDonations.map((d) => [
            d.anonymous ? "Anonymous" : d.donorName,
            d.donorEmail,
            d.donorPhone || "N/A",
            d.amount,
            d.campaign?.title || "N/A",
            d.campaign?.category || "N/A",
            d.paymentStatus,
            d.paymentId || "N/A",
            new Date(d.createdAt).toLocaleString("en-IN"),
        ]);

        const csvContent = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `donations_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success("CSV exported successfully");
    }, [filteredDonations]);

    // Download Receipt
    const downloadReceipt = useCallback((donation) => {
        const receiptContent = `<!DOCTYPE html>
<html>
<head>
    <title>Donation Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #f97316; }
        .receipt-title { font-size: 18px; color: #666; margin-top: 10px; }
        .details { margin: 20px 0; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .label { color: #666; }
        .value { font-weight: 600; }
        .amount { font-size: 24px; color: #16a34a; text-align: center; margin: 30px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .thank-you { text-align: center; font-size: 18px; color: #f97316; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">FUNDamental Grow</div>
        <div class="receipt-title">Donation Receipt</div>
    </div>
    <div class="amount">
        <div style="font-size: 14px; color: #666;">Amount Donated</div>
        ${formatCurrency(donation.amount)}
    </div>
    <div class="details">
        <div class="row"><span class="label">Receipt No</span><span class="value">${donation.id.slice(-8).toUpperCase()}</span></div>
        <div class="row"><span class="label">Transaction ID</span><span class="value">${donation.paymentId || "N/A"}</span></div>
        <div class="row"><span class="label">Date</span><span class="value">${formatDateTime(donation.createdAt)}</span></div>
        <div class="row"><span class="label">Donor Name</span><span class="value">${donation.anonymous ? "Anonymous" : donation.donorName}</span></div>
        <div class="row"><span class="label">Email</span><span class="value">${donation.donorEmail}</span></div>
        <div class="row"><span class="label">Campaign</span><span class="value">${donation.campaign?.title || "N/A"}</span></div>
        <div class="row"><span class="label">Category</span><span class="value">${donation.campaign?.category || "N/A"}</span></div>
        <div class="row"><span class="label">Payment Status</span><span class="value" style="color: #16a34a">${donation.paymentStatus.toUpperCase()}</span></div>
    </div>
    ${donation.message ? `<div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;"><strong>Message:</strong><br/>${donation.message}</div>` : ""}
    <div class="thank-you">Thank you for your generous donation!</div>
    <div class="footer">
        <p>This is a computer-generated receipt and does not require a signature.</p>
        <p>FUNDamental Grow - Making a difference together</p>
    </div>
</body>
</html>`;

        const blob = new Blob([receiptContent], { type: "text/html" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `receipt_${donation.id.slice(-8)}.html`;
        link.click();
        URL.revokeObjectURL(link.href);
    }, []);

    // Delete donation
    const handleDelete = useCallback(async () => {
        if (!deleteModal.donation) return;
        setIsProcessing(true);

        try {
            const res = await fetch(`/api/donations/${deleteModal.donation.id}`, { method: "DELETE" });
            const data = await res.json();

            if (data.success) {
                setDonations((prev) => prev.filter((d) => d.id !== deleteModal.donation.id));
                toast.success("Donation record deleted");
                setDeleteModal({ open: false, donation: null });
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    }, [deleteModal.donation]);

    // Cleanup pending donations
    const handleCleanupPending = useCallback(async () => {
        setIsCleaningUp(true);
        try {
            const res = await fetch("/api/donations/cleanup", { method: "DELETE" });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                setDonations((prev) =>
                    prev.filter((d) => d.paymentStatus !== "pending" || new Date(d.createdAt) > twentyFourHoursAgo)
                );
            } else {
                toast.error(data.message || "Failed to cleanup");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsCleaningUp(false);
        }
    }, []);

    // Toggle donor expansion
    const toggleExpand = useCallback((email) => {
        setExpandedDonors((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(email)) newSet.delete(email);
            else newSet.add(email);
            return newSet;
        });
    }, []);

    // Clear filters
    const clearFilters = useCallback(() => {
        setCampaignFilter("all");
        setAmountFilter("all");
    }, []);

    // DataTable filters
    const filters = useMemo(() => [
        {
            key: "paymentStatus",
            label: "Status",
            allLabel: "All Status",
            options: DONATION_STATUS,
        },
    ], []);

    // DataTable columns
    const columns = useMemo(() => [
        {
            key: "donor",
            label: "Donor",
            render: (donation) => {
                const donorData = donorDonationCounts[donation.donorEmail];
                const ordinal = donorData?.ordinals[donation.id];
                const total = donorData?.total || 1;
                const isRepeat = total > 1;

                return (
                    <div className="flex items-center gap-3">
                        <Avatar name={donation.anonymous ? "A" : donation.donorName} />
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900 truncate">
                                    {donation.anonymous ? "Anonymous" : donation.donorName}
                                </p>
                                {isRepeat && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium whitespace-nowrap">
                                        {getOrdinal(ordinal)}/{total}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">{donation.donorEmail}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            key: "campaign",
            label: "Campaign",
            render: (donation) => (
                <div className="min-w-0">
                    <p className="text-gray-900 font-medium truncate max-w-[160px]">
                        {donation.campaign?.title || "N/A"}
                    </p>
                    <Badge variant="primary" className="mt-1">
                        {donation.campaign?.category || "N/A"}
                    </Badge>
                </div>
            ),
        },
        {
            key: "amount",
            label: "Amount",
            render: (donation) => (
                <p className="font-bold text-green-600">{formatCurrency(donation.amount)}</p>
            ),
        },
        {
            key: "paymentStatus",
            label: "Status",
            render: (donation) => (
                <Badge variant={getStatusVariant(donation.paymentStatus)}>
                    {donation.paymentStatus}
                </Badge>
            ),
        },
        {
            key: "createdAt",
            label: "Date",
            render: (donation) => (
                <p className="text-sm text-gray-600 whitespace-nowrap">
                    {formatDateTime(donation.createdAt)}
                </p>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (donation) => (
                <div className="flex items-center gap-1">
                    <ActionButton
                        icon={Eye}
                        tooltip="View"
                        variant="info"
                        onClick={() => setDetailsModal({ open: true, donation })}
                    />
                    {donation.paymentStatus === "completed" && (
                        <ActionButton
                            icon={FileText}
                            tooltip="Receipt"
                            variant="success"
                            onClick={() => downloadReceipt(donation)}
                        />
                    )}
                    {donation.paymentStatus !== "completed" && (
                        <ActionButton
                            icon={Trash2}
                            tooltip="Delete"
                            variant="danger"
                            onClick={() => setDeleteModal({ open: true, donation })}
                        />
                    )}
                </div>
            ),
        },
    ], [donorDonationCounts, downloadReceipt]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Donation Management"
                subtitle="Track and manage all donations"
                action={exportCSV}
                actionLabel="Export CSV"
                actionIcon={Download}
                secondaryAction={handleCleanupPending}
                secondaryLabel={isCleaningUp ? "Cleaning..." : "Cleanup Pending"}
                secondaryIcon={Trash2}
            />

            {/* Stats */}
            <StatsGrid stats={stats} />

            {/* Custom Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="min-w-[180px]">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Campaign</label>
                        <select
                            value={campaignFilter}
                            onChange={(e) => setCampaignFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
                        >
                            <option value="all">All Campaigns</option>
                            {campaigns.map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="min-w-[150px]">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Amount Range</label>
                        <select
                            value={amountFilter}
                            onChange={(e) => setAmountFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
                        >
                            <option value="all">All Amounts</option>
                            <option value="small">Under ₹1,000</option>
                            <option value="medium">₹1,000 - ₹10,000</option>
                            <option value="large">₹10,000 - ₹50,000</option>
                            <option value="vip">₹50,000+</option>
                        </select>
                    </div>
                    {(campaignFilter !== "all" || amountFilter !== "all") && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-orange-500 hover:text-orange-600 hover:underline cursor-pointer pb-2"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
                <button
                    onClick={() => setViewMode("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${viewMode === "all"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                >
                    All Donations
                </button>
                <button
                    onClick={() => setViewMode("grouped")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${viewMode === "grouped"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                >
                    Group by Donor
                </button>
            </div>

            {/* Content */}
            {viewMode === "grouped" ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Donor</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Donations</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total Amount</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Donation</th>
                                    <th className="px-4 py-3 w-24"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {groupedPagination.paginatedData.map((group) => (
                                    <React.Fragment key={group.donorEmail}>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={group.anonymous ? "A" : group.donorName} />
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-gray-900 truncate">
                                                            {group.anonymous ? "Anonymous" : group.donorName}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">{group.donorEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={group.donationCount > 1 ? "success" : "default"}>
                                                    {group.donationCount} {group.donationCount === 1 ? "time" : "times"}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-bold text-green-600">{formatCurrency(group.totalAmount)}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-600 whitespace-nowrap">
                                                    {formatDateTime(group.lastDonation)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => toggleExpand(group.donorEmail)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    {expandedDonors.has(group.donorEmail) ? (
                                                        <>Hide <ChevronUp className="h-4 w-4" /></>
                                                    ) : (
                                                        <>View <ChevronDown className="h-4 w-4" /></>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedDonors.has(group.donorEmail) && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-3 bg-orange-50">
                                                    <p className="text-sm font-semibold text-gray-700 mb-3">
                                                        Donation History ({group.donationCount} donations)
                                                    </p>
                                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                                        {group.donations.map((donation) => (
                                                            <div
                                                                key={donation.id}
                                                                className="bg-white rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-orange-200"
                                                            >
                                                                <div className="min-w-0">
                                                                    <p className="font-medium text-gray-900 truncate">
                                                                        {donation.campaign?.title || "N/A"}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {formatDateTime(donation.createdAt)}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <p className="font-bold text-green-600">
                                                                        {formatCurrency(donation.amount)}
                                                                    </p>
                                                                    <Badge variant={getStatusVariant(donation.paymentStatus)}>
                                                                        {donation.paymentStatus}
                                                                    </Badge>
                                                                    <ActionButton
                                                                        icon={Eye}
                                                                        tooltip="View"
                                                                        variant="info"
                                                                        onClick={() => setDetailsModal({ open: true, donation })}
                                                                    />
                                                                    {donation.paymentStatus === "completed" && (
                                                                        <ActionButton
                                                                            icon={FileText}
                                                                            tooltip="Receipt"
                                                                            variant="success"
                                                                            onClick={() => downloadReceipt(donation)}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {groupedDonations.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No donations found</div>
                    )}

                    {/* Pagination for Grouped View */}
                    {groupedPagination.totalPages > 1 && (
                        <div className="border-t border-gray-100 p-4">
                            <Pagination
                                currentPage={groupedPagination.currentPage}
                                totalPages={groupedPagination.totalPages}
                                totalItems={groupedPagination.totalItems}
                                itemsPerPage={groupedPagination.itemsPerPage}
                                onPageChange={groupedPagination.setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <DataTable
                    data={filteredDonations}
                    columns={columns}
                    searchable={true}
                    searchKeys={["donorName", "donorEmail", "campaign.title"]}
                    searchPlaceholder="Search by donor name, email or campaign..."
                    filters={filters}
                    emptyMessage="No donations found"
                    itemsPerPage={10}
                />
            )}

            {/* Details Modal */}
            <Modal
                isOpen={detailsModal.open}
                onClose={() => setDetailsModal({ open: false, donation: null })}
                title="Donation Details"
                size="md"
            >
                {detailsModal.donation && (
                    <div className="space-y-4">
                        {/* Amount Header */}
                        <div className="text-center py-4 bg-green-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Amount Donated</p>
                            <p className="text-3xl font-bold text-green-600">
                                {formatCurrency(detailsModal.donation.amount)}
                            </p>
                            <Badge
                                variant={getStatusVariant(detailsModal.donation.paymentStatus)}
                                className="mt-2"
                            >
                                {detailsModal.donation.paymentStatus}
                            </Badge>
                        </div>

                        {/* Donor Info */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" /> Donor Information
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">
                                        {detailsModal.donation.anonymous ? "Anonymous" : detailsModal.donation.donorName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600 truncate">{detailsModal.donation.donorEmail}</span>
                                </div>
                                {detailsModal.donation.donorPhone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">{detailsModal.donation.donorPhone}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Campaign Info */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                                <Building className="h-3.5 w-3.5" /> Campaign
                            </h4>
                            <p className="font-medium text-gray-900">{detailsModal.donation.campaign?.title || "N/A"}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="primary">{detailsModal.donation.campaign?.category || "N/A"}</Badge>
                                <span className="text-xs text-gray-500">
                                    by {detailsModal.donation.campaign?.organizerName || "N/A"}
                                </span>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                                <CreditCard className="h-3.5 w-3.5" /> Payment Details
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs text-gray-500">Transaction ID</p>
                                    <p className="font-mono text-xs mt-0.5">{detailsModal.donation.paymentId || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Date & Time</p>
                                    <p className="text-xs mt-0.5">{formatDateTime(detailsModal.donation.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        {detailsModal.donation.message && (
                            <div className="bg-orange-50 rounded-xl p-4">
                                <h4 className="text-xs font-semibold text-gray-500 mb-2">Message</h4>
                                <p className="text-gray-700 text-sm italic">"{detailsModal.donation.message}"</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1 cursor-pointer"
                                onClick={() => setDetailsModal({ open: false, donation: null })}
                            >
                                Close
                            </Button>
                            {detailsModal.donation.paymentStatus === "completed" && (
                                <Button
                                    className="flex-1 cursor-pointer"
                                    onClick={() => downloadReceipt(detailsModal.donation)}
                                >
                                    <FileText className="w-4 h-4" />
                                    Download Receipt
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => !isProcessing && setDeleteModal({ open: false, donation: null })}
                title="Delete Donation"
                size="sm"
            >
                <div className="text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-7 h-7 text-red-600" />
                    </div>
                    <p className="text-gray-600 mb-2">Delete this {deleteModal.donation?.paymentStatus} donation?</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                        {formatCurrency(deleteModal.donation?.amount || 0)}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">from {deleteModal.donation?.donorName}</p>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-left">
                        <p className="text-xs text-amber-800">
                            <strong>Note:</strong> Only failed/pending donations can be deleted. This removes abandoned payment attempts from your records.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1 cursor-pointer"
                            onClick={() => setDeleteModal({ open: false, donation: null })}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <button
                            onClick={handleDelete}
                            disabled={isProcessing}
                            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 transition-colors"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}