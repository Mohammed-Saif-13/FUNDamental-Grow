import { prisma } from "@/lib/prisma";
import ReportsPage from "./ReportsPage";

export const metadata = {
    title: "Reports | Admin Dashboard",
    description: "View analytics and reports",
};

export const dynamic = "force-dynamic";

async function getReportsData() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        totalDonations,
        completedDonations,
        totalRaised,
        last30DaysDonations,
        previous30DaysDonations,
        totalVolunteers,
        approvedVolunteers,
        totalUsers,
        totalContacts,
        unreadContacts,
        categoryStats,
        recentDonations,
        topCampaigns,
        monthlyDonations,
    ] = await Promise.all([
        prisma.campaign.count(),
        prisma.campaign.count({ where: { status: "active" } }),
        prisma.campaign.count({ where: { status: "completed" } }),
        prisma.donation.count(),
        prisma.donation.count({ where: { paymentStatus: "completed" } }),
        prisma.donation.aggregate({
            where: { paymentStatus: "completed" },
            _sum: { amount: true },
        }),
        prisma.donation.aggregate({
            where: {
                paymentStatus: "completed",
                createdAt: { gte: thirtyDaysAgo },
            },
            _sum: { amount: true },
            _count: true,
        }),
        prisma.donation.aggregate({
            where: {
                paymentStatus: "completed",
                createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
            },
            _sum: { amount: true },
            _count: true,
        }),
        prisma.volunteer.count(),
        prisma.volunteer.count({ where: { status: "approved" } }),
        prisma.user.count(),
        prisma.contact.count(),
        prisma.contact.count({ where: { status: "unread" } }),
        prisma.campaign.groupBy({
            by: ["category"],
            _count: { id: true },
            _sum: { raisedAmount: true },
            where: { status: "active" },
        }),
        prisma.donation.findMany({
            where: { paymentStatus: "completed" },
            orderBy: { createdAt: "desc" },
            take: 10,
            include: {
                campaign: { select: { title: true, slug: true } },
            },
        }),
        prisma.campaign.findMany({
            where: { status: "active" },
            orderBy: { raisedAmount: "desc" },
            take: 5,
            select: {
                id: true,
                title: true,
                slug: true,
                goalAmount: true,
                raisedAmount: true,
                category: true,
            },
        }),
        prisma.$queryRaw`
            SELECT
                TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') as month,
                SUM(amount) as total,
                COUNT(*) as count
            FROM "Donation"
            WHERE "paymentStatus" = 'completed'
            AND "createdAt" >= NOW() - INTERVAL '6 months'
            GROUP BY DATE_TRUNC('month', "createdAt")
            ORDER BY DATE_TRUNC('month', "createdAt") ASC
        `,
    ]);

    const totalRaisedRupees = Math.floor((totalRaised._sum.amount || 0) / 100);
    const last30DaysRupees = Math.floor((last30DaysDonations._sum.amount || 0) / 100);
    const previous30DaysRupees = Math.floor((previous30DaysDonations._sum.amount || 0) / 100);

    const growthPercentage = previous30DaysRupees > 0
        ? Math.round(((last30DaysRupees - previous30DaysRupees) / previous30DaysRupees) * 100)
        : 100;

    return {
        overview: {
            totalCampaigns,
            activeCampaigns,
            completedCampaigns,
            totalDonations: completedDonations,
            totalRaised: totalRaisedRupees,
            totalVolunteers,
            approvedVolunteers,
            totalUsers,
            totalContacts,
            unreadContacts,
        },
        trends: {
            last30Days: {
                donations: last30DaysDonations._count || 0,
                amount: last30DaysRupees,
            },
            previous30Days: {
                donations: previous30DaysDonations._count || 0,
                amount: previous30DaysRupees,
            },
            growthPercentage,
        },
        categoryStats: categoryStats.map((cat) => ({
            category: cat.category,
            count: cat._count.id,
            raised: Math.floor((cat._sum.raisedAmount || 0) / 100),
        })),
        recentDonations: recentDonations.map((d) => ({
            id: d.id,
            donorName: d.anonymous ? "Anonymous" : d.donorName,
            amount: Math.floor(d.amount / 100),
            campaign: d.campaign?.title || "Unknown",
            campaignSlug: d.campaign?.slug,
            createdAt: d.createdAt,
        })),
        topCampaigns: topCampaigns.map((c) => ({
            id: c.id,
            title: c.title,
            slug: c.slug,
            goalAmount: Math.floor(c.goalAmount / 100),
            raisedAmount: Math.floor(c.raisedAmount / 100),
            category: c.category,
            progress: Math.round((c.raisedAmount / c.goalAmount) * 100),
        })),
        monthlyData: monthlyDonations.map((m) => ({
            month: m.month,
            total: Math.floor(Number(m.total) / 100),
            count: Number(m.count),
        })),
    };
}

export default async function Page() {
    const data = await getReportsData();
    return <ReportsPage data={data} />;
}
