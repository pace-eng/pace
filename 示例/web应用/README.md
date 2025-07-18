# PACE Web应用完整示例：TaskFlow

## 项目概述

TaskFlow是一个现代化的任务管理Web应用，完全基于PACE 1.0方法论开发。它展示了如何使用垂直切片、四级任务分类和AI协作来构建高质量的Web应用程序。

## 🎯 示例目标

### 学习目标
- **PACE实践**: 展示PACE方法论在真实项目中的应用
- **现代技术栈**: 演示主流Web技术的最佳实践
- **AI协作**: 展示人机协作开发的具体实施
- **代码质量**: 展示高质量代码的组织和架构

### 技术目标
- **性能优化**: 首屏加载<2秒，操作响应<200ms
- **用户体验**: 直观易用的界面，流畅的交互
- **代码质量**: 90%+测试覆盖率，TypeScript严格模式
- **可维护性**: 模块化架构，清晰的代码组织

## 🛠️ 技术栈

### 前端核心
- **React 18** - 用户界面库
- **TypeScript** - 静态类型检查
- **Vite** - 现代化构建工具
- **Tailwind CSS** - 原子化CSS框架

### 状态管理
- **Zustand** - 轻量级状态管理
- **React Query** - 服务端状态管理
- **React Hook Form** - 表单状态管理

### UI组件
- **Headless UI** - 无样式可访问组件
- **Lucide React** - 现代图标库
- **Framer Motion** - 动画库
- **React Hot Toast** - 通知组件

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Vitest** - 单元测试
- **React Testing Library** - 组件测试

## 📋 功能特性

### 核心功能（切片1）
- ✅ 任务创建、编辑、删除
- ✅ 任务状态管理（待办、进行中、已完成）
- ✅ 任务列表显示和基础排序
- ✅ 本地数据持久化
- ✅ 响应式设计

### 增强功能（切片2）
- ✅ 任务分类和标签系统
- ✅ 高级搜索和筛选
- ✅ 拖拽排序功能
- ✅ 快捷键支持
- ✅ 深色模式切换

### 智能功能（切片3）
- ✅ 自然语言任务创建
- ✅ 智能任务分类建议
- ✅ 工作效率分析
- ✅ 任务优先级推荐

## 🏗️ 项目结构

```
TaskFlow/
├── public/                 # 静态资源
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/         # 可复用组件
│   │   ├── ui/            # 基础UI组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── layout/        # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   └── features/      # 功能组件
│   │       ├── tasks/
│   │       ├── categories/
│   │       └── analytics/
│   ├── hooks/             # 自定义Hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── useHotkeys.ts
│   ├── stores/            # 状态管理
│   │   ├── taskStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   ├── services/          # API和服务层
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   └── ai.ts
│   ├── types/             # TypeScript类型定义
│   │   ├── task.ts
│   │   ├── ui.ts
│   │   └── api.ts
│   ├── utils/             # 工具函数
│   │   ├── date.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── pages/             # 页面组件
│   │   ├── Dashboard.tsx
│   │   ├── Tasks.tsx
│   │   ├── Analytics.tsx
│   │   └── Settings.tsx
│   ├── App.tsx            # 根组件
│   ├── main.tsx           # 应用入口
│   └── index.css          # 全局样式
├── tests/                 # 测试文件
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   └── utils/
├── docs/                  # 项目文档
│   ├── development/       # 开发文档
│   ├── deployment/        # 部署文档
│   └── api/              # API文档
├── scripts/               # 构建和部署脚本
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎯 PACE方法论应用

### 垂直切片开发

#### 切片1：核心任务管理（MVP）
**交付价值**: 用户可以管理基本的任务
**开发时间**: 1周
**包含功能**:
- 任务CRUD操作
- 基础状态管理
- 简单列表界面
- 本地数据存储

#### 切片2：用户体验增强
**交付价值**: 显著提升使用效率和体验
**开发时间**: 1周
**包含功能**:
- 分类标签系统
- 搜索筛选功能
- 拖拽排序
- 快捷键支持

#### 切片3：智能化功能
**交付价值**: AI辅助提升工作效率
**开发时间**: 1周
**包含功能**:
- 自然语言创建
- 智能分类建议
- 工作分析报告
- 个性化推荐

### 四级任务分类示例

#### Level 1任务（AI主导）
- 创建Button、Input等基础UI组件
- 实现TaskItem显示组件
- 编写CRUD操作函数
- 实现数据验证逻辑

#### Level 2任务（人机协作）
- 集成状态管理和UI组件
- 实现搜索筛选功能
- 集成拖拽排序功能
- 实现数据持久化

#### Level 3任务（人类主导）
- 应用架构设计
- 状态管理方案选择
- 性能优化策略
- 部署和CI/CD配置

#### Level 4任务（创新探索）
- AI功能设计和实现
- 用户体验创新
- 新技术方案探索
- 性能监控方案

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 pnpm

### 安装和运行
```bash
# 克隆项目
git clone <repository-url>
cd TaskFlow

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm run test

