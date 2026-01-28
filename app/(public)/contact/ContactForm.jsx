"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
    MapPin,
    Mail,
    Phone,
    Send,
    Facebook,
    Instagram,
    Linkedin,
    CheckCircle,
    MessageSquare,
    ChevronDown,
    Sparkles,
    ArrowRight,
    MessageCircle,
    AlertCircle,
} from "lucide-react";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import CopyButton from "@/components/ui/CopyButton";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { CONTACT_INFO, SOCIAL_LINKS, CONTACT_SUBJECTS, CONTACT_FAQ } from "@/lib/constants";

const indianPhoneRegex = /^(\+91)?[6-9]\d{9}$/;

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    phone: z
        .string()
        .optional()
        .refine((val) => !val || indianPhoneRegex.test(val.replace(/\s/g, "")), {
            message: "Invalid Indian phone number",
        }),
    subject: z.string().min(1, "Please select a subject"),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(1000, "Message too long"),
});

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const CONTACT_INFO_DATA = [
    { icon: MapPin, title: "Visit Us", content: CONTACT_INFO.ADDRESS, copyable: true },
    { icon: Mail, title: "Email Us", content: CONTACT_INFO.EMAIL, href: `mailto:${CONTACT_INFO.EMAIL}`, copyable: true },
    { icon: Phone, title: "Call Us", content: CONTACT_INFO.PHONE, href: `tel:${CONTACT_INFO.PHONE}`, copyable: true },
];

const SOCIAL_LINKS_DATA = [
    { icon: Linkedin, href: SOCIAL_LINKS.LINKEDIN, label: "LinkedIn" },
    { icon: XIcon, href: SOCIAL_LINKS.TWITTER, label: "Twitter" },
    { icon: Instagram, href: SOCIAL_LINKS.INSTAGRAM, label: "Instagram" },
    { icon: Facebook, href: SOCIAL_LINKS.FACEBOOK, label: "Facebook" },
];

const QUICK_LINKS = [
    { href: "/campaigns", label: "Browse Campaigns" },
    { href: "/start-fundraiser", label: "Start a Fundraiser" },
    { href: "/volunteer", label: "Become a Volunteer" },
];

