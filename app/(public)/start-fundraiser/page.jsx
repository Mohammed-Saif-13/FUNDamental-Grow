"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Send,
    Loader2,
    Info,
    IndianRupee,
    Calendar,
    MapPin,
    Rocket,
} from "lucide-react";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";
import { CAMPAIGN_CATEGORIES } from "@/lib/constants";

const indianPhoneRegex = /^(\+91)?[6-9]\d{9}$/;

const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
};

const getMaxDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 90);
    return date.toISOString().split("T")[0];
};

const campaignSchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters").max(100, "Title too long"),
    category: z.string().min(1, "Please select a category"),
    goalAmount: z.coerce.number().min(1000, "Minimum ₹1,000").max(10000000, "Maximum ₹1 Crore"),
    endDate: z.string().min(1, "Please select end date"),
    description: z.string().min(50, "Description must be at least 50 characters").max(500, "Description too long"),
    story: z.string().min(200, "Story must be at least 200 characters").max(5000, "Story too long"),
    image: z.string().min(1, "Cover image is required"),
    organizerName: z.string().min(2, "Name must be at least 2 characters"),
    organizerEmail: z.string().email("Invalid email"),
    organizerPhone: z.string().refine((val) => indianPhoneRegex.test(val.replace(/\s/g, "")), {
        message: "Invalid Indian phone number",
    }),
    location: z.string().min(3, "Location is required"),
});

const STEPS = [
    { id: 1, title: "Basic Info", fields: ["title", "category", "goalAmount", "endDate"] },
    { id: 2, title: "Story", fields: ["description", "story"] },
    { id: 3, title: "Media", fields: ["image"] },
    { id: 4, title: "Organizer", fields: ["organizerName", "organizerEmail", "organizerPhone", "location"] },
    { id: 5, title: "Review", fields: [] },
];

const TIPS = [
    "Write a compelling, honest story",
    "Use high-quality images",
    "Set a realistic goal amount",
    "Share on social media",
    "Post regular updates",
];

