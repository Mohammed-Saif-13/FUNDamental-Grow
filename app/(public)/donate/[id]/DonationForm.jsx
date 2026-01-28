// components/donation/DonationForm.jsx

"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    Heart,
    Shield,
    Lock,
    CheckCircle,
    User,
    Mail,
    Phone,
    IndianRupee,
    AlertTriangle,
    Loader2,
    X,
} from "lucide-react";

import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { useRazorpay } from "@/hooks/useRazorpay";
import { donationSchema } from "@/lib/validations/donation";
import { DONATION_CONFIG, RAZORPAY_CONFIG } from "@/lib/constants/donation";
import { formatCurrency, calculateProgress } from "@/lib/utils";

export default function DonationForm({ campaign }) {
    const router = useRouter();
    const { loadScript, openPayment } = useRazorpay();

    // States
    const [isProcessing, setIsProcessing] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(null);

    // Memoized calculations
    const progress = useMemo(
        () => calculateProgress(campaign.raisedAmount, campaign.goalAmount),
        [campaign.raisedAmount, campaign.goalAmount]
    );

    // remainingAmount is already in rupees (converted in page.jsx)
    const remainingAmount = useMemo(
        () => Math.max(0, campaign.goalAmount - campaign.raisedAmount),
        [campaign.goalAmount, campaign.raisedAmount]
    );

    const maxAllowedDonation = useMemo(
        () => Math.min(DONATION_CONFIG.MAX_AMOUNT, remainingAmount || DONATION_CONFIG.MAX_AMOUNT),
        [remainingAmount]
    );

    const isGoalReached = useMemo(
        () => remainingAmount <= 0,
        [remainingAmount]
    );

    // React Hook Form
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(donationSchema.omit({ campaignId: true })), // IMPORTANT: omit campaignId
        defaultValues: {
            amount: "",
            donorName: "",
            donorEmail: "",
            donorPhone: "",
            message: "",
            anonymous: false,
        },
    });

    const watchedAmount = watch("amount");

    // Handle preset amount selection
    const handlePresetSelect = useCallback((amount) => {
        if (amount > maxAllowedDonation || isGoalReached) return;

        setSelectedPreset(amount);
        setValue("amount", amount, { shouldValidate: true });
    }, [maxAllowedDonation, isGoalReached, setValue]);

    // Handle custom amount input
    const handleCustomAmount = useCallback((e) => {
        const value = e.target.value;
        setSelectedPreset(null);
        setValue("amount", value ? parseInt(value) : "", { shouldValidate: true });
    }, [setValue]);

    // Create Razorpay Order
    const createOrder = useCallback(async (data) => {
        const response = await fetch("/api/payment/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: data.amount,
                campaignId: campaign.id,
                donorName: data.donorName,
                donorEmail: data.donorEmail,
                donorPhone: data.donorPhone || null,
                message: data.message || null,
                anonymous: data.anonymous || false,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create order");
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to create order");
        }

        return result;
    }, [campaign.id]);

    // Verify Payment
    const verifyPayment = useCallback(async (paymentResponse) => {
        const response = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                orderId: paymentResponse.razorpay_order_id,
                paymentId: paymentResponse.razorpay_payment_id,
                signature: paymentResponse.razorpay_signature,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Verification failed");
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Verification failed");
        }

        return result;
    }, []);

    // Process Payment
    const processPayment = useCallback(async (data) => {
        setIsProcessing(true);

        try {
            // Load Razorpay script
            const scriptLoaded = await loadScript();
            if (!scriptLoaded) {
                toast.error("Payment gateway failed to load");
                setIsProcessing(false);
                return;
            }

            // Create order
            const orderData = await createOrder(data);

            // Razorpay options
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "FUNDamental Grow",
                description: `Donation for ${campaign.title}`,
                order_id: orderData.orderId,
                prefill: {
                    name: data.donorName,
                    email: data.donorEmail,
                    contact: data.donorPhone || "",
                },
                theme: {
                    color: "#f97316",
                },
                handler: async (response) => {
                    try {
                        await verifyPayment(response);
                        toast.success("Thank you for your donation! 🎉");
                        router.push(`/thank-you?campaign=${campaign.slug}&amount=${data.amount}`);
                    } catch (error) {
                        console.error("Verification error:", error);
                        toast.error(error.message || "Payment verification failed");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                    },
                },
            };

            // Open Razorpay
            openPayment(options);
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.message || "Payment failed");
            setIsProcessing(false);
        }
    }, [loadScript, createOrder, verifyPayment, openPayment, campaign, router]);

    // Form Submit Handler
    const onSubmit = useCallback(async (data) => {
        if (data.amount > remainingAmount && remainingAmount > 0) {
            toast.error(`Campaign needs only ₹${remainingAmount.toLocaleString()} more`);
            return;
        }

        if (data.amount >= DONATION_CONFIG.WARNING_THRESHOLD && !showWarning) {
            setShowWarning(true);
            return;
        }

        await processPayment(data);
    }, [remainingAmount, showWarning, processPayment]);

    // Confirm Large Donation
    const handleConfirmLargeDonation = useCallback(() => {
        setShowWarning(false);
        handleSubmit(processPayment)();
    }, [handleSubmit, processPayment]);

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12">
            {/* Back Button */}
            <Container>
                <Link
                    href={`/campaigns/${campaign.slug}`}
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Campaign</span>
                </Link>
            </Container>

            <Container>
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

                        {/* Campaign Summary - Shows first on mobile, second on desktop */}
                        <div className="order-1 lg:order-2">
                            <div className="sticky top-24 overflow-hidden rounded-xl border border-gray-100 bg-white sm:rounded-2xl">
                                {/* Campaign Image */}
                                <div className="aspect-video w-full overflow-hidden sm:aspect-[16/10]">
                                    <img
                                        src={campaign.image || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80"}
                                        alt={campaign.title}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="p-4 sm:p-6">
                                    {/* Title & Organizer */}
                                    <h2 className="mb-1 text-lg font-bold text-gray-900 sm:text-xl">
                                        {campaign.title}
                                    </h2>
                                    <p className="mb-4 text-sm text-gray-500">
                                        by {campaign.organizerName}
                                    </p>

                                    {/* Progress Section */}
                                    <div className="mb-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-xl font-bold text-gray-900 sm:text-2xl">
                                                {formatCurrency(campaign.raisedAmount)}
                                            </span>
                                            <span className="text-sm font-semibold text-orange-500 sm:text-base">
                                                {progress}%
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="h-2 overflow-hidden rounded-full bg-gray-100 sm:h-2.5">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                            />
                                        </div>

                                        <div className="mt-2 flex items-center justify-between text-xs sm:text-sm">
                                            <span className="text-gray-500">
                                                Goal: {formatCurrency(campaign.goalAmount)}
                                            </span>
                                            {remainingAmount > 0 && (
                                                <span className="font-medium text-orange-500">
                                                    {formatCurrency(remainingAmount)} left
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Donors Count */}
                                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 sm:mb-6">
                                        <Heart className="h-4 w-4 text-orange-500" />
                                        <span>{campaign._count?.donations || 0} donors</span>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="space-y-2 border-t border-gray-100 pt-4 sm:space-y-3 sm:pt-6">
                                        <TrustBadge
                                            icon={Shield}
                                            text="Verified Campaign"
                                        />
                                        <TrustBadge
                                            icon={Lock}
                                            text="Secure Payment via Razorpay"
                                        />
                                        <TrustBadge
                                            icon={CheckCircle}
                                            text="100% Tax Benefit (80G)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Donation Form - Shows second on mobile, first on desktop */}
                        <div className="order-2 lg:order-1">
                            <div className="rounded-xl border border-gray-100 bg-white p-4 sm:rounded-2xl sm:p-6">
                                <h2 className="mb-4 text-lg font-bold text-gray-900 sm:mb-6 sm:text-xl">
                                    Make a Donation
                                </h2>

                                {/* Goal Reached Alert */}
                                {isGoalReached && (
                                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 sm:mb-6 sm:rounded-xl sm:p-4">
                                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                        <span>This campaign has reached its goal! 🎉</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                                    {/* Amount Selection */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 sm:mb-3">
                                            Select Amount <span className="text-red-500">*</span>
                                        </label>

                                        {/* Preset Amounts Grid */}
                                        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
                                            {DONATION_CONFIG.PRESET_AMOUNTS.map((amount) => {
                                                const isDisabled = amount > maxAllowedDonation || isGoalReached;
                                                const isSelected = selectedPreset === amount;

                                                return (
                                                    <button
                                                        key={amount}
                                                        type="button"
                                                        onClick={() => handlePresetSelect(amount)}
                                                        disabled={isDisabled}
                                                        className={`
                                                            rounded-lg py-2.5 text-sm font-semibold transition-all
                                                            sm:rounded-xl sm:py-3 sm:text-base
                                                            ${isSelected
                                                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                                                                : isDisabled
                                                                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                                                    : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                                            }
                                                        `}
                                                    >
                                                        ₹{amount.toLocaleString()}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Custom Amount Input */}
                                        <div className="relative">
                                            <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 sm:left-4" />
                                            <input
                                                type="number"
                                                placeholder="Enter custom amount"
                                                onChange={handleCustomAmount}
                                                min={DONATION_CONFIG.MIN_AMOUNT}
                                                max={maxAllowedDonation}
                                                disabled={isGoalReached}
                                                className={`
                                                    w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-all
                                                    sm:rounded-xl sm:py-3 sm:pl-12 sm:text-base
                                                    ${isGoalReached
                                                        ? "cursor-not-allowed bg-gray-50"
                                                        : selectedPreset === null && watchedAmount
                                                            ? "border-orange-500 ring-2 ring-orange-500/20"
                                                            : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                                    }
                                                `}
                                            />
                                        </div>

                                        {/* Min/Max Info */}
                                        <p className="mt-2 text-xs text-gray-500">
                                            Min: ₹{DONATION_CONFIG.MIN_AMOUNT.toLocaleString()} | Max: ₹{maxAllowedDonation.toLocaleString()}
                                        </p>

                                        {/* Error */}
                                        {errors.amount && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.amount.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Donor Details */}
                                    <div className="space-y-3 sm:space-y-4">
                                        <Input
                                            label="Full Name"
                                            placeholder="Enter your name"
                                            icon={User}
                                            disabled={isGoalReached}
                                            error={errors.donorName?.message}
                                            required
                                            {...register("donorName")}
                                        />

                                        <Input
                                            label="Email Address"
                                            type="email"
                                            placeholder="Enter your email"
                                            icon={Mail}
                                            disabled={isGoalReached}
                                            error={errors.donorEmail?.message}
                                            required
                                            {...register("donorEmail")}
                                        />

                                        <Input
                                            label="Phone Number (Optional)"
                                            type="tel"
                                            placeholder="10-digit mobile number"
                                            icon={Phone}
                                            disabled={isGoalReached}
                                            error={errors.donorPhone?.message}
                                            {...register("donorPhone")}
                                        />

                                        <Textarea
                                            label="Message (Optional)"
                                            placeholder="Write a message of support..."
                                            rows={3}
                                            disabled={isGoalReached}
                                            {...register("message")}
                                        />
                                    </div>

                                    {/* Anonymous Checkbox */}
                                    <label className={`flex cursor-pointer items-center gap-3 ${isGoalReached ? "cursor-not-allowed opacity-50" : ""}`}>
                                        <input
                                            type="checkbox"
                                            disabled={isGoalReached}
                                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-500 sm:h-5 sm:w-5"
                                            {...register("anonymous")}
                                        />
                                        <span className="text-sm text-gray-600">
                                            Make my donation anonymous
                                        </span>
                                    </label>

                                    {/* Donation Summary */}
                                    {watchedAmount && !isGoalReached && (
                                        <div className="rounded-lg bg-orange-50 p-3 sm:rounded-xl sm:p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 sm:text-base">
                                                    Donation Amount
                                                </span>
                                                <span className="text-lg font-bold text-orange-500 sm:text-xl">
                                                    ₹{parseInt(watchedAmount).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isProcessing || isGoalReached || !watchedAmount}
                                        className="w-full"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>Processing...</span>
                                            </>
                                        ) : isGoalReached ? (
                                            <>
                                                <CheckCircle className="h-5 w-5" />
                                                <span>Goal Reached! 🎉</span>
                                            </>
                                        ) : (
                                            <>
                                                <Heart className="h-5 w-5" />
                                                <span>
                                                    Donate {watchedAmount ? `₹${parseInt(watchedAmount).toLocaleString()}` : ""}
                                                </span>
                                            </>
                                        )}
                                    </Button>

                                    {/* Terms */}
                                    <p className="text-center text-xs text-gray-500">
                                        By donating, you agree to our{" "}
                                        <Link
                                            href="/terms"
                                            className="text-orange-500 hover:underline"
                                        >
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            href="/privacy"
                                            className="text-orange-500 hover:underline"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Large Donation Warning Modal */}
            {showWarning && (
                <WarningModal
                    amount={watchedAmount}
                    isLoading={isProcessing}
                    onConfirm={handleConfirmLargeDonation}
                    onCancel={() => setShowWarning(false)}
                />
            )}
        </div>
    );
}

// Trust Badge Component
function TrustBadge({ icon: Icon, text }) {
    return (
        <div className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
            <Icon className="h-4 w-4 flex-shrink-0 text-green-600" />
            <span>{text}</span>
        </div>
    );
}

// Warning Modal Component
function WarningModal({ amount, isLoading, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl bg-white p-4 sm:rounded-2xl sm:p-6">
                <div className="text-center">
                    {/* Icon */}
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 sm:h-16 sm:w-16">
                        <AlertTriangle className="h-7 w-7 text-yellow-600 sm:h-8 sm:w-8" />
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">
                        Confirm Large Donation
                    </h3>

                    {/* Description */}
                    <p className="mb-6 text-sm text-gray-600 sm:text-base">
                        You're about to donate{" "}
                        <span className="font-bold text-orange-500">
                            ₹{parseInt(amount).toLocaleString()}
                        </span>
                        . Please confirm this amount.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            loading={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Confirm Donation"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}