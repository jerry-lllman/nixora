import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle";

interface BuilderComponent {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: { label: string; placeholder: string; helper?: string }[];
}

const components: BuilderComponent[] = [
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

export function BuilderPage() {
  const [selectedComponentId, setSelectedComponentId] = useState<string>(
    components[0]?.id ?? ""
  );

  const selectedComponent = useMemo(() => {
    return (
      components.find((component) => component.id === selectedComponentId) ??
      components[0]
    );
  }, [selectedComponentId]);

  return (
    <main className="flex min-h-screen bg-slate-50 text-slate-900 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),transparent_55%)] dark:bg-slate-950 dark:text-slate-100">
      <aside className="hidden w-80 flex-none border-r border-slate-200 bg-white/80 p-7 text-slate-700 backdrop-blur lg:block dark:border-white/5 dark:bg-slate-950/70 dark:text-slate-300">
        <div className="space-y-6">
          <header className="space-y-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              Library
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">组件库</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                挑选模块、组合布局，快速拼装出你的下一版页面。
              </p>
            </div>
          </header>
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_20px_60px_-40px_rgba(16,185,129,0.3)] dark:border-white/5 dark:bg-slate-900/50">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">组件</span>
              <button className="rounded-full border border-slate-200 px-3 py-1 font-medium text-slate-700 transition hover:border-emerald-500/60 hover:text-emerald-500 dark:border-white/10 dark:text-slate-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-200">
                新建分组
              </button>
            </div>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400 dark:text-slate-500">
                🔍
              </span>
              <input
                type="search"
                placeholder="输入组件名称..."
                className="w-full rounded-xl border border-slate-200 bg-white/70 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/5 dark:bg-slate-950/80 dark:text-slate-200 dark:placeholder:text-slate-600"
              />
            </div>
            <div className="mt-5 space-y-2">
              {components.map((component) => {
                const isActive = component.id === selectedComponentId;
                return (
                  <button
                    key={component.id}
                    onClick={() => setSelectedComponentId(component.id)}
                    className={`group relative w-full overflow-hidden rounded-xl border px-4 py-4 text-left transition ${
                      isActive
                        ? "border-emerald-400/70 bg-gradient-to-r from-emerald-100 via-emerald-50 to-transparent shadow-[0_20px_50px_-30px_rgba(16,185,129,0.45)] dark:from-emerald-500/15 dark:via-emerald-500/5 dark:shadow-[0_20px_50px_-30px_rgba(16,185,129,0.9)]"
                        : "border-slate-200 bg-white/70 hover:border-emerald-400/50 hover:bg-emerald-50/40 dark:border-white/5 dark:bg-slate-900/50 dark:hover:border-emerald-400/50 dark:hover:bg-slate-900/70"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300"}`}
                      >
                        {component.icon}
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {component.name}
                        </p>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {component.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
      <section className="relative flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-5 text-sm text-slate-600 backdrop-blur dark:border-white/5 dark:bg-slate-950/60 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className="rounded-full border border-slate-200 px-3 py-1 text-emerald-600 transition hover:border-emerald-500/60 hover:text-emerald-500 dark:border-transparent dark:text-emerald-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-200"
            >
              返回首页
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-500 sm:block">
              画布尺寸
            </span>
            <nav className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 p-1 text-xs dark:border-white/5 dark:bg-slate-900/70">
              {[
                { id: "desktop", label: "Desktop" },
                { id: "tablet", label: "Tablet" },
                { id: "mobile", label: "Mobile" }
              ].map((viewport) => (
                <button
                  key={viewport.id}
                  className="rounded-full px-3 py-1 text-slate-600 transition hover:bg-emerald-500/20 hover:text-emerald-800 dark:text-slate-300 dark:hover:text-white"
                  type="button"
                >
                  {viewport.label}
                </button>
              ))}
            </nav>
          </div>
        </header>
        <div className="relative flex flex-1 flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_55%)]"></div>
          <div className="relative flex flex-1 justify-center overflow-y-auto px-8 py-12">
            <div className="relative w-full max-w-4xl">
              <div className="absolute inset-x-10 top-0 -z-20 h-72 rounded-full bg-emerald-500/10 blur-3xl"></div>
              <div className="absolute inset-0 -z-10 rounded-[32px] border border-slate-200 bg-white/90 shadow-[0_40px_120px_-40px_rgba(16,185,129,0.25)] dark:border-white/5 dark:bg-slate-950/80 dark:shadow-[0_40px_120px_-40px_rgba(15,118,110,0.6)]"></div>
              <div className="relative space-y-8 p-12">
                <div className="rounded-[28px] border border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100 p-10 text-slate-700 dark:border-white/5 dark:bg-gradient-to-b dark:from-slate-900/90 dark:via-slate-950/80 dark:to-slate-950/80 dark:text-slate-300">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-700 dark:bg-transparent dark:text-emerald-300">
                        Hero
                      </span>
                      <div>
                        <h3 className="text-3xl font-semibold text-slate-900 dark:text-white">
                          Launch campaigns faster
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          Configure headline, copy, and CTAs to match your
                          go-to-market motion. Preview live content connections
                          in real time.
                        </p>
                      </div>
                    </div>
                    <button className="self-start rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-medium text-slate-600 transition hover:border-emerald-500/40 hover:text-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-emerald-200">
                      Replace component
                    </button>
                  </div>
                  <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm text-slate-600 dark:border-white/5 dark:bg-slate-950/60 dark:text-slate-300">
                    <span className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-white/5">
                      Headline: “Launch campaigns faster”
                    </span>
                    <span className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-white/5">
                      Supporting copy: “Collaborate, QA, and publish from one
                      place.”
                    </span>
                    <span className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-white/5">
                      Primary action: “Start building”
                    </span>
                  </div>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100 p-10 text-slate-700 dark:border-white/5 dark:bg-gradient-to-b dark:from-slate-900/90 dark:via-slate-950/80 dark:to-slate-950/80 dark:text-slate-300">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-700 dark:bg-transparent dark:text-emerald-300">
                        Feature grid
                      </span>
                      <div>
                        <h3 className="text-3xl font-semibold text-slate-900 dark:text-white">
                          Showcase capabilities
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          Toggle column layouts, add cards, and map data fields
                          to your CMS. Set per-breakpoint spacing and color
                          tokens.
                        </p>
                      </div>
                    </div>
                    <button className="self-start rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-medium text-slate-600 transition hover:border-emerald-500/40 hover:text-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-emerald-200">
                      Replace component
                    </button>
                  </div>
                  <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm text-slate-600 dark:border-white/5 dark:bg-slate-950/60 dark:text-slate-300">
                    <span className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-white/5">
                      Section title: “Why teams choose us”
                    </span>
                    <span className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-white/5">
                      Feature count: 3
                    </span>
                    <span className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-white/5">
                      Background: Gradient
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="border-t border-slate-200 bg-white/80 px-8 py-5 dark:border-white/5 dark:bg-slate-950/70">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
              <span>已选组件：{selectedComponent?.name}</span>
              <span>自动保存于 2 分钟前</span>
            </div>
          </footer>
        </div>
      </section>
      <aside className="hidden w-[22rem] flex-none border-l border-slate-200 bg-white/80 p-7 text-slate-700 backdrop-blur xl:block dark:border-white/5 dark:bg-slate-950/70 dark:text-slate-300">
        <div className="space-y-6">
          <header className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-700 dark:border-emerald-500/30 dark:bg-transparent dark:text-emerald-300">
              设置
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {selectedComponent?.name}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                微调文案、样式与交互，实时预览在画布中的效果。
              </p>
            </div>
          </header>
          <form className="space-y-5 text-sm text-slate-600 dark:text-slate-300">
            {selectedComponent?.settings.map((setting) => (
              <label
                key={setting.label}
                className="block space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:border-emerald-400/50 dark:border-white/5 dark:bg-slate-900/60 dark:hover:border-emerald-400/40"
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-slate-500 dark:text-slate-500">
                  {setting.label}
                </span>
                <input
                  type="text"
                  placeholder={setting.placeholder}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/5 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-600"
                />
                {setting.helper ? (
                  <p className="text-xs text-slate-500 dark:text-slate-500">{setting.helper}</p>
                ) : null}
              </label>
            ))}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.9)] transition hover:shadow-[0_18px_40px_-24px_rgba(16,185,129,1)] dark:text-white"
              >
                应用更改
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-emerald-500/40 hover:text-emerald-500 dark:border-white/10 dark:text-slate-300 dark:hover:text-emerald-200"
              >
                重置
              </button>
            </div>
          </form>
        </div>
      </aside>
    </main>
  );
}
