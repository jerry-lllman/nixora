import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

export type MarketingInputType = "text" | "email" | "password" | "number" | "tel";

export interface MarketingInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  placeholder?: string;
  type?: MarketingInputType;
  fullWidth?: boolean;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
}

export function MarketingInput({
  label,
  placeholder,
  type = "text",
  fullWidth = true,
  helperText,
  error = false,
  errorMessage,
  className,
  ...props
}: MarketingInputProps) {
  return (
    <div className={clsx("flex flex-col gap-1.5", fullWidth && "w-full")}>
      {label ? (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      ) : null}
      <input
        type={type}
        placeholder={placeholder}
        className={clsx(
          "rounded-lg border px-4 py-2.5 text-base transition-all duration-200 focus:outline-none focus:ring-2",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:border-red-500 dark:focus:ring-red-900/30"
            : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-200 dark:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/30",
          "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "disabled:bg-slate-50 disabled:cursor-not-allowed dark:disabled:bg-slate-900",
          className
        )}
        {...props}
      />
      {error && errorMessage ? (
        <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
