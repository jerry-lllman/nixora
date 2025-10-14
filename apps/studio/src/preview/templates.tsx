import type { FC } from "react";
import { Cta, FeatureGrid, Hero, Testimonials } from "@nixora/ui";
import type { ComponentSchema } from "../shared/messaging";
import { PreviewWrapper } from "./PreviewWrapper";

interface PreviewTemplateProps {
  schema: ComponentSchema;
}

type PreviewTemplate = FC<PreviewTemplateProps>;

const resolveString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const resolveNumber = (value: unknown, fallback: number) => {
  const num = Number(value);
  return !isNaN(num) && num > 0 ? num : fallback;
};

const HeroTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  const title = resolveString(props.headline, "Launch campaigns faster");
  const description = resolveString(
    props.supportingCopy,
    "Configure headline, copy, and CTAs to match your go-to-market motion. Preview live content connections in real time."
  );
  const ctaLabel = resolveString(props.primaryAction, "Start building");

  return (
    <PreviewWrapper
      type="Hero"
      metadata={{
        Headline: title,
        "Supporting copy": description,
        "Primary action": ctaLabel
      }}
    >
      <Hero title={title} description={description} ctaLabel={ctaLabel} />
    </PreviewWrapper>
  );
};

const FeatureGridTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  const sectionTitle = resolveString(
    props.sectionTitle,
    "Showcase capabilities"
  );
  const description = resolveString(
    props.description,
    "Toggle column layouts, add cards, and map data fields to your CMS. Set per-breakpoint spacing and color tokens."
  );
  const featureCount = resolveNumber(props.featureCount, 3);
  const background = resolveString(props.background, "gradient") as
    | "gradient"
    | "solid"
    | "transparent";

  // Generate placeholder features for preview
  const features = Array.from({ length: featureCount }, (_, i) => ({
    icon: ["✨", "🚀", "🎯", "⚡"][i % 4],
    title: `Feature ${i + 1}`,
    description: "Showcase your product capabilities with this feature grid."
  }));

  return (
    <PreviewWrapper
      type="Feature grid"
      metadata={{
        "Section title": sectionTitle,
        "Feature count": featureCount,
        Background: background
      }}
    >
      <FeatureGrid
        sectionTitle={sectionTitle}
        description={description}
        features={features}
        columns={3}
        background={background}
      />
    </PreviewWrapper>
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

  // Generate placeholder testimonials for preview
  const testimonials = [
    {
      quote: "This product has transformed how our team works together.",
      author: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp"
    },
    {
      quote: "The best tool we've used for building landing pages.",
      author: "Michael Rodriguez",
      role: "Design Lead",
      company: "StartupXYZ"
    },
    {
      quote: "Incredibly intuitive and powerful. Highly recommended!",
      author: "Emma Thompson",
      role: "Marketing Director",
      company: "GrowthLabs"
    }
  ];

  return (
    <PreviewWrapper
      type="Testimonials"
      metadata={{
        Headline: headline,
        "Quote source": quoteSource,
        "Accent color": accentColor
      }}
    >
      <Testimonials
        headline={headline}
        description={description}
        testimonials={testimonials}
        accentColor={accentColor}
      />
    </PreviewWrapper>
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
    <PreviewWrapper
      type="Call to action"
      metadata={{
        Message: message,
        "Button label": buttonLabel,
        "Target URL": targetUrl
      }}
    >
      <Cta
        message={message}
        description={description}
        buttonLabel={buttonLabel}
        buttonHref={targetUrl}
        variant="centered"
      />
    </PreviewWrapper>
  );
};

export const previewTemplates: Record<string, PreviewTemplate> = {
  hero: HeroTemplate,
  "feature-grid": FeatureGridTemplate,
  testimonials: TestimonialsTemplate,
  cta: CtaTemplate
};
