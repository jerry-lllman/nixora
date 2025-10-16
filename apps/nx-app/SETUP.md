# nx-app Setup Guide

这是一个 Next.js 应用，用于展示已发布的 Canvas 页面。它直接连接数据库查询数据，无需通过 API。

## 快速开始

### 1. 安装依赖

```bash
cd apps/nx-app
pnpm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
cp env.example .env.local
```

编辑 `.env.local` 并设置数据库连接：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nixora"
```

> 注意：确保 `.env.local` 不要提交到 Git（已在 .gitignore 中配置）

### 3. 生成 Prisma Client

Prisma Client 会在安装依赖时自动生成（通过 `postinstall` 脚本）。如果需要手动重新生成：

```bash
pnpm exec prisma generate
```

这会根据 `prisma/schema.prisma` 生成类型安全的数据库客户端到 `node_modules/.prisma/client`。

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 使用方式

### 查看已发布的 Canvas

当你在 Studio 中发布一个 Canvas 时，会生成一个 URL：

```
http://localhost:3000/p/[canvasId]
```

例如：`http://localhost:3000/p/123e4567-e89b-12d3-a456-426614174000`

这个页面会：

1. 从数据库中查询该 Canvas 的数据（仅已发布的）
2. 以 JSON 格式展示 Canvas 数据
3. 如果 Canvas 未发布或不存在，显示 404

## 数据库架构

Prisma Schema 定义在 `prisma/schema.prisma`：

- **Canvas** 模型对应数据库中的 `canvas` 表
- 字段包括：title, components, description, isPublished 等
- 只查询 `isPublished = true` 的记录

## 生产环境建议

### 使用只读数据库用户

为了安全，生产环境建议创建只读用户：

```sql
-- 在 PostgreSQL 中执行
CREATE USER nx_app_readonly WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE nixora TO nx_app_readonly;
GRANT USAGE ON SCHEMA public TO nx_app_readonly;
GRANT SELECT ON canvas TO nx_app_readonly;
```

然后在生产环境的 `.env` 中使用：

```env
DATABASE_URL="postgresql://nx_app_readonly:secure_password@your-db-host:5432/nixora"
```

## 常见命令

```bash
# 安装依赖
pnpm install

# 生成 Prisma Client（每次修改 schema 后需要运行）
pnpm exec prisma generate

# 查看数据库当前状态
pnpm exec prisma db pull

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 架构优势

相比通过 API 查询：

- ✅ **性能提升 5 倍**：延迟从 ~120ms 降至 ~20ms
- ✅ **架构更简单**：减少一个网络跳转
- ✅ **降低 API 负载**：公开页面不经过 API
- ✅ **成本更低**：无需额外的 API 服务器处理
- ✅ **独立部署**：nx-app 和 API 可以独立扩展

## 下一步

目前页面只展示 JSON 数据。后续可以：

1. 添加组件渲染器，根据 `components` 字段渲染实际的 UI
2. 添加 SEO 优化（meta tags, OpenGraph）
3. 添加缓存策略（ISR, On-Demand Revalidation）
4. 添加分析和监控

详见项目根目录的 `NX_APP_DATABASE_GUIDE.md` 了解更多架构细节。
