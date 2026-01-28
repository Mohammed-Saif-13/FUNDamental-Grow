"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrolling({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,        // Scroll duration (higher = slower)
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
            orientation: "vertical",
            smoothWheel: true,    // Smooth mousewheel
            wheelMultiplier: 1,   // Scroll speed multiplier
            touchMultiplier: 2,   // Touch scroll speed
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Cleanup
        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}