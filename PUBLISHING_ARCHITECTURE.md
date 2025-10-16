# 发布架构演进规划

本文档规划了 Nixora 画布发布功能的两阶段架构演进路径。

## 📊 架构对比总览

| 维度         | MVP 阶段（共享运行时）        | 全面独立化阶段                  |
| ------------ | ----------------------------- | ------------------------------- |
| **目标用户** | 中小企业、个人创作者          | 大型企业、有合规要求的客户      |
| **部署模式** | 所有客户共享一个 Next.js 应用 | 每个画布生成独立的 Next.js 项目 |
| **数据源**   | 数据库驱动（实时读取）        | 构建时生成（版本锁定）          |
| **组件更新** | 即时生效（所有画布同步更新）  | 需要重新发布（版本隔离）        |
| **成本**     | 低（单一部署）                | 高（多实例部署 + CI/CD）        |
| **开发速度** | 快（3-5天）                   | 慢（2-3周）                     |
| **适用规模** | < 100 客户                    | > 100 客户或有企业需求          |

---

## 🚀 第一阶段：MVP - 共享运行时架构

### 架构概述

```
┌─────────────────────────────────────────────────────────┐
│                    用户访问                              │
│        https://preview.nixora.com/c/[canvasId]          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         apps/preview (Next.js App Router)               │
│  ┌────────────────────────────────────────────┐         │
│  │  app/c/[canvasId]/page.tsx                 │         │
│  │  ├── 从 API 获取 canvas 数据                │         │
│  │  ├── 检查 isPublished 状态                  │         │
│  │  └── 渲染组件树                             │         │
│  └────────────────────────────────────────────┘         │
│  ┌────────────────────────────────────────────┐         │
│  │  components/ComponentRenderer.tsx          │         │
│  │  ├── 组件类型映射                           │         │
│  │  ├── Props 动态注入                         │         │
│  │  └── 从 @nixora/ui 加载组件                 │         │
│  └────────────────────────────────────────────┘         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              apps/api (NestJS)                          │
│  GET /api/canvas/:id/public                             │
│  ├── 查询 Canvas 表                                      │
│  ├── 验证 isPublished = true                            │
│  └── 返回 components (JSONB)                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│          PostgreSQL - Canvas 表                         │
│  ┌─────────────────────────────────────────┐            │
│  │ id: uuid                                │            │
│  │ title: string                           │            │
│  │ components: jsonb                       │            │
│  │ isPublished: boolean                    │            │
│  │ userId: uuid                            │            │
│  │ publishedAt: timestamp                  │            │
│  └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

### 核心优势

✅ **快速迭代**

- 组件库更新后，所有已发布的画布自动使用最新版本
- 修复 bug 无需重新发布所有画布

✅ **低成本**

- 单一 Next.js 部署（1个服务器即可）
- 无需 CI/CD 流水线
- 无需存储大量生成的项目文件

✅ **简单维护**

- 统一的日志和监控
- 统一的性能优化
- 统一的安全更新

✅ **灵活性**

- 支持 A/B 测试（根据用户标签返回不同版本）
- 支持动态内容注入
- 支持实时数据绑定

### 关键实现要点

#### 1. 扩展 Canvas 实体

```typescript
// apps/api/src/canvas/entities/canva.entity.ts
@Column({ default: false })
isPublished!: boolean;

@Column({ nullable: true })
publishedAt?: Date;

@Column({ nullable: true })
publishUrl?: string;
```

#### 2. 添加公开访问 API

```typescript
// apps/api/src/canvas/canvas.controller.ts
@Get(':id/public')
async getPublic(@Param('id') id: string) {
  return this.canvasService.findPublished(id);
}
```

#### 3. Preview 应用核心页面

```typescript
// apps/preview/app/c/[canvasId]/page.tsx
export const revalidate = 3600; // ISR: 每小时重新生成

export default async function CanvasPage({ params }) {
  const canvas = await getPublishedCanvas(params.canvasId);
  return <CanvasRenderer canvas={canvas} />;
}
```

#### 4. 组件渲染器

```typescript
// apps/preview/components/CanvasRenderer.tsx
const componentMap = {
  'NixoraButton': NixoraButton,
  // ... 其他组件
};

