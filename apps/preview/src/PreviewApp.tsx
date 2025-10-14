import { useCallback, useEffect, useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { previewTemplates } from "./templates";
import type {
  BuilderToPreviewMessage,
  ComponentSchema,
  PreviewToBuilderMessage
} from "./types/messaging";
import {
  BUILDER_MESSAGE_TYPE,
  PREVIEW_COMPONENT_SELECTED_TYPE,
  PREVIEW_COMPONENTS_REORDERED_TYPE,
  PREVIEW_READY_TYPE
} from "./types/messaging";

export function PreviewApp() {
  const [schema, setSchema] = useState<ComponentSchema[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null
  );
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<BuilderToPreviewMessage>) => {
      // 不校验域名，根据事件类型来处理
      if (event.data?.type === BUILDER_MESSAGE_TYPE) {
        const {
          schema: incomingSchema = [],
          selectedInstanceId: incomingSelectedId = null
        } = event.data.payload;
        setSchema(incomingSchema);
        setSelectedInstanceId(
          typeof incomingSelectedId === "string" &&
            incomingSelectedId.length > 0
            ? incomingSelectedId
            : null
        );
      }
    };

    window.addEventListener("message", handleMessage);

    const readyMessage: PreviewToBuilderMessage = { type: PREVIEW_READY_TYPE };
    // 发送 ready 消息到 parent（允许任何域名）
    window.parent?.postMessage(readyMessage, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const resetDragState = () => {
    setDraggingIndex(null);
    setDropIndex(null);
  };

  const sendComponentSelected = useCallback(
    (component: ComponentSchema, index: number) => {
      setSelectedInstanceId(component.id);
      const message: PreviewToBuilderMessage = {
        type: PREVIEW_COMPONENT_SELECTED_TYPE,
        payload: {
          instanceId: component.id,
          componentType: component.type,
          index
        }
      };

      // 发送到 parent（允许任何域名）
      window.parent?.postMessage(message, "*");
    },
    []
  );

  const handleKeyDown = useCallback(
    (
      event: KeyboardEvent<HTMLDivElement>,
      component: ComponentSchema,
      index: number
    ) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        sendComponentSelected(component, index);
      }
    },
    [sendComponentSelected]
  );

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    component: ComponentSchema,
    index: number
  ) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", component.id);
    setDraggingIndex(index);
    setDropIndex(index);
    sendComponentSelected(component, index);
  };

  const handleDragOverComponent = (
    event: DragEvent<HTMLDivElement>,
    index: number
  ) => {
    if (draggingIndex === null) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    const rect = event.currentTarget.getBoundingClientRect();
    const insertBefore = event.clientY < rect.top + rect.height / 2;
    const nextDropIndex = insertBefore ? index : index + 1;
    if (dropIndex !== nextDropIndex) {
      setDropIndex(nextDropIndex);
    }
  };

  const handleShellDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (draggingIndex === null) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (event.target === event.currentTarget) {
      const instances = Array.from(
        event.currentTarget.querySelectorAll<HTMLDivElement>(
          ".component-instance"
        )
      );
      const pointerY = event.clientY;

      let nextIndex = schema.length;
      for (let index = 0; index < instances.length; index += 1) {
        const instance = instances[index];
        if (!instance) {
          continue;
        }
        const rect = instance.getBoundingClientRect();
        if (pointerY < rect.top + rect.height / 2) {
          nextIndex = index;
          break;
        }
      }

      if (dropIndex !== nextIndex) {
        setDropIndex(nextIndex);
      }
    }
  };

  const handleShellDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (draggingIndex === null) {
      return;
    }

    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return;
    }

    setDropIndex(null);
  };

  const handleDropOnShell = (event: DragEvent<HTMLDivElement>) => {
    if (draggingIndex === null) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (dropIndex === null) {
      resetDragState();
      return;
    }

    if (dropIndex < 0 || dropIndex > schema.length) {
      resetDragState();
      return;
    }

    const targetIndex = dropIndex > draggingIndex ? dropIndex - 1 : dropIndex;
    if (targetIndex === draggingIndex) {
      resetDragState();
      return;
    }

    const nextSchema = [...schema];
    const [moved] = nextSchema.splice(draggingIndex, 1);
    nextSchema.splice(targetIndex, 0, moved);
    setSchema(nextSchema);

    const reorderMessage: PreviewToBuilderMessage = {
      type: PREVIEW_COMPONENTS_REORDERED_TYPE,
      payload: {
        instanceIds: nextSchema.map((component) => component.id)
      }
    };
    // 发送到 parent（允许任何域名）
    window.parent?.postMessage(reorderMessage, "*");

    resetDragState();
  };

  if (schema.length === 0) {
    return (
      <div className="preview-shell">
        <div className="empty-state">
          拖拽组件到这里
          <span>Drag components from the left panel</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="preview-shell"
      onDragOver={handleShellDragOver}
      onDragLeave={handleShellDragLeave}
      onDrop={handleDropOnShell}
    >
      {schema.map((component, index) => {
        const TemplateComponent = previewTemplates[component.type] ?? null;

        if (!TemplateComponent) {
          return null;
        }

        const isSelected = component.id === selectedInstanceId;
        const isDragging = index === draggingIndex;
        const showDropBefore = dropIndex === index;
        const showDropAfter = dropIndex === index + 1;
        const instanceClassName = [
          "component-instance",
          isSelected ? "component-instance--selected" : "",
          isDragging ? "component-instance--dragging" : "",
          showDropBefore ? "component-instance--drop-before" : "",
          showDropAfter ? "component-instance--drop-after" : ""
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={component.id}
            role="button"
            tabIndex={0}
            className={instanceClassName}
            draggable
            onClick={() => sendComponentSelected(component, index)}
            onKeyDown={(event) => handleKeyDown(event, component, index)}
            onDragStart={(event) => handleDragStart(event, component, index)}
            onDragOver={(event) => handleDragOverComponent(event, index)}
            onDragEnd={resetDragState}
          >
            <TemplateComponent schema={component} />
          </div>
        );
      })}
    </div>
  );
}
