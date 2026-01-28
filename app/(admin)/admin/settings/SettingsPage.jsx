"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Settings, Globe, Phone, MapPin, Share2, Layout, Loader2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function SettingsPage({ settings: initialSettings }) {
    const [settings, setSettings] = useState(initialSettings || {});
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Settings saved successfully");
            } else {
                toast.error(data.message || "Failed to save settings");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Site Settings" subtitle="Manage your website configuration" />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-orange-500" />
                        General Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                            <input
                                type="text"
                                name="siteName"
                                value={settings.siteName || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="FUNDamental Grow"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                            <input
                                type="text"
                                name="tagline"
                                value={settings.tagline || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Your trusted fundraising platform"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows={2}
                                value={settings.description || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Brief description about your platform"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Phone className="h-5 w-5 text-orange-500" />
                        Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={settings.email || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="contact@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={settings.phone || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="+91 9876543210"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                name="address"
                                rows={2}
                                value={settings.address || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Your office address"
                            />
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Layout className="h-5 w-5 text-orange-500" />
                        Hero Section
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                            <input
                                type="text"
                                name="heroTitle"
                                value={settings.heroTitle || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Make a Difference Today"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                            <textarea
                                name="heroSubtitle"
                                rows={2}
                                value={settings.heroSubtitle || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Join thousands of donors making an impact"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-orange-500" />
                        Social Links
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                            <input
                                type="url"
                                name="socialFacebook"
                                value={settings.socialFacebook || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                            <input
                                type="url"
                                name="socialTwitter"
                                value={settings.socialTwitter || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="https://twitter.com/yourhandle"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                            <input
                                type="url"
                                name="socialInstagram"
                                value={settings.socialInstagram || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="https://instagram.com/yourhandle"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                            <input
                                type="url"
                                name="socialLinkedin"
                                value={settings.socialLinkedin || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="https://linkedin.com/company/yourcompany"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-orange-500" />
                        Footer
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
                        <textarea
                            name="footerText"
                            rows={2}
                            value={settings.footerText || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Copyright text or additional footer content"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 cursor-pointer flex items-center gap-2 transition-colors"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Settings"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
