import { cn } from "@/lib/utils";

const borderColors = {
    green: "border-green-400",
    blue: "border-blue-400",
    orange: "border-orange-400",
    purple: "border-purple-400",
    red: "border-red-400",
    yellow: "border-yellow-400",
    cyan: "border-cyan-400",
};

const iconBgColors = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    cyan: "bg-cyan-100 text-cyan-600",
};

const badgeColors = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    cyan: "bg-cyan-100 text-cyan-600",
};

export default function StatCard({
    title,
    value,
    badge,
    icon: Icon,
    color = "blue",
    className,
}) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl p-5 border-2 shadow-sm",
                borderColors[color],
                className
            )}
        >
            <div className="flex items-start justify-between mb-4">
                {Icon && (
                    <div className={cn("p-3 rounded-xl", iconBgColors[color])}>
                        <Icon className="h-5 w-5" />
                    </div>
                )}
                {badge && (
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", badgeColors[color])}>
                        {badge}
                    </span>
                )}
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
        </div>
    );
}