import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const variants = {
    success: {
        bg: "bg-green-50 border-green-200",
        text: "text-green-800",
        icon: CheckCircle,
        iconColor: "text-green-500",
    },
    error: {
        bg: "bg-red-50 border-red-200",
        text: "text-red-800",
        icon: XCircle,
        iconColor: "text-red-500",
    },
    warning: {
        bg: "bg-yellow-50 border-yellow-200",
        text: "text-yellow-800",
        icon: AlertTriangle,
        iconColor: "text-yellow-500",
    },
    info: {
        bg: "bg-blue-50 border-blue-200",
        text: "text-blue-800",
        icon: Info,
        iconColor: "text-blue-500",
    },
};

export default function Alert({
    children,
    variant = "info",
    onClose,
    className,
}) {
    const style = variants[variant];
    const Icon = style.icon;

    return (
        <div
            className={cn(
                "flex items-start gap-3 p-4 rounded-xl border",
                style.bg,
                style.text,
                className
            )}
        >
            <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", style.iconColor)} />
            <p className="flex-1 text-sm">{children}</p>
            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}