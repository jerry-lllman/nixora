import { useEffect, useRef, useState } from "react";
import type {
  BuilderToPreviewMessage,
  ComponentSchema,
  PreviewToBuilderMessage
} from "../../../shared/messaging";
import {
  BUILDER_MESSAGE_TYPE,
  PREVIEW_COMPONENT_SELECTED_TYPE,
  PREVIEW_COMPONENTS_REORDERED_TYPE,
  PREVIEW_READY_TYPE
} from "../../../shared/messaging";

interface UsePreviewMessagingProps {
  schema: ComponentSchema[];
  selectedInstanceId: string | null;
  onComponentSelected: (selection: {
    instanceId: string;
    componentType: string;
    index: number;
  }) => void;
  onComponentsReordered: (instanceIds: string[]) => void;
}

export function usePreviewMessaging({
  schema,
  selectedInstanceId,
  onComponentSelected,
  onComponentsReordered
}: UsePreviewMessagingProps) {

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [previewReadySignal, setPreviewReadySignal] = useState(0);

  useEffect(() => {
    const handlePreviewMessage = (
      event: MessageEvent<PreviewToBuilderMessage>
    ) => {
      // 不校验域名，根据事件类型来处理
      if (event.data?.type === PREVIEW_READY_TYPE) {
        setPreviewReadySignal((signal) => signal + 1);
        return;
      }

      if (event.data?.type === PREVIEW_COMPONENTS_REORDERED_TYPE) {
        onComponentsReordered(event.data.payload.instanceIds);
        return;
      }

      if (event.data?.type === PREVIEW_COMPONENT_SELECTED_TYPE) {
        onComponentSelected({
          instanceId: event.data.payload.instanceId,
          componentType: event.data.payload.componentType,
          index: event.data.payload.index
        });
      }
    };

    window.addEventListener("message", handlePreviewMessage);

    return () => {
      window.removeEventListener("message", handlePreviewMessage);
    };
  }, [onComponentSelected, onComponentsReordered]);

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
        schema,
        selectedInstanceId
      }
    };

    // 发送消息到 preview 窗口（允许任何域名）
    previewWindow.postMessage(message, "*");
  }, [
    selectedInstanceId,
    previewReadySignal,
    schema
  ]);

  return {
    iframeRef
  };
}
