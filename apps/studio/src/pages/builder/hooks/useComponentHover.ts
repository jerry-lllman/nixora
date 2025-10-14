import { useEffect, useRef, useState } from "react";

export function useComponentHover() {
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(
    null
  );
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (componentId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredComponentId(componentId);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredComponentId(null);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    hoveredComponentId,
    handleMouseEnter,
    handleMouseLeave
  };
}
