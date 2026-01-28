"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Sparkles, ShieldCheck, Lock, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/public/layout/Container";

const TEXTS = ["Fund The Future", "Change Lives", "Support Dreams", "Build Hope", "Create Impact"];
const TYPE_SPEED = 100;
const DELETE_SPEED = 50;
const PAUSE_TIME = 2000;

export default function Hero() {
    const [textIndex, setTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState(TEXTS[0]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            setDisplayText(TEXTS[0]);
            return;
        }
    }, []);

    const handleTypewriter = useCallback(() => {
        const currentText = TEXTS[textIndex];
        const speed = isDeleting ? DELETE_SPEED : TYPE_SPEED;

        if (!isDeleting && displayText === currentText) {
            return setTimeout(() => setIsDeleting(true), PAUSE_TIME);
        }

        if (isDeleting && displayText === "") {
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % TEXTS.length);
            return null;
        }

        return setTimeout(() => {
            setDisplayText(
                isDeleting
                    ? currentText.slice(0, displayText.length - 1)
                    : currentText.slice(0, displayText.length + 1)
            );
        }, speed);
    }, [displayText, isDeleting, textIndex]);

    useEffect(() => {
        if (!isClient) return;

        const timer = handleTypewriter();
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isClient, handleTypewriter]);

    const trustBadges = useMemo(() => [
        { icon: ShieldCheck, text: "Verified Campaigns" },
        { icon: Lock, text: "Secure Payments" },
        { icon: CheckCircle, text: "100% Transparent" },
    ], []);

    return (
        <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-white pt-16 sm:pt-10">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50/50" />

            <Container className="relative z-10 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-100/80 backdrop-blur-sm rounded-full mb-6 sm:mb-8 border border-orange-200/50">
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" aria-hidden="true" />
                        <span className="text-xs sm:text-sm font-medium text-orange-700">
                            Trusted by 10,000+ Donors Worldwide
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-4 sm:mb-6">
                        <span className="text-orange-500">
                            {displayText}
                            {isClient && <span className="animate-pulse text-orange-400" aria-hidden="true">|</span>}
                        </span>
                        <br />
                        <span className="text-gray-900">With Every Donation</span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                        Join thousands making real impact. Support verified campaigns with 100% transparency and see exactly where your money goes.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 px-4">
                        <Link href="/campaigns" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8 shadow-lg shadow-orange-500/20">
                                <Heart className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                                <span>Start Donating</span>
                            </Button>
                        </Link>
                        <Link href="/start-fundraiser" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8">
                                <span>Start a Fundraiser</span>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4" role="list">
                        {trustBadges.map(({ icon: Icon, text }, index) => (
                            <div key={index} className="flex items-center gap-2" role="listitem">
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" aria-hidden="true" />
                                <span className="text-xs sm:text-sm font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}