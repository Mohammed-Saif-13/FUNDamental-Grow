"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Heart, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Container from "./Container";

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const isAdmin = session?.user?.role === "ADMIN";

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen || userMenuOpen) {
            setMobileMenuOpen(false);
            setUserMenuOpen(false);
        }
    }, [pathname]);

    useEffect(() => {
        if (!userMenuOpen) return;

        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userMenuOpen]);

    const isActive = useCallback(
        (href) => {
            if (href === "/") return pathname === "/";
            return pathname.startsWith(href);
        },
        [pathname]
    );

    const toggleUserMenu = useCallback((e) => {
        e.stopPropagation();
        setUserMenuOpen((prev) => !prev);
    }, []);

    const handleLogout = useCallback(async (e) => {
        e.preventDefault();
        setUserMenuOpen(false);
        await signOut({ callbackUrl: "/" });
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
            )}
        >
            <Container>
                <nav className="flex items-center justify-between h-14 sm:h-16 md:h-20">
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white fill-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                                {APP_NAME.split(" ")[0]}
                            </span>
                            <span className="text-xs text-gray-500 -mt-1 hidden sm:block">
                                {APP_NAME.split(" ")[1]}
                            </span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive(link.href)
                                        ? "text-orange-600 bg-orange-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {session ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={toggleUserMenu}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-7 h-7 lg:w-8 lg:h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs lg:text-sm font-semibold text-orange-600">
                                            {session.user?.name?.charAt(0) || "U"}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                                        {isAdmin ? "Admin" : session.user?.name?.split(" ")[0] || "User"}
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            "w-4 h-4 text-gray-400 transition-transform",
                                            userMenuOpen && "rotate-180"
                                        )}
                                    />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                        {isAdmin && (
                                            <>
                                                <Link
                                                    href="/admin/dashboard"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    Admin Dashboard
                                                </Link>
                                                <div className="border-t border-gray-100 my-1" />
                                            </>
                                        )}
                                        <Link
                                            href="/profile"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            My Profile
                                        </Link>
                                        <div className="border-t border-gray-100 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button variant="outline" size="sm" className="cursor-pointer">
                                    Login
                                </Button>
                            </Link>
                        )}

                        <Link href="/campaigns">
                            <Button size="sm" className="cursor-pointer">
                                <Heart className="w-4 h-4" />
                                Donate Now
                            </Button>
                        </Link>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </button>
                </nav>
            </Container>

            <div
                className={cn(
                    "md:hidden fixed inset-x-0 top-14 sm:top-16 bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto",
                    mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                )}
            >
                <Container className="py-4">
                    <div className="flex flex-col gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-colors",
                                    isActive(link.href)
                                        ? "text-orange-600 bg-orange-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <hr className="my-4 border-gray-100" />

                    <div className="flex flex-col gap-3">
                        {session ? (
                            <>
                                <div className="flex items-center gap-3 px-4 py-2">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-semibold text-orange-600">
                                            {session.user?.name?.charAt(0) || "U"}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                            {isAdmin ? "Admin" : session.user?.name}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">{session.user?.email}</p>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <Link href="/admin/dashboard" className="w-full">
                                        <Button variant="outline" className="w-full justify-start cursor-pointer">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Admin Dashboard
                                        </Button>
                                    </Link>
                                )}

                                <Link href="/profile" className="w-full">
                                    <Button variant="outline" className="w-full justify-start cursor-pointer">
                                        <User className="w-4 h-4" />
                                        My Profile
                                    </Button>
                                </Link>

                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    className="w-full justify-start text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href="/login" className="w-full">
                                <Button variant="outline" className="w-full justify-center cursor-pointer">
                                    Login / Sign Up
                                </Button>
                            </Link>
                        )}

                        <Link href="/campaigns" className="w-full">
                            <Button className="w-full justify-center cursor-pointer">
                                <Heart className="w-4 h-4" />
                                Donate Now
                            </Button>
                        </Link>
                    </div>
                </Container>
            </div>

            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 top-14 sm:top-16 bg-black/20 -z-10"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </header>
    );
}