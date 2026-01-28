"use client";

import { User, Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { timeAgo } from "@/lib/utils/format";
import { useState } from "react";

function DonorItem({ donation }) {
    const initial = donation.anonymous
        ? "?"
        : donation.donorName?.charAt(0)?.toUpperCase() || "A";

    const name = donation.anonymous ? "Anonymous" : donation.donorName;

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${donation.anonymous
                ? "bg-gray-100 text-gray-400"
                : "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                }`}>
                <span className="font-semibold text-sm">{initial}</span>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm truncate">{name}</p>
                    {donation.anonymous && (
                        <EyeOff className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    )}
                </div>
                <p className="text-xs text-gray-500">{timeAgo(donation.createdAt)}</p>
            </div>

            <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm text-orange-600">
                    {formatCurrency(donation.amount)}
                </p>
            </div>
        </div>
    );
}

export default function DonorWall({ donations, totalDonors }) {
    const [showAll, setShowAll] = useState(false);

    const displayDonations = showAll ? donations : donations.slice(0, 5);

    if (!donations || donations.length === 0) {
        return (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                    Recent Donors
                </h3>
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Be the first to donate!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Recent Donors ({totalDonors})
                </h3>
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>

            <div className="space-y-1">
                {displayDonations.map((donation) => (
                    <DonorItem key={donation.id} donation={donation} />
                ))}
            </div>

            {donations.length > 5 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full mt-3 py-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
                >
                    {showAll ? "Show less" : `View all ${totalDonors} donors →`}
                </button>
            )}
        </div>
    );
}