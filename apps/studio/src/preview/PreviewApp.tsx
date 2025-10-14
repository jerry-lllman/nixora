import { useEffect, useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import type {
  BuilderToPreviewMessage,
  PreviewToBuilderMessage
} from "../shared/messaging";
import {
  BUILDER_MESSAGE_TYPE,
  PREVIEW_COMPONENT_SELECTED_TYPE,
  PREVIEW_COMPONENTS_REORDERED_TYPE,
  PREVIEW_READY_TYPE
} from "../shared/messaging";
import { previewTemplates } from "./templates";

const reorderList = <T,>(list: T[], fromIndex: number, toIndex: number): T[] => {
  const nextList = [...list];
  const [moved] = nextList.splice(fromIndex, 1);
  nextList.splice(toIndex, 0, moved);
  return nextList;
};

export function PreviewApp() {
  const [componentIds, setComponentIds] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<BuilderToPreviewMessage>) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === BUILDER_MESSAGE_TYPE) {
        const { componentIds: incomingComponentIds, selectedInstanceIndex } =
          event.data.payload;
        setComponentIds(incomingComponentIds);

        if (
          typeof selectedInstanceIndex === "number" &&
          selectedInstanceIndex >= 0 &&
          selectedInstanceIndex < incomingComponentIds.length
        ) {
          setSelectedIndex(selectedInstanceIndex);
        } else {
          setSelectedIndex(null);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    const readyMessage: PreviewToBuilderMessage = { type: PREVIEW_READY_TYPE };
    window.parent?.postMessage(readyMessage, window.location.origin);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleSelect = (componentId: string, index: number) => {
    setSelectedIndex(index);
    const message: PreviewToBuilderMessage = {
      type: PREVIEW_COMPONENT_SELECTED_TYPE,
      payload: {
        componentId,
        index
      }
    };
    window.parent?.postMessage(message, window.location.origin);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    componentId: string,
    index: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(componentId, index);
    }
  };

  const resetDragState = () => {
    setDraggingIndex(null);
    setDropIndex(null);
  };

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    componentId: string,
    index: number
  ) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", componentId);
    setDraggingIndex(index);
    setDropIndex(index);
    handleSelect(componentId, index);
  };

  const handleDragOverComponent = (event: DragEvent<HTMLDivElement>, index: number) => {
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
        event.currentTarget.querySelectorAll<HTMLDivElement>(".component-instance")
      );
      const pointerY = event.clientY;
      const nextIndex = instances.findIndex((element) => {
        const rect = element.getBoundingClientRect();
        return pointerY < rect.top + rect.height / 2;
      });
      const derivedIndex = nextIndex === -1 ? componentIds.length : nextIndex;
      if (dropIndex !== derivedIndex) {
        setDropIndex(derivedIndex);
      }
    }
  };

  const handleShellDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (draggingIndex === null) {
      return;
    }
    const relatedTarget = event.relatedTarget as Node | null;
    if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
      setDropIndex(null);
    }
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

    if (
      draggingIndex < 0 ||
      draggingIndex >= componentIds.length ||
      dropIndex < 0 ||
      dropIndex > componentIds.length
    ) {
      resetDragState();
      return;
    }

    const targetIndex = dropIndex > draggingIndex ? dropIndex - 1 : dropIndex;
    if (targetIndex === draggingIndex) {
      resetDragState();
      return;
    }

    const selectedComponentId =
      selectedIndex !== null ? componentIds[selectedIndex] ?? null : null;

    const nextComponentIds = reorderList(componentIds, draggingIndex, targetIndex);
    const nextSelectedIndex =
      selectedComponentId !== null ? nextComponentIds.indexOf(selectedComponentId) : null;

    setComponentIds(nextComponentIds);
    setSelectedIndex(
      nextSelectedIndex !== null && nextSelectedIndex >= 0 ? nextSelectedIndex : null
    );

    const reorderMessage: PreviewToBuilderMessage = {
      type: PREVIEW_COMPONENTS_REORDERED_TYPE,
      payload: {
        componentIds: nextComponentIds,
        selectedIndex:
          nextSelectedIndex !== null && nextSelectedIndex >= 0 ? nextSelectedIndex : null
      }
    };
    window.parent?.postMessage(reorderMessage, window.location.origin);

    resetDragState();
  };

  if (componentIds.length === 0) {
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
      {componentIds.map((componentId, index) => {
        const TemplateComponent = previewTemplates[componentId] ?? null;
        if (!TemplateComponent) {
          return null;
        }

        const isSelected = index === selectedIndex;
        const isDragging = index === draggingIndex;
        const showDropBefore = dropIndex === index;
        const showDropAfter = dropIndex === index + 1;
        const instanceClassName = `component-instance${
          isSelected ? " component-instance--selected" : ""
        }${isDragging ? " component-instance--dragging" : ""}${
          showDropBefore ? " component-instance--drop-before" : ""
        }${showDropAfter ? " component-instance--drop-after" : ""}`;

        return (
          <div
            key={`${componentId}-${index}`}
            role="button"
            tabIndex={0}
            className={instanceClassName}
            draggable
            onClick={() => handleSelect(componentId, index)}
            onKeyDown={(event) => handleKeyDown(event, componentId, index)}
            onDragStart={(event) => handleDragStart(event, componentId, index)}
            onDragOver={(event) => handleDragOverComponent(event, index)}
            onDragEnd={resetDragState}
          >
            <TemplateComponent />
          </div>
        );
      })}
    </div>
  );
}
