# 任务卡生成器

## 概述

任务卡生成器是一个帮助团队快速创建符合PACE 1.0标准的任务卡的工具。它提供了交互式的界面，引导用户填写必要信息，并自动生成格式化的任务卡文档。

## 功能特性

- 📋 **模板选择**: 支持Level 1-4四种任务卡模板
- 🎯 **智能分级**: 根据任务特征自动推荐任务级别
- 📝 **交互式填写**: 逐步引导填写任务卡信息
- ✅ **验证检查**: 自动检查任务卡的完整性和合规性
- 📄 **文档生成**: 生成标准格式的Markdown文档
- 🔄 **模板更新**: 支持自定义和更新任务卡模板

## 安装使用

### 本地安装
```bash
# 安装依赖
cd 工具/任务卡生成器
npm install

# 构建项目
npm run build

# 启动交互式生成器
npm start

# 或者直接运行开发版本
npm run dev
```

### 全局安装
```bash
# 全局安装后可在任意目录使用
npm install -g pace-task-generator

# 启动交互式界面
pace-generator

# 或者直接创建任务卡
pace-generator create --title "用户登录" --level 2
```

### 直接运行
```bash
# 使用npx直接运行
npx pace-task-generator

# 交互式界面
npx pace-task-generator interactive

# 批量创建
npx pace-task-generator batch examples/task-list.json
```

## 使用指南

### 1. 启动生成器
```bash
$ npm start

? 欢迎使用PACE任务卡生成器! 请选择操作:
❯ 创建新任务卡
  查看现有任务卡
  更新模板
  退出
```

### 2. 选择任务类型
```bash
? 请描述您的任务: 
实现用户登录功能

? 根据描述，我们推荐使用 Level 2 任务卡。是否确认?
❯ 确认使用 Level 2
  选择其他级别
  查看级别说明
```

### 3. 填写任务信息
```bash
? 任务ID (例: PROJ-L2-AUTH-001): ECOM-L2-AUTH-001
? 任务标题: 用户登录功能实现
? 优先级: 
❯ P0 (最高)
  P1 (高)
  P2 (中)
  P3 (低)
? 预估工作量 (小时): 16
? 负责人: 张三
```

### 4. 业务上下文
```bash
? 业务目标: 
为电商网站实现安全的用户登录功能，支持邮箱密码登录

? 用户价值: 
用户可以安全地登录账户，访问个人信息和历史订单

? 验收标准 (多行输入，空行结束):
- 用户可以使用邮箱和密码登录
- 登录失败显示友好错误提示
- 登录成功后跳转到用户仪表板
- 支持记住登录状态

```

### 5. 技术规格
```bash
? 相关文件清单 (格式: 文件路径:描述):
src/components/LoginForm.tsx:登录表单组件
src/services/authService.ts:认证服务API
src/stores/authStore.ts:认证状态管理

? 是否需要添加自定义内容? (y/N): n
```

### 6. 生成结果
```bash
✅ 任务卡已生成: specs/slice-auth-001-user-login.spec.md

📋 任务卡摘要:
- 任务ID: ECOM-L2-AUTH-001
- 类型: Level 2 - 集成协调任务
- 优先级: P0
- 预估工作量: 16小时
- 输出文件: specs/slice-auth-001-user-login.spec.md

? 是否要继续创建其他任务卡? (y/N): n
```

## 配置文件

### 项目配置 (pace.config.json)
```json
{
  "projectName": "电商平台",
  "projectPrefix": "ECOM",
  "outputDir": "specs",
  "templates": {
    "level1": "templates/level-1-template.md",
    "level2": "templates/level-2-template.md",
    "level3": "templates/level-3-template.md",
    "level4": "templates/level-4-template.md"
  },
  "teamMembers": [
    "张三",
    "李四", 
    "王五"
  ],
  "defaultSettings": {
    "priority": "P1",
    "estimationUnit": "hours"
  }
}
```

### 模板自定义
```markdown
<!-- 自定义模板示例 -->
# {{taskTitle}}

## 任务标识
- **任务ID**: {{taskId}}
- **任务类型**: {{taskType}}
- **优先级**: {{priority}}
- **预估工作量**: {{estimation}}
- **负责人**: {{assignee}}

## 业务上下文
{{businessContext}}

## 技术规格
{{technicalSpec}}

<!-- 其他自定义内容 -->
```

## 智能特性

### 自动分级算法
```typescript
interface TaskClassification {
  level: 1 | 2 | 3 | 4;
  confidence: number;
  reasoning: string[];
}

function classifyTask(description: string): TaskClassification {
  const keywords = {
    level1: ['实现', 'CRUD', '表单', '页面', '组件'],
    level2: ['集成', '对接', '同步', '协调', '流程'],
    level3: ['架构', '设计', '选型', '方案', '优化'],
    level4: ['创新', '探索', '研究', '验证', '概念']
  };
  
  // 分析关键词匹配度
  // 返回推荐级别和置信度
}
```

