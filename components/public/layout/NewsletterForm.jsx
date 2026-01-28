"use client";

import { useState, useCallback } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = useCallback(async (e) => {
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

    if (isSubscribed) {
        return (
            <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Thanks for subscribing!</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Subscribe</span>
                    </>
                )}
            </button>
        </form>
    );
}