import Link from "next/link";
import { CheckCircle, Heart, Home, Share2, Star, MessageSquare } from "lucide-react";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
    title: "Thank You | FUNDamental Grow",
    description: "Thank you for your generous donation. Your support makes a real difference.",
};

export default async function ThankYouPage({ searchParams }) {
    const params = await searchParams;
    const amount = params?.amount ? parseInt(params.amount) : null;
    const campaignSlug = params?.campaign || null;

    return (
        <div className="min-h-[80vh] flex items-center py-8 bg-gradient-to-br from-green-50 via-white to-orange-50 sm:py-12">
            <Container>
                <div className="mx-auto max-w-lg px-4 text-center">
                    {/* Success Icon */}
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 sm:mb-6 sm:h-20 sm:w-20">
                        <CheckCircle className="h-8 w-8 text-green-500 sm:h-10 sm:w-10" />
                    </div>

                    {/* Thank You Message */}
                    <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:mb-4 sm:text-3xl md:text-4xl">
                        Thank You! 🎉
                    </h1>

                    <p className="mb-2 text-base text-gray-600 sm:text-lg">
                        Your donation of{" "}
                        {amount ? (
                            <span className="font-bold text-orange-500">
                                {formatCurrency(amount)}
                            </span>
                        ) : (
                            "your generous amount"
                        )}{" "}
                        has been received.
                    </p>

                    <p className="mb-6 text-sm text-gray-500 sm:mb-8 sm:text-base">
                        You're making a real difference. A confirmation email has been sent to your inbox.
                    </p>

                    {/* Impact Message */}
                    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 sm:mb-8 sm:rounded-2xl sm:p-6">
                        <Heart className="mx-auto mb-2 h-6 w-6 text-orange-500 sm:mb-3 sm:h-8 sm:w-8" />
                        <p className="text-sm text-gray-600 sm:text-base">
                            "Every act of generosity counts, and your donation will help create lasting change."
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {/* Primary Actions Row */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            {campaignSlug && (
                                <Link href={`/campaigns/${campaignSlug}`} className="w-full sm:w-auto">
                                    <Button variant="outline" className="w-full cursor-pointer">
                                        <Share2 className="h-4 w-4" />
                                        Share Campaign
                                    </Button>
                                </Link>
                            )}

                            <Link href="/campaigns" className="w-full sm:w-auto">
                                <Button className="w-full cursor-pointer">
                                    <Heart className="h-4 w-4" />
                                    Donate More
                                </Button>
                            </Link>

                            <Link href="/" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full cursor-pointer">
                                    <Home className="h-4 w-4" />
                                    Go Home
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Share Your Experience Card */}
                    <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl border border-orange-100">
                        <div className="flex justify-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                            Enjoyed your experience?
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-4">
                            Help others discover the joy of giving. Share your story and inspire more donations!
                        </p>
                        <Link href="/testimonials">
                            <Button variant="outline" size="sm" className="cursor-pointer border-orange-300 text-orange-600 hover:bg-orange-100">
                                <MessageSquare className="w-4 h-4" />
                                Share Your Experience
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}