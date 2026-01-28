"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Users, Clock, CheckCircle, XCircle, Eye, MapPin, Phone, Mail, Filter, Loader2, Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/components/ui/StatsGrid";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import ActionButton from "@/components/ui/ActionButton";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function VolunteersPage({ volunteers: initialVolunteers }) {
    const [volunteers, setVolunteers] = useState(initialVolunteers);
    const [actionModal, setActionModal] = useState({ open: false, volunteer: null, action: null });
    const [detailsModal, setDetailsModal] = useState({ open: false, volunteer: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, volunteer: null });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleStatusUpdate = async () => {
        if (!actionModal.volunteer || !actionModal.action) return;
        setIsProcessing(true);

        try {
            const res = await fetch(`/api/volunteers/${actionModal.volunteer.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: actionModal.action }),
            });
            const data = await res.json();

            if (data.success) {
                setVolunteers(volunteers.map(v =>
                    v.id === actionModal.volunteer.id ? { ...v, status: actionModal.action } : v
                ));
                toast.success(`Volunteer ${actionModal.action} successfully`);
                setActionModal({ open: false, volunteer: null, action: null });
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
        if (!deleteModal.volunteer) return;
        setIsProcessing(true);

        try {
            const res = await fetch(`/api/volunteers/${deleteModal.volunteer.id}`, { method: "DELETE" });
            const data = await res.json();

            if (data.success) {
                setVolunteers(volunteers.filter((v) => v.id !== deleteModal.volunteer.id));
                toast.success("Volunteer deleted");
                setDeleteModal({ open: false, volunteer: null });
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    const total = volunteers.length;
    const pending = volunteers.filter((v) => v.status === "pending").length;
    const approved = volunteers.filter((v) => v.status === "approved").length;
    const rejected = volunteers.filter((v) => v.status === "rejected").length;

    const stats = [
        { icon: Users, value: total, title: "Total Volunteers", color: "purple" },
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
            key: "volunteer",
            label: "Volunteer",
            render: (volunteer) => (
                <div className="flex items-center gap-3">
                    <Avatar name={volunteer.name} />
                    <div>
                        <p className="font-semibold text-gray-900">{volunteer.name}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Mail className="h-3 w-3" />
                            {volunteer.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "contact",
            label: "Contact",
            render: (volunteer) => (
                <div className="text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="h-3 w-3" />
                        {volunteer.phone}
                    </div>
                    {volunteer.address && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                            <MapPin className="h-3 w-3" />
                            {volunteer.address}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "skills",
            label: "Skills",
            render: (volunteer) => (
                <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {volunteer.skills?.split(",").slice(0, 2).map((skill, i) => (
                        <Badge key={i} variant="default">{skill.trim()}</Badge>
                    )) || <span className="text-gray-400 text-sm">-</span>}
                </div>
            ),
        },
        {
            key: "availability",
            label: "Availability",
            render: (volunteer) => (
                <Badge variant="info">{volunteer.availability || "-"}</Badge>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (volunteer) => (
                <Badge variant={volunteer.status === "approved" ? "success" : volunteer.status === "rejected" ? "danger" : "warning"}>
                    {volunteer.status}
                </Badge>
            ),
        },
        {
            key: "createdAt",
            label: "Applied",
            render: (volunteer) => (
                <p className="text-sm text-gray-600">{formatDateTime(volunteer.createdAt)}</p>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (volunteer) => (
                <div className="flex items-center gap-1">
                    <ActionButton icon={Eye} tooltip="View" variant="info" onClick={() => setDetailsModal({ open: true, volunteer })} />
                    {/* Show Approve for pending and rejected */}
                    {(volunteer.status === "pending" || volunteer.status === "rejected") && (
                        <ActionButton icon={CheckCircle} tooltip="Approve" variant="success" onClick={() => setActionModal({ open: true, volunteer, action: "approved" })} />
                    )}
                    {/* Show Reject for pending and approved */}
                    {(volunteer.status === "pending" || volunteer.status === "approved") && (
                        <ActionButton icon={XCircle} tooltip="Reject" variant="danger" onClick={() => setActionModal({ open: true, volunteer, action: "rejected" })} />
                    )}
                    <ActionButton icon={Trash2} tooltip="Delete" variant="danger" onClick={() => setDeleteModal({ open: true, volunteer })} />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Volunteer Management" subtitle="Review and manage volunteer applications" />

            <StatsGrid stats={stats} />

            <DataTable
                data={volunteers}
                columns={columns}
                searchable={true}
                searchKeys={["name", "email", "skills"]}
                searchPlaceholder="Search volunteers..."
                filters={filters}
                emptyMessage="No volunteers found"
            />

            {/* Approve/Reject Modal */}
            <Modal
                isOpen={actionModal.open}
                onClose={() => !isProcessing && setActionModal({ open: false, volunteer: null, action: null })}
                title={actionModal.action === "approved" ? "Approve Volunteer" : "Reject Volunteer"}
                size="sm"
            >
                <div className="text-center">
                    <div className={`w-12 h-12 ${actionModal.action === "approved" ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {actionModal.action === "approved" ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
                    </div>
                    <p className="text-gray-600 mb-2">{actionModal.action === "approved" ? "Approve this volunteer?" : "Reject this volunteer?"}</p>
                    <p className="font-semibold text-gray-900 mb-6">"{actionModal.volunteer?.name}"</p>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setActionModal({ open: false, volunteer: null, action: null })} disabled={isProcessing}>Cancel</Button>
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
            <Modal isOpen={detailsModal.open} onClose={() => setDetailsModal({ open: false, volunteer: null })} title="Volunteer Details" size="md">
                {detailsModal.volunteer && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 pb-4 border-b">
                            <Avatar name={detailsModal.volunteer.name} size="lg" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{detailsModal.volunteer.name}</h3>
                                <Badge variant={detailsModal.volunteer.status === "approved" ? "success" : detailsModal.volunteer.status === "rejected" ? "danger" : "warning"}>
                                    {detailsModal.volunteer.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-gray-500">Email</p><p className="font-medium">{detailsModal.volunteer.email}</p></div>
                            <div><p className="text-gray-500">Phone</p><p className="font-medium">{detailsModal.volunteer.phone}</p></div>
                            <div><p className="text-gray-500">Location</p><p className="font-medium">{detailsModal.volunteer.address || "-"}</p></div>
                            <div><p className="text-gray-500">Availability</p><p className="font-medium">{detailsModal.volunteer.availability || "-"}</p></div>
                            <div className="col-span-2">
                                <p className="text-gray-500 mb-1">Skills</p>
                                <div className="flex flex-wrap gap-1">
                                    {detailsModal.volunteer.skills?.split(",").map((skill, i) => (
                                        <Badge key={i} variant="primary">{skill.trim()}</Badge>
                                    )) || <span className="text-gray-400">Not specified</span>}
                                </div>
                            </div>
                            {detailsModal.volunteer.motivation && (
                                <div className="col-span-2">
                                    <p className="text-gray-500 mb-1">Motivation</p>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{detailsModal.volunteer.motivation}</p>
                                </div>
                            )}
                            <div className="col-span-2"><p className="text-gray-500">Applied On</p><p className="font-medium">{formatDateTime(detailsModal.volunteer.createdAt)}</p></div>
                        </div>
                        {/* Always show action buttons based on current status */}
                        <div className="flex gap-3 pt-4 border-t">
                            {(detailsModal.volunteer.status === "pending" || detailsModal.volunteer.status === "rejected") && (
                                <button onClick={() => { setDetailsModal({ open: false, volunteer: null }); setActionModal({ open: true, volunteer: detailsModal.volunteer, action: "approved" }); }} className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium cursor-pointer flex items-center justify-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Approve
                                </button>
                            )}
                            {(detailsModal.volunteer.status === "pending" || detailsModal.volunteer.status === "approved") && (
                                <button onClick={() => { setDetailsModal({ open: false, volunteer: null }); setActionModal({ open: true, volunteer: detailsModal.volunteer, action: "rejected" }); }} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium cursor-pointer flex items-center justify-center gap-2">
                                    <XCircle className="w-4 h-4" /> Reject
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal.open} onClose={() => !isProcessing && setDeleteModal({ open: false, volunteer: null })} title="Delete Volunteer" size="sm">
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-gray-600 mb-1 text-sm">Delete this volunteer permanently?</p>
                    <p className="font-semibold text-gray-900 mb-4">"{deleteModal.volunteer?.name}"</p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setDeleteModal({ open: false, volunteer: null })} disabled={isProcessing}>Cancel</Button>
                        <button onClick={handleDelete} disabled={isProcessing} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm">
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isProcessing ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
