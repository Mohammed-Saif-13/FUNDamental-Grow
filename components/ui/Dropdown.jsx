"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dropdown({
    label = "Select",
    options = [],
    value,
    onChange,
    icon: Icon = Filter,
    className,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);
    const displayLabel = selectedOption?.label || label;

    return (
        <div ref={dropdownRef} className={cn("relative inline-block", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all min-w-[140px]",
                    isOpen
                        ? "border-orange-500 ring-2 ring-orange-100 bg-white"
                        : "border-gray-200 bg-white hover:border-gray-300"
                )}
            >
                <Icon className="h-4 w-4 text-orange-500" />
                <span className="text-gray-700 flex-1 text-left">{displayLabel}</span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-gray-400 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-[100]">
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange?.(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left",
                                    isSelected
                                        ? "text-orange-600 bg-orange-50"
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                <span className={cn(isSelected && "font-medium")}>
                                    {option.label}
                                </span>
                                {isSelected && (
                                    <div className="h-2 w-2 bg-orange-500 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}