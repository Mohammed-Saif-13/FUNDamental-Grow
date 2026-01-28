import Link from "next/link";
import { Home, Search, Heart, HelpCircle, Users, Mail } from "lucide-react";
import Navbar from "@/components/public/layout/Navbar";
import Footer from "@/components/public/layout/Footer";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-16 md:pt-20">
                <div className="min-h-[calc(100vh-200px)] relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-100/50" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
                            backgroundSize: "40px 40px",
                        }}
                    />

                    {/* Floating Elements */}
                    <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200/40 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-300/30 rounded-full blur-3xl animate-pulse delay-700" />
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-400/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: "3s" }} />

                    <Container className="relative z-10">
                        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] py-12 sm:py-16 md:py-20">
                            {/* 404 Text */}
                            <div className="relative mb-6 sm:mb-8">
                                <h1 className="text-[120px] sm:text-[160px] md:text-[200px] font-black leading-none select-none bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                                    404
                                </h1>
                            </div>

                            {/* Message */}
                            <div className="text-center max-w-lg mx-auto px-4">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                    Oops! Page Not Found
                                </h2>
                                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 sm:mb-10 leading-relaxed">
                                    The page you're looking for seems to have wandered off.
                                    Don't worry, let's get you back on track!
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
                                    <Link href="/" className="w-full sm:w-auto">
                                        <Button size="lg" className="w-full cursor-pointer group">
                                            <Home className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                                            Back to Home
                                        </Button>
                                    </Link>
                                    <Link href="/campaigns" className="w-full sm:w-auto">
                                        <Button variant="outline" size="lg" className="w-full cursor-pointer group">
                                            <Search className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                                            Browse Campaigns
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="w-full max-w-2xl mx-auto px-4">
                                <p className="text-center text-sm text-gray-500 mb-4">Or check out these popular pages:</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <Link
                                        href="/about"
                                        className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all group"
                                    >
                                        <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">About Us</span>
                                    </Link>
                                    <Link
                                        href="/start-fundraiser"
                                        className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all group"
                                    >
                                        <Heart className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">Fundraise</span>
                                    </Link>
                                    <Link
                                        href="/volunteer"
                                        className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all group"
                                    >
                                        <Users className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">Volunteer</span>
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all group"
                                    >
                                        <Mail className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">Contact</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </main>

            <Footer />
        </div>
    );
}
