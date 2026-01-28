import Link from "next/link";
import { Search, CreditCard, BarChart3, PartyPopper, ArrowRight } from "lucide-react";
import Container from "@/components/public/layout/Container";

const STEPS = [
    {
        icon: Search,
        title: "Find a Cause",
        description: "Browse verified campaigns and discover causes that matter to you.",
        color: "from-blue-500 to-cyan-500",
        shadowColor: "shadow-blue-500/20",
    },
    {
        icon: CreditCard,
        title: "Donate Securely",
        description: "Multiple payment options with bank-grade security. Every rupee counts.",
        color: "from-green-500 to-emerald-500",
        shadowColor: "shadow-green-500/20",
    },
    {
        icon: BarChart3,
        title: "Track Impact",
        description: "Real-time updates on how your donation is making a difference.",
        color: "from-purple-500 to-violet-500",
        shadowColor: "shadow-purple-500/20",
    },
    {
        icon: PartyPopper,
        title: "Celebrate",
        description: "See the lives you've changed and share your impact story.",
        color: "from-orange-500 to-amber-500",
        shadowColor: "shadow-orange-500/20",
    },
];

export default function HowItWorks() {
    return (
        <section className="py-12 sm:py-16 md:py-24 bg-white overflow-hidden">
            <Container className="px-4">
                <div className="text-center mb-10 sm:mb-12 md:mb-16">
                    <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                        Simple Process
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        How It Works
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Four simple steps to make a real difference in someone's life.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.title}
                                className={`group relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-2xl ${step.shadowColor}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 rounded-2xl sm:rounded-3xl transition-opacity duration-500`} aria-hidden="true" />

                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <span className="text-5xl sm:text-6xl font-bold text-gray-100 group-hover:text-gray-200 transition-colors" aria-hidden="true">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${step.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ${step.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
                                    </div>
                                </div>

                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-gray-800">
                                    {step.title}
                                </h3>
                                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 sm:mt-12 text-center">
                    <p className="text-gray-500 text-sm sm:text-base mb-3 sm:mb-4">Ready to start your journey?</p>
                    <Link href="/campaigns" className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:gap-4 transition-all text-sm sm:text-base">
                        <span>Explore Campaigns</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    </Link>
                </div>
            </Container>
        </section>
    );
}