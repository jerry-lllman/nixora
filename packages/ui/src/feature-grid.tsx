import { clsx } from "clsx";

export type FeatureGridProps = {
  sectionTitle: string;
  description?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  columns?: 2 | 3 | 4;
  background?: "gradient" | "solid" | "transparent";
  className?: string;
};

const backgroundClassNames = {
  gradient: "bg-gradient-to-b from-slate-900 to-slate-950",
  solid: "bg-slate-900",
  transparent: "bg-transparent"
};

export function FeatureGrid({
  sectionTitle,
  description,
  features = [],
  columns = 3,
  background = "transparent",
  className
}: FeatureGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <section
      className={clsx(
        "px-6 py-20",
        backgroundClassNames[background],
        className
      )}
    >
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-slate-50">
            {sectionTitle}
          </h2>
          {description ? (
            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              {description}
            </p>
          ) : null}
        </div>

        {features.length > 0 ? (
          <div className={clsx("grid gap-8", gridCols[columns])}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-slate-700"
              >
                {feature.icon ? (
                  <div className="text-3xl">{feature.icon}</div>
                ) : null}
                <h3 className="text-xl font-semibold text-slate-50">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
