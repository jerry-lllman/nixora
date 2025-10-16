# 项目清理说明

本文档说明了为改进项目结构和 Git 仓库管理所做的修改。

## 主要问题

1. ❌ **Prisma 生成的代码被提交到 Git**
   - `app/generated/prisma/` 包含 27 个自动生成的文件
   - 这些文件不应该被版本控制

2. ❌ **生成代码位置不合理**
   - 生成到 `app/` 目录（Next.js 应用代码目录）
   - 应该使用 Prisma 默认位置

3. ❌ **缺少环境变量模板**
   - 没有 `.env.example` 供新开发者参考

4. ⚠️ **`.DS_Store` 文件**
   - macOS 系统文件，已在 Git 中但不应该提交

## 已完成的修改

### 1. 更新 `.gitignore`

添加了以下忽略规则：

```gitignore
# prisma generated files (if using custom output path)
/app/generated/
/generated/

# macOS files
.DS_Store
```

### 2. 修改 Prisma 配置

**文件**: `prisma/schema.prisma`

- 移除了自定义 `output` 配置
- 现在使用 Prisma 默认位置: `node_modules/.prisma/client`

```prisma
generator client {
  provider = "prisma-client-js"
  # 移除了: output = "../app/generated/prisma"
}
```

### 3. 更新导入路径

**文件**: `lib/db.ts`

```typescript
// 之前
import { PrismaClient } from "@/app/generated/prisma";
// 现在
import { PrismaClient } from "@prisma/client";
```

### 4. 添加 postinstall 脚本

**文件**: `package.json`

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

现在运行 `pnpm install` 会自动生成 Prisma Client。

### 5. 创建环境变量模板

**新文件**: `env.example`

```env
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nixora"
```

### 6. 更新文档

- ✅ `README.md` - 更新为项目特定内容
- ✅ `SETUP.md` - 更新安装步骤和说明
- ✅ `DATABASE_CONNECTION.md` - 更新配置说明

## 需要手动执行的步骤

### 步骤 1: 删除旧的生成文件

```bash
cd apps/nx-app
rm -rf app/generated
```

### 步骤 2: 重新生成 Prisma Client

```bash
pnpm exec prisma generate
```

现在 Prisma Client 会生成到 `node_modules/.prisma/client`。

### 步骤 3: 从 Git 中移除不应该跟踪的文件

```bash
# 移除 .DS_Store
git rm --cached .DS_Store

# 如果其他地方也有 .DS_Store
git rm --cached -r **/.DS_Store
```

### 步骤 4: 提交更改

```bash
git add .
git commit -m "chore(nx-app): fix Prisma client generation and update .gitignore

- Move Prisma client generation to default location (node_modules/.prisma/client)
- Add app/generated/ and generated/ to .gitignore
- Add postinstall script for automatic Prisma client generation
- Create env.example for environment variable template
- Update documentation (README.md, SETUP.md, DATABASE_CONNECTION.md)
- Remove .DS_Store from Git tracking"
```

## 验证

运行以下命令验证一切正常：

```bash
# 1. 清理并重新安装
rm -rf node_modules
pnpm install

# 2. 确认 Prisma Client 生成到正确位置
ls -la node_modules/.prisma/client

# 3. 启动开发服务器
pnpm dev
```

## 最佳实践总结

✅ **使用 Prisma 默认生成位置**

- 生成到 `node_modules/.prisma/client`
- 从 `@prisma/client` 导入

✅ **不提交生成的代码**

- Prisma Client 自动生成
- 在 `.gitignore` 中忽略

✅ **使用 postinstall 脚本**

- 自动生成 Prisma Client
- 新开发者无需额外步骤

✅ **提供环境变量模板**

- 使用 `env.example`
- `.env.local` 不提交到 Git

## 参考资源

- [Prisma Client 最佳实践](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)
- [Next.js 环境变量](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
