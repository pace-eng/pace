import * as fs from 'fs-extra';
import * as path from 'path';
import * as mustache from 'mustache';
import * as yaml from 'yaml';
import { TaskCard, TaskLevel, ValidationResult, GeneratorConfig, GeneratorOptions } from './types';
import { TaskClassifier } from './classifier';

export class TaskCardGenerator {
  private config: GeneratorConfig;
  private classifier: TaskClassifier;
  private templateCache: Map<string, string> = new Map();

  constructor(config: GeneratorConfig) {
    this.config = config;
    this.classifier = new TaskClassifier();
  }

  /**
   * 生成任务卡
   */
  async generateTaskCard(
    taskData: Partial<TaskCard>,
    options: GeneratorOptions = {}
  ): Promise<{ filePath: string; taskCard: TaskCard }> {
    // 1. 验证输入数据
    const validationResult = this.validateInput(taskData);
    if (!validationResult.isValid) {
      throw new Error(`任务卡数据验证失败: ${validationResult.errors.join(', ')}`);
    }

    // 2. 自动分类（如果启用）
    let taskLevel = taskData.taskType;
    if (options.autoClassify && taskData.functionalDescription) {
      const classification = this.classifier.classifyTask(taskData.functionalDescription);
      taskLevel = classification.level;
      console.log(`自动分类结果: Level ${classification.level} (置信度: ${Math.round(classification.confidence * 100)}%)`);
    }

    // 3. 补全任务卡数据
    const completeTaskCard = this.completeTaskCard(taskData, taskLevel);

    // 4. 生成文档内容
    const template = await this.loadTemplate(taskLevel);
    const content = this.renderTemplate(template, completeTaskCard);

    // 5. 生成文件路径
    const fileName = this.generateFileName(completeTaskCard);
    const filePath = path.join(this.config.outputDir, fileName);

    // 6. 确保输出目录存在
    await fs.ensureDir(this.config.outputDir);

    // 7. 写入文件
    await fs.writeFile(filePath, content, 'utf-8');

    // 8. 验证输出（如果启用）
    if (options.validateOutput) {
      const outputValidation = this.validateOutput(completeTaskCard);
      if (outputValidation.warnings.length > 0) {
        console.warn('任务卡生成警告:', outputValidation.warnings.join(', '));
      }
    }

    return { filePath, taskCard: completeTaskCard };
  }

