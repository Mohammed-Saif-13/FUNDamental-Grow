import { cn } from "@/lib/utils";

const colors = [
    "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
    "bg-gradient-to-br from-blue-400 to-blue-600 text-white",
    "bg-gradient-to-br from-green-400 to-green-600 text-white",
    "bg-gradient-to-br from-purple-400 to-purple-600 text-white",
    "bg-gradient-to-br from-pink-400 to-pink-600 text-white",
    "bg-gradient-to-br from-cyan-400 to-cyan-600 text-white",
];

export default function Avatar({
    name,
    image, // image prop kept for backwards compatibility but not used
    size = "md",
    className
}) {
    const sizes = {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-14 w-14 text-lg",
    };

    // Get consistent color based on name
    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

    // Always show initials avatar (no images)
    return (
        <div
            className={cn(
                "rounded-full flex items-center justify-center font-semibold shrink-0",
                sizes[size],
                colors[colorIndex],
                className
            )}
        >
            {name?.charAt(0).toUpperCase() || "?"}
        </div>
    );
}