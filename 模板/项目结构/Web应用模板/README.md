# Web应用项目结构模板

## 概述

这是一个基于PACE 1.0方法论设计的Web应用项目结构模板，支持现代前端开发和AI协作。

## 项目结构

```
web-app-template/
├── docs/                           # 项目文档
│   ├── architecture.md            # 架构设计文档
│   ├── api-spec.md                # API接口规范
│   ├── deployment.md              # 部署指南
│   └── user-guide.md              # 用户指南
├── specs/                          # 任务卡规格文档
│   ├── slice-1.1-user-auth.spec.md
│   ├── slice-1.2-user-dashboard.spec.md
│   └── slice-2.1-data-management.spec.md
├── src/                           # 源代码
│   ├── components/                # React组件
│   │   ├── common/               # 通用组件
│   │   ├── layout/               # 布局组件
│   │   └── features/             # 功能组件
│   ├── pages/                    # 页面组件
│   ├── hooks/                    # 自定义Hooks
│   ├── services/                 # API服务层
│   ├── stores/                   # 状态管理
│   ├── utils/                    # 工具函数
│   ├── types/                    # TypeScript类型定义
│   ├── styles/                   # 样式文件
│   └── assets/                   # 静态资源
├── tests/                         # 测试代码
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试
│   └── e2e/                      # 端到端测试
├── public/                        # 公共资源
├── config/                        # 配置文件
├── scripts/                       # 构建脚本
├── .env.example                   # 环境变量模板
├── .gitignore                     # Git忽略文件
├── package.json                   # 项目依赖和脚本
├── tsconfig.json                  # TypeScript配置
├── tailwind.config.js             # Tailwind CSS配置
├── vite.config.ts                 # Vite构建配置
└── README.md                      # 项目说明
```

## 技术栈

### 核心技术
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **路由**: React Router v6
- **状态管理**: Zustand
- **UI库**: Tailwind CSS + Headless UI
- **HTTP客户端**: Axios
- **表单处理**: React Hook Form + Zod
- **测试框架**: Vitest + React Testing Library

### 开发工具
- **代码质量**: ESLint + Prettier
- **Git钩子**: Husky + lint-staged
- **包管理器**: pnpm
- **类型检查**: TypeScript

## 快速开始

### 1. 环境准备
```bash
# 确保已安装Node.js 18+和pnpm
node --version  # >= 18.0.0
pnpm --version  # >= 8.0.0

# 安装依赖
pnpm install
```

### 2. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
vim .env
```

### 3. 启动开发服务器
```bash
# 启动开发服务器
pnpm dev

# 启动并开启API mock
pnpm dev:mock
```

### 4. 其他命令
```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 运行测试
pnpm test

# 运行测试覆盖率
pnpm test:coverage

# 代码检查
pnpm lint

# 类型检查
pnpm typecheck
```

## 目录详细说明

### `/docs` - 项目文档
存放项目相关的文档，按照PACE 1.0方法论要求维护：
- `architecture.md`: 系统架构设计
- `api-spec.md`: API接口规范
- `deployment.md`: 部署和运维指南
- `user-guide.md`: 用户使用指南

### `/specs` - 任务卡规格
存放按照PACE 1.0标准创建的任务卡：
- 使用垂直切片方式组织
- 每个spec文件对应一个完整的功能切片
- 包含完整的上下文信息供AI参考

### `/src` - 源代码目录

#### `/src/components` - 组件库
```
components/
├── common/           # 通用组件
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   └── Loading/
├── layout/           # 布局组件
│   ├── Header/
│   ├── Sidebar/
│   ├── Footer/
│   └── Layout/
└── features/         # 功能组件
    ├── auth/
    ├── dashboard/
    └── settings/
