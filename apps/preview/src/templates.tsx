import type { ComponentProps, FC } from "react";
import { Button } from "@nixora/ui";
import type { ComponentSchema } from "./types/messaging";

interface PreviewTemplateProps {
  schema: ComponentSchema;
}

type PreviewTemplate = FC<PreviewTemplateProps>;

// 映射 Builder 配置到 shadcn/ui Button props
type ButtonProps = ComponentProps<typeof Button>;

const variantMap: Record<string, ButtonProps["variant"]> = {
  primary: "default",
  secondary: "secondary",
  danger: "destructive",
  success: "default" // shadcn 没有 success，用 default
};

const sizeMap: Record<string, ButtonProps["size"]> = {
  small: "sm",
  medium: "default",
  large: "lg"
};

export const previewTemplates: Record<string, PreviewTemplate> = {
  // 新的营销组件
  "marketing-button": ({ schema }) => {
    const {
      text,
      variant,
      size,
      icon,
      fullWidth,
      ...rest
    } = schema.props ?? {};
    return (
      <Button
        variant={variantMap[variant] || "default"}
        size={sizeMap[size] || "default"}
        className={fullWidth ? "w-full" : undefined}
        {...rest}
      >
        {icon && <span>{icon}</span>}
        {text || "按钮"}
      </Button>
    );
  }
};
