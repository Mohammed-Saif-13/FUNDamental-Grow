"use client";

import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    phone: z.string().optional()
        .refine(val => !val || /^[0-9]{10}$/.test(val), {
            message: "Phone number must be 10 digits",
        }),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = useCallback(async (data) => {
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name.trim(),
                    email: data.email.toLowerCase().trim(),
                    phone: data.phone?.trim(),
                    password: data.password,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                if (result.message?.includes("email")) {
                    toast.error("Email already exists");
                } else {
                    toast.error(result.message || "Failed to create account");
                }
                setIsSubmitting(false);
                return;
            }

            toast.success("Account created!");
            router.push("/login?registered=true");
        } catch (err) {
            toast.error("Something went wrong");
            setIsSubmitting(false);
        }
    }, [router]);

    // ✅ FIXED: Google Sign Up - Remove redirect: false for OAuth
    const handleGoogleSignUp = useCallback(async () => {
        setIsGoogleLoading(true);
        try {
            // OAuth providers need browser redirect - don't use redirect: false
            await signIn("google", {
                callbackUrl: "/"
            });
            // This code won't execute because page will redirect
        } catch (err) {
            // Only catches server-side errors before redirect
            toast.error("Failed to sign up with Google");
            setIsGoogleLoading(false);
        }
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Create Account
                </h1>
                <p className="text-gray-600">
                    Join FUNDamental Grow and make a difference
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        {...register("name")}
                        autoComplete="name"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${errors.name ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Full Name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Email */}
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="email"
                        {...register("email")}
                        autoComplete="email"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Email Address"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Phone (Optional) */}
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="tel"
                        {...register("phone")}
                        autoComplete="tel"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${errors.phone ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Phone (Optional)"
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                </div>

                {/* Password */}
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        autoComplete="new-password"
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type={showConfirm ? "text" : "password"}
                        {...register("confirmPassword")}
                        autoComplete="new-password"
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Confirm Password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <UserPlus className="w-5 h-5" />
                            Sign Up
                        </>
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
            </div>

            {/* Google Button */}
            <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGoogleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign up with Google
                    </>
                )}
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-orange-500 font-semibold hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    );
}