import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { Button } from "@nixora/ui";
import type {
  BuilderToPreviewMessage,
  ComponentSchema,
  PreviewToBuilderMessage
} from "./shared/messaging";
import {
  BUILDER_MESSAGE_TYPE,
  PREVIEW_COMPONENT_SELECTED_TYPE,
  PREVIEW_COMPONENTS_REORDERED_TYPE,
  PREVIEW_READY_TYPE,
  THEME_SYNC_TYPE
} from "./shared/messaging";

interface SortableItemProps {
  component: ComponentSchema;
  index: number;
  isSelected: boolean;
  onComponentClick: (
    instanceId: string,
    index: number,
    componentType: string
  ) => void;
}

function SortableItem({
  component,
  index,
  isSelected,
  onComponentClick
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onComponentClick(component.id, index, component.type)}
      className={`bg-white dark:bg-slate-800 border-2 rounded-lg cursor-grab active:cursor-grabbing hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-500/30"
          : "border-gray-300 dark:border-gray-700"
      }`}
    >
      <Button {...component.props} />
    </div>
  );
}

function Item({ component }: { component: ComponentSchema }) {
  return (
    <div className="bg-white dark:bg-slate-800 border-1 border-blue-500 dark:border-blue-400 rounded-lg cursor-grabbing">
      <Button {...component.props} />
    </div>
  );
}

export default function RendererApp() {
  // 接收来自 builder 的组件数据
  const [components, setComponents] = useState<ComponentSchema[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // 发送消息到 builder
  const sendMessageToBuilder = (message: PreviewToBuilderMessage) => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, "*");
    }
  };

  // 监听来自 builder 的消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent<BuilderToPreviewMessage>) => {
      if (event.data?.type === BUILDER_MESSAGE_TYPE) {
        const { schema, selectedInstanceId } = event.data.payload;
        if (schema) {
          setComponents(schema);
        }
        setSelectedInstanceId(selectedInstanceId ?? null);
      } else if (event.data?.type === THEME_SYNC_TYPE) {
        const { theme } = event.data.payload;
        if (theme) {
          setTheme(theme);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // 发送 ready 信号
    sendMessageToBuilder({ type: PREVIEW_READY_TYPE });

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setComponents((components) => {
        const oldIndex = components.findIndex((c) => c.id === active.id);
        const newIndex = components.findIndex((c) => c.id === over.id);
        const newComponents = arrayMove(components, oldIndex, newIndex);

        // 通知 builder 组件顺序已改变
        const instanceIds = newComponents.map((c) => c.id);
        sendMessageToBuilder({
          type: PREVIEW_COMPONENTS_REORDERED_TYPE,
          payload: { instanceIds }
        });

        return newComponents;
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleComponentClick = (
    instanceId: string,
    index: number,
    componentType: string
  ) => {
    setSelectedInstanceId(instanceId);
    sendMessageToBuilder({
      type: PREVIEW_COMPONENT_SELECTED_TYPE,
      payload: { instanceId, index, componentType }
    });
  };

  // 应用主题到 document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.dataset.theme = theme;
  }, [theme]);

  // 获取当前拖拽的组件
  const activeComponent = activeId
    ? components.find((c) => c.id === activeId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-3xl mx-auto">
        {components.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                等待组件数据
              </h2>
              <p className="text-gray-500 dark:text-gray-500">
                从左侧拖拽组件到画布中开始构建
              </p>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={components.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {components.map((component, index) => (
                <SortableItem
                  key={component.id}
                  component={component}
                  index={index}
                  isSelected={component.id === selectedInstanceId}
                  onComponentClick={handleComponentClick}
                />
              ))}
            </SortableContext>

            <DragOverlay>
              {activeComponent ? <Item component={activeComponent} /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}
