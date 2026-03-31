"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <SessionProvider>
            <div className="min-h-screen bg-gray-50">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />

                <div
                    className={`transition-all duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-64"
                        }`}
                >
                    <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
                    <main className="p-4 lg:p-6">{children}</main>
                </div>
            </div>
        </SessionProvider>
    );
}