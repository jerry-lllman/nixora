import type { DragEvent, RefObject } from "react";

interface CanvasAreaProps {
  iframeRef: RefObject<HTMLIFrameElement>;
  isDraggingOverPreview: boolean;
  isDraggingComponent: boolean;
  onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

export function CanvasArea({
  iframeRef,
  isDraggingOverPreview,
  isDraggingComponent,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop
}: CanvasAreaProps) {
  return (
    <div className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_55%)]"></div>
      <div className="relative flex flex-1 justify-center px-8 py-12">
        <div
          className="relative w-full max-w-4xl border"
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="absolute inset-x-10 top-0 -z-20 h-72 rounded-full bg-emerald-500/10 blur-3xl"></div>
          <div
            className={`absolute inset-0 -z-10 rounded-[32px] border bg-white/90 shadow-[0_40px_120px_-40px_rgba(16,185,129,0.25)] backdrop-blur transition dark:bg-slate-950/80 dark:shadow-[0_40px_120px_-40px_rgba(15,118,110,0.6)] ${
              isDraggingOverPreview
                ? "border-emerald-400/60 ring-4 ring-emerald-500/20"
                : "border-slate-200 dark:border-white/5"
            }`}
          ></div>
          <iframe
            ref={iframeRef}
            title="组件预览"
            className="relative z-10 w-full overflow-hidden border-0 bg-transparent text-left shadow-[0_24px_80px_-50px_rgba(16,185,129,0.45)]"
            src="/preview.html"
            style={{
              height: "100%",
              pointerEvents: isDraggingComponent ? "none" : "auto"
            }}
          />
        </div>
      </div>
    </div>
  );
}
