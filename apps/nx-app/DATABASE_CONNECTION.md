# 数据库连接配置

## 环境变量

在 `apps/nx-app` 目录下创建 `.env.local` 文件（参考 `env.example`）：

```bash
cp env.example .env.local
```

然后编辑 `.env.local`：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nixora"
```

**注意**：

- 确保使用与 API 项目相同的数据库连接
- `.env.local` 不会被提交到 Git（已在 .gitignore 中配置）

## 需要运行的命令

在设置好环境变量后，运行以下命令：

```bash
# 进入 nx-app 目录
cd apps/nx-app

# 安装依赖（Prisma Client 会自动生成）
pnpm install

# 启动开发服务器
pnpm dev
```

> 注意：Prisma Client 会在 `pnpm install` 时自动生成（通过 postinstall 脚本）

## 测试

1. 在 Studio 应用中创建并发布一个 Canvas
2. 发布后会获得一个 URL，例如：`http://localhost:3000/p/abc-123-def`
3. 访问该 URL，应该能看到 Canvas 数据以 JSON 格式展示

## 文件说明

- `prisma/schema.prisma` - Prisma 数据库模型定义
- `lib/db.ts` - Prisma 客户端单例
- `app/p/[canvasId]/page.tsx` - 展示已发布 Canvas 的页面