```

#### `/src/pages` - 页面组件
```
pages/
├── Home/
├── Auth/
│   ├── Login/
│   └── Register/
├── Dashboard/
└── NotFound/
```

#### `/src/services` - API服务层
```
services/
├── api.ts           # API客户端配置
├── auth.ts          # 认证相关API
├── user.ts          # 用户相关API
└── types.ts         # API类型定义
```

#### `/src/stores` - 状态管理
```
stores/
├── authStore.ts     # 认证状态
├── userStore.ts     # 用户状态
└── index.ts         # 状态管理入口
```

### `/tests` - 测试代码
```
tests/
├── unit/            # 单元测试
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/     # 集成测试
│   └── services/
└── e2e/            # 端到端测试
    └── flows/
```

## 开发规范

### 组件开发规范
1. **组件命名**: 使用PascalCase
2. **文件结构**: 每个组件一个目录
3. **TypeScript**: 严格类型定义
4. **样式**: 使用Tailwind CSS类名

```typescript
// 组件示例
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### API服务规范
1. **统一错误处理**: 使用interceptors
2. **类型安全**: 完整的TypeScript类型
3. **请求取消**: 支持请求取消机制

```typescript
// API服务示例
class UserService {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/api/user/profile');
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await api.put<UserProfile>('/api/user/profile', data);
    return response.data;
  }
}

export const userService = new UserService();
```

### 状态管理规范
1. **模块化**: 按功能域划分store
2. **类型安全**: 完整的TypeScript支持
3. **持久化**: 关键状态本地存储

```typescript
// 状态管理示例
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (credentials) => {
    const response = await authService.login(credentials);
    set({
      user: response.user,
      token: response.token,
      isAuthenticated: true
    });
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }
}));
```

## PACE 1.0集成

### 任务卡使用
1. 在`/specs`目录创建任务卡
2. 使用PACE 1.0标准模板
3. 包含完整的上下文信息
4. 明确的验收标准

### AI协作流程
1. **准备阶段**: 创建详细的任务卡
2. **实现阶段**: AI根据任务卡生成代码
3. **验证阶段**: 人工审查和测试
4. **集成阶段**: 代码集成和部署

### 质量保障
1. **自动化测试**: 单元测试、集成测试、E2E测试
2. **代码质量**: ESLint、Prettier、TypeScript检查
3. **性能监控**: 构建产物分析、运行时性能监控
4. **安全检查**: 依赖安全扫描、代码安全检查

## 部署和运维

### 构建配置
- **开发环境**: 快速热重载，详细错误信息
- **测试环境**: 接近生产的配置，包含调试信息
- **生产环境**: 优化构建，压缩代码，移除调试信息

### 环境变量
```bash
# 基础配置
VITE_APP_TITLE=My App
VITE_APP_VERSION=1.0.0

# API配置
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=10000

# 功能开关
VITE_ENABLE_MOCK=false
VITE_ENABLE_ANALYTICS=true

# 第三方服务
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_GA_TRACKING_ID=GA-XXXXX-X
```

### 部署脚本
```bash
#!/bin/bash
# deploy.sh

# 构建项目
pnpm build

# 运行测试
pnpm test

# 部署到CDN
aws s3 sync dist/ s3://your-bucket-name --delete

# 更新CloudFront缓存
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 最佳实践

### 性能优化
1. **代码分割**: 路由级别的懒加载
2. **资源优化**: 图片压缩、字体优化
3. **缓存策略**: 合理的缓存策略
4. **Bundle分析**: 定期分析包大小

### 用户体验
1. **响应式设计**: 移动端友好
2. **加载状态**: 合适的loading指示
3. **错误处理**: 友好的错误提示
4. **无障碍**: 符合WCAG标准

### 开发体验
1. **热重载**: 快速开发反馈
2. **类型安全**: 编译时错误检查
3. **代码提示**: 完整的IDE支持
4. **调试工具**: React DevTools集成

---

这个模板为基于PACE 1.0方法论的Web应用开发提供了完整的项目结构和开发指南，确保高质量的代码和高效的AI协作。