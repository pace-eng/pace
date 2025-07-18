#!/usr/bin/env node

import * as inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as chalk from 'chalk';
import * as figlet from 'figlet';
import { Command } from 'commander';
import { TaskCardGenerator } from './generator';
import { TaskClassifier } from './classifier';
import { TaskCard, TaskLevel, Priority, GeneratorConfig, GeneratorOptions } from './types';

class TaskCardCLI {
  private generator: TaskCardGenerator;
  private classifier: TaskClassifier;
  private config: GeneratorConfig;

  constructor() {
    this.loadConfig();
    this.generator = new TaskCardGenerator(this.config);
    this.classifier = new TaskClassifier();
  }

  /**
   * 主入口函数
   */
  async run(): Promise<void> {
    this.showWelcome();
    
    const action = await this.selectAction();
    
    switch (action) {
      case 'create':
        await this.createTaskCard();
        break;
      case 'batch':
        await this.batchCreateTaskCards();
        break;
      case 'config':
        await this.configureSettings();
        break;
      case 'templates':
        await this.manageTemplates();
        break;
      case 'exit':
        console.log(chalk.cyan('感谢使用PACE任务卡生成器！'));
        process.exit(0);
    }
  }

  /**
   * 显示欢迎信息
   */
  private showWelcome(): void {
    console.clear();
    console.log(chalk.cyan(figlet.textSync('PACE', {
      font: 'Small',
      horizontalLayout: 'default'
    })));
    console.log(chalk.cyan('任务卡生成器 v1.0.0'));
    console.log(chalk.gray('基于PACE 1.0方法论的智能任务卡生成工具\n'));
  }

