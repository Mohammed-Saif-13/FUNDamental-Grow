"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FileText, CheckCircle, XCircle, Clock, Eye, Trash2, Filter, Loader2, Mail, Phone, Target, DollarSign } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/components/ui/StatsGrid";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import ActionButton from "@/components/ui/ActionButton";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function RequestsPage({ requests: initialRequests }) {
    const [requests, setRequests] = useState(initialRequests);
    const [actionModal, setActionModal] = useState({ open: false, request: null, action: null });
    const [detailsModal, setDetailsModal] = useState({ open: false, request: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, request: null });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleStatusUpdate = async () => {
        if (!actionModal.request || !actionModal.action) return;
        setIsProcessing(true);

        try {
            const res = await fetch(`/api/fundraiser-requests/${actionModal.request.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: actionModal.action }),
            });
            const data = await res.json();

            if (data.success) {
                setRequests(requests.map(r =>
                    r.id === actionModal.request.id ? { ...r, status: actionModal.action } : r
                ));
                if (actionModal.action === "approved") {
                    toast.success("Request approved! Campaign created successfully");
                } else {
                    toast.success("Request rejected");
                }
                setActionModal({ open: false, request: null, action: null });
            } else {
                toast.error(data.message || "Failed to update");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.request) return;
        setIsProcessing(true);

        try {
            const res = await fetch(`/api/fundraiser-requests/${deleteModal.request.id}`, { method: "DELETE" });
            const data = await res.json();

            if (data.success) {
                setRequests(requests.filter(r => r.id !== deleteModal.request.id));
                toast.success("Request deleted");
                setDeleteModal({ open: false, request: null });
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    const total = requests.length;
    const pending = requests.filter((r) => r.status === "pending").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const rejected = requests.filter((r) => r.status === "rejected").length;

    const stats = [
        { icon: FileText, value: total, title: "Total Requests", color: "purple" },
        { icon: Clock, value: pending, title: "Pending Review", color: "orange" },
        { icon: CheckCircle, value: approved, title: "Approved", color: "green" },
        { icon: XCircle, value: rejected, title: "Rejected", color: "red" },
    ];

    const filters = [
        {
            key: "status",
            label: "Status",
            icon: Filter,
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
            key: "request",
            label: "Request",
            render: (request) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{request.title}</p>
                        <p className="text-xs text-gray-500">by {request.name}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "contact",
            label: "Contact",
            render: (request) => (
                <div className="text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="h-3 w-3" />
                        {request.email}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <Phone className="h-3 w-3" />
                        {request.phone}
                    </div>
                </div>
            ),
        },
        {
            key: "category",
            label: "Category",
            render: (request) => <Badge variant="primary">{request.category}</Badge>,
        },
        {
            key: "goalAmount",
            label: "Goal",
            render: (request) => (
                <p className="font-medium text-gray-900">{formatCurrency(request.goalAmount)}</p>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (request) => (
                <Badge variant={request.status === "approved" ? "success" : request.status === "rejected" ? "danger" : "warning"}>
                    {request.status}
                </Badge>
            ),
        },
        {
            key: "createdAt",
            label: "Date",
            render: (request) => (
                <p className="text-sm text-gray-600">{formatDateTime(request.createdAt)}</p>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (request) => (
                <div className="flex items-center gap-1">
                    <ActionButton icon={Eye} tooltip="View" variant="info" onClick={() => setDetailsModal({ open: true, request })} />
                    {request.status === "pending" && (
                        <>
                            <ActionButton icon={CheckCircle} tooltip="Approve" variant="success" onClick={() => setActionModal({ open: true, request, action: "approved" })} />
                            <ActionButton icon={XCircle} tooltip="Reject" variant="danger" onClick={() => setActionModal({ open: true, request, action: "rejected" })} />
                        </>
                    )}
                    <ActionButton icon={Trash2} tooltip="Delete" variant="danger" onClick={() => setDeleteModal({ open: true, request })} />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Fundraiser Requests" subtitle="Review and manage fundraiser applications" />

            <StatsGrid stats={stats} />

            <DataTable
                data={requests}
                columns={columns}
                searchable={true}
                searchKeys={["name", "email", "title", "category"]}
                searchPlaceholder="Search requests..."
                filters={filters}
                emptyMessage="No fundraiser requests found"
            />

            {/* Approve/Reject Modal */}
            <Modal
                isOpen={actionModal.open}
                onClose={() => !isProcessing && setActionModal({ open: false, request: null, action: null })}
                title={actionModal.action === "approved" ? "Approve Request" : "Reject Request"}
                size="sm"
            >
                <div className="text-center">
                    <div className={`w-12 h-12 ${actionModal.action === "approved" ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {actionModal.action === "approved" ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
                    </div>
                    {actionModal.action === "approved" ? (
                        <>
                            <p className="text-gray-600 mb-2">Approve this fundraiser request?</p>
                            <p className="font-semibold text-gray-900 mb-2">"{actionModal.request?.title}"</p>
                            <p className="text-sm text-green-600 mb-6">A new campaign will be created automatically.</p>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-2">Reject this fundraiser request?</p>
                            <p className="font-semibold text-gray-900 mb-6">"{actionModal.request?.title}"</p>
                        </>
                    )}
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setActionModal({ open: false, request: null, action: null })} disabled={isProcessing}>Cancel</Button>
                        <button
                            onClick={handleStatusUpdate}
                            disabled={isProcessing}
                            className={`flex-1 px-4 py-2 ${actionModal.action === "approved" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white rounded-lg font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2`}
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isProcessing ? "Processing..." : actionModal.action === "approved" ? "Approve" : "Reject"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Details Modal */}
            <Modal isOpen={detailsModal.open} onClose={() => setDetailsModal({ open: false, request: null })} title="Request Details" size="lg">
                {detailsModal.request && (
                    <>
                        {/* Header Card */}
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 mb-6">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <FileText className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{detailsModal.request.title}</h3>
                                <Badge variant={detailsModal.request.status === "approved" ? "success" : detailsModal.request.status === "rejected" ? "danger" : "warning"}>
                                    {detailsModal.request.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Image (if exists) */}
                        {detailsModal.request.image && (
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-700 mb-2">Campaign Image</p>
                                <img
                                    src={detailsModal.request.image}
                                    alt={detailsModal.request.title}
                                    className="w-full h-64 object-cover rounded-xl"
                                />
                            </div>
                        )}

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs font-medium text-gray-500 mb-1">Organizer</p>
                                <p className="font-semibold text-gray-900">{detailsModal.request.name}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                                <p className="font-medium text-gray-900 text-sm break-all">{detailsModal.request.email}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs font-medium text-gray-500 mb-1">Phone</p>
                                <p className="font-medium text-gray-900">{detailsModal.request.phone || "N/A"}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs font-medium text-gray-500 mb-1">Category</p>
                                <Badge variant="primary">{detailsModal.request.category}</Badge>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                <p className="text-xs font-medium text-orange-700 mb-1">Goal Amount</p>
                                <p className="text-xl font-bold text-orange-600">{formatCurrency(detailsModal.request.goalAmount)}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs font-medium text-gray-500 mb-1">Submitted On</p>
                                <p className="font-medium text-gray-900">{formatDateTime(detailsModal.request.createdAt)}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="p-4 bg-gray-50 rounded-xl mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{detailsModal.request.description}</p>
                        </div>

                        {/* Action Buttons */}
                        {detailsModal.request.status === "pending" && (
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setDetailsModal({ open: false, request: null });
                                        setActionModal({ open: true, request: detailsModal.request, action: "approved" });
                                    }}
                                    className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all"
                                >
                                    <CheckCircle className="w-5 h-5" /> Approve Request
                                </button>
                                <button
                                    onClick={() => {
                                        setDetailsModal({ open: false, request: null });
                                        setActionModal({ open: true, request: detailsModal.request, action: "rejected" });
                                    }}
                                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all"
                                >
                                    <XCircle className="w-5 h-5" /> Reject Request
                                </button>
                            </div>
                        )}
                    </>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal.open} onClose={() => !isProcessing && setDeleteModal({ open: false, request: null })} title="Delete Request" size="sm">
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-gray-600 mb-2">Delete this request?</p>
                    <p className="font-semibold text-gray-900 mb-6">"{deleteModal.request?.title}"</p>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setDeleteModal({ open: false, request: null })} disabled={isProcessing}>Cancel</Button>
                        <button onClick={handleDelete} disabled={isProcessing} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isProcessing ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}