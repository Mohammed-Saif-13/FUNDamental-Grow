import { Star } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Container from "@/components/public/layout/Container";

// Fallback testimonials - Static data outside
const FALLBACK_TESTIMONIALS = [
    {
        id: "1",
        name: "Priya Sharma",
        role: "Donor",
        rating: 5,
        message: "FUNDamental Grow made it so easy to support causes I care about. The transparency is amazing!",
    },
    {
        id: "2",
        name: "Rahul Verma",
        role: "Campaign Organizer",
        rating: 5,
        message: "We raised ₹5 lakhs in just 2 weeks. The platform is intuitive and support team is helpful.",
    },
    {
        id: "3",
        name: "Anita Desai",
        role: "Donor",
        rating: 5,
        message: "I've been donating monthly for 6 months. The impact updates make me feel connected.",
    },
    {
        id: "4",
        name: "Vikram Singh",
        role: "Volunteer",
        rating: 5,
        message: "As a volunteer, I've seen how donations transform lives. This platform is amazing!",
    },
    {
        id: "5",
        name: "Meera Patel",
        role: "Donor",
        rating: 5,
        message: "Was hesitant about online donations, but verified campaigns gave me confidence.",
    },
    {
        id: "6",
        name: "Arjun Reddy",
        role: "NGO Partner",
        rating: 5,
        message: "Partnering with FUNDamental Grow helped us reach 10x more donors.",
    },
];

async function getTestimonials() {
    try {
        if (!prisma?.testimonial) {
            return FALLBACK_TESTIMONIALS;
        }

        const testimonials = await prisma.testimonial.findMany({
            where: { status: "approved" },
            orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
            take: 12,
        });

        return testimonials.length >= 4 ? testimonials : FALLBACK_TESTIMONIALS;
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return FALLBACK_TESTIMONIALS;
    }
}

function TestimonialCard({ testimonial }) {
    return (
        <div className="flex-shrink-0 w-[280px] sm:w-[300px] p-5 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm">
            {/* Rating - Mobile Optimized */}
            <div className="flex gap-0.5 mb-3 sm:mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                ))}
            </div>

            {/* Text - Mobile Optimized */}
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 line-clamp-3">
                "{testimonial.message}"
            </p>

            {/* Author - Mobile Optimized */}
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold shrink-0 text-sm sm:text-base">
                    {testimonial.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{testimonial.role}</p>
                </div>
            </div>
        </div>
    );
}

export default async function Testimonials() {
    const testimonials = await getTestimonials();

    // Duplicate for seamless loop
    const row1 = [...testimonials, ...testimonials];
    const halfLength = Math.floor(testimonials.length / 2);
    const row2 = [
        ...testimonials.slice(halfLength),
        ...testimonials.slice(0, halfLength),
        ...testimonials.slice(halfLength),
        ...testimonials.slice(0, halfLength)
    ];

    return (
        <section className="py-12 sm:py-16 md:py-24 bg-gray-50 overflow-hidden">
            <Container className="px-4">
                {/* Header - Mobile Optimized */}
                <div className="text-center mb-10 sm:mb-12">
                    <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Loved by Thousands
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
                        See what our community says about their experience with FUNDamental Grow.
                    </p>
                </div>
            </Container>

            {/* Scrolling Testimonials */}
            <div className="relative">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

                {/* Row 1 - Left to Right */}
                <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4 animate-marquee-left">
                    {row1.map((testimonial, index) => (
                        <TestimonialCard key={`row1-${testimonial.id}-${index}`} testimonial={testimonial} />
                    ))}
                </div>

                {/* Row 2 - Right to Left */}
                <div className="flex gap-3 sm:gap-4 animate-marquee-right">
                    {row2.map((testimonial, index) => (
                        <TestimonialCard key={`row2-${testimonial.id}-${index}`} testimonial={testimonial} />
                    ))}
                </div>
            </div>

            {/* Share Your Experience Button - Mobile Optimized */}
            <Container className="px-4">
                <div className="text-center mt-8 sm:mt-10">
                    <Link
                        href="/testimonials"
                        className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white border border-orange-200 text-orange-600 font-medium rounded-xl hover:bg-orange-50 transition-colors text-sm sm:text-base"
                    >
                        Share Your Experience
                    </Link>
                </div>
            </Container>
        </section>
    );
}