export type BuilderToPreviewMessage = {
  type: typeof BUILDER_MESSAGE_TYPE;
  payload: {
    componentIds: string[];
    selectedInstanceIndex?: number | null;
  };
};

export type PreviewToBuilderMessage =
  | {
      type: typeof PREVIEW_READY_TYPE;
    }
  | {
      type: typeof PREVIEW_COMPONENT_SELECTED_TYPE;
      payload: {
        componentId: string;
        index: number;
      };
    };

export const BUILDER_MESSAGE_TYPE = "builder:update-components";
export const PREVIEW_READY_TYPE = "preview:ready";
export const PREVIEW_COMPONENT_SELECTED_TYPE = "preview:component-selected";
