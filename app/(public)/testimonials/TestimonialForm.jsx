"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    Star,
    Send,
    CheckCircle,
    MessageSquare,
    Users,
    Heart,
    Award,
    LogIn,
    AlertCircle,
    Sparkles,
    Quote,
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";

const ROLES = [
    { value: "Donor", label: "Donor", icon: Heart, description: "I've donated to campaigns" },
    { value: "Campaign Organizer", label: "Organizer", icon: Users, description: "I've created fundraisers" },
    { value: "Volunteer", label: "Volunteer", icon: Award, description: "I volunteer here" },
    { value: "NGO Partner", label: "NGO Partner", icon: MessageSquare, description: "Organization partner" },
];

const RATING_LABELS = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Great",
    5: "Excellent!",
};

export default function TestimonialForm() {
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

    // Autofill from session
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

        if (!formData.name || formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.role) {
            newErrors.role = "Please select how you used our platform";
        }

        if (!formData.message || formData.message.trim().length < 20) {
            newErrors.message = "Please write at least 20 characters";
        }

        if (formData.message.length > 500) {
            newErrors.message = "Message cannot exceed 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    message: formData.message.trim(),
                }),
            });

            const data = await res.json();

            if (data.success) {
                setSubmitted(true);
                toast.success("Thank you for your feedback!");
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch {
            toast.error("Failed to submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success State
    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Hero */}
                <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 sm:py-16 md:py-24">
                    <Container>
                        <div className="max-w-lg mx-auto text-center px-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                Thank You! 🎉
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                                Your testimonial has been submitted successfully. Our team will review it and once approved, it will appear on our website.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/campaigns">
                                    <Button className="w-full sm:w-auto cursor-pointer">
                                        <Heart className="w-4 h-4" />
                                        Explore Campaigns
                                    </Button>
                                </Link>
                                <Link href="/">
                                    <Button variant="outline" className="w-full sm:w-auto cursor-pointer">
                                        Back to Home
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Container>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 sm:py-16 md:py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }} />

                <Container className="relative z-10">
                    <div className="max-w-3xl mx-auto text-center px-4">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-100 rounded-full mb-4 sm:mb-6">
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                            <span className="text-xs sm:text-sm font-medium text-orange-700">Share Your Story</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                            We'd Love to <span className="text-orange-500">Hear From You</span>
                        </h1>

                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Your experience matters to us and helps others discover the impact they can make through FUNDamental Grow.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Form Section */}
            <section className="py-8 sm:py-12 md:py-16">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 order-2 lg:order-1">
                            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
                                {/* Why Share Card */}
                                <Card className="p-4 sm:p-6 bg-white">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                                        Why Share Your Experience?
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Heart className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Inspire Others</p>
                                                <p className="text-xs text-gray-500">Your story can motivate others to give</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Users className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Build Trust</p>
                                                <p className="text-xs text-gray-500">Help new donors feel confident</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Award className="w-4 h-4 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Help Us Improve</p>
                                                <p className="text-xs text-gray-500">Your feedback shapes our platform</p>
                                            </div>
                                        </li>
                                    </ul>
                                </Card>

                                {/* Quote Card */}
                                <Card className="p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
                                    <Quote className="w-6 h-6 text-orange-300 mb-3" />
                                    <p className="text-sm text-gray-700 italic leading-relaxed">
                                        "The best way to find yourself is to lose yourself in the service of others."
                                    </p>
                                    <p className="text-xs text-orange-600 font-semibold mt-3">— Mahatma Gandhi</p>
                                </Card>
                            </div>
                        </div>

                        {/* Form Card */}
                        <div className="lg:col-span-2 order-1 lg:order-2">
                            <Card className="p-4 sm:p-6 md:p-8 bg-white border-t-4 border-orange-500">
                                {/* Login Prompt */}
                                {!isAuthenticated && !isLoading && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                        <div className="flex items-center gap-2 sm:gap-3 text-center sm:text-left">
                                            <LogIn className="w-5 h-5 text-orange-500 shrink-0 hidden sm:block" />
                                            <p className="text-xs sm:text-sm text-orange-700">
                                                <span className="font-medium">Sign in</span> to autofill your details!
                                            </p>
                                        </div>
                                        <Link
                                            href="/login"
                                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                                        >
                                            Sign In
                                        </Link>
                                    </div>
                                )}

                                {/* Logged in user info */}
                                {isAuthenticated && (
                                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shrink-0 text-sm sm:text-base">
                                            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{session?.user?.name}</p>
                                            <p className="text-xs sm:text-sm text-gray-500 truncate">{session?.user?.email}</p>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Share Your Experience</h2>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        Fields marked with <span className="text-red-500">*</span> are required
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                                    {/* Name & Email - Only for non-authenticated */}
                                    {!isAuthenticated && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Full Name"
                                                name="name"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleChange}
                                                error={errors.name}
                                                required
                                            />
                                            <Input
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                error={errors.email}
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Role Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                            How did you use FUNDamental Grow? <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                            {ROLES.map((role) => {
                                                const Icon = role.icon;
                                                const isSelected = formData.role === role.value;
                                                return (
                                                    <button
                                                        key={role.value}
                                                        type="button"
                                                        onClick={() => handleRoleSelect(role.value)}
                                                        className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${isSelected
                                                                ? "border-orange-500 bg-orange-50"
                                                                : "border-gray-200 hover:border-orange-300"
                                                            }`}
                                                    >
                                                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-1.5 sm:mb-2 ${isSelected ? "text-orange-500" : "text-gray-400"}`} />
                                                        <p className={`font-semibold text-xs sm:text-sm ${isSelected ? "text-orange-600" : "text-gray-900"}`}>
                                                            {role.label}
                                                        </p>
                                                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1">{role.description}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.role && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.role}
                                            </p>
                                        )}
                                    </div>

                                    {/* Rating */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                            Your Rating <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => handleRatingClick(star)}
                                                    className="p-0.5 sm:p-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                                                >
                                                    <Star
                                                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${star <= formData.rating
                                                                ? "text-yellow-400 fill-yellow-400"
                                                                : "text-gray-300"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                            <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                                                {RATING_LABELS[formData.rating]}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <Textarea
                                            label="Your Experience"
                                            name="message"
                                            placeholder="Tell us about your experience with FUNDamental Grow. What did you like? How did it help you or others?"
                                            value={formData.message}
                                            onChange={handleChange}
                                            error={errors.message}
                                            rows={5}
                                            required
                                        />
                                        <div className="flex justify-between mt-1.5">
                                            <p className="text-xs text-gray-400">Minimum 20 characters</p>
                                            <p className={`text-xs ${formData.message.length > 500 ? "text-red-500" : formData.message.length > 400 ? "text-orange-500" : "text-gray-400"}`}>
                                                {formData.message.length}/500
                                            </p>
                                        </div>
                                    </div>

                                    {/* Info Box */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                                        <div className="flex gap-2 sm:gap-3">
                                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-xs sm:text-sm text-blue-800">
                                                <p className="font-medium mb-1">Review Process</p>
                                                <p className="text-blue-700">
                                                    Your testimonial will be reviewed by our team before being published.
                                                    This usually takes 24-48 hours.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        className="w-full cursor-pointer"
                                    >
                                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                        {isSubmitting ? "Submitting..." : "Submit Testimonial"}
                                    </Button>

                                    <p className="text-center text-[10px] sm:text-xs text-gray-500">
                                        By submitting, you agree that your testimonial may be displayed on our website after review.
                                    </p>
                                </form>
                            </Card>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}