### 模板智能填充
```typescript
interface TemplateData {
  taskId: string;
  taskTitle: string;
  businessGoal: string;
  // ... 其他字段
}

function generateTemplate(level: number, data: TemplateData): string {
  const template = loadTemplate(level);
  return mustache.render(template, data);
}
```

## API接口

### 命令行接口
```bash
# 基本用法
pace-generator --level 2 --title "用户登录" --output specs/

# 批量生成
pace-generator --batch tasks.json

# 使用配置文件
pace-generator --config pace.config.json
```

### 编程接口
```typescript
import { TaskCardGenerator } from 'pace-task-generator';

const generator = new TaskCardGenerator({
  projectName: '我的项目',
  outputDir: 'specs'
});

const taskCard = await generator.create({
  level: 2,
  title: '用户登录功能',
  businessGoal: '实现用户身份验证',
  // ... 其他参数
});

console.log(`任务卡已生成: ${taskCard.filePath}`);
```

## 质量检查

### 完整性检查
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

function validateTaskCard(taskCard: TaskCard): ValidationResult {
  const errors = [];
  const warnings = [];
  
  // 检查必填字段
  if (!taskCard.taskId) errors.push('缺少任务ID');
  if (!taskCard.businessGoal) errors.push('缺少业务目标');
  
  // 检查格式规范
  if (!taskCard.taskId.match(/^[A-Z]+-L[1-4]-\w+-\d+$/)) {
    warnings.push('任务ID格式不规范');
  }
  
  return { isValid: errors.length === 0, errors, warnings };
}
```

### 最佳实践检查
```typescript
function checkBestPractices(taskCard: TaskCard): string[] {
  const suggestions = [];
  
  // 检查任务粒度
  if (taskCard.estimation > 40) {
    suggestions.push('任务工作量较大，建议拆分为更小的任务');
  }
  
  // 检查验收标准
  if (taskCard.acceptanceCriteria.length < 3) {
    suggestions.push('建议添加更多具体的验收标准');
  }
  
  return suggestions;
}
```

## 集成功能

### Git集成
```bash
# 自动提交生成的任务卡
pace-generator --auto-commit

# 创建PR
pace-generator --create-pr --title "添加用户登录任务卡"
```

### 项目管理工具集成
```typescript
// Jira集成
const jiraIntegration = new JiraIntegration({
  host: 'your-domain.atlassian.net',
  apiToken: 'your-api-token'
});

await jiraIntegration.createIssue(taskCard);

// GitHub Issues集成
const githubIntegration = new GitHubIntegration({
  repo: 'your-org/your-repo',
  token: 'your-token'
});

await githubIntegration.createIssue(taskCard);
```

### IDE插件
```typescript
// VS Code扩展
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'pace.generateTaskCard',
    async () => {
      const panel = vscode.window.createWebviewPanel(
        'paceTaskGenerator',
        'PACE任务卡生成器',
        vscode.ViewColumn.One,
        {}
      );
      
      // 显示生成器界面
    }
  );
  
  context.subscriptions.push(disposable);
}
```

## 扩展开发

### 自定义验证器
```typescript
interface CustomValidator {
  name: string;
  validate(taskCard: TaskCard): ValidationResult;
}

class BusinessRuleValidator implements CustomValidator {
  name = 'business-rule-validator';
  
  validate(taskCard: TaskCard): ValidationResult {
    // 自定义业务规则验证
    return { isValid: true, errors: [], warnings: [] };
  }
}

generator.addValidator(new BusinessRuleValidator());
```

### 自定义模板引擎
```typescript
interface TemplateEngine {
  render(template: string, data: any): string;
}

class CustomTemplateEngine implements TemplateEngine {
  render(template: string, data: any): string {
    // 自定义模板渲染逻辑
    return renderedContent;
  }
}

generator.setTemplateEngine(new CustomTemplateEngine());
```

## 最佳实践

### 模板维护
1. **版本控制**: 将模板纳入版本控制
2. **定期更新**: 根据团队反馈更新模板
3. **文档同步**: 保持模板与方法论文档同步
4. **质量检查**: 定期检查生成的任务卡质量

### 团队使用
1. **培训普及**: 确保团队成员了解工具使用
2. **规范统一**: 建立统一的任务卡创建规范
3. **持续改进**: 收集使用反馈，持续优化工具
4. **集成工作流**: 将工具集成到日常工作流程

---

通过使用任务卡生成器，团队可以显著提高任务卡创建的效率和质量，确保符合PACE 1.0方法论的标准，为高效的AI协作奠定基础。