import { useCallback, useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { previewTemplates } from "./templates";
import type {
  BuilderToPreviewMessage,
  ComponentSchema,
  PreviewToBuilderMessage
} from "./types/messaging";
import {
  BUILDER_MESSAGE_TYPE,
  PREVIEW_COMPONENT_SELECTED_TYPE,
  PREVIEW_COMPONENTS_REORDERED_TYPE,
  PREVIEW_READY_TYPE
} from "./types/messaging";

export function PreviewApp() {
  const [schema, setSchema] = useState<ComponentSchema[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null
  );

  const sensors = useSensors(
    useSensor(
      PointerSensor,
      // Slight movement threshold avoids accidental drags on click
      { activationConstraint: { distance: 4 } }
    ),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent<BuilderToPreviewMessage>) => {
      // 不校验域名，根据事件类型来处理
      if (event.data?.type === BUILDER_MESSAGE_TYPE) {
        const {
          schema: incomingSchema = [],
          selectedInstanceId: incomingSelectedId = null
        } = event.data.payload;
        setSchema(incomingSchema);
        setSelectedInstanceId(
          typeof incomingSelectedId === "string" &&
            incomingSelectedId.length > 0
            ? incomingSelectedId
            : null
        );
      }
    };

    window.addEventListener("message", handleMessage);

    const readyMessage: PreviewToBuilderMessage = { type: PREVIEW_READY_TYPE };
    // 发送 ready 消息到 parent（允许任何域名）
    window.parent?.postMessage(readyMessage, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const sendComponentsReordered = useCallback((nextSchema: ComponentSchema[]) => {
    const reorderMessage: PreviewToBuilderMessage = {
      type: PREVIEW_COMPONENTS_REORDERED_TYPE,
      payload: {
        instanceIds: nextSchema.map((component) => component.id)
      }
    };
    // 发送到 parent（允许任何域名）
    window.parent?.postMessage(reorderMessage, "*");
  }, []);

  const sendComponentSelected = useCallback(
    (component: ComponentSchema, index: number) => {
      setSelectedInstanceId(component.id);
      const message: PreviewToBuilderMessage = {
        type: PREVIEW_COMPONENT_SELECTED_TYPE,
        payload: {
          instanceId: component.id,
          componentType: component.type,
          index
        }
      };

      // 发送到 parent（允许任何域名）
      window.parent?.postMessage(message, "*");
    },
    []
  );

  const handleKeyDown = useCallback(
    (
      event: KeyboardEvent<HTMLDivElement>,
      component: ComponentSchema,
      index: number
    ) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        sendComponentSelected(component, index);
      }
    },
    [sendComponentSelected]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const activeId = String(event.active.id);
      const index = schema.findIndex((component) => component.id === activeId);
      if (index === -1) {
        return;
      }

      sendComponentSelected(schema[index], index);
    },
    [schema, sendComponentSelected]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) {
        return;
      }

      const activeId = String(active.id);
      const overId = String(over.id);
      if (activeId === overId) {
        return;
      }

      setSchema((previous) => {
        const oldIndex = previous.findIndex(
          (component) => component.id === activeId
        );
        const newIndex = previous.findIndex(
          (component) => component.id === overId
        );
        if (
          oldIndex === -1 ||
          newIndex === -1 ||
          oldIndex === newIndex
        ) {
          return previous;
        }

        const nextSchema = arrayMove(previous, oldIndex, newIndex);
        sendComponentsReordered(nextSchema);
        return nextSchema;
      });
    },
    [sendComponentsReordered]
  );

  if (schema.length === 0) {
    return (
      <div className="preview-shell">
        <div className="empty-state">
          拖拽组件到这里
          <span>Drag components from the left panel</span>
        </div>
      </div>
    );
  }

  const sortableIds = schema.map((component) => component.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortableIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="preview-shell">
          {schema.map((component, index) => (
            <SortableComponentInstance
              key={component.id}
              component={component}
              index={index}
              isSelected={component.id === selectedInstanceId}
              onSelect={sendComponentSelected}
              onKeyDown={handleKeyDown}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

type SortableComponentInstanceProps = {
  component: ComponentSchema;
  index: number;
  isSelected: boolean;
  onSelect: (component: ComponentSchema, index: number) => void;
  onKeyDown: (
    event: KeyboardEvent<HTMLDivElement>,
    component: ComponentSchema,
    index: number
  ) => void;
};

function SortableComponentInstance({
  component,
  index,
  isSelected,
  onSelect,
  onKeyDown
}: SortableComponentInstanceProps) {
  const TemplateComponent = previewTemplates[component.type] ?? null;

  const { attributes, isDragging, listeners, setNodeRef, transform, transition } =
    useSortable({ id: component.id });

  if (!TemplateComponent) {
    return null;
  }

  const instanceClassName = [
    "component-instance",
    isSelected ? "component-instance--selected" : "",
    isDragging ? "component-instance--dragging" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      className={instanceClassName}
      style={style}
      onClick={() => onSelect(component, index)}
      onKeyDown={(event) => onKeyDown(event, component, index)}
      {...attributes}
      {...listeners}
    >
      <TemplateComponent schema={component} />
    </div>
  );
}