export default function StartFundraiserPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(campaignSchema),
        defaultValues: {
            title: "",
            category: "",
            goalAmount: "",
            endDate: "",
            description: "",
            story: "",
            image: "",
            organizerName: "",
            organizerEmail: "",
            organizerPhone: "",
            location: "",
        },
    });

    const formValues = watch();

    const categoryOptions = useMemo(() =>
        CAMPAIGN_CATEGORIES.map((c) => ({ value: c, label: c })),
        []
    );

    // Auto-fill organizer
    useEffect(() => {
        if (session?.user) {
            setValue("organizerName", session.user.name || "");
            setValue("organizerEmail", session.user.email || "");
        }
    }, [session, setValue]);

    // Redirect if not logged in
    useEffect(() => {
        if (status === "unauthenticated") {
            toast.error("Please login to create a campaign");
            router.push("/login?callbackUrl=/start-fundraiser");
        }
    }, [status, router]);

    const validateStep = useCallback(async () => {
        const currentFields = STEPS[currentStep - 1].fields;
        return await trigger(currentFields);
    }, [currentStep, trigger]);

    const handleNext = useCallback(async () => {
        const isValid = await validateStep();
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, 5));
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [validateStep]);

    const handlePrev = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const onSubmit = useCallback(async (data) => {
        setIsSubmitting(true);

        try {
            // FIXED: Call fundraiser-requests API instead of campaigns
            const res = await fetch("/api/fundraiser-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: data.title,
                    category: data.category,
                    goalAmount: data.goalAmount,
                    endDate: data.endDate,
                    description: data.description,
                    story: data.story,
                    image: data.image,
                    name: data.organizerName,
                    email: data.organizerEmail,
                    phone: data.organizerPhone,
                    location: data.location,
                }),
            });

            const result = await res.json();

            if (!result.success) {
                toast.error(result.message || "Failed to submit request");
                setIsSubmitting(false);
                return;
            }

            toast.success("Request submitted! Admin will review within 24-48 hours.");
            router.push("/fundraiser-success");
        } catch (err) {
            console.error("Submit error:", err);
            toast.error("Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    }, [router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section - Mobile Optimized */}
            <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 sm:py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-64 sm:w-72 h-64 sm:h-72 bg-orange-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-orange-400 rounded-full blur-3xl" />
                </div>

                <Container className="relative z-10">
                    <div className="max-w-3xl mx-auto text-center px-4">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 sm:mb-6 border border-white/20">
                            <Rocket className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                            <span className="text-xs sm:text-sm font-medium text-orange-400">Start Your Journey</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                            Start Your <span className="text-orange-500">Fundraiser</span>
                        </h1>

                        <p className="text-base sm:text-lg text-gray-300">
                            Create your campaign in minutes and start receiving donations.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Progress Steps - Mobile Optimized */}
            <section className="bg-white border-b border-gray-100 sticky top-[80px] z-40">
                <Container>
                    <div className="py-4 sm:py-6">
                        <div className="flex items-center justify-center max-w-3xl mx-auto overflow-x-auto">
                            {STEPS.map((step, index) => (
                                <div key={step.id} className="flex items-center flex-shrink-0">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all ${currentStep > step.id
                                                ? "bg-orange-500 text-white"
                                                : currentStep === step.id
                                                    ? "bg-orange-500 text-white"
                                                    : "bg-gray-100 text-gray-400"
                                                }`}
                                        >
                                            {currentStep > step.id ? (
                                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                            ) : (
                                                step.id
                                            )}
                                        </div>
                                        <span
                                            className={`mt-1 sm:mt-2 text-xs font-medium ${currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                                                }`}
                                        >
                                            {step.title}
                                        </span>
                                    </div>

                                    {index < STEPS.length - 1 && (
                                        <div
                                            className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 mb-6 ${currentStep > step.id ? "bg-orange-500" : "bg-gray-200"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Form Section - Mobile Optimized */}
            <section className="py-6 sm:py-8 md:py-12">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-5 sm:p-6 md:p-8">
                                {/* Step 1: Basic Info */}
                                {currentStep === 1 && (
                                    <div className="space-y-4 sm:space-y-6">
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Basic Information</h2>
                                            <p className="text-xs sm:text-sm text-gray-500">Tell us about your campaign</p>
                                        </div>

                                        <Input
                                            label="Campaign Title"
                                            placeholder="e.g., Help Build a School in Rural India"
                                            {...register("title")}
                                            error={errors.title?.message}
                                            required
                                        />

                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                {...register("category")}
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-sm ${errors.category ? "border-red-300 bg-red-50" : "border-gray-200"
                                                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer`}
                                            >
                                                <option value="">Select category</option>
                                                {categoryOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.category && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.category.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                                Goal Amount (₹) <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                                <input
                                                    type="number"
                                                    placeholder="100000"
                                                    {...register("goalAmount")}
                                                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl border text-sm ${errors.goalAmount ? "border-red-300 bg-red-50" : "border-gray-200"
                                                        } focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all`}
                                                />
                                            </div>
                                            {errors.goalAmount && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.goalAmount.message}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">Min: ₹1,000 | Max: ₹1 Crore</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                                End Date <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                                <input
                                                    type="date"
                                                    min={getMinDate()}
                                                    max={getMaxDate()}
                                                    {...register("endDate")}
                                                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl border text-sm ${errors.endDate ? "border-red-300 bg-red-50" : "border-gray-200"
                                                        } focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer`}
                                                />
                                            </div>
                                            {errors.endDate && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.endDate.message}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">Duration: 7-90 days</p>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Story */}
                                {currentStep === 2 && (
                                    <div className="space-y-4 sm:space-y-6">
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Your Story</h2>
                                            <p className="text-xs sm:text-sm text-gray-500">Share why you're raising funds</p>
                                        </div>

                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                                        Short Description <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea
                                                        {...field}
                                                        placeholder="Brief summary of your campaign"
                                                        rows={3}
                                                        maxLength={500}
                                                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border text-sm ${errors.description ? "border-red-300 bg-red-50" : "border-gray-200"
                                                            } focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none`}
                                                    />
                                                    <div className="flex justify-between mt-1">
                                                        {errors.description ? (
                                                            <p className="text-xs sm:text-sm text-red-600">{errors.description.message}</p>
                                                        ) : (
                                                            <span />
                                                        )}
                                                        <span className="text-xs text-gray-400">{field.value?.length || 0}/500</span>
                                                    </div>
                                                </div>
                                            )}
                                        />

                                        <Controller
                                            name="story"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                                        Full Story <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea
                                                        {...field}
                                                        placeholder="Share your complete story..."
                                                        rows={10}
                                                        maxLength={5000}
                                                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border text-sm ${errors.story ? "border-red-300 bg-red-50" : "border-gray-200"
                                                            } focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none`}
                                                    />
                                                    <div className="flex justify-between mt-1">
                                                        {errors.story ? (
                                                            <p className="text-xs sm:text-sm text-red-600">{errors.story.message}</p>
                                                        ) : (
                                                            <span />
                                                        )}
                                                        <span className="text-xs text-gray-400">{field.value?.length || 0}/5000</span>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                )}

                                {/* Step 3: Media */}
                                {currentStep === 3 && (
                                    <div className="space-y-4 sm:space-y-6">
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Campaign Media</h2>
                                            <p className="text-xs sm:text-sm text-gray-500">Add a compelling cover image</p>
                                        </div>

                                        <ImageUpload
                                            label="Cover Image"
                                            value={formValues.image}
                                            onChange={(url) => setValue("image", url)}
                                            error={errors.image?.message}
                                            required
                                        />

                                        <div className="p-3 sm:p-4 bg-blue-50 rounded-xl">
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                                <div className="text-xs sm:text-sm text-blue-700">
                                                    <p className="font-medium mb-1">Image Tips:</p>
                                                    <ul className="list-disc list-inside space-y-1 text-blue-600">
                                                        <li>Use high-quality images</li>
                                                        <li>Show the beneficiary</li>
                                                        <li>Recommended: 1200x800 pixels</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Organizer */}
                                {currentStep === 4 && (
                                    <div className="space-y-4 sm:space-y-6">
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Organizer Details</h2>
                                            <p className="text-xs sm:text-sm text-gray-500">Your contact information</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                            <Input
                                                label="Full Name"
                                                placeholder="John Doe"
                                                {...register("organizerName")}
                                                error={errors.organizerName?.message}
                                                disabled={!!session?.user}
                                                required
                                            />
                                            <Input
                                                label="Email Address"
                                                type="email"
                                                placeholder="john@example.com"
                                                {...register("organizerEmail")}
                                                error={errors.organizerEmail?.message}
                                                disabled={!!session?.user}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                            <Input
                                                label="Phone Number"
                                                placeholder="+91 98765 43210"
                                                {...register("organizerPhone")}
                                                error={errors.organizerPhone?.message}
                                                required
                                            />
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                                    Location <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="City, State"
                                                        {...register("location")}
                                                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl border text-sm ${errors.location ? "border-red-300 bg-red-50" : "border-gray-200"
                                                            } focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all`}
                                                    />
                                                </div>
                                                {errors.location && (
                                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.location.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Review */}
                                {currentStep === 5 && (
                                    <div className="space-y-4 sm:space-y-6">
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Review Your Campaign</h2>
                                            <p className="text-xs sm:text-sm text-gray-500">Make sure everything looks good</p>
                                        </div>

                                        <div className="border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden">
                                            {formValues.image && (
                                                <img
                                                    src={formValues.image}
                                                    alt="Cover"
                                                    className="w-full h-40 sm:h-48 object-cover"
                                                />
                                            )}
                                            <div className="p-4 sm:p-6">
                                                <span className="inline-block px-2.5 sm:px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full mb-2 sm:mb-3">
                                                    {formValues.category}
                                                </span>
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{formValues.title}</h3>
                                                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{formValues.description}</p>

                                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                                    <span className="text-gray-500">Goal</span>
                                                    <span className="font-bold text-gray-900">
                                                        ₹{parseInt(formValues.goalAmount || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                                                <p className="text-gray-500 mb-1">End Date</p>
                                                <p className="font-medium text-gray-900">{formValues.endDate}</p>
                                            </div>
                                            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                                                <p className="text-gray-500 mb-1">Location</p>
                                                <p className="font-medium text-gray-900">{formValues.location}</p>
                                            </div>
                                        </div>

                                        <div className="p-3 sm:p-4 bg-orange-50 rounded-xl text-xs sm:text-sm text-orange-800">
                                            <p>
                                                By submitting, you agree to our Terms of Service and confirm all information is accurate.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
                                    {currentStep > 1 ? (
                                        <Button type="button" variant="outline" onClick={handlePrev} className="cursor-pointer">
                                            <ArrowLeft className="w-4 h-4" />
                                            Back
                                        </Button>
                                    ) : (
                                        <div />
                                    )}

                                    {currentStep < 5 ? (
                                        <Button type="button" onClick={handleNext} className="cursor-pointer">
                                            Next
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button type="submit" loading={isSubmitting} className="cursor-pointer">
                                            <Send className="w-4 h-4" />
                                            {isSubmitting ? "Submitting..." : "Submit Campaign"}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Sidebar - Mobile Optimized */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6">
                                <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-3 sm:mb-4">💡 Tips for Success</h3>
                                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                                    {TIPS.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                                <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-2">Need Help?</h3>
                                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                                    Our team is here to help you.
                                </p>
                                <a href="/contact">
                                    <Button variant="outline" size="sm" className="w-full cursor-pointer">
                                        Contact Support
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}