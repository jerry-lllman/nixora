# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Nixora 是一个电商营销平台的 monorepo,提供拖拽式体验构建工具(Studio)、发布管道和管理工具。用户在 Studio 中创建营销页面,保存到数据库,并可以发布为独立部署的项目。

## 技术栈

- **包管理**: pnpm + Turborepo
- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **后端**: NestJS + TypeORM + PostgreSQL
- **拖拽**: @dnd-kit
- **状态管理**: React Query + Context API
- **认证**: JWT + Passport

## 核心架构

### Monorepo 结构

```
apps/
  ├── studio/          # 拖拽构建器和运营中心 (Vite + React)
  ├── renderer/        # 画布渲染引擎 (iframe 中运行)
  ├── nx-app/          # 已发布画布托管服务 (Next.js App Router)
  ├── api/             # NestJS 后端服务
packages/
  ├── ui/              # 共享 React 组件库 (@nixora/ui)
  └── utils/           # TypeScript 工具函数
releases/               # 发布的画布项目输出目录
```

### Renderer 应用（画布渲染引擎）

**核心职责**: 在 iframe 中渲染画布组件，与 Studio 通信

**通信机制** (`apps/renderer/src/shared/messaging.ts` 和 `apps/studio/src/shared/messaging.ts`):

- 使用 `postMessage` API 进行跨 iframe 通信
- **Studio → Renderer**: 发送组件 schema 和选中状态
- **Renderer → Studio**: 通知组件选择和重排序事件

**消息类型**:

```typescript
// Renderer 发送给 Studio
PREVIEW_READY_TYPE; // Renderer 已就绪
PREVIEW_COMPONENT_SELECTED_TYPE; // 用户点击了某个组件
PREVIEW_COMPONENTS_REORDERED_TYPE; // 用户拖拽重排了组件

// Studio 发送给 Renderer
BUILDER_MESSAGE_TYPE; // 更新组件列表和选中状态
THEME_SYNC_TYPE; // 同步主题 (light/dark)
```

**拖拽排序** (`apps/renderer/src/RendererApp.tsx`):

- 使用 `@dnd-kit` 实现画布内组件的拖拽排序
- 拖拽完成后通过 postMessage 通知 Studio 更新状态
- 支持键盘无障碍操作

**组件渲染**:

- 从 `@nixora/ui` 导入实际组件 (如 NixoraButton)
- 根据 schema 动态渲染: `<NixoraButton {...component.props} />`
- 支持组件选中高亮和悬停效果

**主题系统**:

- 接收 Studio 的主题同步消息
- 动态切换 `light`/`dark` class 到 `<html>` 元素

**开发服务器**:

- 独立运行在 `http://localhost:3174`
- Studio 通过 iframe 嵌入此地址
- 支持热模块替换 (HMR)

### Canvas 数据存储方案

**核心设计**: PostgreSQL JSONB 字段存储画布组件数据

- **Canvas 实体** (`apps/api/src/canvas/entities/canva.entity.ts`):
  - `components` 字段使用 `@Column({ type: "jsonb" })` 存储组件数组
  - 每个组件包含: `instanceId`, `componentType`, `props`, `order`
  - `isPublished`: 是否已发布
  - `publishedAt`: 发布时间戳
  - `publishUrl`: 发布后的访问 URL（格式：`{NX_APP_URL}/p/{canvasId}`）

### nx-app 数据访问方案

**核心设计**: nx-app 使用 Prisma 直连 PostgreSQL，不通过 API

- **架构优势**:
  - 性能提升 5 倍（直连 ~20ms vs 通过API ~120ms）
  - API 故障不影响已发布页面访问
  - 读写分离（CQRS 模式）
- **Prisma Schema** (`apps/nx-app/prisma/schema.prisma`):

  ```prisma
  model Canvas {
    id          String   @id @default(uuid())
    components  Json     // JSONB 类型
    isPublished Boolean
    publishedAt DateTime?
    // ...
    @@map("canvas")
  }
  ```

- **数据库连接** (`apps/nx-app/lib/db.ts`):
  - 使用 Prisma Client 单例模式
  - 生产环境推荐使用只读数据库用户
- **查询示例**:

  ```typescript
  const canvas = await prisma.canvas.findUnique({
    where: { id, isPublished: true },
    select: { id: true, title: true, components: true }
  });
  ```

- **DTO 验证要点**:
  - 必须使用 `@Allow()` 装饰器允许 `props` 的动态属性
  - 使用 `@ValidateNested()` 和 `@Type()` 验证嵌套对象
  - 注意 ValidationPipe 的 `whitelist: true` 会过滤未装饰的字段

