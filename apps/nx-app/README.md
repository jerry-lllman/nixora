# nx-app

Next.js 应用，用于展示已发布的 Canvas 页面。直接连接数据库查询数据，提供高性能的公开访问。

## 快速开始

详细的设置说明请查看 [SETUP.md](./SETUP.md)

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量
cp env.example .env.local
# 编辑 .env.local 设置数据库连接

# 3. 启动开发服务器
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 主要功能

- 📄 展示已发布的 Canvas 页面 (`/p/[canvasId]`)
- 🗄️ 直接连接数据库（使用 Prisma）
- ⚡ 高性能（~20ms 响应延迟）
- 🔒 只读访问，安全可靠

## 技术栈

- **框架**: Next.js 15 (App Router)
- **数据库**: PostgreSQL + Prisma
- **样式**: Tailwind CSS
- **语言**: TypeScript

## 项目结构

```
apps/nx-app/
├── app/              # Next.js App Router
│   ├── p/           # 公开的 Canvas 页面
│   ├── layout.tsx   # 根布局
│   └── page.tsx     # 首页
├── lib/             # 工具函数
│   └── db.ts        # Prisma 客户端单例
├── prisma/          # 数据库配置
│   └── schema.prisma
└── env.example      # 环境变量模板
```

## 文档

- [SETUP.md](./SETUP.md) - 详细的设置指南
- [DATABASE_CONNECTION.md](./DATABASE_CONNECTION.md) - 数据库连接配置

## 架构说明

详见项目根目录的 `NX_APP_DATABASE_GUIDE.md` 了解架构设计和技术决策。
