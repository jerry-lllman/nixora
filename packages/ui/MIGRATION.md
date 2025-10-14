# 迁移指南

从旧版本迁移到新的基于 shadcn/ui 的组件库。

## 主要变更

### 1. Button 组件

**旧版本有两个按钮组件：**
- `Button` (button.tsx)
- `MarketingButton` (marketing-button.tsx)

**新版本统一为：**
```tsx
import { Button } from "@nixora/ui";

// 旧：<Button variant="primary">
// 新：<Button variant="default"> 或 <Button>

// 旧：<Button variant="ghost">
// 新：<Button variant="ghost"> (保持不变)

// 旧：<Button variant="outline">
// 新：<Button variant="outline"> (保持不变)

// 新增变体：
<Button variant="secondary">次要按钮</Button>
<Button variant="destructive">危险按钮</Button>
<Button variant="link">链接按钮</Button>

// 尺寸选项：
<Button size="sm">小按钮</Button>
<Button size="default">默认</Button>
<Button size="lg">大按钮</Button>
<Button size="icon">图标按钮</Button>
```

### 2. Input 组件

**旧：MarketingInput**
```tsx
<MarketingInput
  label="邮箱"
  placeholder="请输入邮箱"
  type="email"
  helperText="我们不会分享您的邮箱"
  error={false}
  errorMessage="邮箱格式不正确"
/>
```

**新：使用 Input + 自定义布局**
```tsx
import { Input } from "@nixora/ui";

<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium">邮箱</label>
  <Input type="email" placeholder="请输入邮箱" />
  <p className="text-xs text-muted-foreground">我们不会分享您的邮箱</p>
</div>
```

### 3. 文本组件

**旧：MarketingText**
```tsx
<MarketingText text="标题" variant="h1" align="center" />
```

**新：使用原生 HTML + Tailwind**
```tsx
<h1 className="text-4xl md:text-5xl font-bold text-center">标题</h1>
```

### 4. 图片组件

**旧：MarketingImage**
```tsx
<MarketingImage
  src="/image.jpg"
  alt="描述"
  fit="cover"
  rounded
/>
```

**新：使用原生 img + Tailwind**
```tsx
<div className="overflow-hidden rounded-lg">
  <img
    src="/image.jpg"
    alt="描述"
    className="w-full h-full object-cover"
  />
</div>
```

### 5. 轮播组件

**旧：Carousel** (已移除)

**建议：**
使用专业的轮播库，如：
- [Embla Carousel](https://www.embla-carousel.com/) - 轻量级，可定制
- [Swiper](https://swiperjs.com/) - 功能丰富
- shadcn/ui 的 Carousel 组件（基于 Embla）

### 6. 营销组件（保持兼容）

以下组件 API 基本保持不变，但内部使用了 shadcn/ui 的基础组件：

#### Hero
```tsx
<Hero
  eyebrow="新品上线"
  title="打造完美营销页面"
  description="使用 Nixora 快速构建"
  ctaLabel="立即开始"
  onCtaClick={() => {}}
/>
```

#### FeatureGrid
```tsx
<FeatureGrid
  sectionTitle="核心功能"
  description="为营销而生"
  columns={3}
  features={[...]}
/>
```

#### CouponCard
```tsx
<CouponCard
  title="新人专享"
  type="discount"
  value="8折"
  description="首次购买享8折优惠"
  onClaim={() => {}}
/>
```

## 样式定制

### 主题变量

新版本使用 CSS 变量系统，可以在项目中覆盖：

```css
:root {
  --primary: 142.1 76.2% 36.3%; /* emerald-600 */
  --primary-foreground: 355.7 100% 97.3%;
  /* ... 更多变量 */
}
```

### Tailwind 配置

确保你的 `tailwind.config.ts` 包含 UI 包的路径：

```ts
content: [
  "./src/**/*.{ts,tsx}",
  "../../packages/ui/src/**/*.{ts,tsx}", // 重要！
]
```

## 新增功能

### 1. Card 组件

新增的卡片组件，用于构建结构化内容：

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@nixora/ui";

<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardDescription>描述</CardDescription>
  </CardHeader>
  <CardContent>
    内容区域
  </CardContent>
  <CardFooter>
    底部操作区
  </CardFooter>
</Card>
```

### 2. cn 工具函数

用于合并 className：

```tsx
import { cn } from "@nixora/ui";

<div className={cn("base-class", isActive && "active-class", className)}>
  内容
</div>
```

## 迁移步骤

### 步骤 1: 更新依赖
```bash
cd packages/ui
pnpm install
```

### 步骤 2: 查找并替换

使用以下命令查找需要迁移的组件：
```bash
# 查找 MarketingButton
grep -r "MarketingButton" apps/

# 查找 MarketingInput
grep -r "MarketingInput" apps/

# 查找 Carousel
grep -r "Carousel" apps/
```

### 步骤 3: 逐个迁移

建议按以下顺序迁移：
1. Button 组件（最常用）
2. Input 组件
3. 文本和图片组件（简单替换）
4. Carousel（需要引入新库）

### 步骤 4: 测试

```bash
cd apps/studio
pnpm run dev
```

确保所有页面正常显示和交互。

## 常见问题

### Q: 为什么要移除 Carousel？
A: 轮播是复杂组件，维护成本高。使用成熟的库可以获得更好的性能、可访问性和功能。

### Q: 我的自定义样式会受影响吗？
A: 不会。所有组件都支持 `className` prop，可以覆盖默认样式。

### Q: Button 的 variant="primary" 去哪了？
A: 使用 `variant="default"` 或不指定 variant（默认就是 default）。

### Q: 如何自定义主题色？
A: 修改 CSS 变量或 Tailwind 配置中的颜色值。

## 获取帮助

如有问题，请查看：
- [README.md](./README.md) - 组件使用文档
- [shadcn/ui 文档](https://ui.shadcn.com) - 基础组件文档
