import type { DragEvent } from "react";
import { useState } from "react";

export function useDragAndDrop() {
  const [isDraggingOverPreview, setIsDraggingOverPreview] = useState(false);
  const [isDraggingComponent, setIsDraggingComponent] = useState(false);

  const handleDragStart = (
    event: DragEvent<HTMLButtonElement>,
    componentId: string
  ) => {
    event.dataTransfer.setData("application/builder-component", componentId);
    event.dataTransfer.effectAllowed = "copy";
    setIsDraggingComponent(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
    onDrop: (componentId: string) => void
  ) => {
    event.preventDefault();
    setIsDraggingOverPreview(false);
    setIsDraggingComponent(false);
    const componentId = event.dataTransfer.getData(
      "application/builder-component"
    );
    if (!componentId) {
      return;
    }
    onDrop(componentId);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOverPreview(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return;
    }
    setIsDraggingOverPreview(false);
  };

  const handleDragEnd = () => {
    setIsDraggingOverPreview(false);
    setIsDraggingComponent(false);
  };

  return {
    isDraggingOverPreview,
    isDraggingComponent,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    handleDragEnd
  };
}
