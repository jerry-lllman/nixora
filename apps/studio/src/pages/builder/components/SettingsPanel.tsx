import type { BuilderComponent } from "../../../shared/builderComponents";

interface SettingsPanelProps {
  selectedComponent: BuilderComponent | null;
}

export function SettingsPanel({ selectedComponent }: SettingsPanelProps) {
  const selectedComponentName = selectedComponent?.name ?? "未选择";
  const selectedComponentSettings = selectedComponent?.settings ?? [];

  return (
    <aside className="hidden min-h-0 w-[22rem] flex-none overflow-y-auto border-l border-slate-200 bg-white/80 p-7 text-slate-700 backdrop-blur xl:block dark:border-white/5 dark:bg-slate-950/70 dark:text-slate-300">
      <div className="space-y-6">
        <header className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:border-emerald-500/30 dark:bg-transparent dark:text-emerald-300">
            设置
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {selectedComponentName}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              微调文案、样式与交互，实时预览在画布中的效果。
            </p>
          </div>
        </header>
        <form className="space-y-5 text-sm text-slate-600 dark:text-slate-300">
          {selectedComponentSettings.map((setting) => (
            <label
              key={setting.label}
              className="block space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:border-emerald-400/50 dark:border-white/5 dark:bg-slate-900/60 dark:hover:border-emerald-400/40"
            >
              <span className="text-xs font-medium  text-slate-500 dark:text-slate-500">
                {setting.label}
              </span>
              <input
                type="text"
                placeholder={setting.placeholder}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/5 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-600"
              />
              {setting.helper ? (
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {setting.helper}
                </p>
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
  );
}
