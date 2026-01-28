"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export default function Select({
    id,
    label,
    error,
    helperText,
    options = [],
    className = "",
    required = false,
    ...props
}) {
    const reactId = useId();
    const selectId = id || `select-${reactId}`;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <select
                    id={selectId}
                    className={cn(
                        "w-full px-4 py-2.5 rounded-xl border border-gray-200 transition-all appearance-none bg-white",
                        "focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                        className
                    )}
                    required={required}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
            {helperText && !error && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
        </div>
    );
}