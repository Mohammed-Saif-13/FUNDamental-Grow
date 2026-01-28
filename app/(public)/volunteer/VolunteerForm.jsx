"use client";

import { useState } from "react";
import Container from "@/components/public/layout/Container";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import {
    Heart,
    Users,
    Clock,
    Award,
    CheckCircle,
    Send,
    HandHeart,
    Quote,
    AlertCircle,
} from "lucide-react";
import { AVAILABILITY_OPTIONS, VOLUNTEER_SKILLS } from "@/lib/constants";
import toast from "react-hot-toast";

const benefits = [
    {
        icon: Heart,
        title: "Make a Difference",
        desc: "Directly impact lives in your community and beyond.",
    },
    {
        icon: Users,
        title: "Build Network",
        desc: "Connect with like-minded changemakers and professionals.",
    },
    {
        icon: Award,
        title: "Gain Experience",
        desc: "Get a certificate and enhance your resume with real work.",
    },
    {
        icon: Clock,
        title: "Flexible Hours",
        desc: "Volunteer on weekends or whenever you have free time.",
    },
];

export default function VolunteerPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        availability: "",
        skills: [],
        motivation: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSkillToggle = (skillValue) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.includes(skillValue)
                ? prev.skills.filter((s) => s !== skillValue)
                : [...prev.skills, skillValue],
        }));
        if (errors.skills) setErrors((prev) => ({ ...prev, skills: "" }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = "Name must be at least 3 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[+]?[\d\s-]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
            newErrors.phone = "Invalid phone number (min 10 digits)";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.availability) {
            newErrors.availability = "Please select your availability";
        }

        if (formData.skills.length === 0) {
            newErrors.skills = "Please select at least one skill";
        }

        if (!formData.motivation.trim()) {
            newErrors.motivation = "Please tell us your motivation";
        } else if (formData.motivation.trim().length < 50) {
            newErrors.motivation = "Please write at least 50 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            // Scroll to first error
            const firstError = document.querySelector('[class*="text-red"]');
            firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/volunteers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.fullName.trim(),
                    email: formData.email.trim().toLowerCase(),
                    phone: formData.phone.trim(),
                    city: formData.city.trim(),
                    availability: formData.availability,
                    skills: formData.skills,
                    motivation: formData.motivation.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit application");
            }

            // Show success
            setShowSuccessModal(true);
            toast.success(data.message || "Application submitted successfully!");

            // Reset form
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                city: "",
                availability: "",
                skills: [],
                motivation: "",
            });
            setErrors({});

            // Scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            toast.error(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 md:py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }} />

                <Container className="relative z-10">
                    <div className="max-w-3xl mx-auto text-center px-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4 md:mb-6">
                            <HandHeart className="w-4 h-4 text-orange-500" />
                            <span className="text-xs md:text-sm font-medium text-orange-700">Join the Movement</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                            Become a <span className="text-orange-500">Volunteer</span>
                        </h1>

                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                            Your time and skills can transform lives. Join our community of
                            changemakers and help create a better tomorrow.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section className="py-8 md:py-16">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Benefits - Mobile: Horizontal scroll, Desktop: Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Mobile: Horizontal Scroll */}
                            <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
                                <div className="flex gap-4 min-w-max">
                                    {benefits.map((item, i) => (
                                        <Card key={i} className="p-4 bg-white flex-shrink-0 w-64">
                                            <div className="flex gap-3 items-start">
                                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <item.icon className="w-5 h-5 text-orange-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h4>
                                                    <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop: Sticky Sidebar */}
                            <div className="hidden lg:block sticky top-24 space-y-6">
                                <Card className="p-6 bg-white">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                                        Why Join Us?
                                    </h3>
                                    <div className="space-y-4">
                                        {benefits.map((item, i) => (
                                            <div key={i} className="flex gap-3 items-start group">
                                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                                                    <item.icon className="w-5 h-5 text-orange-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h4>
                                                    <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
                                    <Quote className="w-6 h-6 text-orange-500/30 mb-3" />
                                    <p className="text-gray-700 italic text-sm leading-relaxed">
                                        "Volunteering is the ultimate exercise in democracy. You vote in
                                        elections once a year, but when you volunteer, you vote every day."
                                    </p>
                                    <p className="text-orange-600 font-semibold text-sm mt-3">— Anonymous</p>
                                </Card>
                            </div>
                        </div>

                        {/* Registration Form */}
                        <div className="lg:col-span-2">
                            <Card className="p-4 md:p-8 bg-white border-t-4 border-orange-500">
                                <div className="mb-6">
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                                        Volunteer Registration
                                    </h2>
                                    <p className="text-gray-500 text-xs md:text-sm">
                                        Fields marked with <span className="text-red-500">*</span> are required
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                    {/* Name & Email */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Full Name"
                                            name="fullName"
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            error={errors.fullName}
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

                                    {/* Phone & City */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Phone Number"
                                            name="phone"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            error={errors.phone}
                                            required
                                        />
                                        <Input
                                            label="City"
                                            name="city"
                                            placeholder="Mumbai"
                                            value={formData.city}
                                            onChange={handleChange}
                                            error={errors.city}
                                            required
                                        />
                                    </div>

                                    {/* Availability - Mobile Optimized */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Availability <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                                            {AVAILABILITY_OPTIONS.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData((prev) => ({ ...prev, availability: option.value }));
                                                        if (errors.availability) setErrors((prev) => ({ ...prev, availability: "" }));
                                                    }}
                                                    className={`p-2.5 md:p-3 rounded-lg md:rounded-xl border-2 text-xs md:text-sm font-medium transition-all ${formData.availability === option.value
                                                        ? "border-orange-500 bg-orange-50 text-orange-600"
                                                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.availability && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.availability}
                                            </p>
                                        )}
                                    </div>

                                    {/* Skills - Mobile Optimized */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Skills <span className="text-red-500">*</span>
                                            <span className="text-gray-400 font-normal ml-1 text-xs">(Select all that apply)</span>
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {VOLUNTEER_SKILLS.map((skill) => (
                                                <button
                                                    key={skill.value}
                                                    type="button"
                                                    onClick={() => handleSkillToggle(skill.value)}
                                                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${formData.skills.includes(skill.value)
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {skill.label}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.skills && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.skills}
                                            </p>
                                        )}
                                    </div>

                                    {/* Motivation */}
                                    <Textarea
                                        label="Why do you want to volunteer?"
                                        name="motivation"
                                        placeholder="Share your motivation, what causes you care about, and what you hope to achieve... (minimum 50 characters)"
                                        value={formData.motivation}
                                        onChange={handleChange}
                                        error={errors.motivation}
                                        rows={5}
                                        required
                                    />

                                    {/* Character count helper */}
                                    {formData.motivation && (
                                        <p className="text-xs text-gray-500 -mt-3">
                                            {formData.motivation.length} / 50 characters
                                        </p>
                                    )}

                                    {/* Info Box */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg md:rounded-xl p-3 md:p-4">
                                        <div className="flex gap-2 md:gap-3">
                                            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-xs md:text-sm text-blue-800">
                                                <p className="font-medium mb-1">Application Review Process</p>
                                                <p className="text-blue-700">
                                                    Our team reviews all applications within 48-72 hours. You'll receive an email
                                                    notification once your application is processed.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button - Full width on mobile */}
                                    <Button
                                        type="submit"
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto"
                                    >
                                        <Send className="w-4 h-4" />
                                        {isSubmitting ? "Submitting..." : "Submit Application"}
                                    </Button>
                                </form>
                            </Card>

                            {/* Mobile Quote Card */}
                            <Card className="lg:hidden mt-6 p-6 bg-gradient-to-br from-orange-50 to-orange-100">
                                <Quote className="w-6 h-6 text-orange-500/30 mb-3" />
                                <p className="text-gray-700 italic text-sm leading-relaxed">
                                    "Volunteering is the ultimate exercise in democracy. You vote in
                                    elections once a year, but when you volunteer, you vote every day."
                                </p>
                                <p className="text-orange-600 font-semibold text-sm mt-3">— Anonymous</p>
                            </Card>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Success Modal */}
            {showSuccessModal && (
                <Modal onClose={() => setShowSuccessModal(false)}>
                    <div className="text-center py-6 md:py-8 px-4">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-7 h-7 md:w-8 md:h-8 text-green-500" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                            Application Submitted!
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 mb-6">
                            Thank you for your interest in volunteering! Our team will review your
                            application and notify you via email within 48-72 hours.
                        </p>
                        <Button onClick={() => setShowSuccessModal(false)} className="w-full md:w-auto">
                            Done
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}