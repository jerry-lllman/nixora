import type { DragEvent } from "react";
import { useMemo } from "react";
import type { ComponentSchema } from "../../../shared/messaging";
import { usePreviewMessaging } from "../hooks/usePreviewMessaging";

interface CanvasAreaProps {
  canvasComponents: Array<{
    instanceId: string;
    componentId: string;
    props: Record<string, any>;
    order: number;
  }>;
  selectedInstanceId: string | null;
  isDraggingOverPreview: boolean;
  isDraggingComponent?: boolean;
  onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onComponentClick: (instanceId: string) => void;
  onReorder: (instanceIds: string[]) => void;
}

export function CanvasArea({
  canvasComponents,
  selectedInstanceId,
  isDraggingOverPreview,
  isDraggingComponent = false,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onComponentClick,
  onReorder
}: CanvasAreaProps) {
  // 将 CanvasComponentInstance 转换为 ComponentSchema
  const schema: ComponentSchema[] = useMemo(() => {
    return canvasComponents.map((instance) => ({
      id: instance.instanceId,
      type: instance.componentId,
      props: instance.props
    }));
  }, [canvasComponents]);

  const { iframeRef } = usePreviewMessaging({
    schema,
    selectedInstanceId,
    onComponentSelected: ({ instanceId }) => {
      onComponentClick(instanceId);
    },
    onComponentsReordered: (instanceIds) => {
      onReorder(instanceIds);
    }
  });

  return (
    <div className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_55%)]"></div>
      <div className="relative flex flex-1 justify-center px-8 py-12 min-h-0">
        <div className="relative w-full max-w-4xl min-h-[600px] h-full overflow-auto">
          <div
            className={`relative z-10 border bg-white/90 shadow-[0_40px_120px_-40px_rgba(16,185,129,0.25)] backdrop-blur transition dark:bg-slate-950/80 dark:shadow-[0_40px_120px_-40px_rgba(15,118,110,0.6)] min-h-[600px] overflow-hidden ${
              isDraggingOverPreview
                ? "border-emerald-400/60 ring-4 ring-emerald-500/20"
                : "border-slate-200 dark:border-white/5"
            }`}
          >
            <iframe
              ref={iframeRef}
              src="http://localhost:3174"
              title="Canvas Preview"
              className="w-full h-full min-h-[600px] border-0"
              sandbox="allow-scripts allow-same-origin"
            />
            {/* 拖拽捕获层 - 当从左侧拖拽组件时覆盖 iframe 以捕获拖拽事件 */}
            {isDraggingComponent && (
              <div
                className="absolute inset-0 pointer-events-auto"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                style={{ zIndex: 50 }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