# 代码检查
npm run lint

# 类型检查
npm run typecheck
```

### 开发环境配置
```bash
# 复制环境变量文件
cp .env.example .env.local

# 编辑环境变量
# VITE_AI_API_KEY=your_openai_api_key
# VITE_APP_NAME=TaskFlow
# VITE_APP_VERSION=1.0.0
```

## 📚 代码示例

### Level 1示例：Button组件
```typescript
// src/components/ui/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

### Level 2示例：任务状态管理
```typescript
// src/stores/taskStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Task, TaskStatus, TaskFilters } from '../types/task';

interface TaskStore {
  // 状态
  tasks: Task[];
  filters: TaskFilters;
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;

  // 操作
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  selectTask: (task: Task | null) => void;
  
  // 查询
  getFilteredTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
  getTasksByStatus: (status: TaskStatus) => Task[];
}

export const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // 初始状态
        tasks: [],
        filters: {
          status: undefined,
          category: undefined,
          search: '',
          sortBy: 'createdAt',
          sortOrder: 'desc',
        },
        selectedTask: null,
        loading: false,
        error: null,

        // 操作方法
        addTask: (taskData) => {
          set((state) => {
            const newTask: Task = {
              ...taskData,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            state.tasks.unshift(newTask);
            state.error = null;
          });
        },

        updateTask: (id, updates) => {
          set((state) => {
            const index = state.tasks.findIndex((task) => task.id === id);
            if (index !== -1) {
              Object.assign(state.tasks[index], updates, {
                updatedAt: new Date(),
              });
              state.error = null;
            }
          });
        },

        deleteTask: (id) => {
          set((state) => {
            state.tasks = state.tasks.filter((task) => task.id !== id);
            if (state.selectedTask?.id === id) {
              state.selectedTask = null;
            }
            state.error = null;
          });
        },

        setTaskStatus: (id, status) => {
          get().updateTask(id, { 
            status,
            completedAt: status === 'completed' ? new Date() : undefined,
          });
        },

        setFilters: (filters) => {
          set((state) => {
            Object.assign(state.filters, filters);
          });
        },

        selectTask: (task) => {
          set((state) => {
            state.selectedTask = task;
          });
        },

        // 查询方法
        getFilteredTasks: () => {
          const { tasks, filters } = get();
          let filtered = [...tasks];

          // 状态筛选
          if (filters.status) {
            filtered = filtered.filter((task) => task.status === filters.status);
          }

          // 分类筛选
          if (filters.category) {
            filtered = filtered.filter((task) => task.category === filters.category);
          }

          // 搜索筛选
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(
              (task) =>
                task.title.toLowerCase().includes(searchLower) ||
                task.description?.toLowerCase().includes(searchLower)
            );
          }

          // 排序
          filtered.sort((a, b) => {
            const aValue = a[filters.sortBy];
            const bValue = b[filters.sortBy];
            
            if (aValue instanceof Date && bValue instanceof Date) {
              return filters.sortOrder === 'asc' 
                ? aValue.getTime() - bValue.getTime()
                : bValue.getTime() - aValue.getTime();
            }
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return filters.sortOrder === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }
            
            return 0;
          });

          return filtered;
        },

        getTaskById: (id) => {
          return get().tasks.find((task) => task.id === id);
        },

        getTasksByStatus: (status) => {
          return get().tasks.filter((task) => task.status === status);
        },
      })),
      {
        name: 'taskflow-tasks',
        partialize: (state) => ({ tasks: state.tasks, filters: state.filters }),
      }
    ),
    { name: 'TaskStore' }
  )
);
```

