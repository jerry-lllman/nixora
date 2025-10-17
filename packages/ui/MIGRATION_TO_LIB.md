# @nixora/ui Web 应用 → 组件库改造计划

## 项目诊断

当前状态：标准 Vite + React + TypeScript Web 应用
目标状态：可被其他项目引用的 React 组件库

---

## 改造步骤（共 7 步，每步独立可验证）

### 第 1 步：配置 Vite Library Mode

**目标**：将 Vite 构建模式从 SPA 改为 Library

**操作**：
1. 修改 `vite.config.ts`
   - 添加 `build.lib` 配置
   - 配置入口文件为 `src/index.ts`
   - 配置库名称为 `NixoraUI`
   - 配置输出格式：ES 和 UMD

2. 添加 `build.rollupOptions.external`
   - 将 `react` 和 `react-dom` 标记为外部依赖

**验证**：
- 配置文件无语法错误
- 运行 `pnpm build` 不报配置错误（即使构建失败也没关系）

**涉及文件**：
- `vite.config.ts`

**预期输出**：
```
dist/
  nixora-ui.es.js
  nixora-ui.umd.js
```

---

### 第 2 步：配置 TypeScript 类型声明生成

**目标**：生成 `.d.ts` 类型声明文件供消费者使用

**操作**：
1. 修改 `tsconfig.app.json`
   - 设置 `declaration: true`
   - 设置 `declarationDir: "./dist/types"`
   - 设置 `emitDeclarationOnly: true`
   - 移除 `noEmit: true`（与 declaration 冲突）

2. 安装类型生成插件
   ```bash
   pnpm add -D vite-plugin-dts
   ```

3. 在 `vite.config.ts` 中集成 `vite-plugin-dts`

**验证**：
- TypeScript 编译无错误
- 运行 `pnpm build` 生成 `dist/types/**/*.d.ts` 文件

**涉及文件**：
- `tsconfig.app.json`
- `vite.config.ts`
- `package.json` (devDependencies)

**预期输出**：
```
dist/
  types/
    index.d.ts
    components/**/*.d.ts
```

---

### 第 3 步：配置 package.json 导出字段

**目标**：正确配置 npm 包的入口和类型声明

**操作**：
1. 修改 `package.json`
   - 移除 `private: true`
   - 添加 `main` 字段：`"./dist/nixora-ui.umd.js"`
   - 添加 `module` 字段：`"./dist/nixora-ui.es.js"`
   - 添加 `types` 字段：`"./dist/types/index.d.ts"`
   - 添加 `exports` 字段（支持 modern imports）
   - 添加 `files` 字段：`["dist"]`
   - 修改 `scripts.build`：`"tsc && vite build"`

2. 移除 Web 应用特有的 scripts
   - 删除 `scripts.dev`
   - 删除 `scripts.preview`

**验证**：
- `package.json` 格式正确
- 运行 `pnpm build` 成功

**涉及文件**：
- `package.json`

**参考配置**：
```json
{
  "main": "./dist/nixora-ui.umd.js",
  "module": "./dist/nixora-ui.es.js",
  "types": "./dist/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/nixora-ui.es.js",
      "require": "./dist/nixora-ui.umd.js"
    },
    "./styles.css": "./dist/style.css"
  },
  "files": ["dist"]
}
```

---

### 第 4 步：调整依赖类型（dependencies → peerDependencies）

**目标**：避免重复打包 React，让消费者提供 React 运行时

**操作**：
1. 修改 `package.json`
   - 将 `react` 和 `react-dom` 从 `dependencies` 移动到 `peerDependencies`
   - 保留 `tailwindcss` 相关依赖在 `dependencies`（因为样式需要打包）
   - 保留工具库（`clsx`, `class-variance-authority`, `tailwind-merge`）在 `dependencies`

**验证**：
- 运行 `pnpm install` 无错误
- 检查 `node_modules` 中 React 仍然存在（因为开发需要）

**涉及文件**：
- `package.json`

**参考配置**：
```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.0",
    "lucide-react": "^0.546.0",
    "tailwind-merge": "^3.3.1",
    "tailwindcss": "^4.1.14"
  }
}
```

---

### 第 5 步：创建组件库入口文件

**目标**：提供统一的导出入口

**操作**：
1. 创建 `src/index.ts` 文件
   - 导出工具函数：`export * from './lib/utils'`
   - 预留组件导出位置（目前为空）

2. 添加注释说明组件导出规范
   ```typescript
   // 未来添加组件后的导出方式：
   // export { Button } from './components/button'
   ```

**验证**：
- TypeScript 无编译错误
- 运行 `pnpm build` 生成 `dist/index.d.ts`

**涉及文件**：
- `src/index.ts` (新建)

**参考内容**：
```typescript
// 导出工具函数
export * from './lib/utils'

// 未来组件导出示例（当前无组件）
// export { Button } from './components/button'
// export { Input } from './components/input'
```

---

### 第 6 步：清理 Web 应用相关文件

