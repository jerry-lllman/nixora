import type { ReactNode } from "react";

interface PreviewWrapperProps {
  type: string;
  children: ReactNode;
  metadata?: Record<string, string | number>;
}

export function PreviewWrapper({
  type,
  children,
  metadata
}: PreviewWrapperProps) {
  return (
    <section className="component-card">
      <header className="component-card__header">
        <span className="component-card__badge">{type}</span>
        <div className="component-card__actions">
          <button className="component-card__button">Replace component</button>
        </div>
      </header>
      <div className="component-card__body">{children}</div>
      {metadata && Object.keys(metadata).length > 0 ? (
        <div className="component-card__meta">
          {Object.entries(metadata).map(([key, value]) => (
            <span key={key} className="component-chip">
              {key}: {typeof value === "string" ? `"${value}"` : value}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
