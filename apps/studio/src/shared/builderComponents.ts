import type { ComponentType } from "react";

/**
 * 组件分类
 */
export type ComponentCategory = "basic" | "marketing" | "layout";

/**
 * 配置组件的 Props
 */
export interface ConfigPanelProps {
  value: Record<string, any>;          // 当前配置值
  onChange: (key: string, value: any) => void;  // 配置变化回调
}

/**
 * Builder 组件定义
 */
export interface BuilderComponent {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  icon: string;
  component: ComponentType<any>;       // 真实的 React 组件
  ConfigPanel: ComponentType<ConfigPanelProps>;  // 配置面板组件
  props: Record<string, any>;  // 默认配置值
}

/**
 * 画布上的组件实例
 */
export interface CanvasComponentInstance {
  instanceId: string;             // 实例唯一 ID
  componentId: string;            // 对应的 BuilderComponent.id
  props: Record<string, any>;    // 当前配置值
  order: number;                  // 排序
}

import { Button } from "@nixora/ui";
import { ButtonConfig } from "../pages/builder/components/settings/ButtonConfig";

export const builderComponents: BuilderComponent[] = [
  // ===== 基础组件 =====
  {
    id: "marketing-button",
    name: "营销按钮",
    description: "可配置样式、大小和图标的按钮组件",
    category: "basic",
    icon: "🔘",
    component: Button,
    ConfigPanel: ButtonConfig,
    props: {
      text: "立即购买",
      variant: "primary",
      size: "medium",
      fullWidth: false,
      icon: ""
    }
  },
  
  // {
  //   id: "marketing-input",
  //   name: "输入框",
  //   description: "带标签和提示的表单输入框",
  //   category: "basic",
  //   icon: "📝",
  //   component: MarketingInput,
  //   configs: [
  //     {
  //       type: "text",
  //       key: "label",
  //       label: "标签",
  //       defaultValue: "手机号码",
  //       placeholder: "输入标签文字"
  //     },
  //     {
  //       type: "text",
  //       key: "placeholder",
  //       label: "占位符",
  //       defaultValue: "请输入手机号",
  //       placeholder: "输入占位符文字"
  //     },
  //     {
  //       type: "select",
  //       key: "type",
  //       label: "输入类型",
  //       defaultValue: "text",
  //       options: [
  //         { label: "文本", value: "text" },
  //         { label: "邮箱", value: "email" },
  //         { label: "密码", value: "password" },
  //         { label: "数字", value: "number" },
  //         { label: "电话", value: "tel" }
  //       ]
  //     },
  //     {
  //       type: "text",
  //       key: "helperText",
  //       label: "提示文字",
  //       defaultValue: "",
  //       placeholder: "输入帮助提示"
  //     }
  //   ]
  // },
  // {
  //   id: "marketing-text",
  //   name: "文本",
  //   description: "可配置样式的标题或正文文本",
  //   category: "basic",
  //   icon: "📄",
  //   component: MarketingText,
  //   configs: [
  //     {
  //       type: "textarea",
  //       key: "text",
  //       label: "文本内容",
  //       defaultValue: "这是一段营销文案",
  //       placeholder: "输入文本内容"
  //     },
  //     {
  //       type: "select",
  //       key: "variant",
  //       label: "文字样式",
  //       defaultValue: "body",
  //       options: [
  //         { label: "一级标题", value: "h1" },
  //         { label: "二级标题", value: "h2" },
  //         { label: "三级标题", value: "h3" },
  //         { label: "正文", value: "body" },
  //         { label: "说明文字", value: "caption" }
  //       ]
  //     },
  //     {
  //       type: "select",
  //       key: "align",
  //       label: "对齐方式",
  //       defaultValue: "left",
  //       options: [
  //         { label: "左对齐", value: "left" },
  //         { label: "居中", value: "center" },
  //         { label: "右对齐", value: "right" }
  //       ]
  //     },
  //     {
  //       type: "color",
  //       key: "color",
  //       label: "文字颜色",
  //       defaultValue: ""
  //     }
  //   ]
  // },
  // {
  //   id: "marketing-image",
  //   name: "图片",
  //   description: "可配置尺寸和样式的图片组件",
  //   category: "basic",
  //   icon: "🖼️",
  //   component: MarketingImage,
  //   configs: [
  //     {
  //       type: "image",
  //       key: "src",
  //       label: "图片地址",
  //       defaultValue: "https://placehold.co/600x400/emerald/white?text=Product",
  //       placeholder: "输入图片 URL"
  //     },
  //     {
  //       type: "text",
  //       key: "alt",
  //       label: "图片描述",
  //       defaultValue: "商品图片",
  //       placeholder: "输入图片描述"
  //     },
  //     {
  //       type: "select",
  //       key: "fit",
  //       label: "填充方式",
  //       defaultValue: "cover",
  //       options: [
  //         { label: "覆盖", value: "cover" },
  //         { label: "包含", value: "contain" },
  //         { label: "填充", value: "fill" }
  //       ]
  //     },
  //     {
  //       type: "switch",
  //       key: "rounded",
  //       label: "圆角",
  //       defaultValue: true
  //     }
  //   ]
  // },
  // {
  //   id: "marketing-select",
  //   name: "选择器",
  //   description: "下拉选择框，支持自定义选项",
  //   category: "basic",
  //   icon: "📋",
  //   component: MarketingSelect,
  //   configs: [
  //     {
  //       type: "text",
  //       key: "label",
  //       label: "标签",
  //       defaultValue: "选择规格",
  //       placeholder: "输入标签文字"
  //     },
  //     {
  //       type: "text",
  //       key: "placeholder",
  //       label: "占位符",
  //       defaultValue: "请选择",
  //       placeholder: "输入占位符"
  //     },
  //     {
  //       type: "options",
  //       key: "options",
  //       label: "选项列表",
  //       defaultValue: [
  //         { label: "小号", value: "small" },
  //         { label: "中号", value: "medium" },
  //         { label: "大号", value: "large" }
  //       ],
  //       helper: "配置下拉选项的列表"
  //     }
  //   ]
  // },

  // // ===== 营销组件 =====
  // {
  //   id: "carousel",
  //   name: "轮播图",
  //   description: "自动播放的图片轮播展示组件",
  //   category: "marketing",
  //   icon: "🎠",
  //   component: Carousel,
  //   configs: [
  //     {
  //       type: "options",
  //       key: "slides",
  //       label: "轮播图片",
  //       defaultValue: [
  //         {
  //           image: "https://placehold.co/800x400/10b981/white?text=Sale+50%25+Off",
  //           title: "限时抢购",
  //           description: "全场5折起"
  //         },
  //         {
  //           image: "https://placehold.co/800x400/f59e0b/white?text=New+Arrival",
  //           title: "新品上市",
  //           description: "春季新款已到"
  //         },
  //         {
  //           image: "https://placehold.co/800x400/3b82f6/white?text=Free+Shipping",
  //           title: "满额包邮",
  //           description: "满199元包邮"
  //         }
  //       ],
  //       helper: "配置轮播图的图片和文字"
  //     },
  //     {
  //       type: "switch",
  //       key: "autoPlay",
  //       label: "自动播放",
  //       defaultValue: true
  //     },
  //     {
  //       type: "number",
  //       key: "interval",
  //       label: "切换间隔（毫秒）",
  //       defaultValue: 3000,
  //       min: 1000,
  //       max: 10000,
  //       step: 500
  //     },
  //     {
  //       type: "switch",
  //       key: "showIndicators",
  //       label: "显示指示器",
  //       defaultValue: true
  //     },
  //     {
  //       type: "switch",
  //       key: "showArrows",
  //       label: "显示箭头",
  //       defaultValue: true
  //     }
  //   ]
  // },
  // {
  //   id: "coupon-card",
  //   name: "优惠券",
  //   description: "优惠券卡片，支持多种券类型",
  //   category: "marketing",
  //   icon: "🎫",
  //   component: CouponCard,
  //   configs: [
  //     {
  //       type: "text",
  //       key: "title",
  //       label: "券标题",
  //       defaultValue: "新人专享优惠券",
  //       placeholder: "输入优惠券标题"
  //     },
  //     {
  //       type: "select",
  //       key: "type",
  //       label: "券类型",
  //       defaultValue: "discount",
  //       options: [
  //         { label: "折扣券", value: "discount" },
  //         { label: "满减券", value: "amount" },
  //         { label: "包邮券", value: "shipping" }
  //       ]
  //     },
  //     {
  //       type: "text",
  //       key: "value",
  //       label: "券面值",
  //       defaultValue: "20",
  //       placeholder: "如：9折 / 50元",
  //       helper: "折扣券输入折扣（如8.5），满减券输入金额"
  //     },
  //     {
  //       type: "textarea",
  //       key: "description",
  //       label: "描述",
  //       defaultValue: "全场通用，无门槛使用",
  //       placeholder: "输入优惠券描述"
  //     },
  //     {
  //       type: "text",
  //       key: "validUntil",
  //       label: "有效期",
  //       defaultValue: "2025-12-31",
  //       placeholder: "如：2025-12-31"
  //     },
  //     {
  //       type: "text",
  //       key: "minPurchase",
  //       label: "使用门槛",
  //       defaultValue: "99元",
  //       placeholder: "如：99元"
  //     },
  //     {
  //       type: "text",
  //       key: "buttonText",
  //       label: "按钮文字",
  //       defaultValue: "立即领取",
  //       placeholder: "输入按钮文字"
  //     }
  //   ]
  // }
];