export default function ContactForm() {
    const { data: session } = useSession();
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        },
    });

    const subjectValue = watch("subject");

    useEffect(() => {
        if (session?.user) {
            setValue("name", session.user.name || "");
            setValue("email", session.user.email || "");
        }
    }, [session, setValue]);

    const onSubmit = useCallback(async (data) => {
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!result.success) {
                toast.error(result.message || "Failed to send message");
                return;
            }

            setSubmitSuccess(true);
            reset();
            toast.success("Message sent! We'll respond within 2-4 hours.");
        } catch (err) {
            toast.error("Failed to send message. Please try again.");
        }
    }, [reset]);

    const toggleFaq = useCallback((id) => {
        setOpenFaq(prev => prev === id ? null : id);
    }, []);

    const subjectOptions = useMemo(() =>
        CONTACT_SUBJECTS.map((s) => ({ value: s, label: s })),
        []
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section - White/Orange Theme (Like About Page) */}
            <section className="relative bg-linear-to-br from-orange-50 via-white to-orange-50 py-12 sm:py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }} />

                <Container className="relative z-10">
                    <div className="max-w-3xl mx-auto text-center px-4">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-100 rounded-full mb-4 sm:mb-6">
                            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                            <span className="text-xs sm:text-sm font-medium text-orange-700">We're Here to Help</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                            Get in <span className="text-orange-500">Touch</span>
                        </h1>

                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Have questions? Our support team is ready to assist you.
                            <br className="hidden sm:block" />
                            We typically respond within 2-4 hours.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section className="py-8 sm:py-12 md:py-16">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Left Sidebar - Contact Info */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* Contact Cards */}
                            <div className="space-y-3 sm:space-y-4">
                                {CONTACT_INFO_DATA.map((info, index) => (
                                    <Card key={index} className="p-4 sm:p-5 bg-white">
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                                <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="font-bold text-sm sm:text-base text-gray-900">
                                                        {info.title}
                                                    </h3>
                                                    {info.copyable && (
                                                        <CopyButton text={info.content} label={info.title} />
                                                    )}
                                                </div>
                                                {info.href ? (
                                                    <a
                                                        href={info.href}
                                                        className="text-xs sm:text-sm text-gray-600 hover:text-orange-500 transition-colors wrap-break-word"
                                                    >
                                                        {info.content}
                                                    </a>
                                                ) : (
                                                    <p className="text-xs sm:text-sm text-gray-600 wrap-break-word">
                                                        {info.content}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* WhatsApp Card */}
                            <Card className="p-4 sm:p-6 bg-linear-to-br from-green-50 to-green-100 border-green-200">
                                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Quick Chat</h3>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                                    Need instant help? Chat with us on WhatsApp.
                                </p>
                                <WhatsAppButton
                                    phone={CONTACT_INFO.WHATSAPP}
                                    message="Hi! I need help with FUNDamental Grow."
                                />
                            </Card>

                            {/* Social Links */}
                            <Card className="p-4 sm:p-6 bg-white">
                                <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-3 sm:mb-4">Follow Us</h3>
                                <div className="flex gap-2 sm:gap-3">
                                    {SOCIAL_LINKS_DATA.map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer"
                                        >
                                            {typeof social.icon === "function" ? <social.icon /> : <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        </a>
                                    ))}
                                </div>
                            </Card>

                            {/* Quick Links */}
                            <Card className="p-4 sm:p-6 bg-white">
                                <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-3 sm:mb-4">Quick Links</h3>
                                <div className="space-y-2 sm:space-y-3">
                                    {QUICK_LINKS.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.href}
                                            className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-orange-500 transition-colors group"
                                        >
                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Right Side - Contact Form (Volunteer Page Style) */}
                        <div className="lg:col-span-2">
                            <Card className="p-4 sm:p-6 md:p-8 bg-white border-t-4 border-orange-500">
                                {submitSuccess ? (
                                    <div className="text-center py-8 sm:py-12">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Message Sent!</h2>
                                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                                            We've received your message and will respond within 2-4 hours.
                                        </p>
                                        <Button variant="outline" onClick={() => setSubmitSuccess(false)} className="cursor-pointer">
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
                                                <div>
                                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Send us a Message</h2>
                                                    <p className="text-xs sm:text-sm text-gray-500">
                                                        Fields marked with <span className="text-red-500">*</span> are required
                                                    </p>
                                                </div>
                                                {session?.user && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                                                        <Sparkles className="w-3 h-3" />
                                                        Priority Support
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                                            {/* Name & Email */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    label="Full Name"
                                                    placeholder="John Doe"
                                                    {...register("name")}
                                                    error={errors.name?.message}
                                                    disabled={!!session?.user}
                                                    required
                                                />
                                                <Input
                                                    label="Email Address"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    {...register("email")}
                                                    error={errors.email?.message}
                                                    disabled={!!session?.user}
                                                    required
                                                />
                                            </div>

                                            {/* Phone & Subject */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    label="Phone Number (Optional)"
                                                    placeholder="+91 98765 43210"
                                                    {...register("phone")}
                                                    error={errors.phone?.message}
                                                />

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Subject <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={subjectValue}
                                                            onChange={(e) => setValue("subject", e.target.value)}
                                                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm ${errors.subject ? "border-red-300 bg-red-50" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none bg-white cursor-pointer`}
                                                        >
                                                            <option value="">Select a subject</option>
                                                            {subjectOptions.map((opt) => (
                                                                <option key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                                                    </div>
                                                    {errors.subject && (
                                                        <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {errors.subject.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Message */}
                                            <Textarea
                                                label="Message"
                                                placeholder="How can we help you?"
                                                {...register("message")}
                                                error={errors.message?.message}
                                                rows={5}
                                                required
                                            />

                                            {/* Info Box */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                                                <div className="flex gap-2 sm:gap-3">
                                                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
                                                    <div className="text-xs sm:text-sm text-blue-800">
                                                        <p className="font-medium mb-1">Response Time</p>
                                                        <p className="text-blue-700">
                                                            Our team typically responds within 2-4 hours during business hours.
                                                            For urgent matters, please use WhatsApp.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <Button
                                                type="submit"
                                                loading={isSubmitting}
                                                disabled={isSubmitting}
                                                className="w-full sm:w-auto cursor-pointer"
                                            >
                                                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                                {isSubmitting ? "Sending..." : "Send Message"}
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </Card>
                        </div>
                    </div >
                </Container >
            </section >

            {/* FAQ Section */}
            <section className="py-12 sm:py-16 md:py-20 bg-white">
                <Container>
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="text-center mb-8 sm:mb-12">
                            <span className="text-orange-500 font-semibold text-xs sm:text-sm">FAQ</span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3">Everything you need to know</p>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {CONTACT_FAQ.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden"
                                >
                                    <button
                                        onClick={() => toggleFaq(item.id)}
                                        className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left cursor-pointer"
                                    >
                                        <span className="font-semibold text-sm sm:text-base text-gray-900 pr-4">{item.question}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0 transition-transform duration-300 ${openFaq === item.id ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${openFaq === item.id ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                                    >
                                        <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 sm:pt-4">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
                <Container>
                    <div className="max-w-3xl mx-auto text-center px-4">
                        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 mx-auto mb-3 sm:mb-4" />
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Still Have Questions?</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                            Our team is always happy to help.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            <a href={`mailto:${CONTACT_INFO.EMAIL}`} className="w-full sm:w-auto">
                                <Button size="lg" className="w-full cursor-pointer">
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Email Support
                                </Button>
                            </a>
                            <a href={`tel:${CONTACT_INFO.PHONE}`} className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full cursor-pointer">
                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Call Us
                                </Button>
                            </a>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}