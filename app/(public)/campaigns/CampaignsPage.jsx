"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
import Container from "@/components/public/layout/Container";
import CampaignCard from "@/components/public/campaigns/CampaignCard";
import StatsCards from "@/components/public/campaigns/StatsCards";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";

const ITEMS_PER_PAGE = 12;

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most-funded", label: "Most Funded" },
    { value: "least-funded", label: "Least Funded" },
    { value: "ending-soon", label: "Ending Soon" },
];

function FilterTag({ label, onRemove }) {
    return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">
            {label}
            <button onClick={onRemove} className="hover:text-orange-800 cursor-pointer">
                <X className="w-3 h-3" />
            </button>
        </span>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="cursor-pointer"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
            </Button>

            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, i) => (
                    <button
                        key={i}
                        onClick={() => typeof page === "number" && onPageChange(page)}
                        disabled={page === "..."}
                        className={`w-10 h-10 rounded-xl font-medium transition-all cursor-pointer ${page === currentPage
                                ? "bg-orange-500 text-white"
                                : page === "..."
                                    ? "text-gray-400 cursor-default"
                                    : "border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="cursor-pointer"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
}


export default function CampaignsPage({ campaigns, categories, stats, initialCategory, initialSort, initialPage }) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState(initialSort);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [viewMode, setViewMode] = useState("grid");

    const categoryOptions = [
        { value: "", label: "All Categories" },
        ...categories.map((cat) => ({ value: cat, label: cat })),
    ];

    const filteredCampaigns = useMemo(() => {
        let result = [...campaigns];

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.title.toLowerCase().includes(q) ||
                    c.description.toLowerCase().includes(q) ||
                    c.category.toLowerCase().includes(q)
            );
        }

        if (selectedCategory) {
            result = result.filter((c) => c.category === selectedCategory);
        }

        const sortFns = {
            oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            "most-funded": (a, b) => b.raisedAmount - a.raisedAmount,
            "least-funded": (a, b) => a.raisedAmount - b.raisedAmount,
            "ending-soon": (a, b) => new Date(a.endDate || "2099") - new Date(b.endDate || "2099"),
            newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        };

        result.sort(sortFns[sortBy] || sortFns.newest);
        return result;
    }, [campaigns, search, selectedCategory, sortBy]);

    const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const updateURL = (cat, sort, page) => {
        const params = new URLSearchParams();
        if (cat) params.set("category", cat);
        if (sort !== "newest") params.set("sort", sort);
        if (page > 1) params.set("page", page.toString());
        router.push(`/campaigns${params.toString() ? `?${params}` : ""}`, { scroll: false });
    };

    const handleCategoryChange = (val) => {
        setSelectedCategory(val);
        setCurrentPage(1);
        updateURL(val, sortBy, 1);
    };

    const handleSortChange = (val) => {
        setSortBy(val);
        setCurrentPage(1);
        updateURL(selectedCategory, val, 1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        updateURL(selectedCategory, sortBy, page);
        window.scrollTo({ top: 400, behavior: "smooth" });
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setSortBy("newest");
        setCurrentPage(1);
        router.push("/campaigns");
    };

    const hasActiveFilters = search || selectedCategory || sortBy !== "newest";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 sm:py-16">
                <Container>
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Explore <span className="text-orange-500">Campaigns</span>
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10">
                            Discover causes that matter to you and make a real difference with your contribution.
                        </p>

                        <StatsCards stats={stats} />
                    </div>
                </Container>
            </section>

            {/* Category Pills */}
            <section className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-20">
                <Container>
                    <div className="py-4 flex gap-2 overflow-x-auto scrollbar-hide">
                        {[{ value: "", label: "All" }, ...categories.map((c) => ({ value: c, label: c }))].map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => handleCategoryChange(cat.value)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${selectedCategory === cat.value
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Content */}
            <section className="py-8 md:py-12">
                <Container>
                    {/* Filters */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    icon={Search}
                                    placeholder="Search campaigns..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Dropdown
                                    label="Category"
                                    options={categoryOptions}
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Dropdown
                                    label="Sort By"
                                    options={sortOptions}
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    icon={SlidersHorizontal}
                                />
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                <span className="text-sm text-gray-500">Filters:</span>
                                {search && <FilterTag label={`"${search}"`} onRemove={() => setSearch("")} />}
                                {selectedCategory && (
                                    <FilterTag label={selectedCategory} onRemove={() => handleCategoryChange("")} />
                                )}
                                {sortBy !== "newest" && (
                                    <FilterTag
                                        label={sortOptions.find((s) => s.value === sortBy)?.label}
                                        onRemove={() => handleSortChange("newest")}
                                    />
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="ml-auto text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>

                    {/* View Toggle & Results Count */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{paginatedCampaigns.length}</span> of{" "}
                            <span className="font-semibold text-gray-900">{filteredCampaigns.length}</span> campaigns
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                                        ? "bg-orange-500 text-white"
                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                aria-label="Grid view"
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                                        ? "bg-orange-500 text-white"
                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                aria-label="List view"
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Grid/List */}
                    {filteredCampaigns.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your filters</p>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear filters
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div
                                className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                        : "flex flex-col gap-4"
                                }
                            >
                                {paginatedCampaigns.map((campaign) => (
                                    <CampaignCard key={campaign.id} campaign={campaign} viewMode={viewMode} />
                                ))}
                            </div>
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </>
                    )}
                </Container>
            </section>
        </div>
    );
}