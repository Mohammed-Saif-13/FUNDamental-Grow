"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, TrendingUp, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

function AnimatedNumber({ value, duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!ref.current || hasAnimated.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let start = 0;
                    const increment = value / (duration / 16);
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= value) {
                            setCount(value);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [value, duration]);

    return <span ref={ref}>{count}</span>;
}

export default function StatsCards({ stats }) {
    return (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {/* Campaigns Card */}
            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 mx-auto shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>

                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        <AnimatedNumber value={stats.totalCampaigns} />
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">
                        Active Campaigns
                    </p>

                    <div className="pt-2 border-t border-gray-100">
                        <p className="text-[10px] sm:text-xs text-gray-500">Ready to support</p>
                    </div>
                </div>
            </div>

            {/* Raised Amount Card */}
            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 mx-auto shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>

                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        {formatCurrency(stats.totalRaised)}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">
                        Total Raised
                    </p>

                    <div className="pt-2 border-t border-gray-100">
                        <p className="text-[10px] sm:text-xs text-gray-500">Making impact</p>
                    </div>
                </div>
            </div>

            {/* Donors Card */}
            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 mx-auto shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>

                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        <AnimatedNumber value={stats.totalDonors} />+
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">
                        Happy Donors
                    </p>

                    <div className="pt-2 border-t border-gray-100">
                        <p className="text-[10px] sm:text-xs text-gray-500">Join community</p>
                    </div>
                </div>
            </div>
        </div>
    );
}