  /**
   * 选择操作
   */
  private async selectAction(): Promise<string> {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '请选择要执行的操作:',
        choices: [
          { name: '🎯 创建新任务卡', value: 'create' },
          { name: '📋 批量创建任务卡', value: 'batch' },
          { name: '⚙️ 配置设置', value: 'config' },
          { name: '📝 管理模板', value: 'templates' },
          { name: '🚪 退出', value: 'exit' }
        ]
      }
    ]);

    return action;
  }

  /**
   * 创建单个任务卡
   */
  private async createTaskCard(): Promise<void> {
    console.log(chalk.yellow('\n🎯 创建新任务卡\n'));

    // 步骤1: 基本信息收集
    const basicInfo = await this.collectBasicInfo();
    
    // 步骤2: 智能分级
    const classification = await this.classifyTask(basicInfo.functionalDescription);
    
    // 步骤3: 确认级别
    const confirmedLevel = await this.confirmTaskLevel(classification);
    
    // 步骤4: 收集详细信息
    const detailedInfo = await this.collectDetailedInfo(confirmedLevel);
    
    // 步骤5: 合并信息
    const taskData = { ...basicInfo, ...detailedInfo, taskType: confirmedLevel };
    
    // 步骤6: 生成任务卡
    try {
      const result = await this.generator.generateTaskCard(taskData, {
        validateOutput: true,
        autoClassify: false
      });
      
      this.showGenerationResult(result);
      
      // 询问是否继续
      const { continueCreating } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueCreating',
          message: '是否要继续创建其他任务卡?',
          default: false
        }
      ]);
      
      if (continueCreating) {
        await this.createTaskCard();
      } else {
        await this.run();
      }
      
    } catch (error) {
      console.error(chalk.red('❌ 生成失败:', error.message));
      await this.run();
    }
  }

  /**
   * 收集基本信息
   */
  private async collectBasicInfo(): Promise<Partial<TaskCard>> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'taskTitle',
        message: '任务标题:',
        validate: (input: string) => input.trim() ? true : '请输入任务标题'
      },
      {
        type: 'editor',
        name: 'functionalDescription',
        message: '任务描述 (详细描述任务的功能和需求):',
        validate: (input: string) => input.trim() ? true : '请输入任务描述'
      },
      {
        type: 'editor',
        name: 'businessGoal',
        message: '业务目标 (此任务要达成的业务价值):',
        validate: (input: string) => input.trim() ? true : '请输入业务目标'
      },
      {
        type: 'editor',
        name: 'userValue',
        message: '用户价值 (此任务为用户带来的价值):',
        default: ''
      },
      {
        type: 'list',
        name: 'priority',
        message: '优先级:',
        choices: [
          { name: 'P0 - 最高优先级 (阻塞性)', value: 'P0' },
          { name: 'P1 - 高优先级 (重要功能)', value: 'P1' },
          { name: 'P2 - 中等优先级 (一般功能)', value: 'P2' },
          { name: 'P3 - 低优先级 (增强功能)', value: 'P3' }
        ],
        default: 'P1'
      },
      {
        type: 'number',
        name: 'estimation',
        message: '预估工作量 (小时):',
        default: 8,
        validate: (input: number) => input > 0 ? true : '工作量必须大于0'
      },
      {
        type: 'list',
        name: 'assignee',
        message: '负责人:',
        choices: [
          ...this.config.teamMembers,
          { name: '其他 (手动输入)', value: 'other' }
        ]
      }
    ]);

    // 如果选择了"其他"，需要手动输入负责人
    if (answers.assignee === 'other') {
      const { customAssignee } = await inquirer.prompt([
        {
          type: 'input',
          name: 'customAssignee',
          message: '请输入负责人姓名:',
          validate: (input: string) => input.trim() ? true : '请输入负责人姓名'
        }
      ]);
      answers.assignee = customAssignee;
    }

    return answers;
  }

  /**
   * 任务分类
   */
  private async classifyTask(description: string): Promise<any> {
    console.log(chalk.yellow('\n🤖 正在进行智能分级分析...\n'));
    
    const classification = this.classifier.classifyTask(description);
    
    console.log(chalk.green('分析结果:'));
    console.log(`推荐级别: ${chalk.bold(`Level ${classification.level}`)}`);
    console.log(`置信度: ${chalk.bold(`${Math.round(classification.confidence * 100)}%`)}`);
    console.log('\n推理过程:');
    classification.reasoning.forEach((reason, index) => {
      console.log(chalk.gray(`  ${index + 1}. ${reason}`));
    });
    console.log();
    
    return classification;
  }

  /**
   * 确认任务级别
   */
  private async confirmTaskLevel(classification: any): Promise<TaskLevel> {
    const { levelChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'levelChoice',
        message: '请选择任务级别:',
        choices: [
          {
            name: `✅ 确认使用 Level ${classification.level} (推荐)`,
            value: classification.level
          },
          { name: 'Level 1 - 标准化实现 (AI主导)', value: 1 },
          { name: 'Level 2 - 集成协调 (人机协作)', value: 2 },
          { name: 'Level 3 - 架构设计 (人类主导)', value: 3 },
          { name: 'Level 4 - 创新探索 (人类主导)', value: 4 },
          { name: '❓ 查看级别说明', value: 'help' }
        ]
      }
    ]);

    if (levelChoice === 'help') {
      this.showLevelHelp();
      return await this.confirmTaskLevel(classification);
    }

    return levelChoice as TaskLevel;
  }

  /**
   * 收集详细信息
   */
  private async collectDetailedInfo(level: TaskLevel): Promise<Partial<TaskCard>> {
    console.log(chalk.yellow(`\n📋 收集 Level ${level} 任务的详细信息\n`));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'taskId',
        message: '任务ID (留空将自动生成):',
        default: '',
        validate: (input: string) => {
          if (!input.trim()) return true;
          return /^[A-Z]+-L[1-4]-[A-Z0-9]+-\d+$/.test(input) || 
                 '任务ID格式: 项目前缀-L级别-模块-序号 (如: PROJ-L2-AUTH-001)';
        }
      },
      {
        type: 'editor',
        name: 'acceptanceCriteria',
        message: '验收标准 (一行一个标准):',
        filter: (input: string) => input.trim().split('\n').filter(line => line.trim())
      },
      {
        type: 'editor',
        name: 'businessRules',
        message: '业务规则 (一行一个规则, 可选):',
        filter: (input: string) => input.trim() ? input.split('\n').filter(line => line.trim()) : []
      },
      {
        type: 'editor',
        name: 'constraints',
        message: '技术约束 (一行一个约束, 可选):',
        filter: (input: string) => input.trim() ? input.split('\n').filter(line => line.trim()) : []
      },
      {
        type: 'editor',
        name: 'relatedFilesInput',
        message: '相关文件 (格式: 文件路径:描述:操作, 一行一个, 可选):',
        filter: (input: string) => {
          if (!input.trim()) return [];
          return input.split('\n')
            .filter(line => line.trim())
            .map(line => {
              const parts = line.split(':');
              return {
                path: parts[0]?.trim() || '',
                description: parts[1]?.trim() || '',
                action: parts[2]?.trim() || 'modify'
              };
            });
        }
      }
    ]);

    // 根据级别收集特定信息
    const levelSpecificInfo = await this.collectLevelSpecificInfo(level);

    return {
      ...answers,
      relatedFiles: answers.relatedFilesInput,
      ...levelSpecificInfo
    };
  }

  /**
   * 收集级别特定信息
   */
  private async collectLevelSpecificInfo(level: TaskLevel): Promise<Partial<TaskCard>> {
    const questions: any[] = [];

    if (level >= 2) {
      questions.push({
        type: 'editor',
        name: 'interfaceDefinition',
        message: '接口定义 (API、函数签名等, 可选):',
        default: ''
      });
    }

    if (level >= 3) {
      questions.push({
        type: 'editor',
        name: 'implementationApproach',
        message: '实现方案 (架构思路、技术选型等):',
        default: ''
      });
    }

    if (level === 4) {
      questions.push({
        type: 'editor',
        name: 'riskAssessmentInput',
        message: '风险评估 (格式: 描述:影响:概率:缓解措施, 一行一个, 可选):',
        filter: (input: string) => {
          if (!input.trim()) return [];
          return input.split('\n')
            .filter(line => line.trim())
            .map(line => {
              const parts = line.split(':');
              return {
                description: parts[0]?.trim() || '',
                impact: parts[1]?.trim() || 'medium',
                probability: parts[2]?.trim() || 'medium',
                mitigation: parts[3]?.trim() || ''
              };
            });
        }
      });
    }

    if (questions.length === 0) {
      return {};
    }

    const answers = await inquirer.prompt(questions);
    
    return {
      ...answers,
      riskAssessment: answers.riskAssessmentInput
    };
  }

  /**
   * 显示级别说明
   */
  private showLevelHelp(): void {
    console.log(chalk.yellow('\n📚 PACE任务级别说明:\n'));
    
    const levels = [
      {
        level: 'Level 1',
        name: '标准化实现',
        description: 'AI主导的标准化功能实现',
        examples: '组件开发、CRUD操作、表单处理、页面布局',
        workflow: 'AI负责编码实现，人类负责需求确认和质量检查'
      },
      {
        level: 'Level 2', 
        name: '集成协调',
        description: '人机协作的系统集成任务',
        examples: '服务对接、数据同步、工作流集成、状态管理',
        workflow: '人类设计集成方案，AI协助实现，共同调试'
      },
      {
        level: 'Level 3',
        name: '架构设计',
        description: '人类主导的架构决策任务',
        examples: '系统架构、技术选型、性能优化、重构规划',
        workflow: '人类负责分析设计，AI协助验证和实现细节'
      },
      {
        level: 'Level 4',
        name: '创新探索',
        description: '人类主导的创新研究任务',
        examples: '新技术调研、概念验证、用户研究、商业创新',
        workflow: '人类负责创新思考，AI协助信息收集和原型开发'
      }
    ];

    levels.forEach(level => {
      console.log(chalk.bold(chalk.blue(`${level.level} - ${level.name}`)));
      console.log(chalk.gray(`   ${level.description}`));
      console.log(chalk.gray(`   示例: ${level.examples}`));
      console.log(chalk.gray(`   协作: ${level.workflow}\n`));
    });
  }

  /**
   * 显示生成结果
   */
  private showGenerationResult(result: { filePath: string; taskCard: TaskCard }): void {
    console.log(chalk.green('\n✅ 任务卡生成成功!\n'));
    
    console.log(chalk.bold('📋 任务卡摘要:'));
    console.log(`   任务ID: ${chalk.cyan(result.taskCard.taskId)}`);
    console.log(`   标题: ${chalk.cyan(result.taskCard.taskTitle)}`);
    console.log(`   级别: ${chalk.cyan(`Level ${result.taskCard.taskType}`)}`);
    console.log(`   优先级: ${chalk.cyan(result.taskCard.priority)}`);
    console.log(`   工作量: ${chalk.cyan(`${result.taskCard.estimation}小时`)}`);
    console.log(`   负责人: ${chalk.cyan(result.taskCard.assignee)}`);
    console.log(`   文件位置: ${chalk.green(result.filePath)}\n`);
  }

  /**
   * 批量创建任务卡
   */
  private async batchCreateTaskCards(): Promise<void> {
    console.log(chalk.yellow('\n📋 批量创建任务卡\n'));
    
    const { filePath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePath',
        message: '请输入包含任务列表的JSON文件路径:',
        validate: async (input: string) => {
          try {
            await fs.access(input);
            return true;
          } catch {
            return '文件不存在，请检查路径';
          }
        }
      }
    ]);

    try {
      const taskList = await fs.readJson(filePath);
      
      console.log(chalk.yellow(`\n🔄 开始批量生成 ${taskList.length} 个任务卡...\n`));
      
      const results = await this.generator.generateBatch(taskList, {
        validateOutput: true,
        autoClassify: true
      });
      
      console.log(chalk.green(`\n✅ 批量生成完成! 共生成 ${results.length} 个任务卡\n`));
      
    } catch (error) {
      console.error(chalk.red('❌ 批量生成失败:', error.message));
    }
    
    await this.run();
  }

  /**
   * 配置设置
   */
  private async configureSettings(): Promise<void> {
    console.log(chalk.yellow('\n⚙️ 配置设置\n'));
    
    const currentConfig = this.config;
    
    const newConfig = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: '项目名称:',
        default: currentConfig.projectName
      },
      {
        type: 'input',
        name: 'projectPrefix',
        message: '项目前缀:',
        default: currentConfig.projectPrefix
      },
      {
        type: 'input',
        name: 'outputDir',
        message: '输出目录:',
        default: currentConfig.outputDir
      },
      {
        type: 'checkbox',
        name: 'teamMembers',
        message: '团队成员 (可多选):',
        choices: currentConfig.teamMembers.map(member => ({
          name: member,
          value: member,
          checked: true
        }))
      }
    ]);

    // 保存配置
    await this.saveConfig({ ...currentConfig, ...newConfig });
    
    console.log(chalk.green('\n✅ 配置已保存\n'));
    await this.run();
  }

  /**
   * 管理模板
   */
  private async manageTemplates(): Promise<void> {
    console.log(chalk.yellow('\n📝 管理模板\n'));
    
    const { templateAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'templateAction',
        message: '请选择模板操作:',
        choices: [
          { name: '📋 查看模板列表', value: 'list' },
          { name: '📄 查看模板内容', value: 'view' },
          { name: '✏️ 编辑模板', value: 'edit' },
          { name: '🔄 重置模板', value: 'reset' },
          { name: '⬅️ 返回主菜单', value: 'back' }
        ]
      }
    ]);

    switch (templateAction) {
      case 'list':
        await this.listTemplates();
        break;
      case 'view':
        await this.viewTemplate();
        break;
      case 'edit':
        await this.editTemplate();
        break;
      case 'reset':
        await this.resetTemplates();
        break;
      case 'back':
        await this.run();
        return;
    }
    
    await this.manageTemplates();
  }

  /**
   * 列出模板
   */
  private async listTemplates(): Promise<void> {
    console.log(chalk.blue('\n📋 可用模板列表:\n'));
    
    for (let level = 1; level <= 4; level++) {
      const templatePath = path.join(process.cwd(), '模板/任务卡', `level-${level}-*.md`);
      console.log(`  Level ${level}: ${templatePath}`);
    }
    console.log();
  }

  /**
   * 查看模板
   */
  private async viewTemplate(): Promise<void> {
    const { level } = await inquirer.prompt([
      {
        type: 'list',
        name: 'level',
        message: '选择要查看的模板:',
        choices: [
          { name: 'Level 1 - 标准化实现', value: 1 },
          { name: 'Level 2 - 集成协调', value: 2 },
          { name: 'Level 3 - 架构设计', value: 3 },
          { name: 'Level 4 - 创新探索', value: 4 }
        ]
      }
    ]);

    try {
      const templatePath = path.join(
        process.cwd(),
        '模板/任务卡',
        `level-${level}-${this.getLevelName(level)}.md`
      );
      
      const content = await fs.readFile(templatePath, 'utf-8');
      console.log(chalk.gray('\n模板内容:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(content);
      console.log(chalk.gray('─'.repeat(50) + '\n'));
      
    } catch (error) {
      console.error(chalk.red('❌ 无法读取模板文件:', error.message));
    }
  }

  /**
   * 编辑模板
   */
  private async editTemplate(): Promise<void> {
    console.log(chalk.yellow('模板编辑功能需要在外部编辑器中进行'));
    console.log(chalk.gray('模板文件位置: 模板/任务卡/'));
  }

  /**
   * 重置模板
   */
  private async resetTemplates(): Promise<void> {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: '确定要重置所有模板到默认状态吗? (此操作不可撤销)',
        default: false
      }
    ]);

    if (confirm) {
      console.log(chalk.yellow('模板重置功能需要管理员权限'));
    }
  }

  /**
   * 加载配置
   */
  private loadConfig(): void {
    const configPath = path.join(process.cwd(), 'pace.config.json');
    
    try {
      this.config = fs.readJsonSync(configPath);
    } catch {
      // 使用默认配置
      this.config = {
        projectName: 'PACE项目',
        projectPrefix: 'PACE',
        outputDir: 'specs',
        templateDir: '模板/任务卡',
        teamMembers: ['张三', '李四', '王五'],
        defaultSettings: {
          priority: 'P1' as Priority,
          estimationUnit: 'hours' as const
        }
      };
    }
  }

  /**
   * 保存配置
   */
  private async saveConfig(config: GeneratorConfig): Promise<void> {
    const configPath = path.join(process.cwd(), 'pace.config.json');
    await fs.writeJson(configPath, config, { spaces: 2 });
    this.config = config;
    this.generator = new TaskCardGenerator(config);
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
}

