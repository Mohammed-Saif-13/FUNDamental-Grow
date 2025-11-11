"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SuccessModal from "@/components/ui/SuccessModal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ROUTES, MESSAGES } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        setShowSuccess(true);
      }
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push(ROUTES.home);
    router.refresh();
  };

  return (
    <>
      <SuccessModal
        show={showSuccess}
        onClose={handleSuccessClose}
        title="Login Successful!"
        message={MESSAGES.loginSuccess}
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
                Welcome Back!
                <br />
                <span className="text-2xl">Login to Continue</span>
              </h1>
              <p className="text-sm text-[#7F8C8D] mt-3">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-10 pb-10">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Clean code with reusable components */}
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
                label="Password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />

              <div className="flex flex-col items-end">
                <div className="mb-6">
                  <span className="text-sm text-[#7F8C8D] mr-2">New Here?</span>
                  <Link href={ROUTES.signup}>
                    <button
                      type="button"
                      className="bg-white border-2 border-[#e0e0e0] text-[#7F8C8D] px-6 py-3 
                               rounded-lg font-medium hover:border-[#FF5528] hover:text-[#FF5528] 
                               hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Sign Up
                    </button>
                  </Link>
                </div>

                <Button type="submit" loading={loading}>
                  Login
                </Button>
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
