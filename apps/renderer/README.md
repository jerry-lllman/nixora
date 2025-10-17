# Nixora Renderer

画布渲染引擎 - 在 iframe 中运行，负责渲染和展示 Studio 构建的组件。

## 核心功能

- **组件渲染**: 根据 Studio 发送的 schema 动态渲染组件
- **拖拽排序**: 支持用户拖拽重新排列画布上的组件
- **双向通信**: 通过 postMessage API 与 Studio 通信
- **主题同步**: 支持 light/dark 主题切换
- **组件选择**: 点击组件通知 Studio 更新选中状态

## 技术栈

- **React 19** + **TypeScript**
- **Vite** (使用 rolldown-vite) - 快速构建
- **@dnd-kit** - 拖拽排序
- **@nixora/ui** - UI 组件库
- **Tailwind CSS** - 样式

## 开发

```bash
# 在项目根目录
pnpm dev --filter renderer

# 或在当前目录
pnpm dev
```

访问 http://localhost:3174

## 通信协议

### Renderer → Studio 消息

```typescript
// Renderer 就绪
{ type: "preview:ready" }

// 用户点击了组件
{
  type: "preview:component-selected",
  payload: {
    instanceId: string,
    index: number,
    componentType: string
  }
}

// 用户拖拽重排了组件
{
  type: "preview:components-reordered",
  payload: {
    instanceIds: string[]
  }
}
```

### Studio → Renderer 消息

```typescript
// 更新组件列表和选中状态
{
  type: "builder:message",
  payload: {
    schema: ComponentSchema[],
    selectedInstanceId: string | null
  }
}

// 同步主题
{
  type: "theme:sync",
  payload: {
    theme: "light" | "dark"
  }
}
```

## 架构说明

### 为什么独立应用？

1. **隔离性**: 避免 Studio 的样式和状态影响渲染结果
2. **性能**: 独立进程，不阻塞 Studio 的交互
3. **安全性**: iframe 沙盒保护
4. **可扩展**: 未来可以支持多个渲染器（移动端、平板等）

### 组件渲染流程

```
Studio 拖拽组件
  ↓
更新 canvasComponents 状态
  ↓
usePreviewMessaging 发送消息
  ↓
Renderer 接收消息
  ↓
更新 components 状态
  ↓
渲染组件: <Button {...props} />
```

## 添加新组件支持

1. 在 `@nixora/ui` 中创建组件
2. 在 Studio 的 `builderComponents` 注册
3. Renderer 自动支持（因为它导入整个 `@nixora/ui`）

## 注意事项

- Renderer 运行在 iframe 中，无法直接访问 Studio 的状态
- 所有通信必须通过 postMessage
- 确保消息类型常量在 `shared/messaging.ts` 中定义
- 支持热模块替换 (HMR)，修改后自动刷新