export function CanvasRenderer({ canvas }) {
  return canvas.components.map(comp => {
    const Component = componentMap[comp.componentType];
    return <Component key={comp.instanceId} {...comp.props} />;
  });
}
```

#### 5. On-Demand Revalidation

```typescript
// apps/preview/app/api/revalidate/route.ts
export async function POST(request) {
  const { canvasId } = await request.json();
  revalidatePath(`/c/${canvasId}`);
  return NextResponse.json({ revalidated: true });
}

// API 发布时触发
await fetch(`${PREVIEW_URL}/api/revalidate`, {
  method: "POST",
  body: JSON.stringify({ canvasId })
});
```

### 部署建议

**推荐方案**: Vercel（零配置，自动 HTTPS + CDN）

```bash
cd apps/preview
vercel --prod
```

**自托管方案**: Docker + Nginx

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
CMD ["pnpm", "start"]
```

### MVP 阶段的局限性

⚠️ **不适合的场景**：

- 客户需要版本锁定（组件更新可能破坏已发布的页面）
- 需要物理隔离（合规要求）
- 需要独立部署到客户的私有云
- 需要深度定制每个客户的实现
- 超过 1000 个高流量画布

---

## 🏢 第二阶段：全面独立化架构

### 架构概述

```
┌──────────────────────────────────────────────────────┐
│              用户点击"发布"                           │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│          apps/api - Canvas Service                   │
│  async publish(canvasId, userId) {                   │
│    1. 标记 isPublished = true                        │
│    2. 调用 ProjectGenerator 生成项目                 │
│    3. 触发 CI/CD 部署流水线                          │
│    4. 返回部署 URL                                   │
│  }                                                   │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│        ProjectGenerator Service                      │
│  1. 创建项目目录: exports/canvas-{id}/               │
│  2. 生成 package.json（锁定组件版本）                │
│  3. 生成 Next.js 页面代码                            │
│  4. 生成配置文件                                      │
│  5. 初始化 Git 仓库                                   │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│             exports/canvas-abc123/                   │
│  package.json  ← 锁定 @nixora/button@1.0.0           │
│  app/page.tsx  ← 生成的 React 代码                   │
│  next.config.js                                      │
│  Dockerfile / vercel.json                            │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│              CI/CD 流水线                             │
│  GitHub Actions / Jenkins                            │
│  1. pnpm install                                     │
│  2. pnpm build                                       │
│  3. 部署到 Vercel / AWS / 客户私有云                 │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│         独立部署的 Next.js 应用                       │
│  https://canvas-abc123.nixora.com                   │
└──────────────────────────────────────────────────────┘
```

### 核心优势

✅ **版本隔离**

- 每个画布锁定特定版本的组件
- 组件库更新不影响已发布的画布
- 客户可以选择何时升级

✅ **客户隔离**

- 每个画布独立部署
- 互不影响（性能、安全、资源）
- 支持部署到客户指定的环境

✅ **深度定制**

- 生成后可以手动修改代码
- 可以集成客户专属逻辑
- 可以白标（替换品牌）

✅ **合规性**

- 物理隔离
- 独立的安全审计
- 满足 ISO/HIPAA/SOC2 等要求

### 关键实现要点

#### 1. 组件库拆分为独立 npm 包

**当前结构**:

```
packages/ui/src/components/
  ├── button.tsx
  ├── card.tsx
  └── ...
```

**目标结构**:

```
packages/
  ├── button/
  │   ├── package.json  # @nixora/button@1.0.0
  │   └── src/index.tsx
  ├── card/
  │   ├── package.json  # @nixora/card@1.0.0
  │   └── src/index.tsx
  └── ...
```

#### 2. 项目生成器核心逻辑

