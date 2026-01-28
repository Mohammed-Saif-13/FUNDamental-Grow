import { prisma } from "@/lib/prisma";
import RequestsPage from "./RequestsPage";

async function getRequests() {
    const requests = await prisma.fundraiserRequest.findMany({
        orderBy: { createdAt: "desc" },
    });

    // Convert goal amounts from rupees (stored as number) - no conversion needed
    return requests;
}

// Fixed: Use dynamic rendering instead of revalidate for Admin pages to prevent build errors
export const dynamic = "force-dynamic";

export default async function Page() {
    const requests = await getRequests();
    return <RequestsPage requests={requests} />;
}