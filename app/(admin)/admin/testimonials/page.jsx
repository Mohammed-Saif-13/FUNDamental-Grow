import { prisma } from "@/lib/prisma";
import TestimonialsPage from "./TestimonialsPage";

export const metadata = {
    title: "Manage Testimonials | Admin",
    description: "Review and manage user testimonials",
};

async function getData() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { createdAt: "desc" },
        });

        return { testimonials };
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return { testimonials: [] };
    }
}

export default async function Page() {
    const data = await getData();
    return <TestimonialsPage testimonials={data.testimonials} />;
}