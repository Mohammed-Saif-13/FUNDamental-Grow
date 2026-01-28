"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Mail, Phone, MapPin, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatDateTime } from "@/lib/utils";

export default function VolunteerDetailPage({ volunteer: initialVolunteer, campaigns }) {
    const [volunteer, setVolunteer] = useState(initialVolunteer);
    const [taskModal, setTaskModal] = useState({ open: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "general",
        priority: "medium",
        campaignId: "",
        dueDate: "",
    });

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/volunteer-tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    volunteerId: volunteer.id,
                    dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Task assigned successfully");
                setTaskModal({ open: false });
                setFormData({
                    title: "",
                    description: "",
                    type: "general",
                    priority: "medium",
                    campaignId: "",
                    dueDate: "",
                });
                // Refresh page to show new task
                window.location.reload();
            } else {
                toast.error(data.message || "Failed to create task");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalTasks = volunteer.tasks.length;
    const completedTasks = volunteer.tasks.filter((t) => t.status === "completed").length;
    const pendingTasks = volunteer.tasks.filter((t) => t.status === "pending").length;
    const inProgressTasks = volunteer.tasks.filter((t) => t.status === "in_progress").length;

    return (
        <div className="space-y-6">
            {/* Back Button + Header */}
            <div>
                <Link href="/admin/volunteers" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Volunteers
                </Link>
                <PageHeader title="Volunteer Details" subtitle={`Manage ${volunteer.name}'s profile and tasks`} />
            </div>

            {/* Volunteer Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Avatar name={volunteer.name} size="xl" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{volunteer.name}</h2>
                            <Badge variant={volunteer.status === "approved" ? "success" : volunteer.status === "rejected" ? "danger" : "warning"}>
                                {volunteer.status}
                            </Badge>
                        </div>
                    </div>
                    <Button onClick={() => setTaskModal({ open: true })}>
                        <Plus className="h-4 w-4" />
                        Assign Task
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{volunteer.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{volunteer.phone}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium text-gray-900">{volunteer.address || "Not specified"}</p>
                        </div>
                    </div>
                </div>

                {volunteer.skills && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-500 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                            {volunteer.skills.split(",").map((skill, i) => (
                                <Badge key={i} variant="primary">
                                    {skill.trim()}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {volunteer.motivation && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-500 mb-2">Motivation</p>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{volunteer.motivation}</p>
                    </div>
                )}
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{totalTasks}</p>
                            <p className="text-sm text-gray-500">Total Tasks</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-xl">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{completedTasks}</p>
                            <p className="text-sm text-gray-500">Completed</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-xl">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{inProgressTasks}</p>
                            <p className="text-sm text-gray-500">In Progress</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gray-100 rounded-xl">
                            <AlertCircle className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{pendingTasks}</p>
                            <p className="text-sm text-gray-500">Pending</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Tasks</h3>

                {volunteer.tasks.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No tasks assigned yet</p>
                ) : (
                    <div className="space-y-3">
                        {volunteer.tasks.map((task) => (
                            <div key={task.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900">{task.title}</h4>
                                            <Badge variant={task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "info"}>
                                                {task.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            {task.campaign && (
                                                <Link href={`/campaigns/${task.campaign.slug}`} className="text-orange-600 hover:underline">
                                                    Campaign: {task.campaign.title}
                                                </Link>
                                            )}
                                            {task.dueDate && (
                                                <span>Due: {new Date(task.dueDate).toLocaleDateString("en-IN")}</span>
                                            )}
                                            <span>Created: {formatDateTime(task.createdAt)}</span>
                                        </div>
                                    </div>
                                    <Badge variant={task.status === "completed" ? "success" : task.status === "in_progress" ? "warning" : "default"}>
                                        {task.status === "completed" ? "Completed" : task.status === "in_progress" ? "In Progress" : "Pending"}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Task Assignment Modal */}
            <Modal isOpen={taskModal.open} onClose={() => !isSubmitting && setTaskModal({ open: false })} title="Assign New Task" size="md">
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Help with campaign promotion"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the task in detail..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="general">General</option>
                                <option value="campaign">Campaign</option>
                                <option value="event">Event</option>
                                <option value="outreach">Outreach</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Related Campaign (Optional)</label>
                        <select
                            value={formData.campaignId}
                            onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="">No campaign</option>
                            {campaigns.map((campaign) => (
                                <option key={campaign.id} value={campaign.id}>
                                    {campaign.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date (Optional)</label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setTaskModal({ open: false })} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {isSubmitting ? "Assigning..." : "Assign Task"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}