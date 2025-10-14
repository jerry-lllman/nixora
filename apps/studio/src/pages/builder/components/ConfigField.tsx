import type { ComponentConfig } from "../../../shared/builderComponents";

interface ConfigFieldProps {
  config: ComponentConfig;
  value: any;
  onChange: (value: any) => void;
}

/**
 * 动态表单字段组件
 * 根据 config.type 渲染不同的表单控件
 */
export function ConfigField({ config, value, onChange }: ConfigFieldProps) {
  const baseInputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/5 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-600";

  const renderInput = () => {
    switch (config.type) {
      case "text":
      case "image":
        return (
          <input
            type="text"
            placeholder={config.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClass}
          />
        );

      case "textarea":
        return (
          <textarea
            placeholder={config.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className={baseInputClass}
          />
        );

      case "number":
        return (
          <input
            type="number"
            placeholder={config.placeholder}
            value={value ?? config.defaultValue}
            onChange={(e) => onChange(Number(e.target.value))}
            min={config.min}
            max={config.max}
            step={config.step}
            className={baseInputClass}
          />
        );

      case "select":
        return (
          <select
            value={value || config.defaultValue}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClass}
          >
            {config.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "color":
        return (
          <div className="flex gap-2">
            <input
              type="color"
              value={value || "#10b981"}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-lg border border-slate-200 dark:border-white/5"
            />
            <input
              type="text"
              placeholder={config.placeholder || "#10b981"}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className={baseInputClass}
            />
          </div>
        );

      case "switch":
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={value ?? config.defaultValue}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full transition ${
                  value ?? config.defaultValue
                    ? "bg-emerald-500"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  value ?? config.defaultValue ? "translate-x-5" : ""
                }`}
              />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {value ?? config.defaultValue ? "开启" : "关闭"}
            </span>
          </label>
        );

      case "slider":
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={value ?? config.defaultValue}
              onChange={(e) => onChange(Number(e.target.value))}
              min={config.min}
              max={config.max}
              step={config.step}
              className="w-full"
            />
            <div className="text-xs text-slate-500 dark:text-slate-400">
              当前值: {value ?? config.defaultValue}
            </div>
          </div>
        );

      case "options":
        // 简化的 options 编辑器，显示 JSON 字符串
        // 后续可以扩展为更复杂的列表编辑器
        return (
          <div className="space-y-2">
            <textarea
              value={JSON.stringify(value || config.defaultValue, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  onChange(parsed);
                } catch {
                  // 如果 JSON 格式错误，暂不更新
                }
              }}
              rows={6}
              placeholder={config.placeholder}
              className={`${baseInputClass} font-mono text-xs`}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              JSON 格式，请确保格式正确
            </p>
          </div>
        );

      default:
        return (
          <div className="text-xs text-slate-400">
            不支持的字段类型: {config.type}
          </div>
        );
    }
  };

  return (
    <div className="block space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:border-emerald-400/50 dark:border-white/5 dark:bg-slate-900/60 dark:hover:border-emerald-400/40">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-500">
        {config.label}
      </label>
      {renderInput()}
      {config.helper ? (
        <p className="text-xs text-slate-500 dark:text-slate-500">{config.helper}</p>
      ) : null}
    </div>
  );
}
