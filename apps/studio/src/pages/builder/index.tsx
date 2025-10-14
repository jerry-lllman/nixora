import { useMemo, useState } from "react";
import type { BuilderComponent } from "../../shared/builderComponents";
import { builderComponents } from "../../shared/builderComponents";
import { BuilderHeader } from "./components/BuilderHeader";
import { CanvasArea } from "./components/CanvasArea";
import { ComponentLibrary } from "./components/ComponentLibrary";
import { SettingsPanel } from "./components/SettingsPanel";
import { useComponentHover } from "./hooks/useComponentHover";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { usePreviewMessaging } from "./hooks/usePreviewMessaging";

export function BuilderPage() {
  const [selectedLibraryComponentId, setSelectedLibraryComponentId] =
    useState<string>(builderComponents[0]?.id ?? "");
  const [selectedCanvasComponentIndex, setSelectedCanvasComponentIndex] =
    useState<number | null>(null);
  const [droppedComponentIds, setDroppedComponentIds] = useState<string[]>([]);

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

  const { hoveredComponentId, handleMouseEnter, handleMouseLeave } =
    useComponentHover();

  const {
    isDraggingOverPreview,
    isDraggingComponent,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    handleDragEnd
  } = useDragAndDrop();

  const { iframeRef } = usePreviewMessaging({
    droppedComponentIds,
    selectedCanvasComponentId,
    selectedCanvasComponentIndex,
    onComponentsReordered: (componentIds, selectedIndex) => {
      setDroppedComponentIds(componentIds);
      setSelectedCanvasComponentIndex(
        typeof selectedIndex === "number" ? selectedIndex : null
      );
    },
    onComponentSelected: (index) => {
      setSelectedCanvasComponentIndex(index);
    }
  });

  const handleComponentDrop = (componentId: string) => {
    setDroppedComponentIds((prev) => {
      const next = [...prev, componentId];
      setSelectedCanvasComponentIndex(next.length - 1);
      return next;
    });
    setSelectedLibraryComponentId(componentId);
  };

  return (
    <main className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),transparent_55%)] dark:bg-slate-950 dark:text-slate-100">
      <ComponentLibrary
        selectedLibraryComponentId={selectedLibraryComponentId}
        hoveredComponentId={hoveredComponentId}
        onComponentSelect={setSelectedLibraryComponentId}
        onDragStart={(event, componentId) => {
          handleDragStart(event, componentId);
          setSelectedLibraryComponentId(componentId);
        }}
        onDragEnd={handleDragEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <section className="relative flex flex-1 min-h-0 flex-col">
        <BuilderHeader />
        <CanvasArea
          iframeRef={iframeRef}
          isDraggingOverPreview={isDraggingOverPreview}
          isDraggingComponent={isDraggingComponent}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={(event) => {
            handleDrop(event, handleComponentDrop);
          }}
        />
      </section>
      <SettingsPanel selectedComponent={selectedComponent} />
    </main>
  );
}
