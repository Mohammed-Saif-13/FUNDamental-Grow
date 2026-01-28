"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    Plus,
    Eye,
    Edit,
    Trash2,
    Star,
    TrendingUp,
    Target,
    DollarSign,
    Percent,
    LayoutGrid,
    Filter,
    Loader2,
    AlertTriangle,
    Clock,
    XCircle,
} from "lucide-react";
import { formatCurrency, calculateProgress, daysLeft } from "@/lib/utils";
import { CAMPAIGN_CATEGORIES } from "@/lib/constants/campaign";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/components/ui/StatsGrid";
import DataTable from "@/components/ui/DataTable";
import ActionButton from "@/components/ui/ActionButton";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

// Status configuration
const STATUS_CONFIG = {
    active: { label: "Active", color: "bg-green-50 text-green-600" },
    pending: { label: "Pending", color: "bg-yellow-50 text-yellow-600" },
    paused: { label: "Paused", color: "bg-amber-50 text-amber-600" },
    completed: { label: "Completed", color: "bg-blue-50 text-blue-600" },
    rejected: { label: "Rejected", color: "bg-red-50 text-red-600" },
};

// Generate category options from constants
const CATEGORY_OPTIONS = CAMPAIGN_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
}));

// Generate status options
const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
}));

export default function CampaignsPage({ initialCampaigns }) {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState(initialCampaigns);
    const [deleteModal, setDeleteModal] = useState({ open: false, campaign: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [togglingFeatured, setTogglingFeatured] = useState(null);
    const [togglingVisibility, setTogglingVisibility] = useState(null);

    // Stats calculation
    const stats = useMemo(() => {
        const totalCampaigns = campaigns.length;
        const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
        const pendingCampaigns = campaigns.filter((c) => c.status === "pending").length;
        const totalRaised = campaigns.reduce((sum, c) => sum + c.raisedAmount, 0);
        const totalGoal = campaigns.reduce((sum, c) => sum + c.goalAmount, 0);
        const overallProgress = totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0;

        return [
            {
                icon: TrendingUp,
                value: totalCampaigns,
                title: "Total Campaigns",
                color: "blue",
            },
            {
                icon: Target,
                value: activeCampaigns,
                title: "Active Now",
                color: "green",
            },
            {
                icon: Clock,
                value: pendingCampaigns,
                title: "Pending Review",
                color: "yellow",
                badge: pendingCampaigns > 0 ? "!" : null,
            },
            {
                icon: DollarSign,
                value: formatCurrency(totalRaised),
                title: "Total Raised",
                color: "orange",
            },
            {
                icon: Percent,
                value: `${overallProgress}%`,
                title: "Overall Progress",
                color: "purple",
            },
        ];
    }, [campaigns]);

    // Filters configuration
    const filters = useMemo(() => [
        {
            key: "category",
            label: "Category",
            icon: LayoutGrid,
            allLabel: "All Categories",
            options: CATEGORY_OPTIONS,
        },
        {
            key: "status",
            label: "Status",
            icon: Filter,
            allLabel: "All Status",
            options: STATUS_OPTIONS,
        },
    ], []);

    // Handle delete campaign
    const handleDelete = useCallback(async () => {
        if (!deleteModal.campaign) return;
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/campaigns/${deleteModal.campaign.id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (data.success) {
                // Optimistic update
                setCampaigns((prev) => prev.filter((c) => c.id !== deleteModal.campaign.id));
                toast.success("Campaign deleted successfully");
                setDeleteModal({ open: false, campaign: null });
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    }, [deleteModal.campaign]);

    // Handle toggle featured - Optimistic Update
    const handleToggleFeatured = useCallback(async (campaign) => {
        const newFeatured = !campaign.featured;

        // Optimistic update - instant UI change
        setCampaigns((prev) =>
            prev.map((c) => (c.id === campaign.id ? { ...c, featured: newFeatured } : c))
        );
        setTogglingFeatured(campaign.id);

        try {
            const res = await fetch(`/api/campaigns/${campaign.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ featured: newFeatured }),
            });
            const data = await res.json();

            if (data.success) {
                toast.success(newFeatured ? "Added to featured" : "Removed from featured");
            } else {
                // Revert on error
                setCampaigns((prev) =>
                    prev.map((c) => (c.id === campaign.id ? { ...c, featured: !newFeatured } : c))
                );
                toast.error(data.message || "Failed to update");
            }
        } catch {
            // Revert on error
            setCampaigns((prev) =>
                prev.map((c) => (c.id === campaign.id ? { ...c, featured: !newFeatured } : c))
            );
            toast.error("Something went wrong");
        } finally {
            setTogglingFeatured(null);
        }
    }, []);

    // Handle toggle visibility - Optimistic Update
    const handleToggleVisibility = useCallback(async (campaign) => {
        const newVisibility = !campaign.isPublic;

        // Optimistic update - instant UI change
        setCampaigns((prev) =>
            prev.map((c) => (c.id === campaign.id ? { ...c, isPublic: newVisibility } : c))
        );
        setTogglingVisibility(campaign.id);

        try {
            const res = await fetch(`/api/campaigns/${campaign.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublic: newVisibility }),
            });
            const data = await res.json();

            if (data.success) {
                toast.success(newVisibility ? "Campaign is now public" : "Campaign hidden from public");
            } else {
                // Revert on error
                setCampaigns((prev) =>
                    prev.map((c) => (c.id === campaign.id ? { ...c, isPublic: !newVisibility } : c))
                );
                toast.error(data.message || "Failed to update");
            }
        } catch {
            // Revert on error
            setCampaigns((prev) =>
                prev.map((c) => (c.id === campaign.id ? { ...c, isPublic: !newVisibility } : c))
            );
            toast.error("Something went wrong");
        } finally {
            setTogglingVisibility(null);
        }
    }, []);

    // Table columns
    const columns = useMemo(() => [
        {
            key: "title",
            label: "Campaign",
            render: (campaign) => (
                <div className="flex items-center gap-3 min-w-[200px]">
                    <img
                        src={campaign.image || "https://via.placeholder.com/80x60?text=No+Image"}
                        alt={campaign.title}
                        className="h-12 w-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate max-w-[180px]">
                            {campaign.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {campaign._count?.donations || 0} donations
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "category",
            label: "Category",
            render: (campaign) => (
                <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-orange-50 text-orange-600 whitespace-nowrap">
                    {campaign.category}
                </span>
            ),
        },
        {
            key: "progress",
            label: "Progress",
            render: (campaign) => {
                const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
                return (
                    <div className="min-w-[140px]">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">
                                {formatCurrency(campaign.raisedAmount)}
                            </span>
                            <span className="text-xs font-medium text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                                {progress}%
                            </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Goal: {formatCurrency(campaign.goalAmount)}
                        </p>
                    </div>
                );
            },
        },
        {
            key: "status",
            label: "Status",
            render: (campaign) => {
                const days = daysLeft(campaign.endDate);
                const statusConfig = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.pending;
                const isActive = campaign.status === "active";
                const displayText = days !== null && isActive && days > 0
                    ? `${days}d left`
                    : statusConfig.label;

                return (
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusConfig.color}`}>
                        {displayText}
                    </span>
                );
            },
        },
        {
            key: "featured",
            label: "Featured",
            render: (campaign) => (
                <button
                    onClick={() => handleToggleFeatured(campaign)}
                    disabled={togglingFeatured === campaign.id}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 cursor-pointer transition-colors"
                    aria-label={campaign.featured ? "Remove from featured" : "Add to featured"}
                >
                    {togglingFeatured === campaign.id ? (
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    ) : (
                        <Star
                            className={`h-5 w-5 transition-colors ${campaign.featured
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300 hover:text-yellow-400"
                                }`}
                        />
                    )}
                </button>
            ),
        },
        {
            key: "visibility",
            label: "Public",
            render: (campaign) => (
                <button
                    onClick={() => handleToggleVisibility(campaign)}
                    disabled={togglingVisibility === campaign.id}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 ${campaign.isPublic ? "bg-green-500" : "bg-gray-300"
                        }`}
                    aria-label={campaign.isPublic ? "Make private" : "Make public"}
                >
                    {togglingVisibility === campaign.id ? (
                        <span className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                        </span>
                    ) : (
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${campaign.isPublic ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    )}
                </button>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (campaign) => (
                <div className="flex items-center gap-1">
                    <ActionButton
                        icon={Eye}
                        tooltip="View"
                        variant="info"
                        onClick={() => window.open(`/campaigns/${campaign.slug}`, "_blank")}
                    />
                    <ActionButton
                        icon={Edit}
                        tooltip="Edit"
                        variant="default"
                        onClick={() => router.push(`/admin/campaigns/${campaign.id}/edit`)}
                    />
                    <ActionButton
                        icon={Trash2}
                        tooltip="Delete"
                        variant="danger"
                        onClick={() => setDeleteModal({ open: true, campaign })}
                    />
                </div>
            ),
        },
    ], [handleToggleFeatured, handleToggleVisibility, togglingFeatured, togglingVisibility, router]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Campaign Management"
                subtitle="Manage all fundraising campaigns"
                action={() => router.push("/admin/campaigns/create")}
                actionLabel="Create Campaign"
                actionIcon={Plus}
            />

            {/* Stats */}
            <StatsGrid stats={stats} />

            {/* Data Table */}
            <DataTable
                data={campaigns}
                columns={columns}
                searchable={true}
                searchKeys={["title", "category", "organizerName", "organizerEmail"]}
                searchPlaceholder="Search by title, category, organizer..."
                filters={filters}
                emptyMessage="No campaigns found"
                emptyAction={
                    <Link
                        href="/admin/campaigns/create"
                        className="text-orange-500 hover:underline mt-2 inline-block"
                    >
                        Create your first campaign
                    </Link>
                }
                itemsPerPage={10}
                showDateFilter={true}
                dateField="createdAt"
            />

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => !isDeleting && setDeleteModal({ open: false, campaign: null })}
                title="Delete Campaign"
                size="sm"
            >
                <div className="text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-7 h-7 text-red-600" />
                    </div>
                    <p className="text-gray-600 mb-2">Are you sure you want to delete</p>
                    <p className="font-semibold text-gray-900 mb-4 truncate px-4">
                        "{deleteModal.campaign?.title}"?
                    </p>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6">
                        <p className="text-sm text-red-600 flex items-center justify-center gap-2">
                            <XCircle className="w-4 h-4" />
                            This will also delete all donations linked to this campaign.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1 cursor-pointer"
                            onClick={() => setDeleteModal({ open: false, campaign: null })}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 transition-colors"
                        >
                            {isDeleting ? (
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