import { cn } from "@/lib/utils";

const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-orange-100 text-orange-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
};

export default function Badge({
    children,
    variant = "default",
    icon: Icon,
    className
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                variants[variant],
                className
            )}
        >
            {Icon && <Icon className="h-3 w-3" />}
            {children}
        </span>
    );
}