/**
 * @nixora/ui - Nixora UI Component Library
 *
 * 这是组件库的主入口文件，负责导出所有公开的组件和工具函数。
 */

// ==================== 工具函数导出 ====================
/**
 * 导出 utils 模块中的工具函数
 * - cn: 用于合并 Tailwind CSS 类名的工具函数
 */
export * from './lib/utils'

// ==================== 组件导出 ====================
/**
 * 未来添加组件后，使用以下方式导出：
 *
 * 命名导出（推荐）：
 * export { Button } from './components/button'
 * export { Input } from './components/input'
 * export { Card } from './components/card'
 *
 * 或者导出所有内容：
 * export * from './components/button'
 * export * from './components/input'
 *
 * 使用示例：
 * import { Button, Input, cn } from '@nixora/ui'
 */

// TODO: 当添加第一个组件时，在此处导出
// export { Button } from './components/button'

export * from './components/button'