```typescript
// apps/api/src/generator/project-generator.service.ts
@Injectable()
export class ProjectGeneratorService {
  async generateProject(canvas: Canvas): Promise<string> {
    const projectDir = `exports/canvas-${canvas.id}`;

    // 1. 分析组件依赖
    const deps = this.analyzeDependencies(canvas.components);
    // { '@nixora/button': '1.0.0', '@nixora/card': '2.3.1' }

    // 2. 生成 package.json
    await this.generatePackageJson(projectDir, deps);

    // 3. 生成页面代码
    await this.generatePageCode(projectDir, canvas);

    // 4. 生成配置文件
    await this.generateConfigs(projectDir);

    return projectDir;
  }

  private generatePageCode(projectDir: string, canvas: Canvas) {
    const imports = this.generateImports(canvas.components);
    const jsx = this.generateJSX(canvas.components);

    const code = `
${imports}

export default function Page() {
  return (
    <div className="min-h-screen">
      ${jsx}
    </div>
  );
}
    `.trim();

    fs.writeFileSync(`${projectDir}/app/page.tsx`, code);
  }
}
```

#### 3. 部署服务

```typescript
// apps/api/src/generator/deployment.service.ts
@Injectable()
export class DeploymentService {
  async deploy(projectDir: string): Promise<string> {
    // 初始化 Git
    await exec("git init", { cwd: projectDir });
    await exec("git add .", { cwd: projectDir });
    await exec('git commit -m "Initial"', { cwd: projectDir });

    // 部署到 Vercel
    const { stdout } = await exec(
      `vercel --prod --token ${VERCEL_TOKEN} --yes`,
      { cwd: projectDir }
    );

    // 提取部署 URL
    const url = stdout.match(/https:\/\/[^\s]+/)?.[0];
    return url;
  }
}
```

#### 4. 发布流程集成

```typescript
// apps/api/src/canvas/canvas.service.ts
async publish(id: string, userId: string): Promise<Canvas> {
  const canvas = await this.findOne(id, userId);

  // 生成项目
  const projectDir = await this.projectGenerator.generateProject(canvas);

  // 部署
  const deployUrl = await this.deploymentService.deploy(projectDir);

  // 更新数据库
  canvas.isPublished = true;
  canvas.publishedAt = new Date();
  canvas.publishUrl = deployUrl;
  canvas.projectPath = projectDir;

  return await this.canvasRepository.save(canvas);
}
```

#### 5. 生成的项目结构

```
exports/canvas-abc123/
├── package.json
│   {
│     "dependencies": {
│       "@nixora/button": "1.0.0",  ← 版本锁定
│       "@nixora/card": "2.3.1",
│       "next": "14.2.0"
│     }
│   }
├── app/
│   ├── page.tsx
│   │   import { NixoraButton } from '@nixora/button'
│   │   export default function Page() {
│   │     return <NixoraButton text="点击" />
│   │   }
│   ├── layout.tsx
│   └── globals.css
├── next.config.js
├── tailwind.config.js
├── Dockerfile
├── vercel.json
└── README.md
```

### 组件版本管理系统

```typescript
// apps/api/src/components/component-version.entity.ts
@Entity('component_versions')
export class ComponentVersion {
  @Column()
  componentType!: string; // 'NixoraButton'

  @Column()
  packageName!: string; // '@nixora/button'

  @Column()
  version!: string; // '1.0.0'

  @Column({ default: false })
  isDeprecated!: boolean;

  @CreateDateColumn()
  publishedAt!: Date;
}

// 查询当前最新版本
async getCurrentVersion(componentType: string): Promise<string> {
  const version = await this.repo.findOne({
    where: { componentType, isDeprecated: false },
    order: { publishedAt: 'DESC' }
  });
  return version?.version || '1.0.0';
}
```

### 数据库扩展

```typescript
// apps/api/src/canvas/entities/canva.entity.ts
@Column({ default: 'shared' })
deploymentType!: 'shared' | 'dedicated';

@Column({ nullable: true })
projectPath?: string; // exports/canvas-{id}

@Column({ nullable: true })
gitRepoUrl?: string;

@Column({ type: 'jsonb', nullable: true })
componentVersions?: Record<string, string>; // 锁定的组件版本
```

### 全面独立化的挑战

⚠️ **需要解决的问题**：

1. **CI/CD 成本**
   - 每次发布需要 5-10 分钟的构建时间
   - 需要投资 CI/CD 基础设施

2. **存储成本**
   - 每个项目 ~500MB（包含 node_modules）
   - 1000 个画布 = 500GB 存储

