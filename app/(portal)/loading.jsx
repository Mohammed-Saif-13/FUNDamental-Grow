export default function PortalLoading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div>
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mt-2"></div>
            </div>

            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
                            </div>
                            <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content skeleton */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse ml-4"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}