// 命令行参数处理
const program = new Command();

program
  .name('pace-generator')
  .description('PACE 1.0任务卡生成器')
  .version('1.0.0');

program
  .command('interactive')
  .alias('i')
  .description('启动交互式界面')
  .action(async () => {
    const cli = new TaskCardCLI();
    await cli.run();
  });

program
  .command('create')
  .description('直接创建任务卡')
  .option('-t, --title <title>', '任务标题')
  .option('-d, --description <description>', '任务描述')
  .option('-l, --level <level>', '任务级别 (1-4)', '2')
  .option('-p, --priority <priority>', '优先级 (P0-P3)', 'P1')
  .option('-e, --estimation <hours>', '预估工作量 (小时)', '8')
  .option('-a, --assignee <assignee>', '负责人')
  .option('-o, --output <path>', '输出目录', 'specs')
  .action(async (options) => {
    const cli = new TaskCardCLI();
    // 实现命令行直接创建功能
    console.log('功能开发中...');
  });

program
  .command('batch')
  .description('批量创建任务卡')
  .argument('<file>', 'JSON任务列表文件')
  .option('-o, --output <path>', '输出目录', 'specs')
  .action(async (file, options) => {
    const cli = new TaskCardCLI();
    // 实现批量创建功能
    console.log('功能开发中...');
  });

// 默认启动交互式界面
if (process.argv.length === 2) {
  process.argv.push('interactive');
}

program.parse();