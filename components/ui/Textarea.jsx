"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export default function Textarea({
    id,
    label,
    error,
    helperText,
    showCount = false,
    maxLength,
    value,
    className = "",
    required = false,
    ...props
}) {
    const reactId = useId();
    const textareaId = id || `textarea-${reactId}`;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <textarea
                id={textareaId}
                {...(value !== undefined && { value })}
                maxLength={maxLength}
                className={cn(
                    "w-full px-4 py-2.5 rounded-xl border border-gray-200 transition-all resize-none",
                    "focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
                    "placeholder:text-gray-400",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                    className
                )}
                required={required}
                {...props}
            />

            <div className="flex justify-between mt-1.5">
                <div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
                </div>
                {showCount && maxLength && value !== undefined && (
                    <span className="text-xs text-gray-400">
                        {value.length} / {maxLength}
                    </span>
                )}
            </div>
        </div>
    );
}