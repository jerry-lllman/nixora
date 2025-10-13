import type { FC } from "react";

type PreviewTemplate = FC;

const HeroTemplate: PreviewTemplate = () => (
  <section className="component-card">
    <header className="component-card__header">
      <span className="component-card__badge">Hero</span>
      <div className="component-card__actions">
        <button className="component-card__button">Replace component</button>
      </div>
    </header>
    <div className="component-card__body">
      <h3 className="component-card__title">Launch campaigns faster</h3>
      <p className="component-card__description">
        Configure headline, copy, and CTAs to match your go-to-market motion.
        Preview live content connections in real time.
      </p>
    </div>
    <div className="component-card__meta">
      <span className="component-chip">Headline: “Launch campaigns faster”</span>
      <span className="component-chip">
        Supporting copy: “Collaborate, QA, and publish from one place.”
      </span>
      <span className="component-chip">Primary action: “Start building”</span>
    </div>
  </section>
);

const FeatureGridTemplate: PreviewTemplate = () => (
  <section className="component-card">
    <header className="component-card__header">
      <span className="component-card__badge">Feature grid</span>
      <div className="component-card__actions">
        <button className="component-card__button">Replace component</button>
      </div>
    </header>
    <div className="component-card__body">
      <h3 className="component-card__title">Showcase capabilities</h3>
      <p className="component-card__description">
        Toggle column layouts, add cards, and map data fields to your CMS. Set
        per-breakpoint spacing and color tokens.
      </p>
    </div>
    <div className="component-card__meta">
      <span className="component-chip">Section title: “Why teams choose us”</span>
      <span className="component-chip">Feature count: 3</span>
      <span className="component-chip">Background: Gradient</span>
    </div>
  </section>
);

const TestimonialsTemplate: PreviewTemplate = () => (
  <section className="component-card">
    <header className="component-card__header">
      <span className="component-card__badge">Testimonials</span>
      <div className="component-card__actions">
        <button className="component-card__button">Replace component</button>
      </div>
    </header>
    <div className="component-card__body">
      <h3 className="component-card__title">Loved by teams worldwide</h3>
      <p className="component-card__description">
        Rotate customer stories with avatars, quotes, and company logos to
        highlight your strongest social proof.
      </p>
    </div>
    <div className="component-card__meta">
      <span className="component-chip">
        Headline: “What customers are saying”
      </span>
      <span className="component-chip">Quote source: Connected database</span>
      <span className="component-chip">Accent color: #3b82f6</span>
    </div>
  </section>
);

const CtaTemplate: PreviewTemplate = () => (
  <section className="component-card">
    <header className="component-card__header">
      <span className="component-card__badge">Call to action</span>
      <div className="component-card__actions">
        <button className="component-card__button">Replace component</button>
      </div>
    </header>
    <div className="component-card__body">
      <h3 className="component-card__title">Ready to build?</h3>
      <p className="component-card__description">
        Use this banner to capture emails or direct attention to your most
        important activation path.
      </p>
    </div>
    <div className="component-card__meta">
      <span className="component-chip">
        Message: “Ready to start building?”
      </span>
      <span className="component-chip">Button label: “Request access”</span>
      <span className="component-chip">Target URL: https://</span>
    </div>
  </section>
);

export const previewTemplates: Record<string, PreviewTemplate> = {
  hero: HeroTemplate,
  "feature-grid": FeatureGridTemplate,
  testimonials: TestimonialsTemplate,
  cta: CtaTemplate
};
