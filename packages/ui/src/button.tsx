import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { clsx } from "clsx";

type ButtonVariants = "primary" | "ghost" | "outline";

type BaseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: ReactNode;
  variant?: ButtonVariants;
};

const variantClassNames: Record<ButtonVariants, string> = {
  primary: "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
  ghost: "bg-transparent text-slate-100 hover:bg-slate-800/70",
  outline: "border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800/70"
};

export const Button = forwardRef<HTMLButtonElement, BaseProps>(
  ({ asChild = false, className, variant = "primary", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
          variantClassNames[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
