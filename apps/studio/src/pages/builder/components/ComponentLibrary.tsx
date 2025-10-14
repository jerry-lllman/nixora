import type { DragEvent } from "react";
import type { BuilderComponent } from "../../../shared/builderComponents";
import { builderComponents } from "../../../shared/builderComponents";

interface ComponentLibraryProps {
  selectedLibraryComponentId: string;
  hoveredComponentId: string | null;
  onComponentSelect: (componentId: string) => void;
  onDragStart: (event: DragEvent<HTMLButtonElement>, componentId: string) => void;
  onDragEnd: () => void;
  onMouseEnter: (componentId: string) => void;
  onMouseLeave: () => void;
}

export function ComponentLibrary({
  selectedLibraryComponentId,
  hoveredComponentId,
  onComponentSelect,
  onDragStart,
  onDragEnd,
  onMouseEnter,
  onMouseLeave
}: ComponentLibraryProps) {
  return (
    <aside className="hidden min-h-0 w-80 flex-none overflow-y-auto border-r border-slate-200 bg-white/80 p-7 text-slate-700 backdrop-blur lg:block dark:border-white/5 dark:bg-slate-950/70 dark:text-slate-300">
      <div className="space-y-6">
        <header className="space-y-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            Library
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              组件库
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              挑选模块、组合布局，快速拼装出你的下一版页面。
            </p>
          </div>
        </header>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_20px_60px_-40px_rgba(16,185,129,0.3)] dark:border-white/5 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              组件
            </span>
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
          <div className="mt-5 grid grid-cols-3 gap-3">
            {builderComponents.map((component) => {
              const isActive = component.id === selectedLibraryComponentId;
              return (
                <button
                  key={component.id}
                  onClick={() => {
                    onComponentSelect(component.id);
                  }}
                  onMouseEnter={() => {
                    onMouseEnter(component.id);
                  }}
                  onMouseLeave={onMouseLeave}
                  draggable
                  onDragStart={(event) => onDragStart(event, component.id)}
                  onDragEnd={onDragEnd}
                  className={`group relative flex flex-col items-center gap-2 overflow-hidden rounded-xl border px-4 py-5 text-center transition ${
                    isActive
                      ? "border-emerald-400/70 bg-gradient-to-b from-emerald-100 via-emerald-50 to-transparent shadow-[0_20px_50px_-30px_rgba(16,185,129,0.45)] dark:from-emerald-500/10 dark:via-emerald-500/5 dark:to-transparent dark:shadow-[0_20px_50px_-30px_rgba(16,185,129,0.9)]"
                      : "border-slate-200 bg-white/80 hover:border-emerald-400/50 hover:bg-emerald-50/40 dark:border-white/5 dark:bg-slate-900/50 dark:hover:border-emerald-400/50 dark:hover:bg-slate-900/70"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl transition ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:bg-slate-800/80 dark:text-slate-300 dark:group-hover:text-emerald-200"
                    }`}
                  >
                    {component.icon}
                  </span>
                  <p className="text-xs font-semibold text-slate-700 transition-colors dark:text-slate-200">
                    {component.name}
                  </p>
                  {hoveredComponentId === component.id ? (
                    <div className="pointer-events-none absolute inset-x-2 top-full z-10 -mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-600 shadow-[0_12px_30px_-20px_rgba(16,185,129,0.3)] dark:border-emerald-400/40 dark:bg-slate-900/95 dark:text-slate-200 dark:shadow-[0_12px_30px_-20px_rgba(16,185,129,0.8)]">
                      {component.description}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
