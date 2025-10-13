export interface BuilderComponentSetting {
  label: string;
  placeholder: string;
  helper?: string;
}

export interface BuilderComponent {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: BuilderComponentSetting[];
}

export const builderComponents: BuilderComponent[] = [
  {
    id: "hero",
    name: "Hero Section",
    description:
      "Large headline block with supporting text and call-to-action buttons.",
    icon: "✨",
    settings: [
      {
        label: "Headline",
        placeholder: "Craft a compelling statement...",
        helper: "Appears above the fold across all breakpoints."
      },
      {
        label: "Supporting copy",
        placeholder: "Expand on the value proposition"
      },
      {
        label: "Primary action",
        placeholder: "Get started"
      }
    ]
  },
  {
    id: "feature-grid",
    name: "Feature Grid",
    description: "Three column layout for showcasing product capabilities.",
    icon: "🧩",
    settings: [
      {
        label: "Section title",
        placeholder: "Why teams choose us"
      },
      {
        label: "Feature count",
        placeholder: "3",
        helper: "Controls how many cards are generated in the grid."
      },
      {
        label: "Background",
        placeholder: "Gradient, image, or solid color"
      }
    ]
  },
  {
    id: "testimonials",
    name: "Testimonials",
    description: "Rotating carousel with social proof and client logos.",
    icon: "💬",
    settings: [
      {
        label: "Headline",
        placeholder: "What customers are saying"
      },
      {
        label: "Quote source",
        placeholder: "Upload CSV or connect integration"
      },
      {
        label: "Accent color",
        placeholder: "#3b82f6"
      }
    ]
  },
  {
    id: "cta",
    name: "Call to action",
    description: "Slim banner with headline, description, and form inputs.",
    icon: "🚀",
    settings: [
      {
        label: "Message",
        placeholder: "Ready to start building?"
      },
      {
        label: "Button label",
        placeholder: "Request access"
      },
      {
        label: "Target URL",
        placeholder: "https://"
      }
    ]
  }
];
