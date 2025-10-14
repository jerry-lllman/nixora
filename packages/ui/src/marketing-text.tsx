import { clsx } from "clsx";

export type MarketingTextVariant = "h1" | "h2" | "h3" | "body" | "caption";
export type MarketingTextAlign = "left" | "center" | "right";

export interface MarketingTextProps {
  text: string;
  variant?: MarketingTextVariant;
  align?: MarketingTextAlign;
  color?: string;
  className?: string;
}

const variantClasses: Record<MarketingTextVariant, string> = {
  h1: "text-4xl md:text-5xl font-bold",
  h2: "text-3xl md:text-4xl font-bold",
  h3: "text-2xl md:text-3xl font-semibold",
  body: "text-base md:text-lg",
  caption: "text-sm md:text-base text-slate-600 dark:text-slate-400"
};

const alignClasses: Record<MarketingTextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right"
};

export function MarketingText({
  text,
  variant = "body",
  align = "left",
  color,
  className
}: MarketingTextProps) {
  const Component = variant === "h1" || variant === "h2" || variant === "h3" ? variant : "p";

  return (
    <Component
      className={clsx(
        "text-slate-900 dark:text-slate-100",
        variantClasses[variant],
        alignClasses[align],
        className
      )}
      style={color ? { color } : undefined}
    >
      {text}
    </Component>
  );
}
