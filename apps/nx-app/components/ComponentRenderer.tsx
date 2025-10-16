"use client";

import React from "react";
import { NixoraButton } from "@nixora/ui";

// 组件映射表
const COMPONENT_MAP = {
  NixoraButton: NixoraButton
  // 未来可以添加更多组件
} as const;

type ComponentType = keyof typeof COMPONENT_MAP;

interface ComponentData {
  order: number;
  props: Record<string, any>;
  instanceId: string;
  componentType: ComponentType;
}

interface ComponentRendererProps {
  components: ComponentData[];
}

export function ComponentRenderer({ components }: ComponentRendererProps) {
  // 按 order 排序
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {sortedComponents.map((component) => {
        const Component = COMPONENT_MAP[component.componentType];

        if (!Component) {
          console.warn(`Unknown component type: ${component.componentType}`);
          return (
            <div
              key={component.instanceId}
              className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <p className="text-yellow-800">
                Unknown component: {component.componentType}
              </p>
            </div>
          );
        }

        return (
          <div key={component.instanceId} className="component-wrapper">
            <Component {...component.props} />
          </div>
        );
      })}
    </div>
  );
}
