import { prisma } from "@/lib/prisma";
import SettingsPage from "./SettingsPage";

async function getSettings() {
    try {
        const settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            // Create default settings if none exist
            return await prisma.siteSettings.create({
                data: {
                    siteName: "FUNDamental Grow",
                    siteDescription: "Crowdfunding platform for verified causes",
                    contactEmail: "admin@fundamental.com",
                    maintenanceMode: false,
                },
            });
        }

        return settings;
    } catch (error) {
        console.error("Error fetching settings:", error);
        return null;
    }
}

export default async function Page() {
    const settings = await getSettings();
    return <SettingsPage settings={settings} />;
}