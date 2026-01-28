import Link from "next/link";
import {
    Stethoscope,
    GraduationCap,
    Baby,
    TreePine,
    PawPrint,
    HandHeart
} from "lucide-react";
import Container from "@/components/public/layout/Container";

const CATEGORIES = [
    {
        icon: Stethoscope,
        label: "Medical",
        slug: "Medical",
        color: "from-rose-500 to-pink-600",
    },
    {
        icon: GraduationCap,
        label: "Education",
        slug: "Education",
        color: "from-blue-500 to-indigo-600",
    },
    {
        icon: Baby,
        label: "Children",
        slug: "Humanitarian",
        color: "from-amber-500 to-orange-600",
    },
    {
        icon: TreePine,
        label: "Environment",
        slug: "Environment",
        color: "from-green-500 to-emerald-600",
    },
    {
        icon: PawPrint,
        label: "Animals",
        slug: "Animal Welfare",
        color: "from-purple-500 to-violet-600",
    },
    {
        icon: HandHeart,
        label: "Others",
        slug: "",
        color: "from-orange-500 to-red-500",
    },
];

export default function Categories() {
    return (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
            <Container className="px-4">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Causes You Can Raise Funds For
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                        Be it for a personal need, social cause or a creative idea – you can count on us for the project that you want to raise funds for.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                    {CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.label}
                                href={category.slug ? `/campaigns?category=${category.slug}` : "/campaigns"}
                                className="group"
                            >
                                <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${category.color} p-5 sm:p-6 md:p-8 text-center transition-transform duration-300 supports-hover:hover:scale-105 hover:shadow-xl`}>
                                    <div className="absolute inset-0 opacity-10" aria-hidden="true">
                                        <div className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 border-2 border-white rounded-full" />
                                        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full" />
                                        <div className="absolute top-1/2 right-3 sm:right-4 w-2 h-2 bg-white rounded-full" />
                                    </div>

                                    <div className="relative mb-3 sm:mb-4 flex justify-center">
                                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} aria-hidden="true" />
                                    </div>

                                    <h3 className="text-white font-bold text-xs sm:text-sm md:text-base uppercase tracking-wide">
                                        {category.label}
                                    </h3>

                                    <div className="w-6 h-0.5 sm:w-8 sm:h-0.5 bg-white/50 mx-auto mt-2 group-hover:w-10 sm:group-hover:w-12 transition-all duration-300" aria-hidden="true" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}