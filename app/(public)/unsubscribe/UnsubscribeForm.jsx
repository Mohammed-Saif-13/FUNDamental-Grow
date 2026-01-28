"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailX, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";

export default function UnsubscribeForm() {
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get("email") || "";

    const [email, setEmail] = useState(emailFromUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [isUnsubscribed, setIsUnsubscribed] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/newsletter/unsubscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await res.json();

            if (data.success) {
                setIsUnsubscribed(true);
                toast.success("Successfully unsubscribed");
            } else {
                setError(data.message || "Failed to unsubscribe");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 sm:py-16 md:py-24">
            <Container>
                <div className="max-w-md mx-auto px-4">
                    {isUnsubscribed ? (
                        /* Success State */
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                You've Been Unsubscribed
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 mb-6">
                                You will no longer receive newsletter emails from us.
                                We're sorry to see you go!
                            </p>
                            <div className="space-y-3">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Changed your mind?
                                </p>
                                <Link href="/">
                                    <Button variant="outline" className="w-full cursor-pointer">
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Home
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Unsubscribe Form */
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
                            <div className="text-center mb-6">
                                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MailX className="w-7 h-7 text-orange-500" />
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    Unsubscribe from Newsletter
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Enter your email to unsubscribe from our mailing list.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError("");
                                        }}
                                        placeholder="your@email.com"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm ${error ? "border-red-300 bg-red-50" : "border-gray-200"
                                            }`}
                                        disabled={isLoading}
                                    />
                                    {error && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full cursor-pointer"
                                    variant="outline"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <MailX className="w-4 h-4" />
                                            Unsubscribe
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                <p className="text-xs text-gray-500 mb-3">
                                    Changed your mind? Stay connected with us!
                                </p>
                                <Link
                                    href="/"
                                    className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                                >
                                    ← Back to Home
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}