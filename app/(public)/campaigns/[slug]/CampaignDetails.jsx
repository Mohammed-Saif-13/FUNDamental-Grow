"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Heart,
    Share2,
    Calendar,
    MapPin,
    User,
    Copy,
    Facebook,
    Twitter,
    Mail,
    CheckCircle,
    Clock,
} from "lucide-react";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";
import CampaignCard from "@/components/public/campaigns/CampaignCard";
import DonorWall from "@/components/public/campaigns/DonorWall";
import ProgressMilestones from "@/components/public/campaigns/ProgressMilestones";
import FAQAccordion from "@/components/public/campaigns/FAQAccordion";
import { formatCurrency, formatDate, calculateProgress, daysLeft } from "@/lib/utils";

const Tab = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        role="tab"
        aria-selected={active}
        className={`px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-sm transition-all relative ${active ? "text-orange-500" : "text-gray-500 hover:text-gray-700"
            }`}
    >
        {children}
        {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />}
    </button>
);

const UpdateItem = ({ update }) => (
    <div className="p-3 sm:p-4 border border-gray-100 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
            <span className="text-xs sm:text-sm text-gray-500">{formatDate(update.createdAt)}</span>
        </div>
        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">{update.title}</h4>
        <p className="text-gray-600 text-xs sm:text-sm">{update.content}</p>
    </div>
);

