# Canvas 数据存储方案

## 📋 最终方案：PostgreSQL JSONB

### 选择理由

我们选择使用 **PostgreSQL JSONB** 来存储画布组件数据，而不是纯文本/字符串。

### ✅ JSONB 的优势

1. **存储优化**
   - PostgreSQL 自动压缩 JSONB 数据
   - 存储效率接近甚至优于手动压缩的字符串

2. **查询能力**

   ```sql
   -- 可以查询使用了特定组件的画布
   SELECT * FROM canvas
   WHERE components @> '[{"componentType": "NixoraButton"}]';

   -- 可以统计组件使用情况
   SELECT jsonb_array_elements(components)->>'componentType' as component_type,
          COUNT(*)
   FROM canvas
   GROUP BY component_type;
   ```

3. **索引支持**

   ```sql
   -- 创建 GIN 索引加速查询
   CREATE INDEX idx_canvas_components ON canvas USING GIN (components);
   ```

4. **数据完整性**
   - 自动验证 JSON 格式
   - TypeORM 自动处理序列化/反序列化
   - 不需要手动 JSON.parse/JSON.stringify

5. **性能**
   - 直接访问，无需解析
   - 支持部分更新（修改 JSON 内部字段）

### 🗄️ 数据库结构

```typescript
// Canvas 实体
@Entity({ name: "canvas" })
export class Canvas {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "jsonb" })
  components!: any[]; // ✅ 使用 JSONB 存储组件数组

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  isPublished!: boolean;

  @Column({ type: "uuid" })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
```

### 📝 DTO 验证

```typescript
// 组件实例 DTO
export class CanvasComponentDto {
  @IsString()
  instanceId!: string;

  @IsString()
  componentType!: string;

  @Allow() // 允许 props 内部的任意属性
  props!: Record<string, any>;

  @IsOptional()
  @IsNumber()
  order?: number;
}

// Canvas 创建 DTO
export class CreateCanvasDto {
  @IsString()
  title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CanvasComponentDto)
  components!: CanvasComponentDto[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
```

### 🔧 性能优化建议

如果未来遇到性能问题，可以考虑：

#### 1. 数据分页

```typescript
// 只加载可见区域的组件
const visibleComponents = canvas.components.slice(startIndex, endIndex);
```

#### 2. 懒加载

```typescript
// 按需加载组件配置
const component = await loadComponentById(instanceId);
```

#### 3. 添加索引

```sql
-- 加速基于组件类型的查询
CREATE INDEX idx_canvas_components_gin ON canvas USING GIN (components);
```

#### 4. 数据压缩（可选）

```typescript
// 对于超大画布（>1000 组件），可以考虑压缩
import pako from "pako";

const compressed = pako.gzip(JSON.stringify(components));
// 存储到单独的 BYTEA 字段
```

### 📊 数据示例

```json
{
  "id": "7dd128a8-39d9-4aca-9d78-00d4755a651d",
  "title": "我的营销页面",
  "components": [
    {
      "instanceId": "NixoraButton-1760527796701-vnxpi1k01",
      "componentType": "NixoraButton",
      "props": {
        "text": "立即购买",
        "variant": "primary",
        "size": "medium",
        "fullWidth": true,
        "icon": ""
      },
      "order": 0
    },
    {
      "instanceId": "NixoraButton-1760527801234-abc456",
      "componentType": "NixoraButton",
      "props": {
        "text": "了解更多",
        "variant": "secondary",
        "size": "large",
        "fullWidth": false,
        "icon": "arrow-right"
      },
      "order": 1
    }
  ],
  "description": "使用 Nixora Builder 创建",
  "isPublished": false,
  "userId": "295c86dc-5b56-4dfe-8276-d225b78ff887",
  "createdAt": "2025-10-15T11:30:02.300Z",
  "updatedAt": "2025-10-15T11:30:02.300Z"
}
```

### 🎯 预期性能

- **单个画布大小**: 通常 < 100KB（~50 组件）
- **查询速度**: < 50ms（有索引）
- **保存速度**: < 100ms
- **支持的组件数**: 理论上无限制，实际建议 < 1000 组件/画布

### 🚀 行业标准

类似的产品都使用相同方案：

- **Figma**: JSON 存储设计数据
- **Notion**: JSONB 存储页面内容
- **WordPress (Gutenberg)**: JSON 存储块数据
- **Webflow**: JSON 存储网站结构

### ✅ 最终实现

1. ✅ 数据库使用 JSONB 字段
2. ✅ DTO 正确验证组件结构
3. ✅ 前端直接传递 JSON 对象
4. ✅ 后端自动序列化/反序列化
5. ✅ 支持完整的组件数据（props 不会被过滤）

### 📝 注意事项

- ValidationPipe 的 `whitelist: true` 会过滤没有装饰器的字段
- 需要使用 `@Allow()` 装饰器允许动态属性（如 props）
- 使用 `@ValidateNested()` 和 `@Type()` 验证嵌套对象

---

**更新日期**: 2025-10-15  
**状态**: ✅ 已实现并验证