### Level 3示例：应用架构配置
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react', 'lucide-react'],
          utils: ['zustand', '@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

## 🧪 测试策略

### 测试层次
- **单元测试**: 工具函数、Hooks、组件逻辑
- **集成测试**: 组件交互、状态管理集成
- **端到端测试**: 完整用户流程验证

### 测试示例
```typescript
// tests/components/TaskItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from '@/components/features/tasks/TaskItem';
import type { Task } from '@/types/task';

const mockTask: Task = {
  id: '1',
  title: '测试任务',
  description: '这是一个测试任务',
  status: 'todo',
  priority: 'medium',
  category: 'work',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TaskItem', () => {
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染任务信息', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('测试任务')).toBeInTheDocument();
    expect(screen.getByText('这是一个测试任务')).toBeInTheDocument();
  });

  it('应该在点击完成按钮时调用更新函数', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const completeButton = screen.getByLabelText('标记为已完成');
    fireEvent.click(completeButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(mockTask.id, {
      status: 'completed',
    });
  });

  it('应该在点击删除按钮时调用删除函数', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByLabelText('删除任务');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });
});
```

## 📈 性能优化

### 代码分割
```typescript
// 路由级别的代码分割
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const Analytics = lazy(() => import('@/pages/Analytics'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### 虚拟滚动
```typescript
// 大列表性能优化
import { useVirtualizer } from '@tanstack/react-virtual';

export function TaskList({ tasks }: { tasks: Task[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <TaskItem task={tasks[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🎨 设计系统

### 颜色主题
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
};
```

### 设计令牌
```typescript
// src/utils/design-tokens.ts
export const designTokens = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
} as const;
```

## 🚀 部署指南

### 构建优化
```json
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite build --mode analyze",
    "preview": "vite preview",
    "deploy": "npm run build && npm run deploy:vercel"
  }
}
```

### Docker部署
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📊 监控和分析

### 性能监控
```typescript
// src/utils/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function initPerformanceMonitoring() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

function sendToAnalytics(metric: any) {
  // 发送到分析服务
  console.log('Performance metric:', metric);
}
```

### 错误监控
```typescript
// src/utils/error-tracking.ts
export class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('应用错误:', error, errorInfo);
    // 发送错误报告到监控服务
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

## 🎓 学习资源

### 开发文档
- [组件开发指南](./docs/development/components.md)
- [状态管理最佳实践](./docs/development/state-management.md)
- [性能优化技巧](./docs/development/performance.md)
- [测试策略指南](./docs/development/testing.md)

### PACE实践
- [垂直切片实施记录](./docs/pace/vertical-slicing.md)
- [任务分类案例分析](./docs/pace/task-classification.md)
- [AI协作经验总结](./docs/pace/ai-collaboration.md)
- [代码审查清单](./docs/pace/code-review.md)

### 部署运维
- [生产环境部署](./docs/deployment/production.md)
- [性能监控配置](./docs/deployment/monitoring.md)
- [CI/CD流水线](./docs/deployment/cicd.md)
- [故障排查指南](./docs/deployment/troubleshooting.md)

---

TaskFlow展示了PACE方法论在现代Web开发中的强大威力。通过系统化的人机协作、价值驱动的开发方式和高质量的工程实践，我们可以快速构建出既满足用户需求又具备优秀技术品质的Web应用程序。

**准备开始你的PACE Web开发之旅了吗？** 🚀