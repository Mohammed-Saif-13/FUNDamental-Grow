"use client";

import { cn } from "@/lib/utils";

export default function Toggle({
    checked = false,
    onChange,
    disabled = false,
    color = "primary",
    size = "md",
}) {
    const colors = {
        primary: "peer-checked:bg-orange-500",
        success: "peer-checked:bg-green-500",
        warning: "peer-checked:bg-yellow-500",
        danger: "peer-checked:bg-red-500",
    };

    const sizes = {
        sm: "w-9 h-5 after:h-4 after:w-4",
        md: "w-11 h-6 after:h-5 after:w-5",
        lg: "w-14 h-7 after:h-6 after:w-6",
    };

    return (
        <label className={cn("relative inline-flex items-center", !disabled && "cursor-pointer")}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange?.(e.target.checked)}
                disabled={disabled}
                className="sr-only peer"
            />
            <div
                className={cn(
                    "bg-gray-200 rounded-full peer transition-colors",
                    "peer-focus:ring-2 peer-focus:ring-orange-500/20",
                    "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
                    "after:bg-white after:rounded-full after:transition-all",
                    "peer-checked:after:translate-x-full",
                    colors[color],
                    sizes[size],
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            />
        </label>
    );
}