import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { canvasApi } from "../../lib/api/canvas";
import { useTheme } from "../../theme";
import { BuilderHeader } from "./components/BuilderHeader";
import { CanvasArea } from "./components/CanvasArea";
import { ComponentLibrary } from "./components/ComponentLibrary";
import { SettingsPanel } from "./components/settings";
import { useCanvasState } from "./hooks/useCanvasState";
import { useComponentHover } from "./hooks/useComponentHover";
import { useDragAndDrop } from "./hooks/useDragAndDrop";

export function BuilderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLibraryComponentId, setSelectedLibraryComponentId] =
    useState("");
  const [canvasTitle] = useState("未命名画布");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 从 URL 获取画布 ID
  const canvasId = searchParams.get("id");

  const { theme } = useTheme();
  const { handleMouseEnter, handleMouseLeave } = useComponentHover();

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
    reorderComponents,
    setCanvasComponents
  } = useCanvasState();

  // 页面加载时，如果 URL 有 ID，则加载画布数据
  useEffect(() => {
    const loadCanvas = async () => {
      if (!canvasId) return;

      try {
        setIsLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const canvas = await canvasApi.findOne(canvasId);

        // 加载画布的组件数据
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        setCanvasComponents(canvas.components);
      } catch (error) {
        console.error("加载画布失败:", error);
        alert(
          "加载画布失败: " +
            (error instanceof Error ? error.message : "未知错误")
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadCanvas();
  }, [canvasId, setCanvasComponents]);

  const handleComponentDrop = (componentType: string) => {
    addComponent(componentType);
  };

  const selectedInstance = getSelectedInstance();
  const selectedBuilderComponent = selectedInstance
    ? (getBuilderComponent(selectedInstance.componentType) ?? null)
    : null;

  // 处理配置变更，自动绑定当前选中的实例ID
  const handleConfigChange = (key: string, value: unknown) => {
    if (selectedInstance) {
      updateComponentConfig(selectedInstance.instanceId, key, value);
    }
  };

  // 保存画布
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const canvasData = {
        title: canvasTitle,
        components: canvasComponents,
        description: "使用 Nixora Builder 创建"
      };

      if (canvasId) {
        // 更新现有画布
        await canvasApi.update(canvasId, canvasData);
      } else {
        // 创建新画布
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const newCanvas = await canvasApi.create(canvasData);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const newCanvasId = newCanvas.id as string;
        // 更新 URL 查询参数
        setSearchParams({ id: newCanvasId });
      }
    } catch (error) {
      console.error("保存失败:", error);
      alert(
        "保存失败: " + (error instanceof Error ? error.message : "未知错误")
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 发布画布
  const handlePublish = async () => {
    try {
      // 先保存
      if (!canvasId) {
        await handleSave();
        return;
      }

      setIsPublishing(true);

      // 发布
      await canvasApi.publish(canvasId);
      // 静默发布，不显示提示
    } catch (error) {
      console.error("发布失败:", error);
      alert(
        "发布失败: " + (error instanceof Error ? error.message : "未知错误")
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),transparent_55%)] dark:bg-slate-950 dark:text-slate-100">
      <BuilderHeader
        onSave={() => void handleSave()}
        onPublish={() => void handlePublish()}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-slate-500">加载画布中...</p>
        </div>
      ) : (
        <div className="flex flex-1 min-h-0">
          <ComponentLibrary
            selectedLibraryComponentId={selectedLibraryComponentId}
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
            <CanvasArea
              canvasComponents={canvasComponents}
              selectedInstanceId={selectedInstanceId}
              theme={theme}
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
            builderComponent={selectedBuilderComponent ?? null}
            onConfigChange={handleConfigChange}
            onDelete={() => {
              if (selectedInstance) {
                removeComponent(selectedInstance.instanceId);
              }
            }}
          />
        </div>
      )}
    </main>
  );
}
