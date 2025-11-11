"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SuccessModal from "@/components/ui/SuccessModal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import FormContainer from "@/components/ui/FormContainer";
import FormSection from "@/components/ui/FormSection";
import {
  AVAILABILITY_OPTIONS,
  API_ROUTES,
  MESSAGES,
  ROUTES,
} from "@/lib/constants";

export default function VolunteerPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const initialFormState = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    experience: "",
    skills: "",
    motivation: "",
    emergencyContact: "",
    availability: [],
    termsAccepted: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAvailability = (option) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter((item) => item !== option)
        : [...prev.availability, option],
    }));
  };

  const validateForm = () => {
    if (!formData.termsAccepted) {
      setError(MESSAGES.termsError);
      return false;
    }

    if (formData.availability.length === 0) {
      setError("Please select at least one availability slot");
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
      const res = await fetch(API_ROUTES.volunteers, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user: session?.user?.id || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowSuccess(true);
        setFormData({
          ...initialFormState,
          fullName: session?.user?.name || "",
          email: session?.user?.email || "",
        });
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError(MESSAGES.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push(ROUTES.home);
  };

  return (
    <>
      <SuccessModal
        show={showSuccess}
        onClose={handleSuccessClose}
        title="Application Submitted!"
        message={MESSAGES.volunteerSuccess}
      />

      <FormContainer
        title="Become a Volunteer!"
        subtitle="Join us in making a difference"
      >
        <form onSubmit={handleSubmit} className="px-6 md:px-10 pb-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <FormSection title="Personal Details">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 1234567890"
              />
            </div>

            <Textarea
              label="Address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="Your complete address"
            />

            <Input
              label="Emergency Contact"
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="e.g., John Doe - 9876543210"
            />
          </FormSection>

          <FormSection title="Volunteer Information">
            <Input
              label="Years of Experience"
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 2"
              min="0"
            />

            <Textarea
              label="Skills & Interests"
              name="skills"
              required
              value={formData.skills}
              onChange={handleChange}
              rows={3}
              placeholder="e.g., Teaching, Event Management, Social Media, Fundraising..."
            />

            <Textarea
              label="Why do you want to volunteer?"
              name="motivation"
              required
              value={formData.motivation}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about your motivation..."
            />
          </FormSection>

          <FormSection title="Availability">
            <p className="text-red-500 mb-4">* Required</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABILITY_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={formData.availability.includes(option)}
                    onChange={() => handleAvailability(option)}
                    className="w-5 h-5 mr-3 accent-[#FF5528] cursor-pointer"
                  />
                  <span className="text-sm text-[#7F8C8D] group-hover:text-[#2c3e50] transition-colors">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </FormSection>

          <FormSection>
            <div className="mb-4">
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
                  and understand my responsibilities
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
            </div>
          </FormSection>

          <div className="p-6">
            <Button type="submit" loading={loading}>
              Register Now
            </Button>

            <div className="text-center mt-4">
              <Link
                href={ROUTES.home}
                className="text-sm text-[#7F8C8D] hover:text-[#FF5528] transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </form>
      </FormContainer>
    </>
  );
}
