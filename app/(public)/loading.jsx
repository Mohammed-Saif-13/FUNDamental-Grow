import Container from "@/components/public/layout/Container";

function Skeleton({ className }) {
    return (
        <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
    );
}

function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-5">
                <Skeleton className="h-5 w-20 rounded-full mb-3" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-2 w-full rounded-full mb-2" />
                <Skeleton className="h-3 w-24 mb-4" />
                <div className="flex justify-between pt-4 border-t border-gray-100">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Skeleton */}
            <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16">
                <Container>
                    <div className="text-center">
                        <Skeleton className="h-10 w-72 mx-auto mb-4" />
                        <Skeleton className="h-5 w-96 mx-auto mb-8" />
                        <div className="flex justify-center gap-8">
                            <Skeleton className="h-16 w-32" />
                            <Skeleton className="h-16 w-32" />
                            <Skeleton className="h-16 w-32" />
                        </div>
                    </div>
                </Container>
            </div>

            {/* Content Skeleton */}
            <Container className="py-8">
                {/* Filter Bar */}
                <div className="bg-white rounded-2xl p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Skeleton className="flex-1 h-12" />
                        <Skeleton className="w-full md:w-48 h-12" />
                        <Skeleton className="w-full md:w-48 h-12" />
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </Container>
        </div>
    );
}