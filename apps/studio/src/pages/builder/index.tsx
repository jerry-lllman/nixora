import { useState } from "react";
import { builderComponents } from "../../shared/builderComponents";
import { BuilderHeader } from "./components/BuilderHeader";
import { CanvasArea } from "./components/CanvasArea";
import { ComponentLibrary } from "./components/ComponentLibrary";
import { SettingsPanel } from "./components/settings";
import { useCanvasState } from "./hooks/useCanvasState";
import { useComponentHover } from "./hooks/useComponentHover";
import { useDragAndDrop } from "./hooks/useDragAndDrop";

export function BuilderPage() {
  const [selectedLibraryComponentId, setSelectedLibraryComponentId] =
    useState<string>(builderComponents[0]?.id ?? "");

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

  const {
    canvasComponents,
    selectedInstanceId,
    addComponent,
    removeComponent,
    updateComponentConfig,
    selectComponent,
    getSelectedInstance,
    getBuilderComponent,
    reorderComponents
  } = useCanvasState();

  const handleComponentDrop = (componentId: string) => {
    addComponent(componentId);
  };

  const selectedInstance = getSelectedInstance();
  const selectedBuilderComponent = selectedInstance
    ? getBuilderComponent(selectedInstance.componentId)
    : null;

  // 处理配置变更，自动绑定当前选中的实例ID
  const handleConfigChange = (key: string, value: any) => {
    if (selectedInstance) {
      updateComponentConfig(selectedInstance.instanceId, key, value);
    }
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
          canvasComponents={canvasComponents}
          selectedInstanceId={selectedInstanceId}
          isDraggingOverPreview={isDraggingOverPreview}
          isDraggingComponent={isDraggingComponent}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={(event) => {
            handleDrop(event, handleComponentDrop);
          }}
          onComponentClick={selectComponent}
          onReorder={reorderComponents}
        />
      </section>
      <SettingsPanel
        selectedInstance={selectedInstance}
        builderComponent={selectedBuilderComponent || null}
        onConfigChange={handleConfigChange}
        onDelete={() => {
          if (selectedInstance) {
            removeComponent(selectedInstance.instanceId);
          }
        }}
      />
    </main>
  );
}
