"use client";
import React from "react";
import { useInView } from "react-intersection-observer";

interface AnimateOnScrollProps {
    children: React.ReactNode;
    direction?: "up" | "down" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
    threshold?: number;
    delay?: number;
    className?: string;
}

export default function AnimateOnScroll({
    children,
    direction = "up",
    threshold = 0.1,
    delay = 0,
    className = "",
}: AnimateOnScrollProps) {
    const { ref, inView } = useInView({
        threshold,
        triggerOnce: true,
    });

    // Map direction to CSS animation classes
    const animationClassMap: Record<string, string> = {
        "up": "slidein-up",
        "down": "slidein-down",
        "left": "slidein-left",
        "right": "slidein-right",
        "top-left": "slidein-top-left",
        "top-right": "slidein-top-right",
        "bottom-left": "slidein-bottom-left",
        "bottom-right": "slidein-bottom-right",
    };

    // Respect prefers-reduced-motion: if user prefers reduced motion, just show content without animation
    const animationClass = inView
        ? animationClassMap[direction] || "slidein-up"
        : "opacity-0";

    const style = delay > 0 ? { animationDelay: `${delay}ms` } : {};

    // For reduced motion, we'll handle it via CSS media queries in the animations
    return (
        <div
            ref={ref}
            className={`${inView ? animationClass : "opacity-0"} ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}

