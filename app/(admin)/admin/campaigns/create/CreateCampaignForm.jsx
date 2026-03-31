"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    Save,
    Megaphone,
    User,
    Settings,
    FileText,
    Eye,
    EyeOff,
    Star,
    Loader2,
    CheckCircle,
    Info,
} from "lucide-react";
import { CAMPAIGN_CATEGORIES, CAMPAIGN_CONFIG } from "@/lib/constants/campaign";
import { slugify } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Toggle from "@/components/ui/Toggle";
import Alert from "@/components/ui/Alert";
import ImageUpload from "@/components/ui/ImageUpload";

// Category options from constants
const CATEGORY_OPTIONS = [
    { value: "", label: "Select Category" },
    ...CAMPAIGN_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
];

// Initial form state
const INITIAL_STATE = {
    title: "",
    description: "",
    story: "",
    category: "",
    goalAmount: "",
    endDate: "",
    location: "",
    organizerName: "",
    organizerEmail: "",
    organizerPhone: "",
    image: "",
    status: "active",
    featured: false,
    isPublic: true,
};

export default function CreateCampaignForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState({});

    // Handle input change
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        setError("");
    }, [errors]);

    // Handle image change
    const handleImageChange = useCallback((url) => {
        setFormData((prev) => ({ ...prev, image: url }));
        if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
    }, [errors]);

    // Validate form
    const validateForm = useCallback(() => {
        const newErrors = {};
        const { title, description, story, category, goalAmount, endDate, organizerName, organizerEmail, organizerPhone } = formData;

        // Title
        if (!title.trim()) {
            newErrors.title = "Title is required";
        } else if (title.length > CAMPAIGN_CONFIG.TITLE_MAX_LENGTH) {
            newErrors.title = `Title must be under ${CAMPAIGN_CONFIG.TITLE_MAX_LENGTH} characters`;
        }

        // Description
        if (!description.trim()) {
            newErrors.description = "Short description is required";
        } else if (description.length > CAMPAIGN_CONFIG.DESCRIPTION_MAX_LENGTH) {
            newErrors.description = `Description must be under ${CAMPAIGN_CONFIG.DESCRIPTION_MAX_LENGTH} characters`;
        }

        // Story
        if (!story.trim()) {
            newErrors.story = "Campaign story is required";
        } else if (story.length > CAMPAIGN_CONFIG.STORY_MAX_LENGTH) {
            newErrors.story = `Story must be under ${CAMPAIGN_CONFIG.STORY_MAX_LENGTH} characters`;
        }

        // Category
        if (!category) {
            newErrors.category = "Category is required";
        }

        // Goal Amount
        const goalNum = parseFloat(goalAmount);
        if (!goalAmount || isNaN(goalNum)) {
            newErrors.goalAmount = "Goal amount is required";
        } else if (goalNum < CAMPAIGN_CONFIG.MIN_GOAL) {
            newErrors.goalAmount = `Minimum goal is ₹${CAMPAIGN_CONFIG.MIN_GOAL.toLocaleString("en-IN")}`;
        } else if (goalNum > CAMPAIGN_CONFIG.MAX_GOAL) {
            newErrors.goalAmount = `Maximum goal is ₹${(CAMPAIGN_CONFIG.MAX_GOAL / 10000000).toFixed(0)} Crore`;
        }

        // End Date
        if (!endDate) {
            newErrors.endDate = "End date is required";
        } else {
            const selectedDate = new Date(endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const minDate = new Date(today);
            minDate.setDate(minDate.getDate() + CAMPAIGN_CONFIG.MIN_DURATION_DAYS);
            const maxDate = new Date(today);
            maxDate.setDate(maxDate.getDate() + CAMPAIGN_CONFIG.MAX_DURATION_DAYS);

            if (selectedDate <= today) {
                newErrors.endDate = "End date must be in the future";
            } else if (selectedDate < minDate) {
                newErrors.endDate = `Campaign must run for at least ${CAMPAIGN_CONFIG.MIN_DURATION_DAYS} days`;
            } else if (selectedDate > maxDate) {
                newErrors.endDate = `Campaign cannot exceed ${CAMPAIGN_CONFIG.MAX_DURATION_DAYS} days`;
            }
        }

        // Organizer Name
        if (!organizerName.trim()) {
            newErrors.organizerName = "Organizer name is required";
        }

        // Organizer Email
        if (!organizerEmail.trim()) {
            newErrors.organizerEmail = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organizerEmail)) {
            newErrors.organizerEmail = "Invalid email format";
        }

        // Organizer Phone (optional but validate if provided)
        if (organizerPhone && !/^[6-9]\d{9}$/.test(organizerPhone.replace(/\D/g, ""))) {
            newErrors.organizerPhone = "Invalid Indian phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title.trim(),
                    slug: slugify(formData.title),
                    description: formData.description.trim(),
                    story: formData.story.trim(),
                    category: formData.category,
                    goalAmount: parseFloat(formData.goalAmount),
                    endDate: formData.endDate,
                    location: formData.location.trim(),
                    organizerName: formData.organizerName.trim(),
                    organizerEmail: formData.organizerEmail.trim().toLowerCase(),
                    organizerPhone: formData.organizerPhone.replace(/\D/g, ""),
                    image: formData.image,
                    status: formData.status,
                    featured: formData.featured,
                    isPublic: formData.isPublic,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message || "Failed to create campaign");
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            toast.success("Campaign created successfully!");
            setTimeout(() => router.push("/admin/campaigns"), 1500);
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    // Get min date for date picker (today + 7 days)
    const getMinDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + CAMPAIGN_CONFIG.MIN_DURATION_DAYS);
        return date.toISOString().split("T")[0];
    };

    // Get max date for date picker (today + 90 days)
    const getMaxDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + CAMPAIGN_CONFIG.MAX_DURATION_DAYS);
        return date.toISOString().split("T")[0];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/campaigns">
                    <Button variant="outline" size="sm" className="cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Fill in the details to create a new fundraiser</p>
                </div>
            </div>

            {/* Alerts */}
            {success && (
                <Alert variant="success" className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Campaign created successfully! Redirecting...
                </Alert>
            )}
            {error && <Alert variant="error">{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form - Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Campaign Details */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Megaphone className="w-4 h-4 text-orange-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Campaign Details</h2>
                            </div>

                            <div className="space-y-5">
                                <Input
                                    label="Campaign Title"
                                    name="title"
                                    placeholder="e.g., Help Riya Get Her Heart Surgery"
                                    value={formData.title}
                                    onChange={handleChange}
                                    error={errors.title}
                                    maxLength={CAMPAIGN_CONFIG.TITLE_MAX_LENGTH}
                                    required
                                    helperText={`${formData.title.length}/${CAMPAIGN_CONFIG.TITLE_MAX_LENGTH} characters`}
                                />

                                <Textarea
                                    label="Short Description"
                                    name="description"
                                    placeholder="A brief summary of your campaign (shown in campaign cards)..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    error={errors.description}
                                    rows={3}
                                    maxLength={CAMPAIGN_CONFIG.DESCRIPTION_MAX_LENGTH}
                                    showCount
                                    required
                                />

                                <Textarea
                                    label="Campaign Story"
                                    name="story"
                                    placeholder="Tell the complete story. Why is this campaign important? How will the funds be used? Include all details that will help donors understand and connect with your cause..."
                                    value={formData.story}
                                    onChange={handleChange}
                                    error={errors.story}
                                    rows={8}
                                    maxLength={CAMPAIGN_CONFIG.STORY_MAX_LENGTH}
                                    showCount
                                    required
                                    helperText="This is the main content donors will read. Be detailed and authentic."
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Select
                                        label="Category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        options={CATEGORY_OPTIONS}
                                        error={errors.category}
                                        required
                                    />

                                    <Input
                                        label="Goal Amount (₹)"
                                        name="goalAmount"
                                        type="number"
                                        placeholder="e.g., 500000"
                                        value={formData.goalAmount}
                                        onChange={handleChange}
                                        error={errors.goalAmount}
                                        min={CAMPAIGN_CONFIG.MIN_GOAL}
                                        max={CAMPAIGN_CONFIG.MAX_GOAL}
                                        required
                                        helperText={`Min: ₹${CAMPAIGN_CONFIG.MIN_GOAL.toLocaleString("en-IN")} | Max: ₹1 Crore`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label="End Date"
                                        name="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        error={errors.endDate}
                                        min={getMinDate()}
                                        max={getMaxDate()}
                                        required
                                        helperText={`${CAMPAIGN_CONFIG.MIN_DURATION_DAYS}-${CAMPAIGN_CONFIG.MAX_DURATION_DAYS} days allowed`}
                                    />

                                    <Input
                                        label="Location"
                                        name="location"
                                        placeholder="e.g., Mumbai, Maharashtra"
                                        value={formData.location}
                                        onChange={handleChange}
                                        error={errors.location}
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Organizer Details */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Organizer Details</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Organizer Name"
                                    name="organizerName"
                                    placeholder="Full name or organization"
                                    value={formData.organizerName}
                                    onChange={handleChange}
                                    error={errors.organizerName}
                                    required
                                />

                                <Input
                                    label="Email Address"
                                    name="organizerEmail"
                                    type="email"
                                    placeholder="contact@example.com"
                                    value={formData.organizerEmail}
                                    onChange={handleChange}
                                    error={errors.organizerEmail}
                                    required
                                />

                                <div className="sm:col-span-2">
                                    <Input
                                        label="Phone Number"
                                        name="organizerPhone"
                                        type="tel"
                                        placeholder="9876543210"
                                        value={formData.organizerPhone}
                                        onChange={handleChange}
                                        error={errors.organizerPhone}
                                        helperText="Indian mobile number (optional)"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-6">
                        {/* Campaign Image */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-purple-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Campaign Image</h2>
                            </div>

                            <ImageUpload
                                value={formData.image}
                                onChange={handleImageChange}
                                folder="campaigns"
                                error={errors.image}
                                label=""
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Recommended: 1200×630px (16:9 ratio)
                            </p>
                        </Card>

                        {/* Settings */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Settings className="w-4 h-4 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Status Toggle */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.status === "active" ? "bg-green-100" : "bg-gray-200"}`}>
                                            {formData.status === "active" ? (
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Info className="w-4 h-4 text-gray-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Active Status</p>
                                            <p className="text-xs text-gray-500">Accepts donations</p>
                                        </div>
                                    </div>
                                    <Toggle
                                        checked={formData.status === "active"}
                                        onChange={(checked) =>
                                            setFormData((prev) => ({ ...prev, status: checked ? "active" : "paused" }))
                                        }
                                        color="success"
                                    />
                                </div>

                                {/* Public Toggle */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.isPublic ? "bg-blue-100" : "bg-gray-200"}`}>
                                            {formData.isPublic ? (
                                                <Eye className="w-4 h-4 text-blue-600" />
                                            ) : (
                                                <EyeOff className="w-4 h-4 text-gray-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Public Visibility</p>
                                            <p className="text-xs text-gray-500">Show on website</p>
                                        </div>
                                    </div>
                                    <Toggle
                                        checked={formData.isPublic}
                                        onChange={(checked) =>
                                            setFormData((prev) => ({ ...prev, isPublic: checked }))
                                        }
                                        color="info"
                                    />
                                </div>

                                {/* Featured Toggle */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.featured ? "bg-yellow-100" : "bg-gray-200"}`}>
                                            <Star className={`w-4 h-4 ${formData.featured ? "text-yellow-600 fill-yellow-600" : "text-gray-500"}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Featured</p>
                                            <p className="text-xs text-gray-500">Highlight on homepage</p>
                                        </div>
                                    </div>
                                    <Toggle
                                        checked={formData.featured}
                                        onChange={(checked) =>
                                            setFormData((prev) => ({ ...prev, featured: checked }))
                                        }
                                        color="warning"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Actions */}
                        <Card className="p-6">
                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer"
                                    disabled={isLoading || success}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Create Campaign
                                        </>
                                    )}
                                </Button>

                                <Link href="/admin/campaigns" className="block">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full cursor-pointer"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                            </div>

                            {/* Tips */}
                            <div className="mt-5 p-3 bg-blue-50 rounded-xl">
                                <p className="text-xs text-blue-700 font-medium mb-1">💡 Tips for success:</p>
                                <ul className="text-xs text-blue-600 space-y-0.5">
                                    <li>• Use a compelling, emotional image</li>
                                    <li>• Write a detailed, authentic story</li>
                                    <li>• Set a realistic goal amount</li>
                                </ul>
                            </div>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}