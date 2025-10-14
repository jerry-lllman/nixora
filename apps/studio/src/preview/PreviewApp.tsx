import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import type {
  BuilderToPreviewMessage,
  PreviewToBuilderMessage
} from "../shared/messaging";
import {
  BUILDER_MESSAGE_TYPE,
  PREVIEW_COMPONENT_SELECTED_TYPE,
  PREVIEW_READY_TYPE
} from "../shared/messaging";
import { previewTemplates } from "./templates";

export function PreviewApp() {
  const [componentIds, setComponentIds] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
    <div className="preview-shell">
      {componentIds.map((componentId, index) => {
        const TemplateComponent = previewTemplates[componentId] ?? null;
        if (!TemplateComponent) {
          return null;
        }

        const isSelected = index === selectedIndex;

        return (
          <div
            key={`${componentId}-${index}`}
            role="button"
            tabIndex={0}
            className={`component-instance${
              isSelected ? " component-instance--selected" : ""
            }`}
            onClick={() => handleSelect(componentId, index)}
            onKeyDown={(event) => handleKeyDown(event, componentId, index)}
          >
            <TemplateComponent />
          </div>
        );
      })}
    </div>
  );
}
