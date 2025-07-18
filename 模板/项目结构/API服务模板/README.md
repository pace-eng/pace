# API服务项目结构模板

## 概述

这是一个基于PACE 1.0方法论设计的API服务项目结构模板，支持现代后端开发和AI协作。

## 项目结构

```
api-service-template/
├── docs/                           # 项目文档
│   ├── architecture.md            # 架构设计文档
│   ├── api-spec.md                # API接口规范
│   ├── database-design.md         # 数据库设计文档
│   ├── deployment.md              # 部署指南
│   └── security.md                # 安全设计文档
├── specs/                          # 任务卡规格文档
│   ├── slice-1.1-user-auth.spec.md
│   ├── slice-1.2-user-crud.spec.md
│   └── slice-2.1-data-processing.spec.md
├── src/                           # 源代码
│   ├── controllers/              # 控制器层
│   ├── services/                 # 业务逻辑层
│   ├── repositories/             # 数据访问层
│   ├── models/                   # 数据模型
│   ├── middleware/               # 中间件
│   ├── routes/                   # 路由定义
│   ├── utils/                    # 工具函数
│   ├── types/                    # TypeScript类型定义
│   ├── config/                   # 配置管理
│   └── validation/               # 数据验证
├── tests/                         # 测试代码
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试
│   └── e2e/                      # 端到端测试
├── migrations/                    # 数据库迁移
├── seeds/                         # 数据库种子数据
├── scripts/                       # 构建和部署脚本
├── docker/                        # Docker配置
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── docker-compose.dev.yml
├── .env.example                   # 环境变量模板
├── .gitignore                     # Git忽略文件
├── package.json                   # 项目依赖和脚本
├── tsconfig.json                  # TypeScript配置
├── jest.config.js                 # Jest测试配置
├── prisma/                        # Prisma ORM配置
│   ├── schema.prisma
│   └── migrations/
└── README.md                      # 项目说明
```

## 技术栈

### 核心技术
- **运行时**: Node.js 18+ + TypeScript
- **框架**: Express.js
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT + bcrypt
- **验证**: Zod
- **文档**: Swagger/OpenAPI
- **测试**: Jest + Supertest
- **日志**: Winston
- **监控**: Prometheus + Grafana

### 开发工具
- **代码质量**: ESLint + Prettier
- **Git钩子**: Husky + lint-staged
- **包管理器**: pnpm
- **容器化**: Docker + Docker Compose
- **API测试**: Postman/Thunder Client

## 快速开始

### 1. 环境准备
```bash
# 确保已安装Node.js 18+、pnpm和Docker
node --version  # >= 18.0.0
pnpm --version  # >= 8.0.0
docker --version

# 安装依赖
pnpm install
```

### 2. 数据库设置
```bash
# 启动数据库服务
docker-compose up -d postgres

# 运行数据库迁移
pnpm db:migrate

# 填充种子数据
pnpm db:seed
```

### 3. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
vim .env
```

### 4. 启动开发服务器
```bash
# 启动开发服务器
pnpm dev

# 启动并开启调试模式
pnpm dev:debug
```

### 5. 其他命令
```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 运行测试
pnpm test

# 运行测试覆盖率
pnpm test:coverage

# 代码检查
pnpm lint

# 类型检查
pnpm typecheck

