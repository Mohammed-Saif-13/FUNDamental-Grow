import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
    return (
        <div
            className={cn(
                "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded",
                className
            )}
        />
    );
}

// Pre-built skeleton patterns
export function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100">
            <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
        </div>
    );
}

export function TableRowSkeleton({ columns = 6 }) {
    return (
        <tr className="border-b border-gray-50">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <Skeleton className="h-5 w-full max-w-[120px]" />
                </td>
            ))}
        </tr>
    );
}

export function TableSkeleton({ rows = 5, columns = 6 }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            {Array.from({ length: columns }).map((_, i) => (
                                <th key={i} className="px-6 py-4">
                                    <Skeleton className="h-4 w-20" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, i) => (
                            <TableRowSkeleton key={i} columns={columns} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function PageHeaderSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <Skeleton className="h-9 w-64 mb-2" />
                <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <PageHeaderSkeleton />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
            </div>
            <TableSkeleton rows={5} columns={5} />
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <Skeleton className="h-20 w-full mt-4 rounded-xl" />
            <div className="flex gap-2 mt-4 justify-end">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
        </div>
    );
}