import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm",
    secondary: "bg-gray-900 text-white hover:bg-gray-800 shadow-sm",
    outline: "border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    ghost: "text-gray-600 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    success: "bg-green-500 text-white hover:bg-green-600 shadow-sm",
};

const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className,
    loading = false,
    disabled = false,
    ...props
}) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "active:scale-[0.98]",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
}