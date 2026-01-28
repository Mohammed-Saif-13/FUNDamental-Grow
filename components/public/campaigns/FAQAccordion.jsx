"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "How do I donate?",
        answer: "Click the 'Donate Now' button, enter your amount and details, and complete the secure payment through Razorpay. You'll receive a confirmation email instantly.",
    },
    {
        question: "Is my donation secure?",
        answer: "Yes, all donations are processed through Razorpay with bank-grade encryption. Your payment information is completely secure and never stored on our servers.",
    },
    {
        question: "Can I get a receipt?",
        answer: "Yes, you'll automatically receive a digital receipt via email after your donation is confirmed. You can also download it from your donation history.",
    },
    {
        question: "What if the campaign doesn't reach its goal?",
        answer: "All donations go directly to the campaign organizer regardless of whether the goal is met. Your contribution will still make an impact.",
    },
    {
        question: "How do I contact the organizer?",
        answer: "You can reach out to the organizer using the contact information provided in the 'About' section of this campaign.",
    },
];

function FAQItem({ faq, isOpen, onToggle }) {
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-4 text-left hover:text-orange-500 transition-colors"
            >
                <span className="font-medium text-sm sm:text-base text-gray-900 pr-4">
                    {faq.question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="pb-4 pr-8">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
            )}
        </div>
    );
}

export default function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-orange-500" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Frequently Asked Questions
                </h3>
            </div>

            <div>
                {faqs.map((faq, index) => (
                    <FAQItem
                        key={index}
                        faq={faq}
                        isOpen={openIndex === index}
                        onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                    />
                ))}
            </div>
        </div>
    );
}