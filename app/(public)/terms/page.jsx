import { FileText, AlertCircle, CheckCircle, XCircle, Scale, Clock, RefreshCw, Mail, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import Container from "@/components/public/layout/Container";
import Button from "@/components/ui/Button";

const TERMS_SECTIONS = [
    {
        icon: CheckCircle,
        title: "Acceptance of Terms",
        content: `By accessing or using FUNDamental Grow, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our platform.

These terms apply to all users including donors, campaign organizers, and visitors.`,
    },
    {
        icon: FileText,
        title: "Use of Platform",
        content: `You may use our platform only for lawful purposes and in accordance with these Terms. You agree NOT to:

• Use the platform for fraudulent or illegal activities
• Create campaigns with false or misleading information
• Impersonate any person or entity
• Interfere with the proper functioning of the platform
• Attempt to gain unauthorized access to any part of the platform
• Use automated systems to access the platform without permission`,
    },
    {
        icon: Scale,
        title: "Campaign Guidelines",
        content: `Campaign organizers must:

• Provide accurate and truthful information about their cause
• Use funds only for the stated purpose of the campaign
• Keep donors informed about the progress and use of funds
• Comply with all applicable laws and regulations
• Not create campaigns for illegal or harmful activities

We reserve the right to reject, suspend, or remove any campaign that violates these guidelines.`,
    },
    {
        icon: RefreshCw,
        title: "Donations & Refunds",
        content: `• All donations are voluntary and at the donor's discretion
• Donations are generally non-refundable once processed
• Refunds may be considered in cases of fraud or campaign cancellation
• Processing fees may not be refundable
• Tax receipts are provided for eligible donations
• We are not responsible for how campaign organizers use the funds`,
    },
    {
        icon: AlertCircle,
        title: "Platform Fees",
        content: `FUNDamental Grow charges a platform fee to sustain our operations:

• Platform fee: 5% of each donation
• Payment processing fee: As charged by Razorpay
• Fees are deducted before funds are transferred to organizers
• Fee structure may change with prior notice`,
    },
    {
        icon: XCircle,
        title: "Prohibited Activities",
        content: `The following activities are strictly prohibited:

• Creating fake or fraudulent campaigns
• Money laundering or terrorist financing
• Campaigns promoting violence, discrimination, or illegal activities
• Harassment of other users
• Spamming or unsolicited communications
• Violating intellectual property rights
• Any activity that violates Indian law`,
    },
    {
        icon: Clock,
        title: "Account Termination",
        content: `We may suspend or terminate your account if:

• You violate these Terms and Conditions
• We suspect fraudulent activity
• Required by law or legal proceedings
• You engage in prohibited activities
• At our sole discretion with or without notice

Upon termination, your right to use the platform ceases immediately.`,
    },
];

const DISCLAIMERS = [
    {
        title: "No Guarantee",
        text: "We do not guarantee that any campaign will reach its funding goal or that funds will be used as intended.",
    },
    {
        title: "Third-Party Services",
        text: "We use third-party services (Razorpay, Cloudinary) and are not liable for their actions or policies.",
    },
    {
        title: "Limitation of Liability",
        text: "FUNDamental Grow shall not be liable for any indirect, incidental, or consequential damages.",
    },
    {
        title: "Indemnification",
        text: "You agree to indemnify FUNDamental Grow from any claims arising from your use of the platform.",
    },
];

export const metadata = {
    title: "Terms & Conditions | FUNDamental Grow",
    description: "Read the terms and conditions governing the use of FUNDamental Grow crowdfunding platform.",
};

export default function TermsPage() {
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
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                            <span className="text-xs sm:text-sm font-medium text-orange-700">Terms & Conditions</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                            Terms of <span className="text-orange-500">Service</span>
                        </h1>

                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Please read these terms carefully before using our platform.
                            By using FUNDamental Grow, you agree to these terms.
                        </p>

                        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>Effective: January 2025</span>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Table of Contents */}
            <section className="py-8 sm:py-10 bg-white border-b border-gray-100">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {TERMS_SECTIONS.map((section, index) => (
                                <a
                                    key={index}
                                    href={`#section-${index}`}
                                    className="flex items-center gap-2 p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors group"
                                >
                                    <span className="text-orange-500 font-semibold text-sm">{index + 1}.</span>
                                    <span className="text-sm text-gray-700 group-hover:text-orange-600 transition-colors">
                                        {section.title}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section className="py-10 sm:py-14 md:py-16 bg-white">
                <Container>
                    <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
                        {TERMS_SECTIONS.map((section, index) => (
                            <div key={index} id={`section-${index}`} className="scroll-mt-24">
                                <div className="flex items-start gap-4">
                                    <div className="hidden sm:flex w-12 h-12 bg-orange-100 rounded-xl items-center justify-center flex-shrink-0">
                                        <section.icon className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3 sm:hidden">
                                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <section.icon className="w-5 h-5 text-orange-500" />
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900">
                                                {index + 1}. {section.title}
                                            </h2>
                                        </div>
                                        <h2 className="hidden sm:block text-xl md:text-2xl font-bold text-gray-900 mb-4">
                                            {index + 1}. {section.title}
                                        </h2>
                                        <div className="text-sm sm:text-base text-gray-600 whitespace-pre-line leading-relaxed">
                                            {section.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Disclaimers */}
            <section className="py-10 sm:py-14 bg-gray-50">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                            Important Disclaimers
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {DISCLAIMERS.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-gray-100"
                                >
                                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Governing Law */}
            <section className="py-10 sm:py-14 bg-white">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-orange-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Governing Law</h2>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                These Terms shall be governed by and construed in accordance with the laws of India.
                                Any disputes arising from these Terms shall be subject to the exclusive jurisdiction
                                of the courts in India.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Changes to Terms */}
            <section className="py-10 sm:py-14 bg-gray-50">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Changes to These Terms
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify users of any
                            material changes by posting the new Terms on this page and updating the "Effective" date.
                            Your continued use of the platform after changes constitutes acceptance of the new Terms.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Contact Section */}
            <section className="py-10 sm:py-14 md:py-16 bg-white">
                <Container>
                    <div className="max-w-3xl mx-auto text-center px-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Questions About Terms?
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                            If you have any questions about these Terms and Conditions,
                            please don't hesitate to reach out.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            <Link href="/contact">
                                <Button size="lg" className="cursor-pointer">
                                    Contact Us
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                            </Link>
                            <Link href="/privacy-policy">
                                <Button variant="outline" size="lg" className="cursor-pointer">
                                    Privacy Policy
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}
