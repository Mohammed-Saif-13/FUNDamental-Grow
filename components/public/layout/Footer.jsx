"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Heart, Mail, Phone, Linkedin, Instagram, Facebook, ArrowUp, Send, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { APP_NAME, SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Container from "./Container";

// Static value - runs once at build
const CURRENT_YEAR = new Date().getFullYear();

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const FooterLink = ({ href, children }) => (
    <Link href={href} className="text-gray-400 hover:text-white transition-colors text-sm relative group">
        {children}
        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
    </Link>
);

const SocialLink = ({ href, icon: Icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
    >
        {typeof Icon === "function" ? <Icon /> : <Icon className="w-4 h-4" />}
    </a>
);

export default function Footer() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Optimized scroll listener with RAF
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setShowScrollTop(window.scrollY > 400);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNewsletter = useCallback(async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await res.json();

            if (data.success) {
                setIsSubscribed(true);
                setEmail("");
                toast.success(data.message || "Subscribed successfully!");
            } else {
                toast.error(data.message || "Failed to subscribe");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [email]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <footer className="relative bg-linear-to-b from-gray-900 to-gray-950 text-white">
            {/* Top Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-500 via-orange-400 to-orange-500" />

            <Container className="pt-10 pb-6 sm:pt-12 sm:pb-8 md:pt-16 md:pb-10 px-4">
                {/* Main Grid - Mobile Optimized */}
                <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-10">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
                            </div>
                            <span className="text-lg sm:text-xl font-bold">{APP_NAME}</span>
                        </Link>
                        <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                            Empowering communities through transparent crowdfunding. Every donation creates impact.
                        </p>
                        <div className="flex gap-3">
                            <SocialLink href={SOCIAL_LINKS.LINKEDIN} icon={Linkedin} label="LinkedIn" />
                            <SocialLink href={SOCIAL_LINKS.TWITTER} icon={XIcon} label="Twitter" />
                            <SocialLink href={SOCIAL_LINKS.INSTAGRAM} icon={Instagram} label="Instagram" />
                            <SocialLink href={SOCIAL_LINKS.FACEBOOK} icon={Facebook} label="Facebook" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <FooterLink href="/">Home</FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/about">About Us</FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/campaigns">All Campaigns</FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/contact">Contact Support</FooterLink>
                            </li>
                        </ul>
                    </div>

                    {/* Get Involved */}
                    <div>
                        <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Get Involved</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <FooterLink href="/volunteer">Become Volunteer</FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/start-fundraiser">Start Fundraiser</FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/testimonials">Share Experience</FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Newsletter</h3>
                        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                            Subscribe for updates and impact stories.
                        </p>

                        {isSubscribed ? (
                            <div className="flex items-center gap-2 text-green-400 py-2">
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm">Thanks for subscribing!</span>
                            </div>
                        ) : (
                            <form onSubmit={handleNewsletter} className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 pr-10 sm:pr-12 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-xs sm:text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                    aria-label="Subscribe"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-spin" />
                                    ) : (
                                        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

            {/* Contact */}
            <div className="col-span-2 md:col-span-1">
                <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <p className="text-gray-400 leading-relaxed">{CONTACT_INFO.ADDRESS}</p>
                    <a
                        href={`tel:${CONTACT_INFO.PHONE}`}
                        className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 shrink-0" />
                        {CONTACT_INFO.PHONE}
                    </a>
                    <a
                        href={`mailto:${CONTACT_INFO.EMAIL}`}
                        className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors break-all"
                    >
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 shrink-0" />
                        {CONTACT_INFO.EMAIL}
                    </a>
                </div>
            </div>
        </div>

                {/* CTA Section - Mobile Optimized */ }
    <div className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-6 md:p-8 bg-linear-to-r from-gray-800/50 to-gray-800/30 rounded-xl sm:rounded-2xl border border-gray-800">
        <div className="flex flex-col items-center gap-3 sm:gap-4 text-center md:flex-row md:justify-between md:text-left">
            <div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-1">Ready to make a difference?</h4>
                <p className="text-gray-400 text-xs sm:text-sm">Start supporting causes you care about today.</p>
            </div>
            <div className="flex flex-col w-full gap-2 sm:gap-3 sm:flex-row sm:w-auto">
                <Link href="/campaigns" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto cursor-pointer text-sm">
                        <Heart className="w-4 h-4" />
                        Donate Now
                    </Button>
                </Link>
                <Link href="/volunteer" className="w-full sm:w-auto">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto border-gray-600 text-white hover:bg-gray-800 cursor-pointer text-sm"
                    >
                        Become Volunteer
                    </Button>
                </Link>
            </div>
        </div>
    </div>

    {/* Bottom Bar - Mobile Optimized */ }
    <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-800 flex flex-col items-center gap-2 sm:gap-3 md:flex-row md:justify-between">
        <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
            © {CURRENT_YEAR} {APP_NAME}. All rights reserved.
        </p>
        <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500 fill-orange-500" /> for Humanity
        </p>
    </div>
            </Container >

    {/* Scroll to Top - Mobile Optimized */}
    <button
        onClick={scrollToTop}
        className={cn(
            "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer",
            showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        aria-label="Scroll to top"
    >
        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
        </footer >
    );
}