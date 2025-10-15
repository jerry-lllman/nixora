import type { DragEvent } from "react";
import { useState } from "react";

export function useDragAndDrop() {
  const [isDraggingOverPreview, setIsDraggingOverPreview] = useState(false);
  const [isDraggingComponent, setIsDraggingComponent] = useState(false);

  const handleDragStart = (
    event: DragEvent<HTMLButtonElement>,
    componentType: string
  ) => {
    event.dataTransfer.setData("application/builder-component", componentType);
    event.dataTransfer.effectAllowed = "copy";
    setIsDraggingComponent(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
    onDrop: (componentType: string) => void
  ) => {
    event.preventDefault();
    setIsDraggingOverPreview(false);
    setIsDraggingComponent(false);
    const componentType = event.dataTransfer.getData(
      "application/builder-component"
    );
    if (!componentType) {
      return;
    }
    onDrop(componentType);
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
