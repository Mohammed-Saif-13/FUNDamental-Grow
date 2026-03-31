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
    ExternalLink,
    Loader2,
    Shield,
    LogOut,
    FileText,
    ChevronRight,
    Sparkles,
    Clock,
} from "lucide-react";
import { signOut } from "next-auth/react";

import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

// ─────────────────────────────────────────────────────────────────
// Zod Schemas
// ─────────────────────────────────────────────────────────────────
const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
});

const updateSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
    content: z.string().min(20, "Content must be at least 20 characters").max(2000, "Content too long"),
});

// ─────────────────────────────────────────────────────────────────
// Progress Bar
// ─────────────────────────────────────────────────────────────────
function ProgressBar({ value, max }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-500 transition-all duration-700"
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        completed: "bg-blue-50 text-blue-700 border-blue-200",
        pending: "bg-amber-50 text-amber-700 border-amber-200",
        rejected: "bg-red-50 text-red-700 border-red-200",
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status] || map.pending}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-emerald-500 animate-pulse" : "bg-current opacity-60"}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────────
// Main Profile Page
// ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState("donations");
    const [updateModal, setUpdateModal] = useState({ open: false, campaign: null });
    const [isPostingUpdate, setIsPostingUpdate] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(profileSchema),
    });

    const {
        register: registerUpdate,
        handleSubmit: handleSubmitUpdate,
        reset: resetUpdate,
        formState: { errors: updateErrors },
    } = useForm({ resolver: zodResolver(updateSchema) });

    // Redirect if not logged in
    useEffect(() => {
        if (status === "unauthenticated") {
            toast.error("Please login to view your profile");
            router.push("/login?callbackUrl=/profile");
        }
    }, [status, router]);

    // ── Fetch profile ──────────────────────────────────────────
    // ROOT CAUSE FIX: API successResponse wraps data inside `data` key
    // response shape: { success: true, message: "Success", data: { ...user } }
    // Previous code read `json.user` which was undefined — now reads `json.data`
    const fetchProfile = useCallback(async () => {
        try {
            const res = await fetch("/api/user/profile");
            const json = await res.json();

            // Support both response shapes just in case
            const user = json?.data ?? json?.user ?? null;

            if (json?.success && user) {
                setProfileData(user);
                reset({ name: user.name || "" });
            } else {
                toast.error(json?.message || "Failed to load profile");
            }
        } catch {
            toast.error("Failed to load profile");
        } finally {
            setIsLoading(false);
        }
    }, [reset]);

    useEffect(() => {
        if (session?.user) fetchProfile();
    }, [session, fetchProfile]);

    // ── Save profile ───────────────────────────────────────────
    const onSubmit = async (formData) => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formData.name }),
            });
            const json = await res.json();
            const updatedUser = json?.data ?? json?.user ?? null;

            if (json?.success && updatedUser) {
                toast.success("Profile updated successfully!");
                // PUT only returns basic fields; merge to preserve donations/campaigns
                setProfileData((prev) => ({ ...prev, ...updatedUser }));
                reset({ name: updatedUser.name });
                setIsEditing(false);
                await update({ name: updatedUser.name });
            } else {
                toast.error(json?.message || "Failed to update profile");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        reset({ name: profileData?.name || "" });
    };

    // ── Post campaign update ────────────────────────────────────
    const onPostUpdate = async (formData) => {
        if (!updateModal.campaign) return;
        setIsPostingUpdate(true);
        try {
            const res = await fetch(`/api/campaigns/${updateModal.campaign.id}/updates`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const json = await res.json();
            if (json?.success) {
                toast.success("Update posted successfully!");
                setUpdateModal({ open: false, campaign: null });
                resetUpdate();
                fetchProfile();
            } else {
                toast.error(json?.message || "Failed to post update");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsPostingUpdate(false);
        }
    };

    const openUpdateModal = (campaign) => { setUpdateModal({ open: true, campaign }); resetUpdate(); };
    const closeUpdateModal = () => {
        if (!isPostingUpdate) {
            setUpdateModal({ open: false, campaign: null });
            resetUpdate();
        }
    };

    // ── Loading state ──────────────────────────────────────────
    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center animate-pulse">
                        <Heart className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Loading your profile…</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    // ── Derived values ─────────────────────────────────────────
    const donationCount = profileData?.donations?.length || 0;
    const campaignCount = profileData?.campaigns?.length || 0;

    // Always show something — fallback to session data
    const displayName = profileData?.name || session?.user?.name || "—";
    const displayEmail = profileData?.email || session?.user?.email || "—";
    const memberSince = profileData?.createdAt
        ? new Date(profileData.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
        : new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

    // ── Render ─────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#faf9f7]">

            {/* ── Hero Banner ─────────────────────────────────── */}
            <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600" />
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                        backgroundSize: "128px",
                    }}
                />
                <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 border border-white/10" />
                <div className="absolute -bottom-24 -left-10 w-56 h-56 rounded-full bg-white/5 border border-white/10" />
                <div className="absolute bottom-6 left-6 sm:left-10">
                    <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-1">Your Impact</p>
                    <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight drop-shadow">Profile</h1>
                </div>
            </div>

            <Container>
                <div className="relative -mt-14 sm:-mt-16 pb-16 space-y-5">

                    {/* ── Profile Card ────────────────────────── */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-5">

                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-white shadow-lg overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
                                        {profileData?.image
                                            ? <img src={profileData.image} alt={displayName} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center"><User className="w-10 h-10 text-orange-400" /></div>
                                        }
                                    </div>
                                    <button className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform duration-200">
                                        <Camera className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Name / Email / Since — NO member badge */}
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight truncate mb-1">
                                        {displayName}
                                    </h2>
                                    <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        {displayEmail}
                                    </p>
                                    <p className="flex items-center gap-1 text-xs text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        Member since {memberSince}
                                    </p>
                                </div>

                                {/* Edit / Logout */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Logout</span>
                                    </button>
                                </div>
                            </div>

                            {/* 2-stat grid */}
                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <div className="relative overflow-hidden rounded-2xl p-5 border border-rose-100 bg-rose-50/60">
                                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-rose-200 opacity-20" />
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-rose-100 mb-3">
                                        <Heart className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <p className="text-2xl font-bold tracking-tight text-rose-600">{donationCount}</p>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5 uppercase tracking-wider">Donations Made</p>
                                </div>
                                <div className="relative overflow-hidden rounded-2xl p-5 border border-blue-100 bg-blue-50/60">
                                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-blue-200 opacity-20" />
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 mb-3">
                                        <Megaphone className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="text-2xl font-bold tracking-tight text-blue-600">{campaignCount}</p>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5 uppercase tracking-wider">Campaigns Created</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Edit Profile Form ────────────────────── */}
                    {isEditing && (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <Edit2 className="w-4 h-4 text-orange-600" />
                                </div>
                                <h3 className="font-bold text-gray-900">Edit Profile</h3>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Name — editable, pre-filled with current value */}
                                    <Input
                                        label="Full Name"
                                        icon={User}
                                        error={errors.name?.message}
                                        defaultValue={profileData?.name || ""}
                                        {...register("name")}
                                    />
                                    {/* Email — static display, not a form field */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed">
                                            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                                            <span className="truncate">{displayEmail}</span>
                                        </div>
                                        <p className="text-xs text-gray-400">Email cannot be changed</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <Button type="submit" disabled={isSaving} className="cursor-pointer">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {isSaving ? "Saving…" : "Save Changes"}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={cancelEdit} className="cursor-pointer">
                                        <X className="w-4 h-4" /> Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ── Tabs ─────────────────────────────────── */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                        <div className="flex border-b border-gray-100 bg-gray-50/60">
                            {[
                                { id: "donations", label: "My Donations", icon: Heart, count: donationCount },
                                { id: "campaigns", label: "My Campaigns", icon: Megaphone, count: campaignCount },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition-colors cursor-pointer ${activeTab === tab.id
                                            ? "text-orange-600 bg-white"
                                            : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${activeTab === tab.id ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-500"
                                        }`}>
                                        {tab.count}
                                    </span>
                                    {activeTab === tab.id && (
                                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-orange-400 to-rose-500 rounded-t-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="p-5 sm:p-6">

                            {/* Donations Tab */}
                            {activeTab === "donations" && (
                                <div className="space-y-3">
                                    {profileData?.donations?.length > 0 ? (
                                        profileData.donations.map((donation) => (
                                            <div
                                                key={donation.id}
                                                className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 transition-all"
                                            >
                                                <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center">
                                                    <Heart className="w-4 h-4 text-rose-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Link
                                                        href={`/campaigns/${donation.campaign?.slug}`}
                                                        className="font-semibold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1 text-sm"
                                                    >
                                                        {donation.campaign?.title}
                                                    </Link>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className="flex items-center gap-1 text-xs text-gray-400">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(donation.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                        </span>
                                                        {donation.anonymous && (
                                                            <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-medium">
                                                                <Shield className="w-3 h-3" /> Anonymous
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-bold text-emerald-600">
                                                        ₹{donation.amount.toLocaleString("en-IN")}
                                                    </span>
                                                    <Link
                                                        href={`/campaigns/${donation.campaign?.slug}`}
                                                        className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
                                                <Heart className="w-8 h-8 text-rose-300" />
                                            </div>
                                            <p className="font-semibold text-gray-700 mb-1">No donations yet</p>
                                            <p className="text-sm text-gray-400 mb-6">Make your first impact today</p>
                                            <Link href="/campaigns">
                                                <Button className="cursor-pointer">
                                                    <Sparkles className="w-4 h-4" /> Browse Campaigns
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Campaigns Tab */}
                            {activeTab === "campaigns" && (
                                <div className="space-y-4">
                                    {profileData?.campaigns?.length > 0 ? (
                                        profileData.campaigns.map((campaign) => {
                                            const pct = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
                                            return (
                                                <div
                                                    key={campaign.id}
                                                    className="group rounded-2xl border border-gray-100 hover:border-orange-200 overflow-hidden transition-all hover:shadow-md"
                                                >
                                                    <div className="flex flex-col sm:flex-row">
                                                        {campaign.image && (
                                                            <div className="sm:w-40 md:w-48 h-40 sm:h-auto shrink-0 overflow-hidden">
                                                                <img
                                                                    src={campaign.image}
                                                                    alt={campaign.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 p-5">
                                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                                <Link
                                                                    href={`/campaigns/${campaign.slug}`}
                                                                    className="font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2 text-base leading-snug"
                                                                >
                                                                    {campaign.title}
                                                                </Link>
                                                                <StatusBadge status={campaign.status} />
                                                            </div>

                                                            <div className="mb-3">
                                                                <div className="flex items-center justify-between text-sm mb-1.5">
                                                                    <span className="font-bold text-orange-600">₹{campaign.raisedAmount.toLocaleString("en-IN")}</span>
                                                                    <span className="text-gray-400 text-xs">
                                                                        of ₹{campaign.goalAmount.toLocaleString("en-IN")} ·{" "}
                                                                        <span className="font-semibold text-gray-600">{pct.toFixed(0)}%</span>
                                                                    </span>
                                                                </div>
                                                                <ProgressBar value={campaign.raisedAmount} max={campaign.goalAmount} />
                                                            </div>

                                                            <div className="flex items-center justify-between mt-3">
                                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                                    <span className="flex items-center gap-1">
                                                                        <Heart className="w-3 h-3" />
                                                                        {campaign._count?.donations || 0} donors
                                                                    </span>
                                                                    <span>•</span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" />
                                                                        {new Date(campaign.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Link
                                                                        href={`/campaigns/${campaign.slug}`}
                                                                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-orange-100 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors"
                                                                    >
                                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                                    </Link>
                                                                    {campaign.status === "active" && (
                                                                        <button
                                                                            onClick={() => openUpdateModal(campaign)}
                                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer border border-orange-200"
                                                                        >
                                                                            <FileText className="w-3 h-3" /> Post Update
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                                                <Megaphone className="w-8 h-8 text-orange-300" />
                                            </div>
                                            <p className="font-semibold text-gray-700 mb-1">No campaigns yet</p>
                                            <p className="text-sm text-gray-400 mb-6">Start something meaningful today</p>
                                            <Link href="/start-fundraiser">
                                                <Button className="cursor-pointer">
                                                    <Sparkles className="w-4 h-4" /> Start a Fundraiser
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>

            {/* ── Post Campaign Update Modal ───────────────────── */}
            <Modal isOpen={updateModal.open} onClose={closeUpdateModal} title="Post Campaign Update" size="md">
                {updateModal.campaign && (
                    <div>
                        <div className="flex items-center gap-3 mb-5 p-3 bg-orange-50 rounded-xl border border-orange-100">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                <Megaphone className="w-4 h-4 text-orange-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-orange-600 font-medium">Posting update for</p>
                                <p className="font-semibold text-gray-900 text-sm truncate">{updateModal.campaign.title}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitUpdate(onPostUpdate)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Update Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., We reached 50% of our goal!"
                                    {...registerUpdate("title")}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all ${updateErrors.title ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"
                                        }`}
                                />
                                {updateErrors.title && (
                                    <p className="mt-1.5 text-xs text-red-600 font-medium">{updateErrors.title.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Update Content <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    placeholder="Share the latest news about your campaign…"
                                    rows={5}
                                    {...registerUpdate("content")}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all resize-none ${updateErrors.content ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"
                                        }`}
                                />
                                {updateErrors.content && (
                                    <p className="mt-1.5 text-xs text-red-600 font-medium">{updateErrors.content.message}</p>
                                )}
                            </div>
                            <div className="flex gap-3 pt-1">
                                <Button type="button" variant="outline" onClick={closeUpdateModal} disabled={isPostingUpdate} className="flex-1 cursor-pointer">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPostingUpdate} className="flex-1 cursor-pointer">
                                    {isPostingUpdate
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting…</>
                                        : <><FileText className="w-4 h-4" /> Post Update</>
                                    }
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </div>
    );
}