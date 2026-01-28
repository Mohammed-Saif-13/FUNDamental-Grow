import { Shield, Lock, Eye, Database, UserCheck, Mail, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";

const SECTIONS = [
    {
        icon: Database,
        title: "Information We Collect",
        content: [
            "Personal information (name, email, phone) when you create an account or make a donation",
            "Payment information processed securely through Razorpay - we never store card details",
            "Campaign information when you create a fundraiser",
            "Usage data including pages visited, time spent, and interaction patterns",
            "Device information like browser type, IP address, and operating system",
        ],
    },
    {
        icon: Eye,
        title: "How We Use Your Information",
        content: [
            "Process donations and send receipts/confirmations",
            "Communicate campaign updates and platform notifications",
            "Improve our services and user experience",
            "Prevent fraud and ensure platform security",
            "Comply with legal obligations and tax reporting",
        ],
    },
    {
        icon: UserCheck,
        title: "Information Sharing",
        content: [
            "Campaign organizers receive donor names (unless anonymous donation)",
            "Payment processors (Razorpay) for transaction processing",
            "Service providers who assist in platform operations",
            "Legal authorities when required by law",
            "We NEVER sell your personal information to third parties",
        ],
    },
    {
        icon: Lock,
        title: "Data Security",
        content: [
            "SSL encryption for all data transmission",
            "Secure servers with regular security audits",
            "Access controls limiting employee data access",
            "Regular backup and disaster recovery procedures",
            "Compliance with industry security standards",
        ],
    },
    {
        icon: Shield,
        title: "Your Rights",
        content: [
            "Access your personal data anytime through your profile",
            "Request correction of inaccurate information",
            "Request deletion of your account and associated data",
            "Opt-out of marketing communications",
            "Lodge complaints with data protection authorities",
        ],
    },
];

export const metadata = {
    title: "Privacy Policy | FUNDamental Grow",
    description: "Learn how FUNDamental Grow collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 sm:py-16 md:py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }} />

                <Container className="relative z-10">
                    <div className="max-w-3xl mx-auto text-center px-4">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-100 rounded-full mb-4 sm:mb-6">
                            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                            <span className="text-xs sm:text-sm font-medium text-orange-700">Privacy Policy</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                            Your Privacy <span className="text-orange-500">Matters</span> to Us
                        </h1>

                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            We're committed to protecting your personal information and being transparent about how we use it.
                        </p>

                        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>Last updated: January 2025</span>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Quick Summary */}
            <section className="py-8 sm:py-12 bg-white border-b border-gray-100">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-orange-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Quick Summary</h2>
                            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    We collect only what's necessary to provide our services
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    Your payment details are handled securely by Razorpay
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    We never sell your personal information
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    You can access, update, or delete your data anytime
                                </li>
                            </ul>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section className="py-10 sm:py-14 md:py-16 bg-white">
                <Container>
                    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
                        {SECTIONS.map((section, index) => (
                            <div key={index} className="relative">
                                <div className="flex items-start gap-4">
                                    <div className="hidden sm:flex w-12 h-12 bg-orange-100 rounded-xl items-center justify-center flex-shrink-0">
                                        <section.icon className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3 sm:hidden">
                                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <section.icon className="w-5 h-5 text-orange-500" />
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                                        </div>
                                        <h2 className="hidden sm:block text-xl md:text-2xl font-bold text-gray-900 mb-4">
                                            {section.title}
                                        </h2>
                                        <ul className="space-y-2.5">
                                            {section.content.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-gray-600">
                                                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                {index < SECTIONS.length - 1 && (
                                    <div className="border-b border-gray-100 mt-8 sm:mt-10" />
                                )}
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Cookies Section */}
            <section className="py-10 sm:py-14 bg-gray-50">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Cookies & Tracking</h2>
                        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-100">
                            <p className="text-sm sm:text-base text-gray-600 mb-4">
                                We use cookies and similar technologies to enhance your experience:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                                    <p className="text-sm text-gray-600">Required for the website to function properly</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                                    <p className="text-sm text-gray-600">Help us understand how visitors use our site</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-2">Preference Cookies</h3>
                                    <p className="text-sm text-gray-600">Remember your settings and preferences</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-2">Session Cookies</h3>
                                    <p className="text-sm text-gray-600">Keep you logged in during your visit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Contact Section */}
            <section className="py-10 sm:py-14 md:py-16 bg-white">
                <Container>
                    <div className="max-w-3xl mx-auto text-center px-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Questions About Privacy?
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                            If you have any questions about this Privacy Policy or how we handle your data,
                            we're here to help.
                        </p>
                        <Link href="/contact">
                            <Button size="lg" className="cursor-pointer">
                                Contact Us
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                        </Link>
                    </div>
                </Container>
            </section>
        </div>
    );
}
