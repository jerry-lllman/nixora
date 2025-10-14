# @nixora/ui

Nixora 营销页面组件库 - 基于 shadcn/ui 构建

## 架构

本组件库采用分层架构：

```
src/
├── components/
│   ├── ui/              # 基础 UI 组件（shadcn/ui）
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   └── marketing/       # 营销组件（业务特定）
│       ├── hero.tsx
│       ├── cta.tsx
│       ├── page-header.tsx
│       ├── feature-grid.tsx
│       ├── testimonials.tsx
│       └── coupon-card.tsx
├── lib/
│   └── utils.ts         # 工具函数 (cn)
└── styles.css           # Tailwind CSS 变量
```

## 组件分层

### 基础层 (shadcn/ui)
- **Button** - 按钮组件，支持多种变体（default, destructive, outline, secondary, ghost, link）
- **Input** - 输入框组件
- **Card** - 卡片容器组件及其子组件（CardHeader, CardTitle, CardDescription, CardContent, CardFooter）

### 业务层 (Marketing)
- **Hero** - 首屏大标题区域
- **CTA** - 行动号召区域
- **PageHeader** - 页面头部
- **FeatureGrid** - 功能网格展示
- **Testimonials** - 客户评价展示
- **CouponCard** - 优惠券卡片（电商特定）

## 使用示例

### 基础组件

```tsx
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "@nixora/ui";

// Button 示例
<Button variant="default" size="lg">
  点击我
</Button>

// Card 示例
<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardContent>
    内容区域
  </CardContent>
</Card>

// Input 示例
<Input type="email" placeholder="请输入邮箱" />
```

### 营销组件

```tsx
import { Hero, FeatureGrid, Testimonials, CTA } from "@nixora/ui";

// Hero 示例
<Hero
  eyebrow="新品上线"
  title="打造完美营销页面"
  description="使用 Nixora 快速构建高转化率的营销落地页"
  ctaLabel="立即开始"
  onCtaClick={() => console.log("CTA clicked")}
/>

// FeatureGrid 示例
<FeatureGrid
  sectionTitle="核心功能"
  description="为营销而生的组件库"
  columns={3}
  features={[
    {
      icon: "🚀",
      title: "快速上手",
      description: "简单易用的 API 设计"
    },
    {
      icon: "🎨",
      title: "美观现代",
      description: "基于 Tailwind CSS 设计"
    },
    {
      icon: "⚡",
      title: "性能优越",
      description: "极致的加载速度"
    }
  ]}
/>
```

## 技术栈

- **React** - UI 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式系统
- **shadcn/ui** - 基础组件
- **class-variance-authority** - 组件变体管理
- **Radix UI** - 无样式 UI 原语

## 设计原则

1. **组合优于继承** - 通过组合基础组件构建复杂组件
2. **可定制性** - 所有组件支持 className 覆盖
3. **一致性** - 统一的设计语言和 API 风格
4. **可访问性** - 基于 Radix UI，内置无障碍支持

## 主题定制

本组件库使用 CSS 变量进行主题定制。可以通过修改 `src/styles.css` 中的变量来调整主题：

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... 更多变量 */
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm run build

# Lint
pnpm run lint
```

## 迁移说明

从旧版本迁移时的主要变更：

1. **Button** 组件：
   - 旧：`<Button variant="primary">`
   - 新：`<Button variant="default">` 或自定义样式

2. **导入路径统一**：
   - 所有组件从 `@nixora/ui` 导入
   - 无需区分 `marketing-*` 前缀

3. **移除的组件**：
   - `MarketingButton` - 使用 `Button` 替代
   - `MarketingInput` - 使用 `Input` 替代
   - `MarketingText` - 使用原生 HTML 标签 + Tailwind
   - `MarketingImage` - 使用原生 `<img>` + Tailwind
   - `Carousel` - 建议使用专业的轮播库如 Embla Carousel

## License

Private
