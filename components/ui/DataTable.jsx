"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import Dropdown from "./Dropdown";

export default function DataTable({
    data = [],
    columns = [],
    searchable = true,
    searchKeys = [],
    searchPlaceholder = "Search...",
    filters = [],
    emptyMessage = "No data found",
    emptyAction = null,
    onClearFilters = null,
    itemsPerPage = 50,
    dateField = "createdAt",
    showDateFilter = true,
}) {
    const [search, setSearch] = useState("");
    const [filterValues, setFilterValues] = useState(
        filters.reduce((acc, f) => ({ ...acc, [f.key]: "all" }), {})
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Filter logic
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Search filter
            const matchesSearch = searchKeys.length === 0 || searchKeys.some((key) => {
                const value = key.split(".").reduce((obj, k) => obj?.[k], item);
                return String(value || "").toLowerCase().includes(search.toLowerCase());
            });

            // Dropdown filters
            const matchesFilters = filters.every((filter) => {
                const selectedValue = filterValues[filter.key];
                if (selectedValue === "all") return true;
                const itemValue = filter.key.split(".").reduce((obj, k) => obj?.[k], item);
                return itemValue === selectedValue;
            });

            // Date range filter
            let matchesDateRange = true;
            if (startDate || endDate) {
                const itemDate = new Date(item[dateField]);
                if (startDate) {
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    if (itemDate < start) matchesDateRange = false;
                }
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    if (itemDate > end) matchesDateRange = false;
                }
            }

            return matchesSearch && matchesFilters && matchesDateRange;
        });
    }, [data, search, filterValues, searchKeys, filters, startDate, endDate, dateField]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const showPagination = filteredData.length > itemsPerPage;

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterValues, startDate, endDate]);

    // Check if any filter is active
    const hasActiveFilters = search || Object.values(filterValues).some((v) => v !== "all") || startDate || endDate;

    // Clear all filters
    const clearFilters = () => {
        setSearch("");
        setFilterValues(filters.reduce((acc, f) => ({ ...acc, [f.key]: "all" }), {}));
        setStartDate("");
        setEndDate("");
        setCurrentPage(1);
        onClearFilters?.();
    };

    // Page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="space-y-4">
            {/* Search & Filters */}
            {(searchable || filters.length > 0 || showDateFilter) && (
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {searchable && (
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={searchPlaceholder}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            )}
                            {filters.map((filter) => (
                                <Dropdown
                                    key={filter.key}
                                    label={filter.label}
                                    icon={filter.icon || Filter}
                                    options={[
                                        { value: "all", label: filter.allLabel || `All ${filter.label}` },
                                        ...filter.options,
                                    ]}
                                    value={filterValues[filter.key]}
                                    onChange={(value) =>
                                        setFilterValues((prev) => ({ ...prev, [filter.key]: value }))
                                    }
                                />
                            ))}
                        </div>

                        {/* Date Range Filter */}
                        {showDateFilter && (
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>Date Range:</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <span className="text-gray-400">to</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    {(startDate || endDate) && (
                                        <button
                                            onClick={() => { setStartDate(""); setEndDate(""); }}
                                            className="text-sm text-orange-500 hover:underline"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={cn(
                                            "text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase",
                                            column.className
                                        )}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedData.map((item, index) => (
                                <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((column) => (
                                        <td key={column.key} className={cn("px-6 py-4", column.cellClassName)}>
                                            {column.render ? column.render(item) : item[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredData.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{emptyMessage}</p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-orange-500 hover:underline mt-2"
                            >
                                Clear filters
                            </button>
                        )}
                        {!hasActiveFilters && emptyAction}
                    </div>
                )}

                {/* Pagination */}
                {showPagination && filteredData.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            {getPageNumbers().map((page, idx) => (
                                page === "..." ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={cn(
                                            "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                                            currentPage === page
                                                ? "bg-orange-500 text-white"
                                                : "hover:bg-gray-100 text-gray-600"
                                        )}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}