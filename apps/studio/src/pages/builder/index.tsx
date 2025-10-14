import { useMemo, useRef, useState } from "react";
import type { BuilderComponent } from "../../shared/builderComponents";
import { builderComponents } from "../../shared/builderComponents";
import type { ComponentSchema } from "../../shared/messaging";
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
  const [componentSchema, setComponentSchema] = useState<ComponentSchema[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null
  );
  const instanceCounterRef = useRef(0);

  const selectedCanvasComponentIndex = useMemo(() => {
    if (!selectedInstanceId) {
      return null;
    }
    const nextIndex = componentSchema.findIndex(
      (schema) => schema.id === selectedInstanceId
    );
    return nextIndex >= 0 ? nextIndex : null;
  }, [componentSchema, selectedInstanceId]);

  const selectedComponent = useMemo<BuilderComponent | null>(() => {
    if (selectedCanvasComponentIndex === null) {
      return null;
    }
    return (
      builderComponents.find(
        (component) =>
          component.id ===
          componentSchema[selectedCanvasComponentIndex]?.type
      ) ?? null
    );
  }, [componentSchema, selectedCanvasComponentIndex]);

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

  const reorderSchemaByIds = (instanceIds: string[]) => {
    setComponentSchema((prev) => {
      if (instanceIds.length === 0) {
        return prev;
      }

      const componentMap = new Map(prev.map((component) => [component.id, component]));
      const reordered: ComponentSchema[] = [];

      instanceIds.forEach((id) => {
        const component = componentMap.get(id);
        if (component) {
          reordered.push(component);
          componentMap.delete(id);
        }
      });

      if (componentMap.size > 0) {
        componentMap.forEach((component) => {
          reordered.push(component);
        });
      }

      const nextSchema = reordered;
      const hasSelection =
        selectedInstanceId !== null
          ? nextSchema.some((component) => component.id === selectedInstanceId)
          : true;

      if (!hasSelection) {
        const nextSelectedInstance = nextSchema[0] ?? null;
        setSelectedInstanceId(nextSelectedInstance?.id ?? null);
        if (nextSelectedInstance) {
          setSelectedLibraryComponentId(nextSelectedInstance.type);
        }
      }

      return nextSchema;
    });
  };

  const { iframeRef } = usePreviewMessaging({
    schema: componentSchema,
    selectedInstanceId,
    onComponentSelected: ({ instanceId, componentType }) => {
      setSelectedInstanceId(instanceId);
      setSelectedLibraryComponentId(componentType);
    },
    onComponentsReordered: (instanceIds) => {
      reorderSchemaByIds(instanceIds);
    }
  });

  const handleComponentDrop = (componentId: string) => {
    instanceCounterRef.current += 1;
    const instanceId = `${componentId}-${instanceCounterRef.current}`;
    const newComponent: ComponentSchema = {
      id: instanceId,
      type: componentId
    };

    setComponentSchema((prev) => [...prev, newComponent]);
    setSelectedInstanceId(instanceId);
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
