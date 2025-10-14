import type { ReactNode } from "react";
import { clsx } from "clsx";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={clsx("space-y-4", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">{eyebrow}</p>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-slate-50">{title}</h1>
          {description ? <p className="max-w-2xl text-base text-slate-300">{description}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
