'use client';
import { useEffect } from 'react';

export default function SuccessModal({ show, onClose, title, message }) {
    useEffect(() => {
        if (show) {
            // Auto close after 3 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-scaleIn">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-[#2c3e50] mb-3">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-center text-[#7F8C8D] mb-6">
                    {message}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF5528] to-[#FF8C66] animate-progressBar"></div>
                </div>
            </div>
        </div>
    );
}