"use client";

import { Menu, Bell } from "lucide-react";
import { useSession } from "next-auth/react";

export default function VolunteerHeader({ onMenuClick }) {
    const { data: session } = useSession();

    return (
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:px-6">
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
                <Menu className="h-6 w-6" />
            </button>

            <div className="hidden lg:block"></div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                        {session?.user?.name?.charAt(0) || "V"}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-gray-800">{session?.user?.name || "Volunteer"}</p>
                        <p className="text-xs text-gray-500 capitalize">{session?.user?.role || "volunteer"}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}