"use client";

import { useState, useMemo } from "react";
import {
    Mail,
    Download,
    Search,
    Users,
    UserCheck,
    UserX,
    Calendar,
    Trash2,
    Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

export default function NewsletterPage({ initialData }) {
    const [subscribers, setSubscribers] = useState(initialData.subscribers);
    const [stats] = useState(initialData.stats);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isDeleting, setIsDeleting] = useState(null);

    // Filtered subscribers
    const filteredSubscribers = useMemo(() => {
        return subscribers.filter((sub) => {
            const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [subscribers, searchQuery, statusFilter]);

    // Export to CSV
    const handleExport = () => {
        const activeSubscribers = subscribers.filter((s) => s.status === "active");

        if (activeSubscribers.length === 0) {
            toast.error("No active subscribers to export");
            return;
        }

        const csv = [
            "Email,Status,Subscribed At",
            ...activeSubscribers.map(
                (s) =>
                    `${s.email},${s.status},${new Date(s.subscribedAt).toLocaleDateString()}`
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast.success(`Exported ${activeSubscribers.length} subscribers`);
    };

    // Delete subscriber
    const handleDelete = async (id, email) => {
        if (!confirm(`Remove ${email} from newsletter?`)) return;

        setIsDeleting(id);

        try {
            const res = await fetch(`/api/admin/newsletter/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
                setSubscribers((prev) => prev.filter((s) => s.id !== id));
                toast.success("Subscriber removed");
            } else {
                toast.error(data.message || "Failed to remove");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsDeleting(null);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your newsletter subscribers</p>
                </div>
                <Button onClick={handleExport} variant="outline" className="cursor-pointer">
                    <Download className="w-4 h-4" />
                    Export CSV
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-sm text-gray-500">Total Subscribers</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                            <p className="text-sm text-gray-500">Active</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <UserX className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.unsubscribed}</p>
                            <p className="text-sm text-gray-500">Unsubscribed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="unsubscribed">Unsubscribed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Subscribed
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSubscribers.length > 0 ? (
                                filteredSubscribers.map((subscriber) => (
                                    <tr key={subscriber.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <Mail className="w-4 h-4 text-orange-600" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {subscriber.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${subscriber.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {subscriber.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(subscriber.subscribedAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(subscriber.id, subscriber.email)}
                                                disabled={isDeleting === subscriber.id}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No subscribers found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}