const ShareButton = ({ icon: Icon, label, onClick, className }) => (
    <button
        onClick={onClick}
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${className}`}
        title={label}
        aria-label={label}
    >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
);

export default function CampaignDetails({ campaign, similarCampaigns }) {
    const [activeTab, setActiveTab] = useState("about");
    const [copied, setCopied] = useState(false);

    const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
    const days = daysLeft(campaign.endDate);
    const isExpired = days !== null && days <= 0;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    const handleCopyLink = useCallback(() => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [shareUrl]);

    const handleShare = useCallback(
        (platform) => {
            const text = `Support "${campaign.title}" on FUNDamental Grow`;
            const urls = {
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
                email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(shareUrl)}`,
            };
            window.open(urls[platform], "_blank", "noopener,noreferrer");
        },
        [campaign.title, shareUrl]
    );

    const imageUrl = campaign.image || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button */}
            <div className="bg-white border-b border-gray-100">
                <Container>
                    <div className="py-3 sm:py-4">
                        <Link
                            href="/campaigns"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back to Campaigns</span>
                        </Link>
                    </div>
                </Container>
            </div>

            <Container className="py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Campaign Image */}
                        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden">
                            <Image
                                src={imageUrl}
                                alt={campaign.title}
                                width={800}
                                height={500}
                                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                                priority
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
                            />
                            {campaign.featured && (
                                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 sm:px-3 sm:py-1 bg-orange-500 text-white text-xs sm:text-sm font-medium rounded-full flex items-center gap-1">
                                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-white" />
                                    <span>Featured</span>
                                </div>
                            )}
                            {isExpired && (
                                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 sm:px-3 sm:py-1 bg-red-500 text-white text-xs sm:text-sm font-medium rounded-full">
                                    Campaign Ended
                                </div>
                            )}
                        </div>

                        {/* Campaign Header */}
                        <div>
                            <span className="inline-block px-2.5 py-1 sm:px-3 sm:py-1 bg-orange-100 text-orange-600 text-xs sm:text-sm font-medium rounded-full mb-2 sm:mb-3">
                                {campaign.category}
                            </span>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                                {campaign.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="truncate">by {campaign.organizerName}</span>
                                </span>
                                {campaign.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="truncate">{campaign.location}</span>
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    {formatDate(campaign.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* Tabs - About/Updates */}
                        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden">
                            <div role="tablist" className="flex border-b border-gray-100">
                                <Tab active={activeTab === "about"} onClick={() => setActiveTab("about")}>
                                    About
                                </Tab>
                                <Tab active={activeTab === "updates"} onClick={() => setActiveTab("updates")}>
                                    Updates ({campaign.updates?.length || 0})
                                </Tab>
                            </div>

                            <div className="p-4 sm:p-6">
                                {activeTab === "about" && (
                                    <div role="tabpanel" className="prose prose-gray max-w-none">
                                        <p className="text-sm sm:text-base text-gray-600 whitespace-pre-line leading-relaxed">
                                            {campaign.description}
                                        </p>

                                        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-xl">
                                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3">Organizer</h3>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-base sm:text-lg font-bold text-orange-500">
                                                        {campaign.organizerName?.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                                        {campaign.organizerName}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                                                        {campaign.organizerEmail}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "updates" && (
                                    <div role="tabpanel" className="space-y-3 sm:space-y-4">
                                        {campaign.updates?.length > 0 ? (
                                            campaign.updates.map((update) => <UpdateItem key={update.id} update={update} />)
                                        ) : (
                                            <div className="text-center py-8 sm:py-12">
                                                <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500 text-sm">No updates yet</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Donor Wall */}
                        <DonorWall donations={campaign.donations} totalDonors={campaign._count?.donations || 0} />

                        {/* FAQ Section */}
                        <FAQAccordion />
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 sm:top-24 space-y-4 sm:space-y-6">
                            {/* Donation Card */}
                            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
                                <div className="mb-4 sm:mb-6">
                                    <div className="flex items-end justify-between mb-2">
                                        <div>
                                            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                                                {formatCurrency(campaign.raisedAmount)}
                                            </span>
                                            <span className="text-gray-500 text-xs sm:text-sm ml-1">raised</span>
                                        </div>
                                        <span className="text-base sm:text-lg font-semibold text-orange-500">{progress}%</span>
                                    </div>

                                    <div className="h-2.5 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">
                                        Goal: {formatCurrency(campaign.goalAmount)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <div className="text-center p-2.5 sm:p-3 bg-gray-50 rounded-xl">
                                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                                            {campaign._count?.donations || 0}
                                        </p>
                                        <p className="text-xs text-gray-500">Donors</p>
                                    </div>
                                    <div className="text-center p-2.5 sm:p-3 bg-gray-50 rounded-xl">
                                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                                            {days !== null ? (days > 0 ? days : 0) : "∞"}
                                        </p>
                                        <p className="text-xs text-gray-500">Days Left</p>
                                    </div>
                                </div>

                                {isExpired ? (
                                    <Button size="lg" className="w-full" disabled>
                                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Campaign Ended
                                    </Button>
                                ) : (
                                    <Link href={`/donate/${campaign.slug}`}>
                                        <Button size="lg" className="w-full cursor-pointer">
                                            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                            Donate Now
                                        </Button>
                                    </Link>
                                )}

                                <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4 text-green-600">
                                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium">Verified Campaign</span>
                                </div>
                            </div>

                            {/* Progress Milestones */}
                            <ProgressMilestones raisedAmount={campaign.raisedAmount} goalAmount={campaign.goalAmount} />

                            {/* Share Campaign */}
                            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6">
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
                                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Share Campaign
                                </h3>

                                <div className="flex items-center gap-2">
                                    <ShareButton
                                        icon={Facebook}
                                        label="Facebook"
                                        onClick={() => handleShare("facebook")}
                                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer"
                                    />
                                    <ShareButton
                                        icon={Twitter}
                                        label="Twitter"
                                        onClick={() => handleShare("twitter")}
                                        className="bg-sky-100 text-sky-600 hover:bg-sky-200 cursor-pointer"
                                    />
                                    <ShareButton
                                        icon={Mail}
                                        label="Email"
                                        onClick={() => handleShare("email")}
                                        className="bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                                    />
                                    <ShareButton
                                        icon={copied ? CheckCircle : Copy}
                                        label="Copy Link"
                                        onClick={handleCopyLink}
                                        className={`cursor-pointer ${copied ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    />
                                </div>

                                {copied && <p className="text-xs sm:text-sm text-green-600 mt-2 text-center">Link copied!</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Campaigns */}
                {similarCampaigns.length > 0 && (
                    <div className="mt-12 sm:mt-16">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Similar Campaigns</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {similarCampaigns.map((c) => (
                                <CampaignCard
                                    key={c.id}
                                    campaign={{
                                        ...c,
                                        goalAmount: typeof c.goalAmount === 'number' && c.goalAmount > 100000
                                            ? Math.floor(c.goalAmount / 100)
                                            : c.goalAmount,
                                        raisedAmount: typeof c.raisedAmount === 'number' && c.raisedAmount > 100000
                                            ? Math.floor(c.raisedAmount / 100)
                                            : c.raisedAmount,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
}