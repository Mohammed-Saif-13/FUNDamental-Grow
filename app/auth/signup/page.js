"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SuccessModal from "@/components/ui/SuccessModal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { API_ROUTES, VALIDATION, MESSAGES, ROUTES } from "@/lib/constants";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!formData.termsAccepted) {
      setError(MESSAGES.termsError);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < VALIDATION.minPasswordLength) {
      setError(
        `Password must be at least ${VALIDATION.minPasswordLength} characters`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch(API_ROUTES.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        setShowSuccess(true);
      }
    } catch (err) {
      setError(MESSAGES.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push(ROUTES.login);
  };

  return (
    <>
      <SuccessModal
        show={showSuccess}
        onClose={handleSuccessClose}
        title="Account Created Successfully!"
        message={MESSAGES.signupSuccess}
      />

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div
            className="signup-container relative bg-white rounded-3xl shadow-2xl overflow-hidden 
                        transition-all duration-600 hover:shadow-3xl hover:-translate-y-1"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF5528] to-[#FF8C66] z-10"></div>

            <div
              className="absolute top-[-100px] right-[-100px] w-[250px] h-[250px] rounded-full 
                          bg-gradient-to-br from-[#FF552833] to-transparent opacity-30 
                          transition-all duration-800 signup-circle-1"
            ></div>
            <div
              className="absolute bottom-[-80px] left-[-80px] w-[200px] h-[200px] rounded-full 
                          bg-gradient-to-br from-[#FF552833] to-transparent opacity-20 
                          transition-all duration-800 signup-circle-2"
            ></div>

            <div className="text-center pt-9 pb-6 relative overflow-hidden">
              <h1
                className="text-3xl font-bold text-[#333] font-serif inline-block relative 
                           after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 
                           after:-translate-x-1/2 after:w-10 after:h-[3px] after:bg-gradient-to-r 
                           after:from-[#FF5528] after:to-[#FF8C66] after:rounded-full 
                           after:transition-all after:duration-500 signup-heading"
              >
                Join Us & Make a Difference
              </h1>
              <p className="text-sm text-[#7F8C8D] mt-3">
                Create your account to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-10 pb-10">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 1234567890"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
              />

              <div className="mb-6">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="w-5 h-5 mt-0.5 mr-3 accent-[#FF5528] cursor-pointer"
                  />
                  <span className="text-sm text-[#7F8C8D] leading-relaxed">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-[#FF5528] hover:underline"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#FF5528] hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
              </div>

              <Button type="submit" loading={loading}>
                Sign Up
              </Button>

              <div className="text-center mt-6">
                <span className="text-sm text-[#7F8C8D]">
                  Already have an account?{" "}
                </span>
                <Link
                  href={ROUTES.login}
                  className="text-sm text-[#FF5528] font-semibold hover:underline"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link
              href={ROUTES.home}
              className="text-sm text-gray-600 hover:text-[#FF5528] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