**目标**：移除不再需要的 Web 应用入口和资源

**操作**：
1. 删除文件
   - `src/main.tsx`
   - `src/App.tsx`
   - `src/App.css`
   - `index.html`
   - `public/vite.svg`
   - `src/assets/react.svg`

2. 保留文件
   - `src/index.css` (保留作为组件样式基础)
   - `src/lib/utils.ts` (工具函数)

**验证**：
- 运行 `pnpm build` 成功
- 检查 `dist` 目录包含预期文件

**涉及文件**：
- 多个待删除文件（见上）

**注意**：
- 这一步不影响构建，可以最后做
- 如果不确定，可以先重命名为 `.bak` 而不是删除

---

### 第 7 步：添加开发环境支持（可选）

**目标**：提供组件预览和开发调试能力

**操作**：
1. 创建 `dev` 目录用于本地开发
   ```
   dev/
     index.html
     main.tsx
     App.tsx
   ```

2. 修改 `vite.config.ts`
   - 添加 `root` 配置判断：开发模式使用 `dev` 目录

3. 恢复 `package.json` 中的 `dev` 脚本
   ```json
   "scripts": {
     "dev": "vite dev",
     "build": "tsc && vite build"
   }
   ```

**验证**：
- 运行 `pnpm dev` 启动开发服务器
- 可以在 `dev/App.tsx` 中导入并测试组件

**涉及文件**：
- `dev/**/*` (新建)
- `vite.config.ts`
- `package.json`

**状态**：可选步骤，建议在步骤 1-6 完成后再做

---

## 改造后的项目结构

```
packages/ui/
├── src/
│   ├── components/        # 未来的组件目录
│   │   └── button/
│   │       ├── button.tsx
│   │       └── index.ts
│   ├── lib/
│   │   └── utils.ts       # 工具函数
│   ├── index.css          # 全局样式
│   └── index.ts           # 📌 组件库入口
├── dev/                   # 开发预览目录（可选）
│   ├── index.html
│   ├── main.tsx
│   └── App.tsx
├── dist/                  # 构建输出
│   ├── nixora-ui.es.js
│   ├── nixora-ui.umd.js
│   ├── style.css
│   └── types/
│       └── index.d.ts
├── vite.config.ts         # Library 模式配置
├── tsconfig.json
├── tsconfig.app.json      # 开启 declaration
└── package.json           # 配置 main/module/types/exports
```

---

## 验证改造结果

### 1. 本地构建验证
```bash
pnpm build
```

**预期输出**：
- `dist/nixora-ui.es.js` (ESM 格式)
- `dist/nixora-ui.umd.js` (UMD 格式)
- `dist/style.css` (样式文件)
- `dist/types/index.d.ts` (类型声明)

### 2. 在其他项目中测试引用

在 `apps/studio` 或其他项目中：

```typescript
import { cn } from '@nixora/ui'  // 导入工具函数
import '@nixora/ui/styles.css'   // 导入样式

// 未来添加组件后：
// import { Button } from '@nixora/ui'
```

### 3. 检查类型提示

在消费者项目中，IDE 应该能够自动补全并显示类型提示。

---

## 回滚方案

如果改造过程中出现问题，每一步都可以独立回滚：

- **步骤 1-3**：修改配置文件，可以直接 `git checkout` 恢复
- **步骤 4**：调整依赖，运行 `pnpm install` 恢复
- **步骤 5**：创建文件，直接删除即可
- **步骤 6**：删除文件，从 git 恢复
- **步骤 7**：可选步骤，直接删除 `dev` 目录

---

## 潜在问题预警

### ⚠️ 问题 1：Tailwind CSS 配置
- **现象**：组件库消费者需要配置 Tailwind 才能正常显示样式
- **解决**：考虑使用 CSS-in-JS 或将 Tailwind 编译为静态 CSS

### ⚠️ 问题 2：样式隔离
- **现象**：组件样式可能与消费者项目冲突
- **解决**：使用 CSS Modules 或添加命名空间前缀

### ⚠️ 问题 3：React 版本兼容性
- **现象**：peerDependencies 设置过严可能导致安装失败
- **解决**：使用宽松的版本范围 `^18.0.0 || ^19.0.0`

### ⚠️ 问题 4：Tree Shaking
- **现象**：消费者打包时无法正确 tree-shake
- **解决**：确保 `package.json` 的 `sideEffects` 字段正确配置

---

## 执行建议

1. **按顺序执行**：步骤 1-6 有依赖关系，建议顺序执行
2. **每步验证**：每完成一步，运行构建确保无错误
3. **提交频率**：每完成一步就提交一次，方便回滚
4. **暂缓步骤 7**：等前 6 步稳定后再考虑添加开发环境

---

## 下一步行动

**等待你的审核反馈**，确认无误后我将开始执行改造。

如果你有任何疑问或需要调整计划，请告诉我：
- 是否同意这个改造方案？
- 是否需要调整某些步骤的优先级？
- 是否有其他特殊需求？
