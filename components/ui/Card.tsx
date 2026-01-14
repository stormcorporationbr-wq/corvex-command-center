import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-lg border p-6",
                    variant === "default" && "bg-bg-surface border-border",
                    variant === "glass" && "glass-glow",
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = "Card";

export default Card;
