"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export default function Input({
    id,
    label,
    error,
    helperText,
    icon: Icon,
    className = "",
    type = "text",
    required = false,
    ...props
}) {
    const reactId = useId();
    const inputId = id || `input-${reactId}`;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Icon className="h-5 w-5" />
                    </div>
                )}

                <input
                    id={inputId}
                    type={type}
                    className={cn(
                        "w-full px-4 py-2.5 rounded-xl border border-gray-200 transition-all",
                        "focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
                        "placeholder:text-gray-400",
                        Icon && "pl-10",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                        className
                    )}
                    required={required}
                    {...props}
                />
            </div>

            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
            {helperText && !error && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
        </div>
    );
}