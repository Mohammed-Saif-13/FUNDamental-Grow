"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({ phone, message = "Hello! I need help." }) {
    const cleanPhone = phone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all cursor-pointer"
        >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
        </a >
    );
}