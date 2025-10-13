export type BuilderToPreviewMessage =
  | {
      type: "builder:update-components";
      payload: {
        componentIds: string[];
      };
    };

export type PreviewToBuilderMessage = {
  type: "preview:ready";
};

export const BUILDER_MESSAGE_TYPE = "builder:update-components";
export const PREVIEW_READY_TYPE = "preview:ready";
