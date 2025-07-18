import { TaskLevel, TaskClassification } from './types';

export class TaskClassifier {
  private readonly keywords = {
    level1: [
      // 标准化实现关键词
      '实现', '创建', '添加', '编写', '构建',
      'CRUD', '表单', '页面', '组件', '函数',
      '按钮', '输入', '显示', '列表', '详情',
      '保存', '删除', '更新', '查询', '验证',
      'implement', 'create', 'add', 'build', 'write',
      'form', 'page', 'component', 'function', 'button',
      'input', 'display', 'list', 'detail', 'save',
      'delete', 'update', 'query', 'validate'
    ],
    level2: [
      // 集成协调关键词
      '集成', '整合', '对接', '连接', '同步',
      '协调', '配合', '联动', '交互', '通信',
      '流程', '工作流', '状态管理', '数据流',
      '接口', 'API', '服务', '中间件',
      'integrate', 'connect', 'sync', 'coordinate',
      'workflow', 'state', 'dataflow', 'interface',
      'API', 'service', 'middleware', 'communication'
    ],
    level3: [
      // 架构设计关键词
      '架构', '设计', '规划', '方案', '策略',
      '选型', '决策', '评估', '分析', '优化',
      '性能', '扩展', '重构', '升级', '迁移',
      '安全', '可靠性', '可维护性', '可扩展性',
      'architecture', 'design', 'plan', 'strategy',
      'selection', 'decision', 'evaluation', 'analysis',
      'optimization', 'performance', 'scalability',
      'refactor', 'upgrade', 'migration', 'security'
    ],
    level4: [
      // 创新探索关键词
      '创新', '探索', '研究', '验证', '实验',
      '概念', '原型', '试验', '调研', '分析',
      '可行性', '评估', '发现', '突破', '革新',
      '新技术', '新方法', '新模式', '前沿',
      'innovation', 'explore', 'research', 'experiment',
      'prototype', 'feasibility', 'breakthrough',
      'cutting-edge', 'novel', 'pioneering'
    ]
  };

  private readonly complexityIndicators = {
    simple: [
      '简单', '基础', '基本', '标准', '常规',
      'simple', 'basic', 'standard', 'regular', 'common'
    ],
    medium: [
      '中等', '一般', '适中', '常见', '典型',
      'medium', 'moderate', 'typical', 'average'
    ],
    complex: [
      '复杂', '困难', '高级', '深入', '综合',
      'complex', 'difficult', 'advanced', 'comprehensive'
    ],
    innovation: [
      '创新', '前沿', '突破', '革命性', '开创性',
      'innovative', 'cutting-edge', 'breakthrough', 'revolutionary'
    ]
  };

  classifyTask(description: string): TaskClassification {
    const text = description.toLowerCase();
    const scores = this.calculateScores(text);
    const complexity = this.assessComplexity(text);
    
    // 确定推荐级别
    const level = this.determineLevel(scores, complexity);
    
    // 计算置信度
    const confidence = this.calculateConfidence(scores, level);
    
    // 生成推理过程
    const reasoning = this.generateReasoning(scores, complexity, level);

    return {
      level,
      confidence,
      reasoning
    };
  }

  private calculateScores(text: string): Record<string, number> {
    const scores: Record<string, number> = {
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0
    };

    // 计算每个级别的关键词匹配得分
    Object.entries(this.keywords).forEach(([level, keywords]) => {
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          scores[level] += matches.length;
        }
      });
    });

    // 归一化得分
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore > 0) {
      Object.keys(scores).forEach(level => {
        scores[level] = scores[level] / maxScore;
      });
    }

    return scores;
  }

  private assessComplexity(text: string): string {
    const complexityScores = {
      simple: 0,
      medium: 0,
      complex: 0,
      innovation: 0
    };

    Object.entries(this.complexityIndicators).forEach(([complexity, indicators]) => {
      indicators.forEach(indicator => {
        if (text.includes(indicator)) {
          complexityScores[complexity]++;
        }
      });
    });

    // 返回得分最高的复杂度级别
    return Object.entries(complexityScores)
      .sort(([,a], [,b]) => b - a)[0][0];
  }

  private determineLevel(scores: Record<string, number>, complexity: string): TaskLevel {
    // 根据关键词得分确定基础级别
    const sortedLevels = Object.entries(scores)
      .sort(([,a], [,b]) => b - a);
    
    let baseLevel = parseInt(sortedLevels[0][0].replace('level', '')) as TaskLevel;

    // 根据复杂度调整级别
    switch (complexity) {
      case 'simple':
        baseLevel = Math.max(1, baseLevel - 1) as TaskLevel;
        break;
      case 'complex':
        baseLevel = Math.min(4, baseLevel + 1) as TaskLevel;
        break;
      case 'innovation':
        baseLevel = 4;
        break;
    }

    return baseLevel;
  }

  private calculateConfidence(scores: Record<string, number>, level: TaskLevel): number {
    const levelKey = `level${level}`;
    const maxScore = Math.max(...Object.values(scores));
    const levelScore = scores[levelKey];
    
    // 基础置信度基于该级别的得分
    let confidence = levelScore;
    
    // 如果最高得分就是推荐级别，增加置信度
    if (levelScore === maxScore && maxScore > 0) {
      confidence += 0.2;
    }
    
    // 如果多个级别得分相近，降低置信度
    const topScores = Object.values(scores).sort((a, b) => b - a);
    if (topScores[0] - topScores[1] < 0.2) {
      confidence -= 0.15;
    }
    
    return Math.min(1, Math.max(0, confidence));
  }

  private generateReasoning(
    scores: Record<string, number>, 
    complexity: string, 
    level: TaskLevel
  ): string[] {
    const reasoning: string[] = [];
    
    // 分析关键词匹配
    const sortedLevels = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .filter(([,score]) => score > 0);
    
    if (sortedLevels.length > 0) {
      const topLevel = sortedLevels[0][0];
      reasoning.push(`任务描述中包含较多${this.getLevelName(topLevel)}相关的关键词`);
    }
    
    // 分析复杂度
    switch (complexity) {
      case 'simple':
        reasoning.push('任务复杂度较低，适合标准化实现');
        break;
      case 'complex':
        reasoning.push('任务复杂度较高，需要架构设计或深度思考');
        break;
      case 'innovation':
        reasoning.push('任务涉及创新探索，需要实验性方法');
        break;
      default:
        reasoning.push('任务复杂度适中');
    }
    
    // 解释推荐级别
    reasoning.push(this.getLevelDescription(level));
    
    return reasoning;
  }

  private getLevelName(levelKey: string): string {
    const names = {
      level1: 'Level 1 标准化实现',
      level2: 'Level 2 集成协调',
      level3: 'Level 3 架构设计',
      level4: 'Level 4 创新探索'
    };
    return names[levelKey] || '未知级别';
  }

  private getLevelDescription(level: TaskLevel): string {
    const descriptions = {
      1: '推荐使用Level 1，适合AI主导的标准化实现任务',
      2: '推荐使用Level 2，需要人机协作的集成协调任务',
      3: '推荐使用Level 3，需要人类主导的架构设计任务',
      4: '推荐使用Level 4，需要人类主导的创新探索任务'
    };
    return descriptions[level] || '级别描述未找到';
  }
}