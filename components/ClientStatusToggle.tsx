"use client";

import { useState, useTransition } from "react";
import { toggleClientStatus } from "@/app/actions/clients";
import { cn } from "@/lib/utils";

interface ClientStatusToggleProps {
    clientId: string;
    currentStatus: 'active' | 'paused';
    clientName: string;
}

export default function ClientStatusToggle({
    clientId,
    currentStatus,
    clientName
}: ClientStatusToggleProps) {
    const [isPending, startTransition] = useTransition();
    const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

    const handleToggle = () => {
        // Optimistic UI update
        const newStatus = optimisticStatus === 'active' ? 'paused' : 'active';
        setOptimisticStatus(newStatus);

        // Server action
        startTransition(async () => {
            try {
                await toggleClientStatus(clientId, currentStatus);
            } catch (error) {
                // Revert on error
                setOptimisticStatus(currentStatus);
                console.error('Failed to toggle status:', error);
            }
        });
    };

    const isActive = optimisticStatus === 'active';

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
                "relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-bg",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isActive
                    ? "bg-gradient-to-r from-primary/80 to-primary shadow-lg shadow-primary/30"
                    : "bg-border/50"
            )}
            title={`${clientName} is ${optimisticStatus}`}
        >
            <span
                className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300",
                    isActive ? "translate-x-8" : "translate-x-1"
                )}
            />
            {isPending && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                </span>
            )}
        </button>
    );
}
