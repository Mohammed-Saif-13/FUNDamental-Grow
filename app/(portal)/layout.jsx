"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import VolunteerSidebar from "@/components/volunteer/VolunteerSidebar";
import VolunteerHeader from "@/components/volunteer/VolunteerHeader";

export default function PortalLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <SessionProvider>
            <div className="min-h-screen bg-gray-50">
                <VolunteerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="lg:pl-64 transition-all duration-300">
                    <VolunteerHeader onMenuClick={() => setSidebarOpen(true)} />
                    <main className="p-4 lg:p-6">{children}</main>
                </div>
            </div>
        </SessionProvider>
    );
}