import Link from "next/link";
import { Heart } from "lucide-react";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4">
            <div className="w-full max-w-md">
                {/* Logo Section - Same as Navbar */}
                <Link href="/" className="flex items-center gap-2 justify-center mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Heart className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900">FUNDamental</span>
                        <span className="text-xs text-gray-500 -mt-1">Grow</span>
                    </div>
                </Link>

                {children}
            </div>
        </div>
    );
}