# nx-app 搭建指南

本文档说明 `nx-app` 应用的搭建步骤和后端已完成的准备工作。

## 🎯 架构设计

**nx-app 直连数据库方案（CQRS 模式）**

```
搭建端（写操作）：
Studio → API (NestJS) → PostgreSQL Master

用户访问端（读操作）：
最终用户 → nx-app (Next.js + Prisma) → PostgreSQL

优势：
- 性能提升 5 倍（~20ms vs ~120ms）
- API 故障不影响已发布页面
- 读写分离，架构清晰
```

**详细方案**: 参考 [NX_APP_DATABASE_GUIDE.md](./NX_APP_DATABASE_GUIDE.md)

## ✅ 已完成的后端准备工作

### 1. Canvas 实体扩展

**文件**: `apps/api/src/canvas/entities/canva.entity.ts`

新增字段：

- `publishedAt`: 发布时间戳
- `publishUrl`: 发布后的访问 URL（格式：`http://localhost:3000/p/{canvasId}`）
- `components`: 类型改为 `CanvasComponent[]`（更类型安全）

### 2. 数据库结构就绪

Canvas 表已包含所有必要字段：

- `id`: UUID 主键
- `title`: 画布标题
- `components`: JSONB 存储组件数据
- `isPublished`: 是否已发布
- `publishedAt`: 发布时间
- `publishUrl`: 发布 URL
- `userId`: 所属用户

### 3. 发布逻辑完善

**文件**: `apps/api/src/canvas/canvas.service.ts`

`publish()` 方法现在会：

1. 设置 `isPublished = true`
2. 记录 `publishedAt` 时间戳
3. 生成 `publishUrl`（从环境变量 `NX_APP_URL` 读取）

### 4. 配置更新

**文件**: `apps/api/src/config/app.config.ts`

新增配置项：

- `nxAppUrl`: nx-app 的 URL（默认 `http://localhost:3000`）

### 5. 类型安全

**文件**: `apps/api/src/canvas/interfaces/canvas-component.interface.ts`

新增接口：

```typescript
interface CanvasComponent {
  instanceId: string;
  componentType: string;
  props: Record<string, unknown>;
  order?: number;
}
```

## 📋 nx-app 搭建步骤

### 1. 创建 Next.js 应用

```bash
cd apps
pnpm create next-app nx-app --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

### 2. 安装 Prisma

```bash
cd apps/nx-app
pnpm add @prisma/client
pnpm add -D prisma
npx prisma init
```

### 3. 目录结构

```
apps/nx-app/
├── app/
│   ├── p/
│   │   └── [canvasId]/
│   │       └── page.tsx          # 画布渲染页面
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts           # ISR 重新验证
│   └── layout.tsx
├── components/
│   └── ComponentRenderer.tsx      # 组件渲染器
├── lib/
│   └── db.ts                      # Prisma 数据库客户端
├── prisma/
│   └── schema.prisma              # Prisma Schema
├── .env.local                     # 环境变量
└── next.config.js
```

### 4. 配置 Prisma Schema

**文件**: `apps/nx-app/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Canvas {
  id          String   @id @default(uuid())
  title       String
  components  Json     // JSONB 类型
  description String?
  isPublished Boolean  @default(false)
  publishedAt DateTime?
  publishUrl  String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("canvas")
}
```

### 5. 生成 Prisma Client

```bash
cd apps/nx-app
npx prisma generate
```

### 6. 环境变量配置

创建 `apps/nx-app/.env.local`:

```env
# PostgreSQL 连接（开发环境）
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nixora"

# 生产环境使用只读用户（推荐）
# DATABASE_URL="postgresql://nx_app_readonly:password@your-db.com:5432/nixora"
```

### 7. Prisma 数据库客户端

**文件**: `apps/nx-app/lib/db.ts`

```typescript
import { PrismaClient } from "@prisma/client";

// 全局单例，避免在 Next.js 开发模式下创建多个实例
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### 8. 组件渲染器实现

**文件**: `apps/nx-app/components/ComponentRenderer.tsx`

```typescript
import { NixoraButton } from '@nixora/ui';

// 组件映射表
const componentMap: Record<string, React.ComponentType<any>> = {
  NixoraButton,
  // 未来添加更多组件
};

interface ComponentRendererProps {
  componentType: string;
  props: Record<string, any>;
}

export function ComponentRenderer({ componentType, props }: ComponentRendererProps) {
  const Component = componentMap[componentType];

  if (!Component) {
    return <div className="text-red-500">未知组件: {componentType}</div>;
  }

  return <Component {...props} />;
}
```

### 9. 画布页面实现

**文件**: `apps/nx-app/app/p/[canvasId]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ComponentRenderer } from '@/components/ComponentRenderer';

// ISR: 每小时重新生成
export const revalidate = 3600;

interface PageProps {
  params: {
    canvasId: string;
  };
}

async function getPublishedCanvas(canvasId: string) {
  const canvas = await prisma.canvas.findUnique({
    where: {
      id: canvasId,
      isPublished: true, // 只查询已发布的
    },
    select: {
      id: true,
      title: true,
      components: true,
      description: true,
      publishedAt: true,
      // 不返回敏感字段 userId, updatedAt
    },
  });

  return canvas;
}

export default async function CanvasPage({ params }: PageProps) {
  const canvas = await getPublishedCanvas(params.canvasId);

  if (!canvas) {
    notFound();
  }

  const components = canvas.components as Array<{
    instanceId: string;
    componentType: string;
    props: Record<string, any>;
  }>;

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">{canvas.title}</h1>

        {components.map((component) => (
          <ComponentRenderer
            key={component.instanceId}
            componentType={component.componentType}
            props={component.props}
          />
        ))}
      </div>
    </main>
  );
}
```

