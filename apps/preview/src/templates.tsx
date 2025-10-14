import type { FC } from "react";
import {
  Hero,
  FeatureGrid,
  Testimonials,
  Cta,
  MarketingButton,
  MarketingInput,
  MarketingText,
  MarketingImage,
  MarketingSelect,
  Carousel,
  CouponCard
} from "@nixora/ui";
import type { ComponentSchema } from "./types/messaging";
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

const resolveBoolean = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

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

// ===== 营销组件模板 =====
const MarketingButtonTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  return (
    <MarketingButton
      text={resolveString(props.text, "立即购买")}
      variant={resolveString(props.variant, "primary") as any}
      size={resolveString(props.size, "medium") as any}
      fullWidth={resolveBoolean(props.fullWidth, false)}
      icon={resolveString(props.icon, "")}
    />
  );
};

const MarketingInputTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  return (
    <MarketingInput
      label={resolveString(props.label, "手机号码")}
      placeholder={resolveString(props.placeholder, "请输入手机号")}
      type={resolveString(props.type, "text") as any}
      helperText={resolveString(props.helperText, "")}
    />
  );
};

const MarketingTextTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  return (
    <MarketingText
      text={resolveString(props.text, "这是一段营销文案")}
      variant={resolveString(props.variant, "body") as any}
      align={resolveString(props.align, "left") as any}
      color={resolveString(props.color, "")}
    />
  );
};

const MarketingImageTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  return (
    <MarketingImage
      src={resolveString(props.src, "https://placehold.co/600x400/emerald/white?text=Product")}
      alt={resolveString(props.alt, "商品图片")}
      fit={resolveString(props.fit, "cover") as any}
      rounded={resolveBoolean(props.rounded, true)}
    />
  );
};

const MarketingSelectTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  const options = Array.isArray(props.options)
    ? props.options
    : [
        { label: "小号", value: "small" },
        { label: "中号", value: "medium" },
        { label: "大号", value: "large" }
      ];

  return (
    <MarketingSelect
      label={resolveString(props.label, "选择规格")}
      placeholder={resolveString(props.placeholder, "请选择")}
      options={options}
    />
  );
};

const CarouselTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  const slides = Array.isArray(props.slides)
    ? props.slides
    : [
        {
          image: "https://placehold.co/800x400/10b981/white?text=Sale+50%25+Off",
          title: "限时抢购",
          description: "全场5折起"
        },
        {
          image: "https://placehold.co/800x400/f59e0b/white?text=New+Arrival",
          title: "新品上市",
          description: "春季新款已到"
        }
      ];

  return (
    <Carousel
      slides={slides}
      autoPlay={resolveBoolean(props.autoPlay, true)}
      interval={resolveNumber(props.interval, 3000)}
      showIndicators={resolveBoolean(props.showIndicators, true)}
      showArrows={resolveBoolean(props.showArrows, true)}
    />
  );
};

const CouponCardTemplate: PreviewTemplate = ({ schema }) => {
  const props = (schema.props ?? {}) as Record<string, unknown>;
  return (
    <CouponCard
      title={resolveString(props.title, "新人专享优惠券")}
      type={resolveString(props.type, "discount") as any}
      value={resolveString(props.value, "20")}
      description={resolveString(props.description, "全场通用，无门槛使用")}
      validUntil={resolveString(props.validUntil, "2025-12-31")}
      minPurchase={resolveString(props.minPurchase, "99元")}
      buttonText={resolveString(props.buttonText, "立即领取")}
    />
  );
};

export const previewTemplates: Record<string, PreviewTemplate> = {
  // 新的营销组件
  "marketing-button": MarketingButtonTemplate,
  "marketing-input": MarketingInputTemplate,
  "marketing-text": MarketingTextTemplate,
  "marketing-image": MarketingImageTemplate,
  "marketing-select": MarketingSelectTemplate,
  "carousel": CarouselTemplate,
  "coupon-card": CouponCardTemplate,

  // 旧的组件（保留兼容性）
  hero: HeroTemplate,
  "feature-grid": FeatureGridTemplate,
  testimonials: TestimonialsTemplate,
  cta: CtaTemplate
};
