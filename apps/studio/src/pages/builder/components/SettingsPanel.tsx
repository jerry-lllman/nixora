import type { CanvasComponentInstance, BuilderComponent } from "../../../shared/builderComponents";
import { ConfigField } from "./ConfigField";

interface SettingsPanelProps {
  selectedInstance: CanvasComponentInstance | null;
  builderComponent: BuilderComponent | null;
  onConfigChange: (key: string, value: any) => void;
  onDelete: () => void;
}

export function SettingsPanel({
  selectedInstance,
  builderComponent,
  onConfigChange,
  onDelete
}: SettingsPanelProps) {
  if (!selectedInstance || !builderComponent) {
    return (
      <aside className="hidden min-h-0 w-[22rem] flex-none overflow-y-auto border-l border-slate-200 bg-white/80 p-7 text-slate-700 backdrop-blur xl:block dark:border-white/5 dark:bg-slate-950/70 dark:text-slate-300">
        <div className="flex h-full items-center justify-center">
          <div className="text-center space-y-3">
            <div className="text-4xl">👈</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              从左侧拖拽组件到画布
              <br />
              或点击画布中的组件进行配置
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden min-h-0 w-[22rem] flex-none overflow-y-auto border-l border-slate-200 bg-white/80 p-7 text-slate-700 backdrop-blur xl:block dark:border-white/5 dark:bg-slate-950/70 dark:text-slate-300">
      <div className="space-y-6">
        <header className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            {builderComponent.icon} 配置
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {builderComponent.name}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {builderComponent.description}
            </p>
          </div>
        </header>

        {/* 动态配置表单 */}
        <div className="space-y-4">
          {builderComponent.configs.map((config) => (
            <ConfigField
              key={config.key}
              config={config}
              value={selectedInstance.config[config.key]}
              onChange={(value) => onConfigChange(config.key, value)}
            />
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-3">
          <button
            type="button"
            onClick={onDelete}
            className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            删除组件
          </button>
          <p className="text-xs text-center text-slate-400 dark:text-slate-500">
            ID: {selectedInstance.instanceId.split("-").pop()}
          </p>
        </div>
      </div>
    </aside>
  );
}
