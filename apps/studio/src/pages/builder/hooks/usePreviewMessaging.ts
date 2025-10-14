import { useEffect, useRef, useState } from "react";
import type {
  BuilderToPreviewMessage,
  PreviewToBuilderMessage
} from "../../../shared/messaging";
import {
  BUILDER_MESSAGE_TYPE,
  PREVIEW_COMPONENT_SELECTED_TYPE,
  PREVIEW_COMPONENTS_REORDERED_TYPE,
  PREVIEW_READY_TYPE
} from "../../../shared/messaging";

interface UsePreviewMessagingProps {
  droppedComponentIds: string[];
  selectedCanvasComponentId: string | null;
  selectedCanvasComponentIndex: number | null;
  onComponentsReordered: (
    componentIds: string[],
    selectedIndex: number | null
  ) => void;
  onComponentSelected: (index: number) => void;
}

export function usePreviewMessaging({
  droppedComponentIds,
  selectedCanvasComponentId,
  selectedCanvasComponentIndex,
  onComponentsReordered,
  onComponentSelected
}: UsePreviewMessagingProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [previewReadySignal, setPreviewReadySignal] = useState(0);

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

      if (event.data?.type === PREVIEW_COMPONENTS_REORDERED_TYPE) {
        const { componentIds: nextComponentIds, selectedIndex } =
          event.data.payload;
        onComponentsReordered(nextComponentIds, selectedIndex);
        return;
      }

      if (event.data?.type === PREVIEW_COMPONENT_SELECTED_TYPE) {
        onComponentSelected(event.data.payload.index);
      }
    };

    window.addEventListener("message", handlePreviewMessage);

    return () => {
      window.removeEventListener("message", handlePreviewMessage);
    };
  }, [onComponentsReordered, onComponentSelected]);

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

  return {
    iframeRef
  };
}
