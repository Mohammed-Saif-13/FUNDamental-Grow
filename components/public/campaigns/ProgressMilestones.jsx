"use client";

import { CheckCircle, Circle } from "lucide-react";
import { calculateProgress } from "@/lib/utils";

const milestones = [
    { percent: 25, label: "Quarter Funded", color: "text-blue-500" },
    { percent: 50, label: "Halfway There", color: "text-green-500" },
    { percent: 75, label: "Almost Done", color: "text-orange-500" },
    { percent: 100, label: "Goal Reached", color: "text-purple-500" },
];

export default function ProgressMilestones({ raisedAmount, goalAmount }) {
    const currentProgress = calculateProgress(raisedAmount, goalAmount);

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-6">
                Progress Milestones
            </h3>

            <div className="space-y-4">
                {milestones.map((milestone, index) => {
                    const isCompleted = currentProgress >= milestone.percent;
                    const isCurrent = currentProgress < milestone.percent &&
                        (index === 0 || currentProgress >= milestones[index - 1].percent);

                    return (
                        <div key={milestone.percent} className="flex items-center gap-3">
                            <div className={`flex-shrink-0 ${isCompleted
                                    ? milestone.color
                                    : isCurrent
                                        ? "text-orange-500"
                                        : "text-gray-300"
                                }`}>
                                {isCompleted ? (
                                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                                ) : (
                                    <Circle className="w-6 h-6 sm:w-7 sm:h-7" />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className={`text-sm sm:text-base font-medium ${isCompleted
                                            ? "text-gray-900"
                                            : isCurrent
                                                ? "text-orange-500"
                                                : "text-gray-400"
                                        }`}>
                                        {milestone.label}
                                    </p>
                                    <span className={`text-xs sm:text-sm font-semibold ${isCompleted
                                            ? milestone.color
                                            : isCurrent
                                                ? "text-orange-500"
                                                : "text-gray-400"
                                        }`}>
                                        {milestone.percent}%
                                    </span>
                                </div>

                                {isCompleted && (
                                    <p className="text-xs text-green-600">
                                        ✓ Milestone achieved
                                    </p>
                                )}

                                {isCurrent && (
                                    <p className="text-xs text-orange-500">
                                        {milestone.percent - currentProgress}% to go
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}