- **性能考虑**:
  - 可使用 GIN 索引加速 JSONB 查询
  - 单个画布建议 < 1000 组件
  - 参考 `CANVAS_STORAGE_SOLUTION.md` 查看详细设计

### Studio 前端架构

**核心流程**: 组件库 → 拖拽 → 画布 → 配置面板

1. **状态管理** (`apps/studio/src/pages/builder/hooks/useCanvasState.ts`):
   - `canvasComponents`: 画布上的所有组件实例
   - `selectedInstanceId`: 当前选中的组件实例ID
   - 提供 CRUD 操作: `addComponent`, `removeComponent`, `updateComponentConfig`, `reorderComponents`

2. **拖拽系统** (`apps/studio/src/pages/builder/hooks/useDragAndDrop.ts`):
   - 使用原生 HTML5 Drag & Drop API
   - 组件库中的组件可拖拽到画布
   - 画布中的组件可通过 @dnd-kit 重排序

3. **Renderer 集成** (`apps/studio/src/pages/builder/hooks/usePreviewMessaging.ts`):
   - Builder 通过 iframe 嵌入 Renderer 应用 (`http://localhost:3174`)
   - 监听 Renderer 的 ready 信号后发送组件数据
   - 接收 Renderer 的组件选择和重排序事件
   - 双向同步选中状态和主题

4. **组件注册系统**:
   - `@nixora/ui` 包导出 UI 组件 (如 NixoraButton)
   - Builder 在 `apps/studio/src/pages/builder/components/settings/` 中定义配置组件
   - Renderer 从 `@nixora/ui` 导入并渲染实际组件
   - Studio 通过 `builderComponents` 数组注册可用组件

5. **API 集成**:
   - Canvas API (`apps/studio/src/lib/api/canvas.ts`): CRUD + publish
   - Auth API (`apps/studio/src/lib/api/auth.ts`): 登录/注册/用户信息
   - React Query 管理数据缓存和状态

### NestJS 后端架构

**模块结构**:

- `UsersModule`: 用户管理 (bcrypt 加密密码)
- `AuthModule`: JWT 认证 (passport-local + passport-jwt)
- `CanvasModule`: 画布 CRUD + publish 功能

**配置系统** (`apps/api/src/config/`):

- `app.config.ts`: 应用端口、全局前缀
- `auth.config.ts`: JWT secret、过期时间、bcrypt salt rounds
- `database.config.ts`: PostgreSQL 连接 URL、同步选项

**认证守卫**:

- 大多数端点使用 `@UseGuards(JwtAuthGuard)`
- 登录/注册端点公开访问
- 用户 ID 从 JWT token 提取: `@Request() req` → `req.user.userId`

## 常用命令

### 开发

```bash
# 安装依赖
pnpm install

# 启动所有服务 (studio + api + renderer 并行)
pnpm dev

# 只启动某个应用
pnpm dev --filter studio   # Studio on http://localhost:5173
pnpm dev --filter api       # API on http://localhost:3333
pnpm dev --filter renderer  # Renderer on http://localhost:3174

# 启动 API (在 apps/api 目录)
pnpm dev  # 等同于 nest start --watch
```

### 构建

```bash
# 构建所有项目
pnpm build

# 构建单个应用
pnpm build --filter studio
pnpm build --filter api
```

### 代码质量

```bash
# Lint 所有项目
pnpm lint

# Lint 单个应用
pnpm lint --filter studio

# 格式化代码
pnpm format
```

### 清理

```bash
# 清理所有 node_modules 和构建产物
pnpm clean

# 清理单个应用
pnpm clean --filter studio
```

## 环境变量配置

### API 环境变量 (`apps/api/.env`)

```env
NODE_ENV=development
PORT=3333
GLOBAL_PREFIX=api

DATABASE_URL=postgres://postgres:postgres@localhost:5432/nixora
DB_SYNCHRONIZE=true  # 生产环境必须设为 false

JWT_SECRET=change-me
JWT_EXPIRES_IN=3600s
BCRYPT_SALT_ROUNDS=12
```

**重要**: 生产环境中:

- 修改 `JWT_SECRET` 为强密码
- 设置 `DB_SYNCHRONIZE=false` 并使用数据库迁移
- 配置真实的 PostgreSQL 连接

### nx-app 环境变量 (`apps/nx-app/.env.local`)

```env
# PostgreSQL 连接（推荐使用只读用户）
DATABASE_URL=postgresql://nx_app_readonly:password@localhost:5432/nixora

# 开发环境可以使用主用户
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nixora
```

**生产环境**: 配置只读数据库用户，提高安全性：

```sql
CREATE USER nx_app_readonly WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE nixora TO nx_app_readonly;
GRANT USAGE ON SCHEMA public TO nx_app_readonly;
GRANT SELECT ON canvas TO nx_app_readonly;
```

