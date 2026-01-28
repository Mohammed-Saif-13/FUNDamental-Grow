import Link from "next/link";
import { Rocket, ArrowRight } from "lucide-react";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";

export default function CallToAction() {
    return (
        <section className="py-12 sm:py-16 md:py-24 bg-white">
            <Container className="px-4">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 sm:p-8 md:p-12 lg:p-16">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-60 sm:h-60 bg-white rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 text-center">
                        {/* Icon - Mobile Optimized */}
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 md:mb-6">
                            <Rocket className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>

                        {/* Content - Mobile Optimized */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                            Ready to Start Your Fundraiser?
                        </h2>
                        <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-6 sm:mb-7 md:mb-8 leading-relaxed px-4">
                            Join thousands of fundraisers who have successfully raised money for their causes. It's free and takes only 5 minutes.
                        </p>

                        {/* CTA Buttons - Mobile First */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                            <Link href="/start-fundraiser" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="bg-white text-orange-600 hover:bg-gray-100 w-full sm:w-auto"
                                >
                                    Start Fundraiser - It's Free
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                            </Link>
                            <Link href="/campaigns" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                                >
                                    Explore Campaigns
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Text - Mobile Optimized */}
                        <p className="text-white/70 text-xs sm:text-sm mt-6 sm:mt-7 md:mt-8">
                            ✓ No platform fees &nbsp; ✓ 24/7 Support &nbsp; ✓ Withdraw anytime
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    );
}