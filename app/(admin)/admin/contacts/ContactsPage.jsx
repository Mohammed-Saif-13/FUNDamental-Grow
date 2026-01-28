"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, AlertCircle, Eye, CheckCircle, Send, Trash2, Filter, Loader2, Phone, Calendar } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/components/ui/StatsGrid";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import ActionButton from "@/components/ui/ActionButton";

export default function ContactsPage({ contacts: initialContacts }) {
    const [contacts, setContacts] = useState(initialContacts);
    const [viewModal, setViewModal] = useState({ open: false, contact: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, contact: null });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleStatusUpdate = async (contact, newStatus) => {
        try {
            const res = await fetch(`/api/contact/${contact.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();

            if (data.success) {
                setContacts(contacts.map(c => c.id === contact.id ? { ...c, status: newStatus } : c));
                if (viewModal.contact?.id === contact.id) {
                    setViewModal({ ...viewModal, contact: { ...viewModal.contact, status: newStatus } });
                }
                toast.success(`Marked as ${newStatus}`);
            } else {
                toast.error(data.message || "Failed to update");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.contact) return;
        setIsProcessing(true);

        try {
            const res = await fetch(`/api/contact/${deleteModal.contact.id}`, { method: "DELETE" });
            const data = await res.json();

            if (data.success) {
                setContacts(contacts.filter(c => c.id !== deleteModal.contact.id));
                toast.success("Message deleted");
                setDeleteModal({ open: false, contact: null });
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    const openViewModal = (contact) => {
        setViewModal({ open: true, contact });
        if (contact.status === "unread") {
            handleStatusUpdate(contact, "read");
        }
    };

    const total = contacts.length;
    const unread = contacts.filter((c) => c.status === "unread").length;
    const read = contacts.filter((c) => c.status === "read").length;
    const replied = contacts.filter((c) => c.status === "replied").length;

    const stats = [
        { icon: Mail, value: total, title: "Total Messages", color: "purple" },
        { icon: AlertCircle, value: unread, title: "Unread", color: "orange" },
        { icon: Eye, value: read, title: "Read", color: "blue" },
        { icon: CheckCircle, value: replied, title: "Replied", color: "green" },
    ];

    const filters = [
        {
            key: "status",
            label: "Status",
            icon: Filter,
            allLabel: "All Status",
            options: [
                { value: "unread", label: "Unread" },
                { value: "read", label: "Read" },
                { value: "replied", label: "Replied" },
            ],
        },
    ];

    const columns = [
        {
            key: "sender",
            label: "Sender",
            render: (contact) => (
                <div className="flex items-center gap-3">
                    <Avatar name={contact.name} />
                    <div>
                        <p className={`font-semibold ${contact.status === "unread" ? "text-gray-900" : "text-gray-700"}`}>{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "subject",
            label: "Subject",
            render: (contact) => (
                <div>
                    <p className={`font-medium ${contact.status === "unread" ? "text-gray-900" : "text-gray-700"}`}>{contact.subject}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 max-w-[250px]">{contact.message}</p>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (contact) => (
                <Badge variant={contact.status === "unread" ? "danger" : contact.status === "read" ? "info" : "success"}>
                    {contact.status}
                </Badge>
            ),
        },
        {
            key: "createdAt",
            label: "Date",
            render: (contact) => (
                <p className="text-sm text-gray-600">{formatDateTime(contact.createdAt)}</p>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (contact) => (
                <div className="flex items-center gap-1">
                    <ActionButton icon={Eye} tooltip="View" variant="info" onClick={() => openViewModal(contact)} />
                    <ActionButton icon={CheckCircle} tooltip="Mark Replied" variant="success" onClick={() => handleStatusUpdate(contact, "replied")} />
                    <ActionButton icon={Trash2} tooltip="Delete" variant="danger" onClick={() => setDeleteModal({ open: true, contact })} />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Contact Messages" subtitle="Manage support inquiries" />

            <StatsGrid stats={stats} />

            <DataTable
                data={contacts}
                columns={columns}
                searchable={true}
                searchKeys={["name", "email", "subject"]}
                searchPlaceholder="Search messages..."
                filters={filters}
                emptyMessage="No messages found"
            />

            {/* View Modal */}
            <Modal isOpen={viewModal.open} onClose={() => setViewModal({ open: false, contact: null })} title="Message Details" size="md">
                {viewModal.contact && (
                    <div className="space-y-4">
                        <div className="flex items-start justify-between pb-4 border-b">
                            <div className="flex items-center gap-3">
                                <Avatar name={viewModal.contact.name} size="lg" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">{viewModal.contact.name}</h3>
                                    <p className="text-sm text-gray-500">{viewModal.contact.email}</p>
                                    {viewModal.contact.phone && (
                                        <p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{viewModal.contact.phone}</p>
                                    )}
                                </div>
                            </div>
                            <Badge variant={viewModal.contact.status === "unread" ? "danger" : viewModal.contact.status === "read" ? "info" : "success"}>
                                {viewModal.contact.status}
                            </Badge>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mb-2"><Calendar className="w-3 h-3" />{formatDateTime(viewModal.contact.createdAt)}</p>
                            <h4 className="font-semibold text-gray-900 mb-2">{viewModal.contact.subject}</h4>
                            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{viewModal.contact.message}</p>
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                            <a href={`mailto:${viewModal.contact.email}?subject=Re: ${viewModal.contact.subject}`} onClick={() => handleStatusUpdate(viewModal.contact, "replied")} className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium cursor-pointer flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" /> Reply via Email
                            </a>
                            <button onClick={() => { setViewModal({ open: false, contact: null }); setDeleteModal({ open: true, contact: viewModal.contact }); }} className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-medium cursor-pointer flex items-center justify-center gap-2">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal.open} onClose={() => !isProcessing && setDeleteModal({ open: false, contact: null })} title="Delete Message" size="sm">
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-gray-600 mb-2">Delete message from</p>
                    <p className="font-semibold text-gray-900 mb-6">"{deleteModal.contact?.name}"?</p>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setDeleteModal({ open: false, contact: null })} disabled={isProcessing}>Cancel</Button>
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
