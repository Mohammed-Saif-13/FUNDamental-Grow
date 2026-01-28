import { prisma } from "@/lib/prisma";
import RequestsPage from "./RequestsPage";

async function getRequests() {
    const requests = await prisma.fundraiserRequest.findMany({
        orderBy: { createdAt: "desc" },
    });

    // Convert goal amounts from rupees (stored as number) - no conversion needed
    return requests;
}

export const revalidate = 60;

export default async function Page() {
    const requests = await getRequests();
    return <RequestsPage requests={requests} />;
}