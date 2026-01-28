import Hero from "@/components/public/home/Hero";
import StatsCounter from "@/components/public/home/StatsCounter";
import Categories from "@/components/public/home/Categories";
import dynamic from "next/dynamic";

const FeaturedCampaigns = dynamic(() => import("@/components/public/home/FeaturedCampaigns"));
const HowItWorks = dynamic(() => import("@/components/public/home/HowItWorks"));
const WhyChooseUs = dynamic(() => import("@/components/public/home/WhyChooseUs"));
const Testimonials = dynamic(() => import("@/components/public/home/Testimonials"));
const CallToAction = dynamic(() => import("@/components/public/home/CallToAction"));

export const metadata = {
    title: "FUNDamental Grow - Transparent Crowdfunding Platform",
    description: "India's most trusted crowdfunding platform. Start a fundraiser or donate to verified campaigns for education, medical, NGO, and community causes.",
    keywords: ["crowdfunding", "fundraising", "donate", "charity", "NGO", "medical fundraising", "education fund", "India"],
    openGraph: {
        title: "FUNDamental Grow - Transparent Crowdfunding Platform",
        description: "India's most trusted crowdfunding platform. Start a fundraiser or donate to verified campaigns.",
        type: "website",
        locale: "en_IN",
        siteName: "FUNDamental Grow",
    },
};

export default function HomePage() {
    return (
        <>
            <Hero />
            <StatsCounter />
            <Categories />
            <FeaturedCampaigns />
            <HowItWorks />
            <WhyChooseUs />
            <Testimonials />
            <CallToAction />
        </>
    );
}