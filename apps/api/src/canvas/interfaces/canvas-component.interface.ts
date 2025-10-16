export interface CanvasComponent {
  instanceId: string;
  componentType: string;
  props: Record<string, unknown>;
  order?: number;
}

