"use client";

import { useState, useMemo, useCallback } from "react";

export default function usePagination(data = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  // Reset to page 1 when data changes significantly
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Go to specific page
  const goToPage = useCallback(
    (page) => {
      const validPage = Math.max(1, Math.min(page, totalPages || 1));
      setCurrentPage(validPage);
    },
    [totalPages],
  );

  // Reset to first page
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    totalItems: data.length,
    paginatedData,
    setCurrentPage: goToPage,
    resetPage,
    itemsPerPage,
  };
}