# 数据库操作
pnpm db:studio    # 打开Prisma Studio
pnpm db:reset     # 重置数据库
pnpm db:generate  # 生成Prisma客户端
```

## 目录详细说明

### `/docs` - 项目文档
存放项目相关的技术文档：
- `architecture.md`: 系统架构设计和技术选型
- `api-spec.md`: RESTful API接口规范
- `database-design.md`: 数据库结构和关系设计
- `deployment.md`: 部署和运维指南
- `security.md`: 安全策略和实现

### `/specs` - 任务卡规格
存放按照PACE 1.0标准创建的任务卡：
- 使用垂直切片方式组织
- 每个spec文件对应一个完整的API功能
- 包含完整的业务逻辑和技术实现细节

### `/src` - 源代码目录

#### 分层架构设计
```
src/
├── controllers/      # 控制器层 - 处理HTTP请求响应
├── services/         # 业务逻辑层 - 核心业务逻辑
├── repositories/     # 数据访问层 - 数据库操作抽象
├── models/          # 数据模型 - 业务实体定义
├── middleware/      # 中间件 - 横切关注点
├── routes/          # 路由层 - API路由定义
├── utils/           # 工具函数 - 通用工具和助手
├── types/           # 类型定义 - TypeScript类型
├── config/          # 配置管理 - 应用配置
└── validation/      # 数据验证 - 输入验证schema
```

#### `/src/controllers` - 控制器层
```typescript
// 示例：用户控制器
export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }
}
```

#### `/src/services` - 业务逻辑层
```typescript
// 示例：用户服务
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    // 业务逻辑验证
    await this.validateUserData(userData);
    
    // 密码加密
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // 创建用户
    return this.userRepository.create({
      ...userData,
      password: hashedPassword
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  private async validateUserData(userData: CreateUserDto): Promise<void> {
    // 检查邮箱是否已存在
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
  }
}
```

#### `/src/repositories` - 数据访问层
```typescript
// 示例：用户仓储
export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userData: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: userData
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async update(id: string, userData: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: userData
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }
}
```

### `/tests` - 测试代码
```
tests/
├── unit/                 # 单元测试
│   ├── controllers/      # 控制器测试
│   ├── services/         # 服务层测试
│   ├── repositories/     # 仓储层测试
│   └── utils/           # 工具函数测试
├── integration/          # 集成测试
│   ├── api/             # API集成测试
│   └── database/        # 数据库集成测试
└── e2e/                 # 端到端测试
    └── scenarios/       # 业务场景测试
```

## 开发规范

### API设计规范
1. **RESTful风格**: 遵循REST设计原则
2. **统一响应格式**: 标准化的API响应结构
3. **错误处理**: 统一的错误码和错误信息
4. **版本控制**: 支持API版本管理

```typescript
// 统一响应格式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 错误响应示例
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 数据库设计规范
1. **命名约定**: 使用snake_case命名
2. **索引策略**: 合理的索引设计
3. **约束定义**: 完整的数据约束
4. **迁移管理**: 版本化的数据库变更

```sql
-- 示例：用户表设计
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 安全规范
1. **认证授权**: JWT token + RBAC权限控制
2. **输入验证**: 严格的输入数据验证
3. **SQL注入防护**: 使用参数化查询
4. **CORS配置**: 合理的跨域配置

```typescript
// 认证中间件示例
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

## PACE 1.0集成

### 任务卡使用
1. 在`/specs`目录创建API功能任务卡
2. 包含完整的业务逻辑描述
3. 定义清晰的API接口规范
4. 明确的测试策略和验收标准

### AI协作流程
1. **准备阶段**: 创建详细的API任务卡
2. **实现阶段**: AI根据任务卡生成分层代码
3. **测试阶段**: 自动化测试和人工验证
4. **集成阶段**: API集成和文档更新

### 质量保障
1. **自动化测试**: 单元测试、集成测试、E2E测试
2. **代码质量**: ESLint、Prettier、TypeScript检查
3. **API文档**: 自动生成的OpenAPI文档
4. **性能监控**: API性能和错误率监控

## 部署和运维

### Docker化部署
```dockerfile
# Dockerfile示例
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
```

### 环境配置
```bash
# 生产环境变量
NODE_ENV=production
PORT=3000

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# 日志配置
LOG_LEVEL=info
LOG_FILE=logs/app.log

# 监控配置
METRICS_PORT=9090
HEALTH_CHECK_ENDPOINT=/health
```

### 监控和日志
1. **应用监控**: Prometheus + Grafana
2. **日志聚合**: Winston + ELK Stack
3. **错误追踪**: Sentry
4. **性能监控**: APM工具集成

## 最佳实践

### 性能优化
1. **数据库优化**: 索引优化、查询优化
2. **缓存策略**: Redis缓存、查询缓存
3. **连接池**: 数据库连接池管理
4. **压缩**: Gzip响应压缩

### 安全最佳实践
1. **输入验证**: 严格的数据验证
2. **认证授权**: 完善的权限控制
3. **HTTPS**: 强制使用HTTPS
4. **安全头**: 设置安全HTTP头

### 运维最佳实践
1. **健康检查**: 完善的健康检查端点
2. **优雅关闭**: 优雅的应用关闭机制
3. **配置管理**: 环境变量配置管理
4. **日志记录**: 结构化的日志记录

---

这个模板为基于PACE 1.0方法论的API服务开发提供了完整的项目结构和开发指南，确保高质量的代码和高效的AI协作。