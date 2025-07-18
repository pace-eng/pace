export interface TaskCard {
  // 任务标识
  taskId: string;
  taskTitle: string;
  taskType: TaskLevel;
  priority: Priority;
  estimation: number;
  assignee: string;
  createdDate: string;
  dueDate?: string;

  // 业务上下文
  businessGoal: string;
  userValue: string;
  businessRules: string[];
  acceptanceCriteria: string[];

  // 技术规格
  functionalDescription: string;
  technicalRequirements: TechnicalRequirement[];
  interfaceDefinition?: string;
  dataModel?: string;
  constraints: string[];

  // 实现指导
  implementationApproach?: string;
  codeExamples?: string[];
  bestPractices: string[];
  considerations: string[];

  // 相关文件
  relatedFiles: RelatedFile[];

  // 质量保障
  testStrategy: string;
  validationChecklist: string[];
  riskAssessment?: RiskItem[];
  rollbackPlan?: string;

  // 自定义字段
  customFields?: Record<string, any>;
}

export type TaskLevel = 1 | 2 | 3 | 4;

export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

export interface TechnicalRequirement {
  category: string;
  description: string;
  required: boolean;
}

export interface RelatedFile {
  path: string;
  description: string;
  action: 'view' | 'modify' | 'create';
}

export interface RiskItem {
  description: string;
  impact: 'high' | 'medium' | 'low';
  probability: 'high' | 'medium' | 'low';
  mitigation: string;
}

export interface TaskClassification {
  level: TaskLevel;
  confidence: number;
  reasoning: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface GeneratorConfig {
  projectName: string;
  projectPrefix: string;
  outputDir: string;
  templateDir: string;
  teamMembers: string[];
  defaultSettings: {
    priority: Priority;
    estimationUnit: 'hours' | 'days';
  };
  customValidators?: string[];
}

export interface GeneratorOptions {
  interactive?: boolean;
  autoClassify?: boolean;
  validateOutput?: boolean;
  createPR?: boolean;
  autoCommit?: boolean;
}