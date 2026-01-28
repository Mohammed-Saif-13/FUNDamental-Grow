import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./Button";

export default function PageHeader({
    title,
    subtitle,
    action,
    actionLabel,
    actionIcon: ActionIcon,
    secondaryAction,
    secondaryLabel,
    secondaryIcon: SecondaryIcon,
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                    <p className="text-gray-500 mt-1">
                        {subtitle}
                        <span className="text-gray-400 ml-2">• Updated just now</span>
                    </p>
                )}
            </div>
            <div className="flex items-center gap-3">
                {secondaryAction && (
                    <Button variant="outline" onClick={secondaryAction}>
                        {SecondaryIcon && <SecondaryIcon className="h-4 w-4" />}
                        {secondaryLabel}
                    </Button>
                )}
                {action && (
                    <Button onClick={action}>
                        {ActionIcon && <ActionIcon className="h-4 w-4" />}
                        {actionLabel}
                    </Button>
                )}
            </div>
        </div>
    );
}