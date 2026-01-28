"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AdminError({ error, reset }) {
    useEffect(() => {
        console.error("Admin panel error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Error</h1>
                <p className="text-gray-600 mb-6">
                    Something went wrong in the admin panel. This has been logged.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>
                    <Link
                        href="/admin/dashboard"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}