3. **批量更新难题**
   - 组件有严重 bug 时，如何批量更新所有项目？
   - 需要构建"重新发布所有画布"的工具

4. **监控复杂度**
   - 需要为每个项目配置独立的监控
   - 需要聚合监控面板

---

## 🔄 迁移路径

### 从 MVP 到独立化的平滑过渡

#### 策略 1：渐进式迁移

```typescript
// Canvas 实体添加部署类型字段
@Column({ default: 'shared' })
deploymentType: 'shared' | 'dedicated';

// 发布时根据类型选择策略
async publish(id: string, userId: string) {
  const canvas = await this.findOne(id, userId);

  if (canvas.deploymentType === 'shared') {
    return await this.publishToSharedRuntime(canvas);
  } else {
    return await this.publishAsDedicatedProject(canvas);
  }
}
```

#### 策略 2：按客户等级区分

```typescript
// 用户表添加等级字段
@Column({ default: 'free' })
tier: 'free' | 'pro' | 'enterprise';

// 自动选择部署类型
const deploymentType = user.tier === 'enterprise' ? 'dedicated' : 'shared';
```

#### 策略 3：按流量自动升级

```typescript
// 监控画布流量，超过阈值自动升级
if (canvas.monthlyPageViews > 1000000) {
  await this.migrateToStandalone(canvas);
}
```

---

## 📊 成本对比分析

### MVP 阶段（前 100 个客户）

| 资源         | MVP 方案          | 独立化方案       |
| ------------ | ----------------- | ---------------- |
| **服务器**   | $50/月 (单台 VPS) | $500/月 (多实例) |
| **存储**     | 10GB              | 500GB            |
| **CI/CD**    | 不需要            | $200/月          |
| **开发时间** | 5 天              | 20 天            |
| **维护成本** | 低                | 高               |
| **总成本**   | ~$50/月           | ~$700/月         |

### 规模化阶段（1000+ 客户）

| 资源         | MVP 方案  | 独立化方案 |
| ------------ | --------- | ---------- |
| **服务器**   | $500/月   | $5000/月   |
| **存储**     | 100GB     | 5TB        |
| **CI/CD**    | $200/月   | $2000/月   |
| **人力成本** | 1 个运维  | 3-5 个运维 |
| **总成本**   | ~$1000/月 | ~$10000/月 |

---

## 🎯 决策矩阵

### 何时使用共享运行时（MVP）？

✅ 适用场景：

- 客户数 < 100
- 都是中小企业或个人用户
- 不需要合规认证
- 快速迭代需求强
- 预算有限

### 何时切换到独立化？

✅ 触发条件（满足任一即切换）：

- 有大型企业客户（年收入 > $10K）
- 需要通过 ISO/SOC2 认证
- 客户要求部署到私有云
- 单个画布月流量 > 100 万 PV
- 组件版本锁定需求强烈

---

## 📝 实施检查清单

### MVP 阶段检查清单

- [ ] Preview 应用搭建完成
- [ ] ComponentRenderer 实现
- [ ] 公开访问 API 完成
- [ ] ISR 缓存策略配置
- [ ] On-Demand Revalidation 实现
- [ ] 部署到 Vercel/服务器
- [ ] 监控和日志配置
- [ ] 性能测试（< 1s 首屏加载）

### 独立化阶段检查清单

- [ ] 组件库拆分为独立 npm 包
- [ ] ProjectGenerator 实现
- [ ] CI/CD 流水线搭建
- [ ] Git 仓库管理系统
- [ ] 组件版本管理系统
- [ ] 批量部署工具
- [ ] 监控聚合面板
- [ ] 成本控制策略
- [ ] 客户自定义部署流程

---

## 🔮 未来展望

### 第三阶段：混合智能化（2-3 年后）

- **AI 驱动的部署决策**：根据画布特征自动选择最优部署方式
- **边缘计算**：将热门画布推送到 CDN 边缘节点
- **Serverless 架构**：按需计费，零成本起步
- **多租户隔离**：在共享运行时中实现逻辑隔离

---

**最后更新**: 2025-10-15
**维护者**: Nixora 团队
**版本**: 1.0
