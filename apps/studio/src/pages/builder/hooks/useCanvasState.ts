import { useState, useCallback } from "react";
import type { CanvasComponentInstance, BuilderComponent } from "../../../shared/builderComponents";
import { builderComponents } from "../../../shared/builderComponents";

export function useCanvasState() {
  // 画布上的组件实例列表
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponentInstance[]>([]);

  // 当前选中的画布组件实例 ID
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

  /**
   * 添加组件到画布
   */
  const addComponent = useCallback((componentType: string) => {
    const builderComponent = builderComponents.find((c) => c.componentType === componentType);
    if (!builderComponent) return;

    // 使用组件定义的默认配置
    const newInstance: CanvasComponentInstance = {
      instanceId: `${componentType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      componentType,
      props: { ...builderComponent.props }, // 克隆默认配置
      order: canvasComponents.length
    };

    setCanvasComponents((prev) => [...prev, newInstance]);
    setSelectedInstanceId(newInstance.instanceId);
  }, [canvasComponents.length]);

  /**
   * 删除组件实例
   */
  const removeComponent = useCallback((instanceId: string) => {
    setCanvasComponents((prev) => prev.filter((c) => c.instanceId !== instanceId));
    if (selectedInstanceId === instanceId) {
      setSelectedInstanceId(null);
    }
  }, [selectedInstanceId]);

  /**
   * 更新组件配置
   */
  const updateComponentConfig = useCallback((instanceId: string, key: string, value: any) => {
    setCanvasComponents((prev) =>
      prev.map((instance) =>
        instance.instanceId === instanceId
          ? { ...instance, props: { ...instance.props, [key]: value } }
          : instance
      )
    );
  }, []);

  /**
   * 更新整个组件配置对象
   */
  const updateComponentConfigs = useCallback((instanceId: string, newProps: Record<string, any>) => {
    setCanvasComponents((prev) =>
      prev.map((instance) =>
        instance.instanceId === instanceId
          ? { ...instance, props: { ...instance.props, ...newProps } }
          : instance
      )
    );
  }, []);

  /**
   * 选中组件
   */
  const selectComponent = useCallback((instanceId: string | null) => {
    setSelectedInstanceId(instanceId);
  }, []);

  /**
   * 获取当前选中的组件实例
   */
  const getSelectedInstance = useCallback((): CanvasComponentInstance | null => {
    if (!selectedInstanceId) return null;
    return canvasComponents.find((c) => c.instanceId === selectedInstanceId) || null;
  }, [selectedInstanceId, canvasComponents]);

  /**
   * 获取组件的 BuilderComponent 定义
   */
  const getBuilderComponent = useCallback((componentId: string): BuilderComponent | undefined => {
    return builderComponents.find((c) => c.componentType === componentId);
  }, []);

  /**
   * 移动组件顺序
   */
  const moveComponent = useCallback((instanceId: string, direction: "up" | "down") => {
    setCanvasComponents((prev) => {
      const index = prev.findIndex((c) => c.instanceId === instanceId);
      if (index === -1) return prev;

      const newOrder = [...prev];
      if (direction === "up" && index > 0) {
        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      } else if (direction === "down" && index < prev.length - 1) {
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      }

      // 更新 order 字段
      return newOrder.map((item, idx) => ({ ...item, order: idx }));
    });
  }, []);

  /**
   * 重新排序组件（用于拖拽）- 接受两个 ID
   */
  const reorderComponents = useCallback((activeIdOrIds: string | string[], overId?: string) => {
    // 如果传入的是数组，则直接按数组顺序重排
    if (Array.isArray(activeIdOrIds)) {
      setCanvasComponents((prev) => {
        const instanceMap = new Map(prev.map((c) => [c.instanceId, c]));
        const newOrder = activeIdOrIds
          .map((id) => instanceMap.get(id))
          .filter((c): c is CanvasComponentInstance => c !== undefined);

        // 更新 order 字段
        return newOrder.map((item, idx) => ({ ...item, order: idx }));
      });
      return;
    }

    // 原有的逻辑：接受 activeId 和 overId
    const activeId = activeIdOrIds;
    if (!overId) return;

    setCanvasComponents((prev) => {
      const oldIndex = prev.findIndex((c) => c.instanceId === activeId);
      const newIndex = prev.findIndex((c) => c.instanceId === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      // 重新排列数组
      const newOrder = [...prev];
      const [movedItem] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedItem);

      // 更新 order 字段
      return newOrder.map((item, idx) => ({ ...item, order: idx }));
    });
  }, []);

  /**
   * 清空画布
   */
  const clearCanvas = useCallback(() => {
    setCanvasComponents([]);
    setSelectedInstanceId(null);
  }, []);

  return {
    canvasComponents,
    selectedInstanceId,
    addComponent,
    removeComponent,
    updateComponentConfig,
    updateComponentConfigs,
    selectComponent,
    getSelectedInstance,
    getBuilderComponent,
    moveComponent,
    reorderComponents,
    clearCanvas
  };
}