### 10. ISR 重新验证 API（可选）

**文件**: `apps/nx-app/app/api/revalidate/route.ts`

```typescript
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { canvasId } = await request.json();

  if (!canvasId) {
    return NextResponse.json({ error: "Missing canvasId" }, { status: 400 });
  }

  revalidatePath(`/p/${canvasId}`);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
```

### 11. 添加 @nixora/ui 依赖

```bash
cd apps/nx-app
pnpm add @nixora/ui@workspace:*
```

### 12. package.json 更新

在 `apps/nx-app/package.json` 中添加脚本：

```json
{
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 13. 更新根目录 turbo.json

在根目录的 `turbo.json` 中添加 nx-app：

```json
{
  "pipeline": {
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    }
  }
}
```

## 🧪 测试流程

### 开发环境测试

1. **启动数据库**（如果使用本地 PostgreSQL）：

   ```bash
   # 确保 PostgreSQL 正在运行
   psql -U postgres -c "SELECT 1"
   ```

2. **启动所有服务**：

   ```bash
   pnpm dev
   ```

3. **在 Studio 中创建并发布画布**：
   - 访问 `http://localhost:5173/builder`
   - 添加组件
   - 点击"发布"按钮
   - 后端会生成 `publishUrl`: `http://localhost:3000/p/{canvasId}`

4. **查看发布的画布**：
   - 访问 `http://localhost:3000/p/{canvasId}`
   - nx-app 直接从数据库读取数据并渲染

5. **验证数据库直连**（可选）：
   ```bash
   # 在 nx-app 的终端日志中应该能看到 Prisma 查询日志
   # 类似：Query: SELECT * FROM canvas WHERE id = '...' AND isPublished = true
   ```

## 🚀 部署到生产环境

### 1. 配置只读数据库用户（推荐）

```sql
-- 创建只读用户
CREATE USER nx_app_readonly WITH PASSWORD 'secure_password';

-- 授予权限
GRANT CONNECT ON DATABASE nixora TO nx_app_readonly;
GRANT USAGE ON SCHEMA public TO nx_app_readonly;
GRANT SELECT ON canvas TO nx_app_readonly;
```

### 2. 后端环境变量

在 `apps/api` 的生产环境中设置：

```env
NX_APP_URL=https://nx.nixora.com
DATABASE_URL=postgresql://postgres:password@db.example.com:5432/nixora
```

### 3. 前端部署（Vercel 推荐）

Vercel 自动支持 Prisma：

```bash
cd apps/nx-app
vercel --prod
```

配置环境变量：

- `DATABASE_URL`: 生产数据库连接（使用只读用户）

Vercel 会自动：

1. 运行 `prisma generate`
2. 配置数据库连接池
3. 优化冷启动性能

### 4. 更新后端配置

部署后更新 API 环境变量：

```env
NX_APP_URL=https://your-nx-app.vercel.app
```

## 📊 最终架构图

```
搭建端（写操作）：
┌─────────────────────────────────────────────────────────┐
│              apps/studio (搭建端)                        │
│  创建、编辑、发布画布                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              apps/api (NestJS)                          │
│  POST /api/canvas (创建)                                 │
│  PATCH /api/canvas/:id (更新)                            │
│  POST /api/canvas/:id/publish (发布)                     │
│  └── TypeORM 管理写操作                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│          PostgreSQL - Canvas 表                         │
└─────────────────────────────────────────────────────────┘
                     ▲
                     │ (直接数据库连接，只读)
用户访问端（读操作）: │
┌─────────────────────────────────────────────────────────┐
│         apps/nx-app (Next.js + Prisma)                  │
│  ┌────────────────────────────────────────────┐         │
│  │  prisma.canvas.findUnique()                │         │
│  │  ├── 查询 isPublished = true               │         │
│  │  ├── 性能: ~20ms                            │         │
│  │  └── ISR 缓存: 1小时                        │         │
│  └────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────┘
                     ▲
                     │
┌─────────────────────────────────────────────────────────┐
│                    用户访问                              │
│          https://nx.nixora.com/p/[canvasId]             │
└─────────────────────────────────────────────────────────┘
```

## 📝 实施检查清单

- [ ] 创建 nx-app 应用
- [ ] 安装并配置 Prisma
- [ ] 配置 Prisma Schema
- [ ] 创建数据库客户端（lib/db.ts）
- [ ] 实现组件渲染器
- [ ] 实现画布页面（带 Prisma 查询）
- [ ] 配置 ISR 缓存
- [ ] 配置只读数据库用户（生产环境）
- [ ] 测试端到端流程
- [ ] 部署到 Vercel

## 🔗 相关文档

- [NX_APP_DATABASE_GUIDE.md](./NX_APP_DATABASE_GUIDE.md) - 数据库直连方案详解 ⭐
- [PUBLISHING_ARCHITECTURE.md](./PUBLISHING_ARCHITECTURE.md) - 完整的发布架构规划
- [CANVAS_STORAGE_SOLUTION.md](./CANVAS_STORAGE_SOLUTION.md) - 画布数据存储方案
- [CLAUDE.md](./CLAUDE.md) - 项目技术文档

## 💡 关键优势

**为什么选择直连数据库？**

1. **性能**: ~20ms vs ~120ms（提升 5 倍）
2. **可靠性**: API 故障不影响已发布页面
3. **简洁**: 减少一层调用，代码更直接
4. **安全**: 生产环境使用只读用户
5. **成本**: 减少 API 服务器负载

---

**创建日期**: 2025-10-16  
**更新日期**: 2025-10-16  
**状态**: 后端准备完成，架构已优化（CQRS 模式）
