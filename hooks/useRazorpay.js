"use client";

import { useState, useCallback } from "react";

export function useRazorpay() {
  const [loading, setLoading] = useState(false);

  const loadScript = useCallback(() => {
    return new Promise((resolve) => {
      if (typeof window.Razorpay !== "undefined") {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const openPayment = useCallback((options) => {
    if (typeof window.Razorpay === "undefined") {
      console.error("Razorpay SDK not loaded");
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  }, []);

  return { loadScript, openPayment, loading };
}
