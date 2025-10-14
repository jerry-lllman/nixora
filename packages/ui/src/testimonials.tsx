import { clsx } from "clsx";

export type TestimonialsProps = {
  headline: string;
  description?: string;
  testimonials?: Array<{
    quote: string;
    author: string;
    role?: string;
    company?: string;
    avatar?: string;
  }>;
  accentColor?: string;
  className?: string;
};

export function Testimonials({
  headline,
  description,
  testimonials = [],
  accentColor = "#3b82f6",
  className
}: TestimonialsProps) {
  return (
    <section className={clsx("px-6 py-20", className)}>
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-slate-50">{headline}</h2>
          {description ? (
            <p className="mx-auto max-w-2xl text-lg text-slate-300">{description}</p>
          ) : null}
        </div>

        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/50 p-6"
                style={{
                  borderLeftColor: accentColor,
                  borderLeftWidth: "3px"
                }}
              >
                <p className="text-slate-300 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-700" />
                  )}
                  <div>
                    <p className="font-medium text-slate-50">{testimonial.author}</p>
                    {testimonial.role || testimonial.company ? (
                      <p className="text-sm text-slate-400">
                        {[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
