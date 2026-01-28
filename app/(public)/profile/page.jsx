"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
    User,
    Mail,
    Camera,
    Edit2,
    Save,
    X,
    Heart,
    Megaphone,
    Calendar,
    IndianRupee,
    ExternalLink,
    Loader2,
    Shield,
    LogOut,
    Plus,
    FileText,
    Bell,
    Trash2,
} from "lucide-react";
import { signOut } from "next-auth/react";

import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { formatCurrency, formatDate } from "@/lib/utils";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
});

const updateSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
    content: z.string().min(20, "Content must be at least 20 characters").max(2000, "Content too long"),
});

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState("donations");

    // Update modal state
    const [updateModal, setUpdateModal] = useState({ open: false, campaign: null });
    const [isPostingUpdate, setIsPostingUpdate] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
    });

    const {
        register: registerUpdate,
        handleSubmit: handleSubmitUpdate,
        reset: resetUpdate,
        formState: { errors: updateErrors },
    } = useForm({
        resolver: zodResolver(updateSchema),
    });

    // Redirect if not logged in
    useEffect(() => {
        if (status === "unauthenticated") {
            toast.error("Please login to view your profile");
            router.push("/login?callbackUrl=/profile");
        }
    }, [status, router]);

    // Fetch profile data
    const fetchProfile = useCallback(async () => {
        try {
            const res = await fetch("/api/user/profile");
            const data = await res.json();
            if (data.success) {
                setProfileData(data.user);
                reset({
                    name: data.user.name,
                    email: data.user.email,
                });
            }
        } catch {
            toast.error("Failed to load profile");
        } finally {
            setIsLoading(false);
        }
    }, [reset]);

    useEffect(() => {
        if (session?.user) {
            fetchProfile();
        }
    }, [session, fetchProfile]);

    const onSubmit = async (formData) => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Profile updated successfully!");
                setProfileData(data.user);
                setIsEditing(false);
                // Update session
                await update({ name: formData.name });
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        reset({
            name: profileData?.name,
            email: profileData?.email,
        });
    };

    // Post campaign update
    const onPostUpdate = async (formData) => {
        if (!updateModal.campaign) return;
        setIsPostingUpdate(true);

        try {
            const res = await fetch(`/api/campaigns/${updateModal.campaign.id}/updates`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Update posted successfully!");
                setUpdateModal({ open: false, campaign: null });
                resetUpdate();
                fetchProfile(); // Refresh to get updated campaigns
            } else {
                toast.error(data.message || "Failed to post update");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsPostingUpdate(false);
        }
    };

    const openUpdateModal = (campaign) => {
        setUpdateModal({ open: true, campaign });
        resetUpdate();
    };

    const closeUpdateModal = () => {
        if (!isPostingUpdate) {
            setUpdateModal({ open: false, campaign: null });
            resetUpdate();
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!session) return null;

    const totalDonated = profileData?.donations?.reduce((sum, d) => sum + d.amount, 0) || 0;
    const totalRaised = profileData?.campaigns?.reduce((sum, c) => sum + c.raisedAmount, 0) || 0;

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
            <Container>
                {/* Profile Header */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden mb-6 sm:mb-8">
                    {/* Cover Banner */}
                    <div className="h-24 sm:h-32 md:h-40 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

                    <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
                        {/* Avatar & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-16">
                            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-white p-1 shadow-lg">
                                        {profileData?.image ? (
                                            <img
                                                src={profileData.image}
                                                alt={profileData.name}
                                                className="w-full h-full rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-xl bg-orange-100 flex items-center justify-center">
                                                <User className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
                                            </div>
                                        )}
                                    </div>
                                    <button className="absolute bottom-1 right-1 w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Name & Email */}
                                <div className="mt-2 sm:mt-0 sm:mb-2">
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                                        {profileData?.name}
                                    </h1>
                                    <p className="text-sm sm:text-base text-gray-500 flex items-center gap-1.5">
                                        <Mail className="w-4 h-4" />
                                        {profileData?.email}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-0">
                                {!isEditing ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(true)}
                                        className="cursor-pointer"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </Button>
                                ) : null}
                                <Button
                                    variant="outline"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="cursor-pointer text-red-500 border-red-200 hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </Button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
                            <div className="p-3 sm:p-4 bg-orange-50 rounded-xl">
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600">
                                    {formatCurrency(totalDonated)}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">Total Donated</p>
                            </div>
                            <div className="p-3 sm:p-4 bg-green-50 rounded-xl">
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                                    {profileData?.donations?.length || 0}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">Donations Made</p>
                            </div>
                            <div className="p-3 sm:p-4 bg-blue-50 rounded-xl">
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                                    {profileData?.campaigns?.length || 0}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">Campaigns Created</p>
                            </div>
                            <div className="p-3 sm:p-4 bg-purple-50 rounded-xl">
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                                    {formatCurrency(totalRaised)}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">Total Raised</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                {isEditing && (
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Edit Profile
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <Input
                                    label="Full Name"
                                    icon={User}
                                    error={errors.name?.message}
                                    {...register("name")}
                                />
                                <Input
                                    label="Email Address"
                                    icon={Mail}
                                    type="email"
                                    error={errors.email?.message}
                                    disabled
                                    {...register("email")}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button type="submit" disabled={isSaving} className="cursor-pointer">
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={cancelEdit}
                                    className="cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden">
                    {/* Tab Headers */}
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab("donations")}
                            className={`flex-1 px-4 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors ${
                                activeTab === "donations"
                                    ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50/50"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <Heart className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                            My Donations
                        </button>
                        <button
                            onClick={() => setActiveTab("campaigns")}
                            className={`flex-1 px-4 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors ${
                                activeTab === "campaigns"
                                    ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50/50"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <Megaphone className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                            My Campaigns
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 sm:p-6">
                        {activeTab === "donations" && (
                            <div className="space-y-3 sm:space-y-4">
                                {profileData?.donations?.length > 0 ? (
                                    profileData.donations.map((donation) => (
                                        <div
                                            key={donation.id}
                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-xl gap-3"
                                        >
                                            <div className="flex-1">
                                                <Link
                                                    href={`/campaigns/${donation.campaign?.slug}`}
                                                    className="font-medium text-gray-900 hover:text-orange-600 transition-colors line-clamp-1"
                                                >
                                                    {donation.campaign?.title}
                                                </Link>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(donation.createdAt).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                    {donation.anonymous && (
                                                        <span className="flex items-center gap-1 text-orange-600">
                                                            <Shield className="w-3.5 h-3.5" />
                                                            Anonymous
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                                <span className="text-lg sm:text-xl font-bold text-green-600 flex items-center">
                                                    <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    {donation.amount.toLocaleString("en-IN")}
                                                </span>
                                                <Link
                                                    href={`/campaigns/${donation.campaign?.slug}`}
                                                    className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 sm:py-12">
                                        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 mb-4">You haven't made any donations yet</p>
                                        <Link href="/campaigns">
                                            <Button className="cursor-pointer">
                                                Browse Campaigns
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "campaigns" && (
                            <div className="space-y-3 sm:space-y-4">
                                {profileData?.campaigns?.length > 0 ? (
                                    profileData.campaigns.map((campaign) => (
                                        <div
                                            key={campaign.id}
                                            className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl"
                                        >
                                            {campaign.image && (
                                                <img
                                                    src={campaign.image}
                                                    alt={campaign.title}
                                                    className="w-full sm:w-24 h-32 sm:h-24 rounded-lg object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <Link
                                                        href={`/campaigns/${campaign.slug}`}
                                                        className="font-medium text-gray-900 hover:text-orange-600 transition-colors line-clamp-1"
                                                    >
                                                        {campaign.title}
                                                    </Link>
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                        campaign.status === "active"
                                                            ? "bg-green-100 text-green-700"
                                                            : campaign.status === "completed"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                        {campaign.status}
                                                    </span>
                                                </div>

                                                {/* Progress */}
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between text-sm mb-1">
                                                        <span className="font-medium text-orange-600">
                                                            {formatCurrency(campaign.raisedAmount)}
                                                        </span>
                                                        <span className="text-gray-500">
                                                            of {formatCurrency(campaign.goalAmount)}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                                                            style={{
                                                                width: `${Math.min(
                                                                    (campaign.raisedAmount / campaign.goalAmount) * 100,
                                                                    100
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <span>{campaign._count?.donations || 0} donations</span>
                                                        <span>•</span>
                                                        <span>
                                                            {new Date(campaign.createdAt).toLocaleDateString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                            })}
                                                        </span>
                                                    </div>
                                                    {campaign.status === "active" && (
                                                        <button
                                                            onClick={() => openUpdateModal(campaign)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <FileText className="w-3.5 h-3.5" />
                                                            Post Update
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 sm:py-12">
                                        <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 mb-4">You haven't created any campaigns yet</p>
                                        <Link href="/start-fundraiser">
                                            <Button className="cursor-pointer">
                                                Start a Fundraiser
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Post Update Modal */}
                <Modal
                    isOpen={updateModal.open}
                    onClose={closeUpdateModal}
                    title="Post Campaign Update"
                    size="md"
                >
                    {updateModal.campaign && (
                        <div>
                            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500">Posting update for:</p>
                                <p className="font-medium text-gray-900">{updateModal.campaign.title}</p>
                            </div>

                            <form onSubmit={handleSubmitUpdate(onPostUpdate)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Update Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., We reached 50% of our goal!"
                                        {...registerUpdate("title")}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                                            updateErrors.title ? "border-red-300 bg-red-50" : "border-gray-200"
                                        }`}
                                    />
                                    {updateErrors.title && (
                                        <p className="mt-1 text-sm text-red-600">{updateErrors.title.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Update Content <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        placeholder="Share the latest news about your campaign..."
                                        rows={5}
                                        {...registerUpdate("content")}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none ${
                                            updateErrors.content ? "border-red-300 bg-red-50" : "border-gray-200"
                                        }`}
                                    />
                                    {updateErrors.content && (
                                        <p className="mt-1 text-sm text-red-600">{updateErrors.content.message}</p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeUpdateModal}
                                        disabled={isPostingUpdate}
                                        className="flex-1 cursor-pointer"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isPostingUpdate}
                                        className="flex-1 cursor-pointer"
                                    >
                                        {isPostingUpdate ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Posting...
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="w-4 h-4" />
                                                Post Update
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </Modal>
            </Container>
        </div>
    );
}
