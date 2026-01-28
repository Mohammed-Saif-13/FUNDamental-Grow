import Link from "next/link";
import { CheckCircle, Share2, Eye, ArrowRight } from "lucide-react";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";

export default async function FundraiserSuccessPage({ searchParams }) {
    const params = await searchParams;
    const slug = params?.slug;

    return (
        <div className="min-h-[80vh] bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center">
            <Container>
                <div className="max-w-lg mx-auto text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Campaign Submitted! 🎉
                    </h1>

                    <p className="text-gray-600 mb-2">
                        Your fundraiser has been submitted for review.
                    </p>
                    <p className="text-sm text-gray-500 mb-8">
                        Our team will review your campaign within 24-48 hours. You'll receive an email once it's approved.
                    </p>

                    <div className="p-4 bg-orange-50 rounded-xl mb-8">
                        <p className="text-sm text-orange-800">
                            <strong>What's next?</strong> Share your campaign link with friends and family to get early support!
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {slug && (
                            <Link href={`/campaigns/${slug}`} className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto cursor-pointer">
                                    <Eye className="w-4 h-4" />
                                    Preview Campaign
                                </Button>
                            </Link>
                        )}
                        <Link href="/campaigns">
                            <Button variant="outline" className="w-full sm:w-auto cursor-pointer">
                                Browse Campaigns
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}