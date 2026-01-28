"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Flame, Clock } from "lucide-react";
import { memo } from "react";
import { formatCurrency, calculateProgress, daysLeft } from "@/lib/utils";

const CampaignCard = ({ campaign, viewMode = "grid" }) => {
    const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
    const days = daysLeft(campaign.endDate);
    const isUrgent = days !== null && days > 0 && days <= 7;
    const isTrending = campaign._count?.donations > 10;

    const imageUrl = campaign.image || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80";

    return (
        <Link href={`/campaigns/${campaign.slug}`} className="block">
            <article className={`group bg-white overflow-hidden border border-gray-100 shadow-sm transition-shadow duration-300 hover:shadow-xl ${viewMode === "grid"
                    ? "rounded-xl sm:rounded-2xl supports-hover:hover:-translate-y-1"
                    : "rounded-xl flex flex-col sm:flex-row"
                }`}>
                <div className={`relative overflow-hidden bg-gray-100 ${viewMode === "grid" ? "h-40 sm:h-48" : "h-48 sm:h-auto sm:w-64"
                    }`}>
                    {/* Image and badges - same as before */}
                    <Image
                        src={imageUrl}
                        alt={campaign.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
                    />
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 sm:px-3 sm:py-1 bg-orange-50/90 backdrop-blur-sm text-orange-600 rounded-full text-xs font-semibold">
                        {campaign.category}
                    </span>

                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1">
                        {isTrending && (
                            <span className="px-2 py-0.5 bg-red-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold rounded-full flex items-center gap-1">
                                <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                Trending
                            </span>
                        )}
                        {isUrgent && (
                            <span className="px-2 py-0.5 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold rounded-full flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                {days}d left
                            </span>
                        )}
                    </div>
                </div>

                <div className={viewMode === "grid" ? "p-4 sm:p-5" : "p-4 sm:p-5 flex-1"}>
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2 line-clamp-1 transition-colors group-hover:text-orange-500">
                        {campaign.title}
                    </h3>

                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
                        {campaign.description}
                    </p>

                    <div className="mb-3 sm:mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-base sm:text-lg font-bold text-gray-900">
                                {formatCurrency(campaign.raisedAmount)}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold text-orange-500">
                                {progress}%
                            </span>
                        </div>

                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">
                            Goal: {formatCurrency(campaign.goalAmount)}
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 sm:pt-4 border-t border-gray-100 gap-2">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="truncate">{days !== null ? (days > 0 ? `${days}d left` : "Ended") : "No deadline"}</span>
                        </span>
                        {campaign.location && (
                            <span className="flex items-center gap-1 truncate max-w-[100px] sm:max-w-[120px]">
                                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                <span className="truncate">{campaign.location}</span>
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default memo(
    CampaignCard,
    (prev, next) =>
        prev.campaign.id === next.campaign.id &&
        prev.campaign.raisedAmount === next.campaign.raisedAmount &&
        prev.campaign.goalAmount === next.campaign.goalAmount &&
        prev.campaign.endDate === next.campaign.endDate
);