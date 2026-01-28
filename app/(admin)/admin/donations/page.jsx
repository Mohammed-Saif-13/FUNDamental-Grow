import { prisma } from "@/lib/prisma";
import { paiseToRupees } from "@/lib/utils/currency";
import DonationsPage from "./DonationsPage";

export const metadata = {
    title: "Donations | Admin Dashboard",
    description: "Track and manage all donations",
};

export const revalidate = 0; // Always fresh data

async function getData() {
    try {
        const [donations, campaigns] = await Promise.all([
            prisma.donation.findMany({
                orderBy: { createdAt: "desc" },
                include: {
                    campaign: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            category: true,
                            organizerName: true,
                        },
                    },
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.campaign.findMany({
                where: { status: "active" },
                select: { id: true, title: true },
                orderBy: { title: "asc" },
            }),
        ]);

        // Convert paise to rupees
        const formattedDonations = donations.map((d) => ({
            ...d,
            amount: paiseToRupees(d.amount),
        }));

        return { donations: formattedDonations, campaigns };
    } catch (error) {
        console.error("Error fetching donations:", error);
        return { donations: [], campaigns: [] };
    }
}

export default async function Page() {
    const { donations, campaigns } = await getData();
    return <DonationsPage initialDonations={donations} campaigns={campaigns} />;
}