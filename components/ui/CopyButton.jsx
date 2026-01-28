"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function CopyButton({ text, label = "Copy" }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success(`${label} copied to clipboard!`);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy");
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title={`Copy ${label}`}
        >
            {copied ? (
                <Check className="w-4 h-4 text-green-500" />
            ) : (
                <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            )}
        </button>
    );
}