"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Megaphone,
    ClipboardList,
    HandCoins,
    Users,
    UserCheck,
    Mail,
    BarChart3,
    Settings,
    ExternalLink,
    LogOut,
    ChevronLeft,
    Heart,
    X,
    MessageSquareQuote,
    Newspaper,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const menuItems = [
    { href: "/", label: "View Website", icon: ExternalLink, external: true },
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
    { href: "/admin/requests", label: "Requests", icon: ClipboardList },
    { href: "/admin/donations", label: "Donations", icon: HandCoins },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/volunteers", label: "Volunteers", icon: UserCheck },
    { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { href: "/admin/contacts", label: "Contacts", icon: Mail },
    { href: "/admin/newsletter", label: "Newsletter", icon: Newspaper },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose, collapsed, setCollapsed }) {
    const pathname = usePathname();
    const scrollRef = useRef(null);

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        const handleWheel = (e) => {
            const { scrollTop, scrollHeight, clientHeight } = scrollElement;
            const isAtTop = scrollTop === 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight;

            if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                return;
            }

            e.stopPropagation();
        };

        scrollElement.addEventListener("wheel", handleWheel, { passive: false });
        return () => scrollElement.removeEventListener("wheel", handleWheel);
    }, []);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    "fixed top-0 left-0 bg-slate-800 text-white z-50 transition-all duration-300",
                    collapsed ? "w-20" : "w-64",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
                style={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden"
                }}
            >
                <div className="flex items-center gap-3 p-4 border-b border-slate-700" style={{ flexShrink: 0 }}>
                    <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Heart className="h-6 w-6 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <h1 className="font-bold text-lg">FUNDamental</h1>
                            <p className="text-xs text-slate-400">Admin Panel</p>
                        </div>
                    )}
                    <button onClick={onClose} className="lg:hidden ml-auto text-slate-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div
                    ref={scrollRef}
                    className="p-3 space-y-1 sidebar-menu-scroll"
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden"
                    }}
                >
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const isExternal = item.external;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                target={isExternal ? "_blank" : undefined}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                    isActive
                                        ? "bg-orange-500 text-white"
                                        : "text-slate-300 hover:bg-slate-700 hover:text-white",
                                    collapsed && "justify-center px-2"
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {!collapsed && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-3 border-t border-slate-700 space-y-1" style={{ flexShrink: 0 }}>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={cn(
                            "hidden lg:flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:bg-slate-700 hover:text-white rounded-xl transition-all",
                            collapsed && "justify-center px-2"
                        )}
                    >
                        <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
                        {!collapsed && <span className="font-medium">Collapse Menu</span>}
                    </button>

                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-slate-700 hover:text-red-300 rounded-xl transition-all",
                            collapsed && "justify-center px-2"
                        )}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}