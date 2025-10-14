import type { FC } from "react";
import type { ComponentSchema } from "../shared/messaging";

type PreviewTemplateProps = {
  schema: ComponentSchema;
};

type PreviewTemplate = FC<PreviewTemplateProps>;

const resolveString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const HeroTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  const headline = resolveString(props.headline, "Launch campaigns faster");
  const supportingCopy = resolveString(
    props.supportingCopy,
    "Configure headline, copy, and CTAs to match your go-to-market motion. Preview live content connections in real time."
  );
  const primaryAction = resolveString(props.primaryAction, "Start building");

  return (
    <section className="component-card">
      <header className="component-card__header">
        <span className="component-card__badge">Hero</span>
        <div className="component-card__actions">
          <button className="component-card__button">Replace component</button>
        </div>
      </header>
      <div className="component-card__body">
        <h3 className="component-card__title">{headline}</h3>
        <p className="component-card__description">{supportingCopy}</p>
      </div>
      <div className="component-card__meta">
        <span className="component-chip">Headline: “{headline}”</span>
        <span className="component-chip">
          Supporting copy: “
          {resolveString(
            props.supportingCopy,
            "Collaborate, QA, and publish from one place."
          )}
          ”
        </span>
        <span className="component-chip">Primary action: “{primaryAction}”</span>
      </div>
    </section>
  );
};

const FeatureGridTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  const sectionTitle = resolveString(props.sectionTitle, "Showcase capabilities");
  const description = resolveString(
    props.description,
    "Toggle column layouts, add cards, and map data fields to your CMS. Set per-breakpoint spacing and color tokens."
  );
  const featureCount = resolveString(props.featureCount, "3");
  const background = resolveString(props.background, "Gradient");

  return (
    <section className="component-card">
      <header className="component-card__header">
        <span className="component-card__badge">Feature grid</span>
        <div className="component-card__actions">
          <button className="component-card__button">Replace component</button>
        </div>
      </header>
      <div className="component-card__body">
        <h3 className="component-card__title">{sectionTitle}</h3>
        <p className="component-card__description">{description}</p>
      </div>
      <div className="component-card__meta">
        <span className="component-chip">
          Section title: “{resolveString(props.sectionTitle, "Why teams choose us")}”
        </span>
        <span className="component-chip">Feature count: {featureCount}</span>
        <span className="component-chip">Background: {background}</span>
      </div>
    </section>
  );
};

const TestimonialsTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  const headline = resolveString(props.headline, "Loved by teams worldwide");
  const description = resolveString(
    props.description,
    "Rotate customer stories with avatars, quotes, and company logos to highlight your strongest social proof."
  );
  const quoteSource = resolveString(props.quoteSource, "Connected database");
  const accentColor = resolveString(props.accentColor, "#3b82f6");

  return (
    <section className="component-card">
      <header className="component-card__header">
        <span className="component-card__badge">Testimonials</span>
        <div className="component-card__actions">
          <button className="component-card__button">Replace component</button>
        </div>
      </header>
      <div className="component-card__body">
        <h3 className="component-card__title">{headline}</h3>
        <p className="component-card__description">{description}</p>
      </div>
      <div className="component-card__meta">
        <span className="component-chip">
          Headline: “{resolveString(props.headline, "What customers are saying")}”
        </span>
        <span className="component-chip">Quote source: {quoteSource}</span>
        <span className="component-chip">Accent color: {accentColor}</span>
      </div>
    </section>
  );
};

const CtaTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  const message = resolveString(props.message, "Ready to build?");
  const description = resolveString(
    props.description,
    "Use this banner to capture emails or direct attention to your most important activation path."
  );
  const buttonLabel = resolveString(props.buttonLabel, "Request access");
  const targetUrl = resolveString(props.targetUrl, "https://");

  return (
    <section className="component-card">
      <header className="component-card__header">
        <span className="component-card__badge">Call to action</span>
        <div className="component-card__actions">
          <button className="component-card__button">Replace component</button>
        </div>
      </header>
      <div className="component-card__body">
        <h3 className="component-card__title">{message}</h3>
        <p className="component-card__description">{description}</p>
      </div>
      <div className="component-card__meta">
        <span className="component-chip">
          Message: “{resolveString(props.message, "Ready to start building?")}”
        </span>
        <span className="component-chip">Button label: “{buttonLabel}”</span>
        <span className="component-chip">Target URL: {targetUrl}</span>
      </div>
    </section>
  );
};

export const previewTemplates: Record<string, PreviewTemplate> = {
  hero: HeroTemplate,
  "feature-grid": FeatureGridTemplate,
  testimonials: TestimonialsTemplate,
  cta: CtaTemplate
};
