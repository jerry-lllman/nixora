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
  PREVIEW_READY_TYPE,
  THEME_SYNC_TYPE
} from "../../../shared/messaging";

interface UsePreviewMessagingProps {
  schema: ComponentSchema[];
  selectedInstanceId: string | null;
  theme?: "light" | "dark";
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
  theme,
  onComponentSelected,
  onComponentsReordered
}: UsePreviewMessagingProps) {

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [previewReadySignal, setPreviewReadySignal] = useState(0);

  useEffect(() => {
    const handlePreviewMessage = (
      event: MessageEvent
    ) => {
      // 不校验域名，根据事件类型来处理
      const data = event.data as PreviewToBuilderMessage | undefined;
      if (!data?.type) return;

      switch (data.type) {
        case PREVIEW_READY_TYPE:
          setPreviewReadySignal((signal) => signal + 1);
          break;
        case PREVIEW_COMPONENTS_REORDERED_TYPE:
          onComponentsReordered(data.payload.instanceIds);
          break;
        case PREVIEW_COMPONENT_SELECTED_TYPE:
          onComponentSelected({
            instanceId: data.payload.instanceId,
            componentType: data.payload.componentType,
            index: data.payload.index
          });
          break;
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

  // 同步主题到 preview
  useEffect(() => {
    if (previewReadySignal === 0 || !theme) {
      return;
    }

    const previewWindow = iframeRef.current?.contentWindow;
    if (!previewWindow) {
      return;
    }

    const message: BuilderToPreviewMessage = {
      type: THEME_SYNC_TYPE,
      payload: {
        theme
      }
    };

    previewWindow.postMessage(message, "*");
  }, [theme, previewReadySignal]);

  return {
    iframeRef
  };
}
