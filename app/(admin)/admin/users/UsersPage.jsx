"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Users, Shield, UserCheck, UserX, Eye, Trash2, Filter, Loader2, Mail, Gift, ShieldCheck, ShieldOff } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/components/ui/StatsGrid";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import ActionButton from "@/components/ui/ActionButton";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function UsersPage({ users: initialUsers }) {
    const [users, setUsers] = useState(initialUsers);
    const [detailsModal, setDetailsModal] = useState({ open: false, user: null });
    const [roleModal, setRoleModal] = useState({ open: false, user: null, role: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRoleChange = async () => {
        if (!roleModal.user) return;
        setIsProcessing(true);

        try {
            const res = await fetch(`/api/users/${roleModal.user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: roleModal.role }),
            });
            const data = await res.json();

            if (data.success) {
                setUsers(users.map(u => u.id === roleModal.user.id ? { ...u, role: roleModal.role } : u));
                toast.success(`User role changed to ${roleModal.role}`);
                setRoleModal({ open: false, user: null, role: null });
            } else {
                toast.error(data.message || "Failed to update role");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.user) return;
        setIsProcessing(true);

        try {
            const res = await fetch(`/api/users/${deleteModal.user.id}`, { method: "DELETE" });
            const data = await res.json();

            if (data.success) {
                setUsers(users.filter(u => u.id !== deleteModal.user.id));
                toast.success("User deleted");
                setDeleteModal({ open: false, user: null });
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    const total = users.length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const regularUsers = users.filter((u) => u.role === "USER").length;
    const verified = users.filter((u) => u.emailVerified).length;

    const stats = [
        { icon: Users, value: total, title: "Total Users", color: "purple" },
        { icon: Shield, value: admins, title: "Admins", color: "orange" },
        { icon: UserCheck, value: regularUsers, title: "Regular Users", color: "blue" },
        { icon: Mail, value: verified, title: "Email Verified", color: "green" },
    ];

    const filters = [
        {
            key: "role",
            label: "Role",
            icon: Shield,
            allLabel: "All Roles",
            options: [
                { value: "ADMIN", label: "Admin" },
                { value: "USER", label: "User" },
            ],
        },
    ];

    const columns = [
        {
            key: "user",
            label: "User",
            render: (user) => (
                <div className="flex items-center gap-3">
                    <Avatar name={user.name} src={user.image} />
                    <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="h-3 w-3" />
                            {user.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "role",
            label: "Role",
            render: (user) => (
                <Badge variant={user.role === "ADMIN" ? "warning" : "default"}>
                    {user.role === "ADMIN" ? "Admin" : "User"}
                </Badge>
            ),
        },
        {
            key: "verified",
            label: "Email Status",
            render: (user) => (
                <Badge variant={user.emailVerified ? "success" : "danger"}>
                    {user.emailVerified ? "Verified" : "Not Verified"}
                </Badge>
            ),
        },
        {
            key: "activity",
            label: "Activity",
            render: (user) => (
                <div className="text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                        <Gift className="h-3 w-3" />
                        {user._count.donations} donations
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {user._count.campaigns} campaigns
                    </div>
                </div>
            ),
        },
        {
            key: "createdAt",
            label: "Registered",
            render: (user) => (
                <p className="text-sm text-gray-600">{formatDateTime(user.createdAt)}</p>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (user) => (
                <div className="flex items-center gap-1">
                    <ActionButton icon={Eye} tooltip="View" variant="info" onClick={() => setDetailsModal({ open: true, user })} />
                    <ActionButton
                        icon={user.role === "ADMIN" ? ShieldOff : ShieldCheck}
                        tooltip={user.role === "ADMIN" ? "Remove Admin" : "Make Admin"}
                        variant={user.role === "ADMIN" ? "danger" : "success"}
                        onClick={() => setRoleModal({ open: true, user, role: user.role === "ADMIN" ? "USER" : "ADMIN" })}
                    />
                    <ActionButton icon={Trash2} tooltip="Delete" variant="danger" onClick={() => setDeleteModal({ open: true, user })} />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="User Management" subtitle="View and manage all registered users" />

            <StatsGrid stats={stats} />

            <DataTable
                data={users}
                columns={columns}
                searchable={true}
                searchKeys={["name", "email"]}
                searchPlaceholder="Search by name or email..."
                filters={filters}
                emptyMessage="No users found"
            />

            {/* Details Modal */}
            <Modal isOpen={detailsModal.open} onClose={() => setDetailsModal({ open: false, user: null })} title="User Details" size="md">
                {detailsModal.user && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 pb-4 border-b">
                            <Avatar name={detailsModal.user.name} src={detailsModal.user.image} size="lg" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{detailsModal.user.name}</h3>
                                <p className="text-gray-500">{detailsModal.user.email}</p>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant={detailsModal.user.role === "ADMIN" ? "warning" : "default"}>
                                        {detailsModal.user.role}
                                    </Badge>
                                    <Badge variant={detailsModal.user.emailVerified ? "success" : "danger"}>
                                        {detailsModal.user.emailVerified ? "Verified" : "Not Verified"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Email Verified</p>
                                <p className="font-medium">{detailsModal.user.emailVerified ? formatDateTime(detailsModal.user.emailVerified) : "Not verified"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Registered On</p>
                                <p className="font-medium">{formatDateTime(detailsModal.user.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Total Donations</p>
                                <p className="font-medium">{detailsModal.user._count.donations}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Campaigns Created</p>
                                <p className="font-medium">{detailsModal.user._count.campaigns}</p>
                            </div>
                            {detailsModal.user.volunteer && (
                                <div className="col-span-2">
                                    <p className="text-gray-500">Volunteer Status</p>
                                    <Badge variant={detailsModal.user.volunteer.status === "approved" ? "success" : detailsModal.user.volunteer.status === "rejected" ? "danger" : "warning"}>
                                        {detailsModal.user.volunteer.status}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Role Change Modal */}
            <Modal
                isOpen={roleModal.open}
                onClose={() => !isProcessing && setRoleModal({ open: false, user: null, role: null })}
                title={roleModal.role === "ADMIN" ? "Make Admin" : "Remove Admin"}
                size="sm"
            >
                <div className="text-center">
                    <div className={`w-12 h-12 ${roleModal.role === "ADMIN" ? "bg-orange-100" : "bg-gray-100"} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {roleModal.role === "ADMIN" ? <ShieldCheck className="w-6 h-6 text-orange-600" /> : <ShieldOff className="w-6 h-6 text-gray-600" />}
                    </div>
                    <p className="text-gray-600 mb-2">
                        {roleModal.role === "ADMIN" ? "Make this user an admin?" : "Remove admin privileges?"}
                    </p>
                    <p className="font-semibold text-gray-900 mb-6">"{roleModal.user?.name}"</p>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setRoleModal({ open: false, user: null, role: null })} disabled={isProcessing}>Cancel</Button>
                        <button
                            onClick={handleRoleChange}
                            disabled={isProcessing}
                            className={`flex-1 px-4 py-2 ${roleModal.role === "ADMIN" ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-500 hover:bg-gray-600"} text-white rounded-lg font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2`}
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isProcessing ? "Processing..." : "Confirm"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal.open} onClose={() => !isProcessing && setDeleteModal({ open: false, user: null })} title="Delete User" size="sm">
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-gray-600 mb-2">Delete this user permanently?</p>
                    <p className="font-semibold text-gray-900 mb-2">"{deleteModal.user?.name}"</p>
                    <p className="text-sm text-red-500 mb-6">This will also delete all their donations and campaigns.</p>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setDeleteModal({ open: false, user: null })} disabled={isProcessing}>Cancel</Button>
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