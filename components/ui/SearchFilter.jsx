"use client";

import { Search, Filter } from "lucide-react";
import Input from "./Input";
import Select from "./Select";

export default function SearchFilter({
    searchPlaceholder = "Search...",
    searchValue,
    onSearchChange,
    filters = [],
}) {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        icon={Search}
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                </div>
                {filters.map((filter) => (
                    <div key={filter.name} className="sm:w-48">
                        <Select
                            options={filter.options}
                            value={filter.value}
                            onChange={(e) => filter.onChange?.(e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}