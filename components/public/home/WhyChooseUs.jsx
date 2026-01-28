import { Shield, Eye, Zap, HeartHandshake, BadgeCheck, Clock } from "lucide-react";
import Container from "@/components/public/layout/Container";

// Static data outside component
const FEATURES = [
    {
        icon: Shield,
        title: "100% Secure",
        description: "Bank-grade security for all transactions. Your data is always protected.",
    },
    {
        icon: BadgeCheck,
        title: "Verified Campaigns",
        description: "Every campaign is thoroughly verified before going live.",
    },
    {
        icon: Eye,
        title: "Full Transparency",
        description: "Track exactly where your money goes with detailed reports.",
    },
    {
        icon: Zap,
        title: "Quick Process",
        description: "Funds reach beneficiaries within 24-48 hours of withdrawal.",
    },
    {
        icon: HeartHandshake,
        title: "Direct Impact",
        description: "95% of donations go directly to the cause you support.",
    },
    {
        icon: Clock,
        title: "24/7 Support",
        description: "Our dedicated team is always here to help you.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Container className="px-4">
                {/* Header - Mobile Optimized */}
                <div className="text-center mb-10 sm:mb-12 md:mb-16">
                    <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-1.5 bg-orange-500/20 text-orange-400 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                        Why FUNDamental Grow
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                        Why People Trust Us
                    </h2>
                    <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        We're committed to making charitable giving simple, transparent, and impactful.
                    </p>
                </div>

                {/* Features Grid - Mobile First */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {FEATURES.map((feature, index) => (
                        <div
                            key={index}
                            className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 group"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}