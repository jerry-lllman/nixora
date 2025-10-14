import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

export type MarketingButtonSize = "small" | "medium" | "large";
export type MarketingButtonVariant = "primary" | "secondary" | "danger" | "success";

export interface MarketingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  size?: MarketingButtonSize;
  variant?: MarketingButtonVariant;
  fullWidth?: boolean;
  icon?: string;
}

const sizeClasses: Record<MarketingButtonSize, string> = {
  small: "px-4 py-2 text-sm",
  medium: "px-6 py-3 text-base",
  large: "px-8 py-4 text-lg"
};

const variantClasses: Record<MarketingButtonVariant, string> = {
  primary: "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700",
  secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
  danger: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
  success: "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
};

export function MarketingButton({
  text,
  size = "medium",
  variant = "primary",
  fullWidth = false,
  icon,
  className,
  ...props
}: MarketingButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {icon ? <span className="text-lg">{icon}</span> : null}
      {text}
    </button>
  );
}
