"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function ImageUpload({
    value,
    onChange,
    folder = "campaigns",
    label = "Upload Image",
    error,
    required = false,
    aspectRatio = "video",
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(value || "");
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlValue, setUrlValue] = useState("");
    const inputRef = useRef(null);

    const aspectClasses = {
        video: "aspect-video",
        square: "aspect-square",
        portrait: "aspect-[3/4]",
    };

    // Process file upload
    const processFile = useCallback(async (file) => {
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, WEBP images allowed");
            return;
        }

        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            toast.error("File size must be less than 5MB");
            return;
        }

        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message || "Upload failed");
                setPreview("");
                onChange("");
                return;
            }

            setPreview(data.url);
            onChange(data.url);
            toast.success("Image uploaded!");
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Failed to upload image");
            setPreview("");
            onChange("");
        } finally {
            setIsUploading(false);
        }
    }, [folder, onChange]);

    // Process URL (for external images)
    const processUrl = useCallback((url) => {
        if (!url) return;

        // Basic URL validation
        const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i;
        const isValidImageUrl = urlPattern.test(url) || url.includes("cloudinary") || url.includes("unsplash") || url.includes("images");

        if (!isValidImageUrl && !url.startsWith("http")) {
            toast.error("Please enter a valid image URL");
            return;
        }

        setPreview(url);
        onChange(url);
        setShowUrlInput(false);
        setUrlValue("");
        toast.success("Image URL added!");
    }, [onChange]);

    // Handle file input change
    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        processFile(file);
    }, [processFile]);

    // Handle drag events
    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    // Handle drop - supports both files and URLs
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        // Check for files first
        const file = e.dataTransfer?.files?.[0];
        if (file && file.type.startsWith("image/")) {
            processFile(file);
            return;
        }

        // Check for URL (dragged from browser)
        const url = e.dataTransfer?.getData("text/uri-list") || e.dataTransfer?.getData("text/plain");
        if (url && url.startsWith("http")) {
            processUrl(url);
            return;
        }

        toast.error("Please drop an image file or valid image URL");
    }, [processFile, processUrl]);

    // Handle remove
    const handleRemove = useCallback(() => {
        setPreview("");
        onChange("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }, [onChange]);

    // Handle click to upload
    const handleClick = useCallback(() => {
        if (!isUploading && !showUrlInput) {
            inputRef.current?.click();
        }
    }, [isUploading, showUrlInput]);

    // Handle URL submit
    const handleUrlSubmit = useCallback((e) => {
        e.preventDefault();
        processUrl(urlValue.trim());
    }, [urlValue, processUrl]);

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {preview ? (
                /* Preview State */
                <div className={cn("relative rounded-2xl overflow-hidden border-2 border-gray-200", aspectClasses[aspectRatio])}>
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => {
                            toast.error("Failed to load image");
                            setPreview("");
                            onChange("");
                        }}
                    />

                    {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                            <p className="text-white text-sm font-medium">Uploading...</p>
                        </div>
                    )}

                    {!isUploading && (
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors group">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all cursor-pointer shadow-lg"
                                title="Remove image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Ready
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Upload State */
                <div className="space-y-3">
                    <div
                        onClick={handleClick}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={cn(
                            "relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all",
                            aspectClasses[aspectRatio],
                            "flex flex-col items-center justify-center",
                            isDragging
                                ? "border-orange-500 bg-orange-50 scale-[1.02]"
                                : error
                                    ? "border-red-300 bg-red-50 hover:border-red-400"
                                    : "border-gray-200 bg-gray-50 hover:border-orange-500 hover:bg-orange-50"
                        )}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors",
                            isDragging ? "bg-orange-100" : "bg-gray-100"
                        )}>
                            {isDragging ? (
                                <Upload className="w-6 h-6 text-orange-500" />
                            ) : (
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                            )}
                        </div>

                        <p className={cn(
                            "text-sm font-medium mb-1 transition-colors",
                            isDragging ? "text-orange-600" : "text-gray-700"
                        )}>
                            {isDragging ? "Drop image here" : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-gray-500">
                            JPG, PNG, WEBP (max 5MB)
                        </p>

                        {isDragging && (
                            <div className="absolute inset-0 border-2 border-orange-500 rounded-2xl pointer-events-none animate-pulse" />
                        )}
                    </div>

                    {/* URL Input Toggle */}
                    {!showUrlInput ? (
                        <button
                            type="button"
                            onClick={() => setShowUrlInput(true)}
                            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-orange-500 transition-colors cursor-pointer"
                        >
                            <LinkIcon className="w-4 h-4" />
                            Or paste image URL
                        </button>
                    ) : (
                        <form onSubmit={handleUrlSubmit} className="space-y-2">
                            <input
                                type="url"
                                value={urlValue}
                                onChange={(e) => setUrlValue(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={!urlValue.trim()}
                                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
                                >
                                    Add URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUrlInput(false);
                                        setUrlValue("");
                                    }}
                                    className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}