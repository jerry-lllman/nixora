import { clsx } from "clsx";
import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface MarketingSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  fullWidth?: boolean;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
}

export function MarketingSelect({
  label,
  placeholder,
  options,
  fullWidth = true,
  helperText,
  error = false,
  errorMessage,
  className,
  ...props
}: MarketingSelectProps) {
  return (
    <div className={clsx("flex flex-col gap-1.5", fullWidth && "w-full")}>
      {label ? (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      ) : null}
      <select
        className={clsx(
          "rounded-lg border px-4 py-2.5 text-base transition-all duration-200 focus:outline-none focus:ring-2 appearance-none bg-no-repeat bg-right",
          "bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')]",
          "pr-10",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:border-red-500 dark:focus:ring-red-900/30"
            : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-200 dark:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/30",
          "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100",
          "disabled:bg-slate-50 disabled:cursor-not-allowed dark:disabled:bg-slate-900",
          className
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && errorMessage ? (
        <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
