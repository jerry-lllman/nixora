import { Button } from "./button";
import { clsx } from "clsx";

export type CtaProps = {
  message: string;
  description?: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  buttonHref?: string;
  variant?: "centered" | "split";
  className?: string;
};

export function Cta({
  message,
  description,
  buttonLabel,
  onButtonClick,
  buttonHref,
  variant = "centered",
  className
}: CtaProps) {
  const isCentered = variant === "centered";

  return (
    <section
      className={clsx(
        "px-6 py-16",
        "bg-gradient-to-r from-emerald-500/10 to-blue-500/10",
        "border-y border-slate-800",
        className
      )}
    >
      <div
        className={clsx(
          "mx-auto max-w-6xl",
          isCentered ? "space-y-6 text-center" : "flex flex-wrap items-center justify-between gap-6"
        )}
      >
        <div className={clsx(isCentered ? "space-y-3" : "flex-1 space-y-2")}>
          <h2 className={clsx("text-3xl font-semibold text-slate-50", !isCentered && "text-left")}>
            {message}
          </h2>
          {description ? (
            <p
              className={clsx(
                "text-lg text-slate-300",
                isCentered ? "mx-auto max-w-2xl" : "max-w-xl text-left"
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        <div className={isCentered ? "flex justify-center" : ""}>
          {buttonHref ? (
            <Button asChild variant="primary">
              <a href={buttonHref}>{buttonLabel}</a>
            </Button>
          ) : (
            <Button variant="primary" onClick={onButtonClick}>
              {buttonLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
