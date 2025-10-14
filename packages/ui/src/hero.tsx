import { Button } from "./button";

interface HeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  onCtaClick?: () => void;
}

export function Hero({ eyebrow, title, description, ctaLabel, onCtaClick }: HeroProps) {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-20 text-center">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">{eyebrow}</p>
      ) : null}
      <h1 className="text-5xl font-semibold leading-tight text-slate-50">{title}</h1>
      <p className="mx-auto max-w-2xl text-lg text-slate-200">{description}</p>
      <div className="flex justify-center">
        <Button variant="primary" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
