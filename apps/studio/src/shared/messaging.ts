export interface ComponentSchema {
  /**
   * Unique identifier for the component instance.
   */
  id: string;
  /**
   * Component type, used to resolve the preview template.
   */
  type: string;
  /**
   * Optional props used by the preview template.
   */
  props?: Record<string, any>;
}

export interface BuilderToPreviewMessage {
  type: typeof BUILDER_MESSAGE_TYPE;
  payload: {
    schema: ComponentSchema[];
    selectedInstanceId?: string | null;
  };
};

export type PreviewToBuilderMessage =
  | {
      type: typeof PREVIEW_READY_TYPE;
    }
  | {
      type: typeof PREVIEW_COMPONENT_SELECTED_TYPE;
      payload: {
        instanceId: string;
        index: number;
        componentType: string;
      };
    }
  | {
      type: typeof PREVIEW_COMPONENTS_REORDERED_TYPE;
      payload: {
        instanceIds: string[];
      };
    };

export const BUILDER_MESSAGE_TYPE = "builder:update-components";
export const PREVIEW_READY_TYPE = "preview:ready";
export const PREVIEW_COMPONENT_SELECTED_TYPE = "preview:component-selected";
export const PREVIEW_COMPONENTS_REORDERED_TYPE =
  "preview:components-reordered";
