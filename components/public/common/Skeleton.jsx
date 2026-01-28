import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
    return (
        <div
            className={cn(
                "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-lg",
                className
            )}
        />
    );
}

// Campaign Card Skeleton
export function CampaignCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-5">
                <Skeleton className="h-5 w-20 rounded-full mb-3" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-10" />
                    </div>
                    <Skeleton className="h-1.5 w-full rounded-full" />
                    <Skeleton className="h-3 w-28" />
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-100">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </div>
    );
}

// Featured Campaigns Skeleton
export function FeaturedCampaignsSkeleton() {
    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <Skeleton className="h-7 w-40 mx-auto rounded-full mb-4" />
                    <Skeleton className="h-10 w-96 mx-auto mb-4" />
                    <Skeleton className="h-5 w-80 mx-auto" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <CampaignCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// Hero Skeleton
export function HeroSkeleton() {
    return (
        <section className="min-h-[90vh] flex items-center bg-gradient-to-br from-gray-50 via-orange-50/30 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <Skeleton className="h-8 w-48 rounded-full mb-6 mx-auto lg:mx-0" />
                        <Skeleton className="h-14 w-full max-w-md mb-2 mx-auto lg:mx-0" />
                        <Skeleton className="h-14 w-3/4 max-w-sm mb-6 mx-auto lg:mx-0" />
                        <Skeleton className="h-6 w-full max-w-xl mb-2 mx-auto lg:mx-0" />
                        <Skeleton className="h-6 w-2/3 max-w-md mb-8 mx-auto lg:mx-0" />
                        <div className="flex gap-4 justify-center lg:justify-start">
                            <Skeleton className="h-12 w-36 rounded-lg" />
                            <Skeleton className="h-12 w-40 rounded-lg" />
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <Skeleton className="h-96 w-full rounded-3xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}

// Stats Skeleton
export function StatsSkeleton() {
    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="text-center p-6 md:p-8 rounded-2xl bg-white border border-gray-100">
                            <Skeleton className="w-14 h-14 rounded-2xl mx-auto mb-4" />
                            <Skeleton className="h-10 w-24 mx-auto mb-2" />
                            <Skeleton className="h-4 w-28 mx-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}