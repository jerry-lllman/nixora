import type { DragEvent } from "react";
import type { CanvasComponentInstance } from "../../../shared/builderComponents";
import { builderComponents } from "../../../shared/builderComponents";

interface CanvasAreaProps {
  canvasComponents: CanvasComponentInstance[];
  selectedInstanceId: string | null;
  isDraggingOverPreview: boolean;
  onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onComponentClick: (instanceId: string) => void;
}

export function CanvasArea({
  canvasComponents,
  selectedInstanceId,
  isDraggingOverPreview,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onComponentClick
}: CanvasAreaProps) {
  return (
    <div className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_55%)]"></div>
      <div className="relative flex flex-1 justify-center px-8 py-12 overflow-auto">
        <div
          className="relative w-full max-w-4xl min-h-[600px]"
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="absolute inset-x-10 top-0 -z-20 h-72 rounded-full bg-emerald-500/10 blur-3xl"></div>
          <div
            className={`relative z-10 rounded-[32px] border bg-white/90 shadow-[0_40px_120px_-40px_rgba(16,185,129,0.25)] backdrop-blur transition dark:bg-slate-950/80 dark:shadow-[0_40px_120px_-40px_rgba(15,118,110,0.6)] min-h-[600px] p-8 ${
              isDraggingOverPreview
                ? "border-emerald-400/60 ring-4 ring-emerald-500/20"
                : "border-slate-200 dark:border-white/5"
            }`}
          >
            {canvasComponents.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="space-y-4">
                  <div className="text-6xl">📦</div>
                  <div>
                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                      画布空空如也
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      从左侧拖拽组件到这里开始设计
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {canvasComponents.map((instance) => {
                  const builderComponent = builderComponents.find(
                    (c) => c.id === instance.componentId
                  );
                  if (!builderComponent) return null;

                  const Component = builderComponent.component;
                  const isSelected = instance.instanceId === selectedInstanceId;

                  return (
                    <div
                      key={instance.instanceId}
                      onClick={() => onComponentClick(instance.instanceId)}
                      className={`relative rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-emerald-500 ring-offset-4 ring-offset-white dark:ring-offset-slate-950"
                          : "hover:ring-2 hover:ring-emerald-300 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-slate-950"
                      }`}
                    >
                      {/* 组件标签 */}
                      {isSelected ? (
                        <div className="absolute -top-3 left-4 z-20 flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                          <span>{builderComponent.icon}</span>
                          <span>{builderComponent.name}</span>
                        </div>
                      ) : null}

                      {/* 渲染真实组件 */}
                      <div className="p-4">
                        <Component {...instance.config} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