## 开发工作流

### 添加新的 UI 组件

1. 在 `packages/ui/src/components/` 创建组件
2. 在 `packages/ui/src/index.ts` 导出
3. 在 `apps/studio/src/pages/builder/components/settings/` 创建配置组件
4. 在 `componentRegistry` 注册组件类型

### 修改 API 端点

1. 在对应模块的 controller 中添加路由 (如 `canvas.controller.ts`)
2. 在对应的 service 中实现业务逻辑 (如 `canvas.service.ts`)
3. 如需数据验证,创建 DTO (使用 class-validator)
4. 更新前端 API 客户端 (如 `apps/studio/src/lib/api/canvas.ts`)

### 数据库更改

**当前**: 使用 TypeORM 的 `synchronize: true` (仅开发环境)

- 修改实体 (`*.entity.ts`) 后自动同步数据库结构
- 生产环境应使用迁移: `nest build && npx typeorm migration:generate`

## 关键文件位置

- **Builder 主页面**: `apps/studio/src/pages/builder/index.tsx`
- **Canvas 状态管理**: `apps/studio/src/pages/builder/hooks/useCanvasState.ts`
- **Renderer 通信**: `apps/studio/src/pages/builder/hooks/usePreviewMessaging.ts`
- **Renderer 渲染器**: `apps/renderer/src/RendererApp.tsx`
- **通信协议**: `apps/studio/src/shared/messaging.ts` (Studio 和 Renderer 共享)
- **Canvas API Controller**: `apps/api/src/canvas/canvas.controller.ts`
- **Canvas 实体**: `apps/api/src/canvas/entities/canva.entity.ts`
- **认证守卫**: `apps/api/src/auth/guards/jwt-auth.guard.ts`
- **Auth Context**: `apps/studio/src/contexts/AuthContext.tsx`
- **主题系统**: `apps/studio/src/theme.tsx`

## 路由结构

### Studio 前端路由

- `/` - 首页
- `/login` - 登录页
- `/register` - 注册页
- `/builder?id={canvasId}` - 画布编辑器 (需认证)

### API 后端路由

所有路由都带 `/api` 前缀:

- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/profile` - 获取当前用户 (需认证)
- `GET /api/users/me` - 获取当前用户详情 (需认证)
- `POST /api/canvas` - 创建画布 (需认证)
- `GET /api/canvas` - 获取用户的所有画布 (需认证)
- `GET /api/canvas/:id` - 获取单个画布 (需认证)
- `PATCH /api/canvas/:id` - 更新画布 (需认证)
- `DELETE /api/canvas/:id` - 删除画布 (需认证)
- `POST /api/canvas/:id/publish` - 发布画布 (需认证)
- `POST /api/canvas/:id/unpublish` - 取消发布 (需认证)

**注意**: nx-app 不通过 API 访问数据，而是使用 Prisma 直连数据库

## 注意事项

### TypeScript 配置

- 根目录 `tsconfig.base.json` 定义公共配置
- 各子项目继承基础配置并覆盖特定选项
- 使用 workspace 引用: `@nixora/ui`, `@nixora/utils`

### 代码风格

- 使用 Prettier 格式化 (配置在根目录 `.prettierrc`)
- ESLint 检查 TypeScript 和 React (各应用有独立配置)
- 导入排序使用 `@ianvs/prettier-plugin-sort-imports`

### Git 工作流

- 主分支: `main`
- 提交前运行 `pnpm lint` 确保代码质量
- 小步提交,确保每次提交都能编译通过

### 性能优化

- Builder 页面使用 React.memo 优化渲染
- Canvas 组件使用虚拟化处理大量组件 (待实现)
- API 响应使用 GZIP 压缩 (NestJS 默认)

### 安全考虑

- 所有密码使用 bcrypt 加密 (salt rounds = 12)
- JWT token 存储在 localStorage (考虑迁移到 httpOnly cookie)
- CORS 配置在 `apps/api/src/main.ts`
- 生产环境禁用 TypeORM 同步,使用迁移

## Troubleshooting

### 数据库连接失败

检查:

1. PostgreSQL 是否运行: `psql -U postgres`
2. 数据库是否存在: `CREATE DATABASE nixora;`
3. `.env` 中的 `DATABASE_URL` 是否正确

### 组件拖拽不生效

检查:

1. 组件是否在 `componentRegistry` 中注册
2. 浏览器控制台是否有错误
3. `@dnd-kit` 版本是否兼容

### JWT 认证失败

检查:

1. `.env` 中的 `JWT_SECRET` 是否设置
2. Token 是否过期 (默认 3600 秒)
3. 前端是否正确设置 Authorization header
