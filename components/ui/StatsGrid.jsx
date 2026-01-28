import StatCard from "./StatCard";
import { cn } from "@/lib/utils";

const gridCols = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
};

export default function StatsGrid({ stats = [] }) {
    const cols = Math.min(stats.length, 5);

    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", gridCols[cols])}>
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    icon={stat.icon}
                    value={stat.value}
                    title={stat.title}
                    badge={stat.badge}
                    color={stat.color}
                />
            ))}
        </div>
    );
}