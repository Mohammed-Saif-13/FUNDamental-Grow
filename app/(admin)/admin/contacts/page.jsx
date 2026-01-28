import { prisma } from "@/lib/prisma";
import ContactsPage from "./ContactsPage";

async function getData() {
    const contacts = await prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 100, // Limit to prevent large queries
    });

    return { contacts };
}

export const revalidate = 30;

export default async function Page() {
    const data = await getData();
    return <ContactsPage contacts={data.contacts} />;
}