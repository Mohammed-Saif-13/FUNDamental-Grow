"use client";

import { useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems = 0,
    itemsPerPage = 10,
    showInfo = true,
    showFirstLast = false,
    maxVisiblePages = 5,
    className = "",
}) {
    // Calculate display range
    const { startItem, endItem } = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        return { startItem: start, endItem: end };
    }, [currentPage, itemsPerPage, totalItems]);

    // Generate page numbers to display
    const pageNumbers = useMemo(() => {
        const pages = [];

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate start and end of visible range
            let start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
            let end = Math.min(totalPages - 1, start + maxVisiblePages - 3);

            // Adjust start if end is at limit
            if (end === totalPages - 1) {
                start = Math.max(2, end - maxVisiblePages + 3);
            }

            // Add ellipsis after first page if needed
            if (start > 2) {
                pages.push("...");
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (end < totalPages - 1) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    }, [currentPage, totalPages, maxVisiblePages]);

    // Handlers
    const goToPage = useCallback((page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    }, [currentPage, totalPages, onPageChange]);

    const goToPrevious = useCallback(() => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    }, [currentPage, onPageChange]);

    const goToNext = useCallback(() => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    }, [currentPage, totalPages, onPageChange]);

    const goToFirst = useCallback(() => {
        if (currentPage !== 1) {
            onPageChange(1);
        }
    }, [currentPage, onPageChange]);

    const goToLast = useCallback(() => {
        if (currentPage !== totalPages) {
            onPageChange(totalPages);
        }
    }, [currentPage, totalPages, onPageChange]);

    // Don't render if only 1 page
    if (totalPages <= 1) return null;

    return (
        <div className={cn(
            "flex flex-col sm:flex-row items-center justify-between gap-4 px-2",
            className
        )}>
            {/* Info Text */}
            {showInfo && totalItems > 0 && (
                <p className="text-sm text-gray-500 order-2 sm:order-1">
                    Showing <span className="font-medium text-gray-700">{startItem}</span> to{" "}
                    <span className="font-medium text-gray-700">{endItem}</span> of{" "}
                    <span className="font-medium text-gray-700">{totalItems}</span> entries
                </p>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center gap-1 order-1 sm:order-2">
                {/* First Page */}
                {showFirstLast && (
                    <button
                        onClick={goToFirst}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label="First page"
                    >
                        <ChevronsLeft className="h-4 w-4 text-gray-600" />
                    </button>
                )}

                {/* Previous */}
                <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {pageNumbers.map((page, index) =>
                        page === "..." ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 text-gray-400 select-none"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={cn(
                                    "min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                                    currentPage === page
                                        ? "bg-orange-500 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100"
                                )}
                                aria-label={`Page ${page}`}
                                aria-current={currentPage === page ? "page" : undefined}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                {/* Next */}
                <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>

                {/* Last Page */}
                {showFirstLast && (
                    <button
                        onClick={goToLast}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label="Last page"
                    >
                        <ChevronsRight className="h-4 w-4 text-gray-600" />
                    </button>
                )}
            </div>
        </div>
    );
}