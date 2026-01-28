"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function ApproveRejectModal({ volunteer, onClose, onConfirm, type }) {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const isReject = type === "reject";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const status = isReject ? "rejected" : "approved";
        const body = { status };
        if (isReject && reason) {
            body.reason = reason;
        }

        try {
            const res = await fetch(`/api/volunteers/${volunteer.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (data.success) {
                onConfirm();
                onClose();
            } else {
                alert(data.message || "Failed to update volunteer");
            }
        } catch (error) {
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isReject ? "Reject Volunteer" : "Approve Volunteer"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <p className="text-gray-600 mb-4">
                        Are you sure you want to{" "}
                        <strong>{isReject ? "reject" : "approve"}</strong>{" "}
                        <strong>{volunteer.name}</strong>?
                    </p>

                    {isReject && (
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Rejection Reason (Optional)
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Explain why this application is being rejected..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                rows={3}
                            />
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-4 py-2 text-white rounded-lg ${isReject
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-green-600 hover:bg-green-700"
                                } disabled:opacity-50`}
                        >
                            {loading ? "Processing..." : isReject ? "Reject" : "Approve"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}