import type { ConfigPanelProps } from "../../../../shared/builderComponents";

/**
 * Button 组件的配置面板
 */
export function ButtonConfig({ value, onChange }: ConfigPanelProps) {
  const baseInputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/5 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-600";

  return (
    <div className="space-y-4">
      {/* 按钮文字 */}
      <div className="block space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:border-emerald-400/50 dark:border-white/5 dark:bg-slate-900/60 dark:hover:border-emerald-400/40">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-500">
          按钮文字
        </label>
        <input
          type="text"
          placeholder="输入按钮文字"
          value={value.text || ""}
          onChange={(e) => onChange("text", e.target.value)}
          className={baseInputClass}
        />
      </div>

      {/* 样式 */}
      <div className="block space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:border-emerald-400/50 dark:border-white/5 dark:bg-slate-900/60 dark:hover:border-emerald-400/40">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-500">
          样式
        </label>
        <select
          value={value.variant || "primary"}
          onChange={(e) => onChange("variant", e.target.value)}
          className={baseInputClass}
        >
          <option value="primary">主要按钮</option>
          <option value="secondary">次要按钮</option>
          <option value="danger">危险按钮</option>
          <option value="success">成功按钮</option>
        </select>
      </div>

      {/* 尺寸 */}
      <div className="block space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:border-emerald-400/50 dark:border-white/5 dark:bg-slate-900/60 dark:hover:border-emerald-400/40">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-500">
          尺寸
        </label>
        <select
          value={value.size || "medium"}
          onChange={(e) => onChange("size", e.target.value)}
          className={baseInputClass}
        >
          <option value="small">小</option>
          <option value="medium">中</option>
          <option value="large">大</option>
        </select>
      </div>

      {/* 全宽显示 */}
      <div className="block space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:border-emerald-400/50 dark:border-white/5 dark:bg-slate-900/60 dark:hover:border-emerald-400/40">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-500">
          全宽显示
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={value.fullWidth || false}
              onChange={(e) => onChange("fullWidth", e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full transition ${
                value.fullWidth
                  ? "bg-emerald-500"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                value.fullWidth ? "translate-x-5" : ""
              }`}
            />
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {value.fullWidth ? "开启" : "关闭"}
          </span>
        </label>
      </div>

      {/* 图标 */}
      <div className="block space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:border-emerald-400/50 dark:border-white/5 dark:bg-slate-900/60 dark:hover:border-emerald-400/40">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-500">
          图标
        </label>
        <input
          type="text"
          placeholder="输入 emoji 或图标"
          value={value.icon || ""}
          onChange={(e) => onChange("icon", e.target.value)}
          className={baseInputClass}
        />
      </div>
    </div>
  );
}
