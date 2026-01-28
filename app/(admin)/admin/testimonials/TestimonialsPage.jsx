"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { MessageSquareQuote, Clock, CheckCircle, XCircle, Star, Eye, Trash2, Loader2, Award } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/components/ui/StatsGrid";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import ActionButton from "@/components/ui/ActionButton";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function TestimonialsPage({ testimonials: initialTestimonials }) {
    const [testimonials, setTestimonials] = useState(initialTestimonials);
    const [actionModal, setActionModal] = useState({ open: false, testimonial: null, action: null });
    const [detailsModal, setDetailsModal] = useState({ open: false, testimonial: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, testimonial: null });
    const [isProcessing, setIsProcessing] = useState(false);
    const [togglingFeatured, setTogglingFeatured] = useState(null);

    const handleStatusUpdate = async () => {
        if (!actionModal.testimonial || !actionModal.action) return;
        setIsProcessing(true);

        try {
            const res = await fetch(`/api/testimonials/${actionModal.testimonial.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: actionModal.action }),
            });
            const data = await res.json();

            if (data.success) {
                setTestimonials(testimonials.map((t) => (t.id === actionModal.testimonial.id ? { ...t, status: actionModal.action } : t)));
                toast.success(`Testimonial ${actionModal.action}`);
                setActionModal({ open: false, testimonial: null, action: null });
            } else {
                toast.error(data.message || "Failed to update");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleToggleFeatured = async (testimonial) => {
        setTogglingFeatured(testimonial.id);

        try {
            const res = await fetch(`/api/testimonials/${testimonial.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ featured: !testimonial.featured }),
            });
            const data = await res.json();

            if (data.success) {
                setTestimonials(testimonials.map((t) => (t.id === testimonial.id ? { ...t, featured: !t.featured } : t)));
                toast.success(testimonial.featured ? "Removed from featured" : "Added to featured");
            } else {
                toast.error(data.message || "Failed to update");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setTogglingFeatured(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.testimonial) return;
        setIsProcessing(true);

        try {
            const res = await fetch(`/api/testimonials/${deleteModal.testimonial.id}`, { method: "DELETE" });
            const data = await res.json();

            if (data.success) {
                setTestimonials(testimonials.filter((t) => t.id !== deleteModal.testimonial.id));
                toast.success("Testimonial deleted");
                setDeleteModal({ open: false, testimonial: null });
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    const total = testimonials.length;
    const pending = testimonials.filter((t) => t.status === "pending").length;
    const approved = testimonials.filter((t) => t.status === "approved").length;
    const featured = testimonials.filter((t) => t.featured).length;

    const stats = [
        { icon: MessageSquareQuote, value: total, title: "Total Testimonials", color: "purple" },
        { icon: Clock, value: pending, title: "Pending Review", color: "orange" },
        { icon: CheckCircle, value: approved, title: "Approved", color: "green" },
        { icon: Award, value: featured, title: "Featured", color: "blue" },
    ];

    const filters = [
        {
            key: "status",
            label: "Status",
            allLabel: "All Status",
            options: [
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
            ],
        },
    ];

    const columns = [
        {
            key: "author",
            label: "Author",
            render: (testimonial) => (
                <div className="flex items-center gap-3">
                    <Avatar name={testimonial.name} image={testimonial.image} />
                    <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-xs text-gray-500">{testimonial.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "role",
            label: "Role",
            render: (testimonial) => (
                <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-600 whitespace-nowrap">
                    {testimonial.role}
                </span>
            ),
        },
        {
            key: "rating",
            label: "Rating",
            render: (testimonial) => (
                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                        />
                    ))}
                </div>
            ),
        },
        {
            key: "message",
            label: "Message",
            render: (testimonial) => (
                <p className="text-sm text-gray-600 line-clamp-2 max-w-[250px]">"{testimonial.message}"</p>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (testimonial) => (
                <Badge
                    variant={
                        testimonial.status === "approved" ? "success" : testimonial.status === "pending" ? "warning" : "danger"
                    }
                >
                    {testimonial.status}
                </Badge>
            ),
        },
        {
            key: "featured",
            label: "Featured",
            render: (testimonial) => (
                <button
                    onClick={() => testimonial.status === "approved" && handleToggleFeatured(testimonial)}
                    disabled={togglingFeatured === testimonial.id || testimonial.status !== "approved"}
                    className="p-1 disabled:opacity-50 cursor-pointer"
                    title={testimonial.status !== "approved" ? "Only approved testimonials can be featured" : ""}
                >
                    {togglingFeatured === testimonial.id ? (
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    ) : testimonial.featured ? (
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ) : (
                        <Star className="h-5 w-5 text-gray-300 hover:text-yellow-500 transition-colors" />
                    )}
                </button>
            ),
        },
        {
            key: "createdAt",
            label: "Date",
            render: (testimonial) => <p className="text-sm text-gray-600">{formatDateTime(testimonial.createdAt)}</p>,
        },
        {
            key: "actions",
            label: "Actions",
            render: (testimonial) => (
                <div className="flex items-center gap-1">
                    <ActionButton icon={Eye} tooltip="View" variant="info" onClick={() => setDetailsModal({ open: true, testimonial })} />
                    {(testimonial.status === "pending" || testimonial.status === "rejected") && (
                        <ActionButton icon={CheckCircle} tooltip="Approve" variant="success" onClick={() => setActionModal({ open: true, testimonial, action: "approved" })} />
                    )}
                    {(testimonial.status === "pending" || testimonial.status === "approved") && (
                        <ActionButton icon={XCircle} tooltip="Reject" variant="danger" onClick={() => setActionModal({ open: true, testimonial, action: "rejected" })} />
                    )}
                    <ActionButton icon={Trash2} tooltip="Delete" variant="danger" onClick={() => setDeleteModal({ open: true, testimonial })} />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Testimonial Management" subtitle="Review and manage user testimonials" />

            <StatsGrid stats={stats} />

            <DataTable
                data={testimonials}
                columns={columns}
                searchable={true}
                searchKeys={["name", "email", "message"]}
                searchPlaceholder="Search testimonials..."
                filters={filters}
                emptyMessage="No testimonials found"
            />

            {/* Action Modal */}
            <Modal
                isOpen={actionModal.open}
                onClose={() => !isProcessing && setActionModal({ open: false, testimonial: null, action: null })}
                title={actionModal.action === "approved" ? "Approve Testimonial" : "Reject Testimonial"}
                size="sm"
            >
                <div className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${actionModal.action === "approved" ? "bg-green-100" : "bg-red-100"}`}>
                        {actionModal.action === "approved" ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                        )}
                    </div>
                    <p className="text-gray-600 mb-1 text-sm">
                        {actionModal.action === "approved"
                            ? "Approve this testimonial? It will be visible on the website."
                            : "Reject this testimonial? It will not be shown to visitors."}
                    </p>
                    <p className="font-semibold text-gray-900 mb-4">by {actionModal.testimonial?.name}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setActionModal({ open: false, testimonial: null, action: null })} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <button
                            onClick={handleStatusUpdate}
                            disabled={isProcessing}
                            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm ${actionModal.action === "approved" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isProcessing ? "Processing..." : actionModal.action === "approved" ? "Approve" : "Reject"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Details Modal */}
            <Modal isOpen={detailsModal.open} onClose={() => setDetailsModal({ open: false, testimonial: null })} title="Testimonial Details" size="md">
                {detailsModal.testimonial && (
                    <div className="space-y-4">
                        {/* Author Info */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <Avatar name={detailsModal.testimonial.name} image={detailsModal.testimonial.image} size="lg" />
                            <div>
                                <h3 className="font-semibold text-gray-900">{detailsModal.testimonial.name}</h3>
                                <p className="text-sm text-gray-500">{detailsModal.testimonial.email}</p>
                                <Badge variant="primary" className="mt-1">{detailsModal.testimonial.role}</Badge>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Rating:</span>
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < detailsModal.testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="bg-orange-50 rounded-xl p-4">
                            <p className="text-gray-700 italic">"{detailsModal.testimonial.message}"</p>
                        </div>

                        {/* Meta */}
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Submitted: {formatDateTime(detailsModal.testimonial.createdAt)}</span>
                            <Badge variant={detailsModal.testimonial.status === "approved" ? "success" : detailsModal.testimonial.status === "pending" ? "warning" : "danger"}>
                                {detailsModal.testimonial.status}
                            </Badge>
                        </div>

                        {/* Actions */}
                        {detailsModal.testimonial.status === "pending" && (
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => {
                                        setDetailsModal({ open: false, testimonial: null });
                                        setActionModal({ open: true, testimonial: detailsModal.testimonial, action: "approved" });
                                    }}
                                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" /> Approve
                                </button>
                                <button
                                    onClick={() => {
                                        setDetailsModal({ open: false, testimonial: null });
                                        setActionModal({ open: true, testimonial: detailsModal.testimonial, action: "rejected" });
                                    }}
                                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <XCircle className="w-4 h-4" /> Reject
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal.open} onClose={() => !isProcessing && setDeleteModal({ open: false, testimonial: null })} title="Delete Testimonial" size="sm">
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-gray-600 mb-1 text-sm">Delete this testimonial permanently?</p>
                    <p className="font-semibold text-gray-900 mb-4">by "{deleteModal.testimonial?.name}"</p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setDeleteModal({ open: false, testimonial: null })} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <button
                            onClick={handleDelete}
                            disabled={isProcessing}
                            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isProcessing ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
