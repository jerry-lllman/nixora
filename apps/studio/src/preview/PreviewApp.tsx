import { useEffect, useMemo, useState } from "react";
import type {
  BuilderToPreviewMessage,
  PreviewToBuilderMessage
} from "../shared/messaging";
import { BUILDER_MESSAGE_TYPE, PREVIEW_READY_TYPE } from "../shared/messaging";
import { previewTemplates } from "./templates";

export function PreviewApp() {
  const [componentIds, setComponentIds] = useState<string[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<BuilderToPreviewMessage>) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === BUILDER_MESSAGE_TYPE) {
        setComponentIds(event.data.payload.componentIds);
      }
    };

    window.addEventListener("message", handleMessage);

    const readyMessage: PreviewToBuilderMessage = { type: PREVIEW_READY_TYPE };
    window.parent?.postMessage(readyMessage, window.location.origin);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const renderedComponents = useMemo(() => {
    if (componentIds.length === 0) {
      return null;
    }

    return componentIds.map((componentId, index) => {
      const TemplateComponent = previewTemplates[componentId] ?? null;
      if (!TemplateComponent) {
        return null;
      }
      return <TemplateComponent key={`${componentId}-${index}`} />;
    });
  }, [componentIds]);

  if (!renderedComponents) {
    return (
      <div className="preview-shell">
        <div className="empty-state">
          拖拽组件到这里
          <span>Drag components from the left panel</span>
        </div>
      </div>
    );
  }

  return <div className="preview-shell">{renderedComponents}</div>;
}
