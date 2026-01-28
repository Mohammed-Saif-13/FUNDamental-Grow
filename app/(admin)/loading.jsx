import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-10 w-36 rounded-lg" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border-2 border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-24 mb-2" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
            </div>

            {/* Search bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <Skeleton className="h-11 flex-1 rounded-xl" />
                    <Skeleton className="h-11 w-40 rounded-xl" />
                    <Skeleton className="h-11 w-40 rounded-xl" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <th key={i} className="px-6 py-4">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b border-gray-50">
                                    {Array.from({ length: 6 }).map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <Skeleton className="h-5 w-full max-w-[120px]" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}