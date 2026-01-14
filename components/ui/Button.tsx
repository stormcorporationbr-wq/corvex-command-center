import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                className={cn(
                    // Base styles
                    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-bg",
                    "disabled:opacity-50 disabled:cursor-not-allowed",

                    // Variants
                    variant === "primary" && "bg-primary text-bg hover:bg-primary-hover shadow-glow hover-glow",
                    variant === "secondary" && "bg-bg-surface text-text-main border border-border hover:border-primary/50",
                    variant === "ghost" && "text-text-main hover:bg-primary/10 hover:text-primary",
                    variant === "danger" && "bg-red-500 text-white hover:bg-red-600",

                    // Sizes
                    size === "sm" && "px-3 py-1.5 text-sm",
                    size === "md" && "px-4 py-2 text-base",
                    size === "lg" && "px-6 py-3 text-lg",

                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export default Button;
