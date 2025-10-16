# nx-app 直连数据库方案

## 架构对比

### 旧方案（通过 API）

```
nx-app → API (NestJS) → PostgreSQL
  │                          │
  └─ 延迟: ~100ms           └─ 查询: ~20ms

总延迟: ~120ms
```

### 新方案（直连数据库）✅

```
nx-app → PostgreSQL
  │           │
  └─ 查询: ~20ms

总延迟: ~20ms  (快 5 倍!)
```

## 实施步骤

### 1. 在 nx-app 中安装 Prisma

```bash
cd apps/nx-app
pnpm add @prisma/client
pnpm add -D prisma
```

### 2. 初始化 Prisma

```bash
cd apps/nx-app
npx prisma init
```

### 3. 配置 Prisma Schema

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

### 4. 生成 Prisma Client

```bash
cd apps/nx-app
npx prisma generate
```

### 5. 创建数据库客户端单例

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

### 6. 更新画布页面

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

### 7. 环境变量配置

**文件**: `apps/nx-app/.env.local`

```env
# PostgreSQL 连接（只读用户推荐）
DATABASE_URL="postgresql://readonly_user:password@localhost:5432/nixora"

# 或者使用主用户（开发环境）
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nixora"
```

### 8. 生产环境：配置只读数据库用户（推荐）

```sql
-- 创建只读用户
CREATE USER nx_app_readonly WITH PASSWORD 'secure_password';

-- 授予连接权限
GRANT CONNECT ON DATABASE nixora TO nx_app_readonly;

-- 授予 schema 使用权限
GRANT USAGE ON SCHEMA public TO nx_app_readonly;

-- 授予 canvas 表的只读权限
GRANT SELECT ON canvas TO nx_app_readonly;

-- 测试连接
psql "postgresql://nx_app_readonly:secure_password@localhost:5432/nixora"
```

生产环境 `.env`:

```env
DATABASE_URL="postgresql://nx_app_readonly:secure_password@your-db.example.com:5432/nixora"
```

## API 端点调整

### 现在 API 的职责

**API 仍然保留** `/api/canvas/:id/public` 端点，但用途变了：

1. **作为备用方案**：如果 nx-app 数据库连接失败
2. **用于 On-Demand Revalidation**：发布时通知 nx-app 更新缓存
3. **统一监控入口**：记录发布事件

**文件**: `apps/api/src/canvas/canvas.service.ts`

```typescript
async publish(id: string, userId: string): Promise<Canvas> {
  const canvas = await this.findOne(id, userId);

  const nxAppUrl = this.configService.get<string>('app.nxAppUrl');

  canvas.isPublished = true;
  canvas.publishedAt = new Date();
  canvas.publishUrl = `${nxAppUrl}/p/${id}`;

  const result = await this.canvasRepository.save(canvas);

  // 通知 nx-app 重新验证缓存
  try {
    await fetch(`${nxAppUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ canvasId: id }),
    });
  } catch (error) {
    console.error('Failed to revalidate nx-app:', error);
  }

  return result;
}
```

## 部署配置

### Vercel 部署

Vercel 自动支持 Prisma：

```bash
cd apps/nx-app
vercel --prod
```

配置环境变量：

- `DATABASE_URL`: 生产数据库 URL（只读用户）

Vercel 会自动：

1. 运行 `prisma generate`
2. 配置连接池
3. 优化冷启动

### 自托管 Docker

**文件**: `apps/nx-app/Dockerfile`

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN npx prisma generate
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

## 性能优化

### 1. 连接池配置

```env
DATABASE_URL="postgresql://user:password@host:5432/nixora?connection_limit=5&pool_timeout=10"
```

### 2. 查询优化

```typescript
// 添加索引（在后端迁移中）
CREATE INDEX idx_canvas_published ON canvas(id, isPublished) WHERE isPublished = true;
```

### 3. 边缘运行时（Vercel）

```typescript
// 使用边缘运行时

// 需要使用 @prisma/client/edge
import { PrismaClient } from "@prisma/client/edge";

// app/p/[canvasId]/page.tsx
export const runtime = "edge";
```

## 监控和日志

### Prisma 查询日志

```typescript
// lib/db.ts
export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "stdout", level: "error" }
  ]
});

prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Duration: " + e.duration + "ms");
});
```

## 迁移策略

### 阶段 1：并行运行（1周）

- nx-app 直连数据库
- API 端点保留作为备用
- 监控两者的性能差异

### 阶段 2：完全切换

- 移除 API 的公开查询端点
- API 只保留管理功能

## 数据库隔离方案（可选）

### 方案 A：只读副本

```
Studio → API → PostgreSQL Master (读写)
                       │
                       ▼ (异步复制)
nx-app ────────→ PostgreSQL Replica (只读)
```

配置：

```env
# Studio 使用主库
DATABASE_URL="postgresql://user:password@master.example.com:5432/nixora"

# nx-app 使用副本
DATABASE_URL="postgresql://readonly:password@replica.example.com:5432/nixora"
```

### 方案 B：PgBouncer 连接池

```
Studio → API ──┐
               ├─→ PgBouncer ─→ PostgreSQL
nx-app ────────┘
```

## 成本对比

| 方案       | 延迟   | 复杂度 | 成本           |
| ---------- | ------ | ------ | -------------- |
| 通过 API   | ~120ms | 中     | API 服务器费用 |
| 直连数据库 | ~20ms  | 低     | 仅数据库费用   |
| 只读副本   | ~25ms  | 高     | 数据库费用 × 2 |

## 总结

**推荐方案**：nx-app 直连 PostgreSQL（使用 Prisma）

**优势**：

- ✅ 性能提升 5 倍
- ✅ 架构更简单
- ✅ 降低 API 负载
- ✅ 成本更低
- ✅ 独立部署

**风险**：

- ⚠️ 需要管理数据库凭证
- ⚠️ 需要配置只读用户（生产环境）

---

**更新日期**: 2025-10-16  
**状态**: 推荐采用
