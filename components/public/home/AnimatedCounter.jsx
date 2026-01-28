"use client";

import { useEffect, useState, useRef } from "react";

const formatNumber = (num, prefix = "", suffix = "") => {
    if (num >= 10000000) return `${prefix}${(num / 10000000).toFixed(1)}Cr${suffix}`;
    if (num >= 100000) return `${prefix}${(num / 100000).toFixed(1)}L${suffix}`;
    if (num >= 1000) return `${prefix}${(num / 1000).toFixed(1)}K${suffix}`;
    return `${prefix}${num}${suffix}`;
};

export default function AnimatedCounter({ value, prefix = "", suffix = "", duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimatedRef.current) {
                    hasAnimatedRef.current = true;

                    let start = 0;
                    const increment = value / (duration / 16);

                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= value) {
                            setCount(value);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);

                    return () => clearInterval(timer);
                }
            },
            { threshold: 0.3, rootMargin: "0px" }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
            observer.disconnect();
        };
    }, [value, duration]);

    return <span ref={ref}>{formatNumber(count, prefix, suffix)}</span>;
}