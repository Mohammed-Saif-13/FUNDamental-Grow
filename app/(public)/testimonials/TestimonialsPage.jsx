"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Star, Send, CheckCircle, MessageSquare, Users, Heart, Award, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";

const ROLES = [
    { value: "Donor", label: "Donor", icon: Heart, description: "I've donated to campaigns" },
    { value: "Campaign Organizer", label: "Campaign Organizer", icon: Users, description: "I've created fundraisers" },
    { value: "Volunteer", label: "Volunteer", icon: Award, description: "I volunteer with FUNDamental Grow" },
    { value: "NGO Partner", label: "NGO Partner", icon: MessageSquare, description: "My organization partners with FUNDamental Grow" },
];

export default function TestimonialsPage() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        rating: 5,
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    // Autofill name and email from session when user is logged in
    useEffect(() => {
        if (session?.user) {
            setFormData((prev) => ({
                ...prev,
                name: session.user.name || "",
                email: session.user.email || "",
            }));
        }
    }, [session]);

    const handleRatingClick = (rating) => {
        setFormData((prev) => ({ ...prev, rating }));
    };

    const handleRoleSelect = (role) => {
        setFormData((prev) => ({ ...prev, role }));
        setErrors((prev) => ({ ...prev, role: null }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name || formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.role) {
            newErrors.role = "Please select your role";
        }

        if (!formData.message || formData.message.length < 20) {
            newErrors.message = "Message must be at least 20 characters";
        }

        if (formData.message.length > 500) {
            newErrors.message = "Message cannot exceed 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setSubmitted(true);
                toast.success("Thank you for your feedback!");
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch {
            toast.error("Failed to submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <section className="py-16 md:py-24 min-h-[80vh] flex items-center">
                <Container>
                    <div className="max-w-lg mx-auto text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
                        <p className="text-gray-600 mb-8">
                            Your testimonial has been submitted successfully. Our team will review it and once approved, it will appear on our website.
                        </p>
                        <Button onClick={() => window.location.href = "/"} className="cursor-pointer">
                            Back to Home
                        </Button>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24">
            <Container>
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
                            Share Your Story
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            We'd Love to Hear From You
                        </h1>
                        <p className="text-gray-600">
                            Your experience matters to us and helps others discover the impact they can make through FUNDamental Grow.
                        </p>
                    </div>

                    {/* Login Prompt for non-authenticated users */}
                    {!isAuthenticated && !isLoading && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-center sm:text-left">
                                <LogIn className="w-5 h-5 text-orange-500 shrink-0 hidden sm:block" />
                                <p className="text-sm text-orange-700">
                                    <span className="font-medium">Sign in</span> to autofill your details and submit faster!
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                        {/* Logged in user info banner */}
                        {isAuthenticated && (
                            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold shrink-0">
                                    {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{session?.user?.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{session?.user?.email}</p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                            </div>
                        )}

                        {/* Name & Email - Hidden when logged in, shown when not logged in */}
                        {!isAuthenticated && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.name ? "border-red-500" : "border-gray-200"}`}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? "border-red-500" : "border-gray-200"}`}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                            </div>
                        )}

                        {/* Role Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">How did you use FUNDamental Grow? *</label>
                            <div className="grid grid-cols-2 gap-3">
                                {ROLES.map((role) => {
                                    const Icon = role.icon;
                                    const isSelected = formData.role === role.value;
                                    return (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => handleRoleSelect(role.value)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                                                isSelected
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-200 hover:border-orange-300"
                                            }`}
                                        >
                                            <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-orange-500" : "text-gray-400"}`} />
                                            <p className={`font-medium text-sm ${isSelected ? "text-orange-600" : "text-gray-900"}`}>
                                                {role.label}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.role && <p className="text-red-500 text-xs mt-2">{errors.role}</p>}
                        </div>

                        {/* Rating */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Your Rating *</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingClick(star)}
                                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${
                                                star <= formData.rating
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-gray-500 self-center">
                                    {formData.rating === 5 ? "Excellent!" : formData.rating === 4 ? "Great!" : formData.rating === 3 ? "Good" : formData.rating === 2 ? "Fair" : "Poor"}
                                </span>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience *</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tell us about your experience with FUNDamental Grow. What did you like? How did it help you or others?"
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${errors.message ? "border-red-500" : "border-gray-200"}`}
                            />
                            <div className="flex justify-between mt-1">
                                {errors.message ? (
                                    <p className="text-red-500 text-xs">{errors.message}</p>
                                ) : (
                                    <p className="text-gray-400 text-xs">Minimum 20 characters</p>
                                )}
                                <p className={`text-xs ${formData.message.length > 500 ? "text-red-500" : "text-gray-400"}`}>
                                    {formData.message.length}/500
                                </p>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Testimonial
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            By submitting, you agree that your testimonial may be displayed on our website after review.
                        </p>
                    </form>
                </div>
            </Container>
        </section>
    );
}
