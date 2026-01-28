"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    hideClose = false,
}) {
    // Prevent background scroll + handle scrollbar width
    useEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove('modal-open');
            document.documentElement.style.removeProperty('--scrollbar-width');
        };
    }, [isOpen]);

    // ESC key to close
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            {/* Backdrop */}
            <div
                className="modal-backdrop-overlay"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    "modal-container",
                    `modal-${size}`
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || !hideClose) && (
                    <div className="modal-header">
                        {title && (
                            <h2 className="modal-title">{title}</h2>
                        )}
                        {!hideClose && (
                            <button
                                onClick={onClose}
                                className="modal-close-btn"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Scrollable Content */}
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
}