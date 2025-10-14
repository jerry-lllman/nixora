import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import type { BuilderComponent } from "../shared/builderComponents";
import { builderComponents } from "../shared/builderComponents";
import type {
  BuilderToPreviewMessage,
  PreviewToBuilderMessage
} from "../shared/messaging";
import {
  BUILDER_MESSAGE_TYPE,
  PREVIEW_COMPONENT_SELECTED_TYPE,
  PREVIEW_READY_TYPE
} from "../shared/messaging";

export function BuilderPage() {
  const [selectedLibraryComponentId, setSelectedLibraryComponentId] = useState<string>(
    builderComponents[0]?.id ?? ""
  );
  const [selectedCanvasComponentIndex, setSelectedCanvasComponentIndex] = useState<number | null>(
    null
  );
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(
    null
  );
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [droppedComponentIds, setDroppedComponentIds] = useState<string[]>([]);
  const [isDraggingOverPreview, setIsDraggingOverPreview] = useState(false);
  const [isDraggingComponent, setIsDraggingComponent] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [previewReadySignal, setPreviewReadySignal] = useState(0);

  const selectedCanvasComponentId = useMemo(() => {
    if (selectedCanvasComponentIndex === null) {
      return null;
    }
    return droppedComponentIds[selectedCanvasComponentIndex] ?? null;
  }, [droppedComponentIds, selectedCanvasComponentIndex]);

  const selectedComponent = useMemo<BuilderComponent | null>(() => {
    if (!selectedCanvasComponentId) {
      return null;
    }
    return (
      builderComponents.find(
        (component) => component.id === selectedCanvasComponentId
      ) ?? null
    );
  }, [selectedCanvasComponentId]);

  const selectedComponentName = selectedComponent?.name ?? "未选择";
  const selectedComponentSettings = selectedComponent?.settings ?? [];

  const previewHeight = useMemo(() => {
    const baseHeight = 560;
    const additionalPerComponent = 220;
    const maxHeight = 1600;
    const computedHeight = baseHeight + droppedComponentIds.length * additionalPerComponent;
    return `${Math.min(maxHeight, Math.max(baseHeight, computedHeight))}px`;
  }, [droppedComponentIds.length]);

  const handleDragStart = (
    event: DragEvent<HTMLButtonElement>,
    componentId: string
  ) => {
    event.dataTransfer.setData("application/builder-component", componentId);
    event.dataTransfer.effectAllowed = "copy";
    setSelectedLibraryComponentId(componentId);
    setIsDraggingComponent(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOverPreview(false);
    setIsDraggingComponent(false);
    const componentId = event.dataTransfer.getData("application/builder-component");
    if (!componentId) {
      return;
    }
    setDroppedComponentIds((prev) => {
      const next = [...prev, componentId];
      setSelectedCanvasComponentIndex(next.length - 1);
      return next;
    });
    setSelectedLibraryComponentId(componentId);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOverPreview(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return;
    }
    setIsDraggingOverPreview(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handlePreviewMessage = (
      event: MessageEvent<PreviewToBuilderMessage>
    ) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === PREVIEW_READY_TYPE) {
        setPreviewReadySignal((signal) => signal + 1);
        return;
      }

      if (event.data?.type === PREVIEW_COMPONENT_SELECTED_TYPE) {
        setSelectedCanvasComponentIndex(event.data.payload.index);
      }
    };

    window.addEventListener("message", handlePreviewMessage);

    return () => {
      window.removeEventListener("message", handlePreviewMessage);
    };
  }, []);

  useEffect(() => {
    if (previewReadySignal === 0) {
      return;
    }

    const previewWindow = iframeRef.current?.contentWindow;
    if (!previewWindow) {
      return;
    }

    const message: BuilderToPreviewMessage = {
      type: BUILDER_MESSAGE_TYPE,
      payload: {
        componentIds: droppedComponentIds,
        selectedInstanceIndex: selectedCanvasComponentId
          ? selectedCanvasComponentIndex
          : null
      }
    };

    previewWindow.postMessage(message, window.location.origin);
  }, [
    droppedComponentIds,
    previewReadySignal,
    selectedCanvasComponentId,
    selectedCanvasComponentIndex
  ]);

  const handleMouseEnter = (componentId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredComponentId(componentId);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredComponentId(null);
  };

  return (
    <main className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),transparent_55%)] dark:bg-slate-950 dark:text-slate-100">
      <aside className="hidden min-h-0 w-80 flex-none overflow-y-auto border-r border-slate-200 bg-white/80 p-7 text-slate-700 backdrop-blur lg:block dark:border-white/5 dark:bg-slate-950/70 dark:text-slate-300">
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
            <div className="mt-5 grid grid-cols-3 gap-3">
              {builderComponents.map((component) => {
                const isActive = component.id === selectedLibraryComponentId;
                return (
                  <button
                    key={component.id}
                    onClick={() => {
                      setSelectedLibraryComponentId(component.id);
                    }}
                    onMouseEnter={() => {
                      handleMouseEnter(component.id);
                    }}
                    onMouseLeave={handleMouseLeave}
                    draggable
                    onDragStart={(event) => handleDragStart(event, component.id)}
                    onDragEnd={() => {
                      setIsDraggingOverPreview(false);
                      setIsDraggingComponent(false);
                    }}
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
                      <div className="pointer-events-none absolute inset-x-2 top-full z-10 -mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] leading-relaxed text-slate-600 shadow-[0_12px_30px_-20px_rgba(16,185,129,0.3)] dark:border-emerald-400/40 dark:bg-slate-900/95 dark:text-slate-200 dark:shadow-[0_12px_30px_-20px_rgba(16,185,129,0.8)]">
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
      <section className="relative flex flex-1 min-h-0 flex-col">
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
            <span className="hidden text-xs uppercase text-slate-500 dark:text-slate-500 sm:block">
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
        <div className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_55%)]"></div>
          <div className="relative flex flex-1 justify-center overflow-y-auto px-8 py-12">
            <div
              className="relative w-full max-w-4xl"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
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
                className="relative z-10 w-full overflow-hidden rounded-[32px] border-0 bg-transparent text-left shadow-[0_24px_80px_-50px_rgba(16,185,129,0.45)]"
                src="/preview.html"
                style={{
                  height: previewHeight,
                  pointerEvents: isDraggingComponent ? "none" : "auto"
                }}
              />
            </div>
          </div>
        </div>
        <footer className="border-t border-slate-200 bg-white/80 px-8 py-5 dark:border-white/5 dark:bg-slate-950/70">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
            <span>已选组件：{selectedComponentName}</span>
            <span>自动保存于 2 分钟前</span>
          </div>
        </footer>
      </section>
      <aside className="hidden min-h-0 w-[22rem] flex-none overflow-y-auto border-l border-slate-200 bg-white/80 p-7 text-slate-700 backdrop-blur xl:block dark:border-white/5 dark:bg-slate-950/70 dark:text-slate-300">
        <div className="space-y-6">
          <header className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-700 dark:border-emerald-500/30 dark:bg-transparent dark:text-emerald-300">
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
