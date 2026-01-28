import { cn } from "@/lib/utils";
import Tooltip from "./Tooltip";

const variants = {
    default: "text-gray-500 hover:bg-gray-100",
    primary: "text-orange-500 hover:bg-orange-50",
    success: "text-green-500 hover:bg-green-50",
    danger: "text-red-500 hover:bg-red-50",
    info: "text-blue-500 hover:bg-blue-50",
};

export default function ActionButton({
    icon: Icon,
    tooltip,
    variant = "default",
    onClick,
    className,
    disabled = false,
}) {
    const button = (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
        >
            <Icon className="h-4 w-4" />
        </button>
    );

    if (tooltip) {
        return <Tooltip content={tooltip}>{button}</Tooltip>;
    }

    return button;
}