  /**
   * 批量生成任务卡
   */
  async generateBatch(taskList: Partial<TaskCard>[], options: GeneratorOptions = {}): Promise<string[]> {
    const results: string[] = [];
    
    for (const taskData of taskList) {
      try {
        const result = await this.generateTaskCard(taskData, options);
        results.push(result.filePath);
        console.log(`✅ 已生成: ${result.filePath}`);
      } catch (error) {
        console.error(`❌ 生成失败: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * 验证任务卡输入数据
   */
  private validateInput(taskData: Partial<TaskCard>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // 必填字段检查
    if (!taskData.taskTitle) errors.push('缺少任务标题');
    if (!taskData.businessGoal) errors.push('缺少业务目标');
    if (!taskData.functionalDescription) errors.push('缺少功能描述');
    if (!taskData.assignee) warnings.push('建议指定负责人');

    // 格式检查
    if (taskData.taskId && !taskData.taskId.match(/^[A-Z]+-L[1-4]-[A-Z0-9]+-\d+$/)) {
      warnings.push('任务ID格式建议使用: 项目前缀-L级别-模块-序号 (如: PROJ-L2-AUTH-001)');
    }

    // 工作量检查
    if (taskData.estimation && taskData.estimation > 40) {
      suggestions.push('任务工作量较大(>40小时)，建议拆分为更小的任务');
    }

    // 验收标准检查
    if (taskData.acceptanceCriteria && taskData.acceptanceCriteria.length < 3) {
      suggestions.push('建议添加更多具体的验收标准(至少3条)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * 补全任务卡数据
   */
  private completeTaskCard(taskData: Partial<TaskCard>, taskLevel: TaskLevel): TaskCard {
    const now = new Date().toISOString().split('T')[0];
    
    return {
      // 基本信息
      taskId: taskData.taskId || this.generateTaskId(taskLevel),
      taskTitle: taskData.taskTitle || '',
      taskType: taskLevel,
      priority: taskData.priority || this.config.defaultSettings.priority,
      estimation: taskData.estimation || 8,
      assignee: taskData.assignee || '',
      createdDate: now,
      dueDate: taskData.dueDate,

      // 业务上下文
      businessGoal: taskData.businessGoal || '',
      userValue: taskData.userValue || '',
      businessRules: taskData.businessRules || [],
      acceptanceCriteria: taskData.acceptanceCriteria || [],

      // 技术规格
      functionalDescription: taskData.functionalDescription || '',
      technicalRequirements: taskData.technicalRequirements || [],
      interfaceDefinition: taskData.interfaceDefinition,
      dataModel: taskData.dataModel,
      constraints: taskData.constraints || [],

      // 实现指导
      implementationApproach: taskData.implementationApproach,
      codeExamples: taskData.codeExamples || [],
      bestPractices: taskData.bestPractices || this.getDefaultBestPractices(taskLevel),
      considerations: taskData.considerations || [],

      // 相关文件
      relatedFiles: taskData.relatedFiles || [],

      // 质量保障
      testStrategy: taskData.testStrategy || this.getDefaultTestStrategy(taskLevel),
      validationChecklist: taskData.validationChecklist || this.getDefaultValidationChecklist(taskLevel),
      riskAssessment: taskData.riskAssessment,
      rollbackPlan: taskData.rollbackPlan,

      // 自定义字段
      customFields: taskData.customFields
    };
  }

  /**
   * 加载模板
   */
  private async loadTemplate(level: TaskLevel): Promise<string> {
    const templateKey = `level-${level}`;
    
    if (this.templateCache.has(templateKey)) {
      return this.templateCache.get(templateKey)!;
    }

    const templatePath = path.join(
      process.cwd(),
      '模板/任务卡',
      `level-${level}-${this.getLevelName(level)}.md`
    );

    try {
      const template = await fs.readFile(templatePath, 'utf-8');
      this.templateCache.set(templateKey, template);
      return template;
    } catch (error) {
      throw new Error(`无法加载模板文件: ${templatePath}`);
    }
  }

  /**
   * 渲染模板
   */
  private renderTemplate(template: string, taskCard: TaskCard): string {
    // 准备模板数据
    const templateData = {
      ...taskCard,
      // 格式化日期
      createdDateFormatted: new Date(taskCard.createdDate).toLocaleDateString('zh-CN'),
      dueDateFormatted: taskCard.dueDate ? new Date(taskCard.dueDate).toLocaleDateString('zh-CN') : '',
      
      // 格式化列表
      businessRulesList: taskCard.businessRules.map(rule => `- ${rule}`).join('\n'),
      acceptanceCriteriaList: taskCard.acceptanceCriteria.map(criteria => `- ${criteria}`).join('\n'),
      constraintsList: taskCard.constraints.map(constraint => `- ${constraint}`).join('\n'),
      bestPracticesList: taskCard.bestPractices.map(practice => `- ${practice}`).join('\n'),
      considerationsList: taskCard.considerations.map(consideration => `- ${consideration}`).join('\n'),
      validationChecklistList: taskCard.validationChecklist.map(item => `- [ ] ${item}`).join('\n'),
      
      // 技术要求表格
      technicalRequirementsTable: this.formatTechnicalRequirements(taskCard.technicalRequirements),
      
      // 相关文件表格
      relatedFilesTable: this.formatRelatedFiles(taskCard.relatedFiles),
      
      // 风险评估表格
      riskAssessmentTable: taskCard.riskAssessment ? this.formatRiskAssessment(taskCard.riskAssessment) : '',
      
      // 级别信息
      levelName: this.getLevelName(taskCard.taskType),
      levelDescription: this.getLevelDescription(taskCard.taskType)
    };

    return mustache.render(template, templateData);
  }

  /**
   * 生成任务ID
   */
  private generateTaskId(level: TaskLevel): string {
    const timestamp = Date.now().toString().slice(-6);
    return `${this.config.projectPrefix}-L${level}-TASK-${timestamp}`;
  }

  /**
   * 生成文件名
   */
  private generateFileName(taskCard: TaskCard): string {
    const levelPrefix = `L${taskCard.taskType}`;
    const modulePrefix = this.extractModuleFromTaskId(taskCard.taskId);
    const titleSlug = this.slugify(taskCard.taskTitle);
    
    return `${levelPrefix}-${modulePrefix}-${titleSlug}.md`;
  }

  /**
   * 提取模块名称
   */
  private extractModuleFromTaskId(taskId: string): string {
    const parts = taskId.split('-');
    return parts.length >= 3 ? parts[2].toLowerCase() : 'general';
  }

  /**
   * 生成URL友好的字符串
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[\u4e00-\u9fff]/g, match => {
        // 中文字符转拼音或保留
        return match;
      })
      .replace(/[^\w\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50);
  }

  /**
   * 获取级别名称
   */
  private getLevelName(level: TaskLevel): string {
    const names = {
      1: '标准化实现',
      2: '集成协调',
      3: '架构设计',
      4: '创新探索'
    };
    return names[level];
  }

  /**
   * 获取级别描述
   */
  private getLevelDescription(level: TaskLevel): string {
    const descriptions = {
      1: 'AI主导的标准化实现任务',
      2: '人机协作的集成协调任务',
      3: '人类主导的架构设计任务',
      4: '人类主导的创新探索任务'
    };
    return descriptions[level];
  }

  /**
   * 获取默认最佳实践
   */
  private getDefaultBestPractices(level: TaskLevel): string[] {
    const practices = {
      1: [
        '遵循代码规范和团队约定',
        '编写清晰的注释和文档',
        '进行充分的单元测试',
        '使用类型检查提高代码质量'
      ],
      2: [
        '确保接口设计的一致性',
        '处理异常情况和边界条件',
        '实现适当的错误处理和日志记录',
        '考虑性能和用户体验'
      ],
      3: [
        '进行全面的架构分析',
        '考虑系统的可扩展性和维护性',
        '评估技术选型的合理性',
        '制定详细的实施计划'
      ],
      4: [
        '进行充分的研究和调研',
        '构建概念验证和原型',
        '评估技术可行性和风险',
        '准备备选方案'
      ]
    };
    return practices[level] || [];
  }

  /**
   * 获取默认测试策略
   */
  private getDefaultTestStrategy(level: TaskLevel): string {
    const strategies = {
      1: '单元测试覆盖主要功能，集成测试验证接口正确性',
      2: '集成测试验证系统间交互，端到端测试确保用户流程',
      3: '性能测试验证架构设计，压力测试验证系统容量',
      4: '概念验证测试，用户反馈测试，A/B测试验证效果'
    };
    return strategies[level] || '根据任务特性制定合适的测试策略';
  }

  /**
   * 获取默认验证清单
   */
  private getDefaultValidationChecklist(level: TaskLevel): string[] {
    const checklists = {
      1: [
        '代码通过所有单元测试',
        '代码符合团队规范',
        '功能满足需求规格',
        '完成代码审查'
      ],
      2: [
        '集成测试通过',
        '用户流程验证完成',
        '性能指标达标',
        '错误处理验证'
      ],
      3: [
        '架构设计文档完整',
        '技术选型得到确认',
        '实施计划可行',
        '风险评估完成'
      ],
      4: [
        '概念验证成功',
        '技术可行性确认',
        '用户反馈积极',
        '商业价值明确'
      ]
    };
    return checklists[level] || [];
  }

  /**
   * 格式化技术要求表格
   */
  private formatTechnicalRequirements(requirements: any[]): string {
    if (!requirements || requirements.length === 0) {
      return '| 类别 | 描述 | 必需 |\n|------|------|------|\n| - | 暂无技术要求 | - |';
    }

    const header = '| 类别 | 描述 | 必需 |\n|------|------|------|';
    const rows = requirements.map(req => 
      `| ${req.category} | ${req.description} | ${req.required ? '✅' : '❌'} |`
    ).join('\n');

    return `${header}\n${rows}`;
  }

  /**
   * 格式化相关文件表格
   */
  private formatRelatedFiles(files: any[]): string {
    if (!files || files.length === 0) {
      return '| 文件路径 | 描述 | 操作 |\n|----------|------|------|\n| - | 暂无相关文件 | - |';
    }

    const header = '| 文件路径 | 描述 | 操作 |\n|----------|------|------|';
    const rows = files.map(file => 
      `| \`${file.path}\` | ${file.description} | ${this.getActionIcon(file.action)} ${file.action} |`
    ).join('\n');

    return `${header}\n${rows}`;
  }

  /**
   * 格式化风险评估表格
   */
  private formatRiskAssessment(risks: any[]): string {
    const header = '| 风险描述 | 影响程度 | 发生概率 | 缓解措施 |\n|----------|----------|----------|----------|';
    const rows = risks.map(risk => 
      `| ${risk.description} | ${this.getRiskIcon(risk.impact)} ${risk.impact} | ${this.getRiskIcon(risk.probability)} ${risk.probability} | ${risk.mitigation} |`
    ).join('\n');

    return `${header}\n${rows}`;
  }

  /**
   * 获取操作图标
   */
  private getActionIcon(action: string): string {
    const icons = {
      view: '👀',
      modify: '✏️',
      create: '📝'
    };
    return icons[action] || '📄';
  }

  /**
   * 获取风险级别图标
   */
  private getRiskIcon(level: string): string {
    const icons = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
    return icons[level] || '⚪';
  }

  /**
   * 验证输出质量
   */
  private validateOutput(taskCard: TaskCard): ValidationResult {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // 检查内容完整性
    if (!taskCard.userValue) {
      warnings.push('缺少用户价值描述');
    }

    if (taskCard.acceptanceCriteria.length === 0) {
      warnings.push('缺少验收标准');
    }

    if (taskCard.relatedFiles.length === 0) {
      suggestions.push('建议添加相关文件信息');
    }

    // 检查任务粒度
    if (taskCard.estimation > 32) {
      suggestions.push('任务工作量较大，建议拆分');
    }

    return {
      isValid: true,
      errors: [],
      warnings,
      suggestions
    };
  }
}