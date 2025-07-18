/**
 * TaskFlow 类型定义
 * 
 * 这个文件展示了PACE方法论中的类型安全设计：
 * - Level 1任务：定义清晰的数据结构
 * - TypeScript最佳实践
 * - 完整的类型覆盖
 */

// 任务状态枚举
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';

// 任务优先级枚举
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// 任务分类
export type TaskCategory = 'work' | 'personal' | 'study' | 'health' | 'other';

// 排序字段
export type SortField = 'title' | 'createdAt' | 'updatedAt' | 'dueDate' | 'priority';

// 排序方向
export type SortOrder = 'asc' | 'desc';

/**
 * 核心任务接口
 * 包含任务的所有基本属性
 */
export interface Task {
  /** 唯一标识符 */
  id: string;
  
  /** 任务标题 */
  title: string;
  
  /** 任务详细描述 */
  description?: string;
  
  /** 任务当前状态 */
  status: TaskStatus;
  
  /** 任务优先级 */
  priority: TaskPriority;
  
  /** 任务分类 */
  category: TaskCategory;
  
  /** 截止日期 */
  dueDate?: Date;
  
  /** 完成日期 */
  completedAt?: Date;
  
  /** 创建时间 */
  createdAt: Date;
  
  /** 最后更新时间 */
  updatedAt: Date;
  
  /** 预估工作时间（分钟） */
  estimatedMinutes?: number;
  
  /** 实际工作时间（分钟） */
  actualMinutes?: number;
  
  /** 任务标签 */
  tags: string[];
  
  /** 附件URL列表 */
  attachments: string[];
  
  /** 任务备注 */
  notes?: string;
  
  /** 是否为重要任务 */
  isImportant: boolean;
  
  /** 是否为紧急任务 */
  isUrgent: boolean;
  
  /** 排序权重 */
  sortOrder: number;
}

/**
 * 创建任务时的输入类型
 * 排除自动生成的字段
 */
export type CreateTaskInput = Omit<
  Task,
  'id' | 'createdAt' | 'updatedAt' | 'completedAt'
> & {
  // 创建时的可选字段
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
  tags?: string[];
  attachments?: string[];
  isImportant?: boolean;
  isUrgent?: boolean;
  sortOrder?: number;
};

/**
 * 更新任务时的输入类型
 * 所有字段都是可选的，除了不可更改的字段
 */
export type UpdateTaskInput = Partial<
  Omit<Task, 'id' | 'createdAt'>
> & {
  // 更新时间会自动设置
  updatedAt?: never;
};

/**
 * 任务筛选器接口
 * 用于筛选和搜索任务
 */
export interface TaskFilters {
  /** 状态筛选 */
  status?: TaskStatus | TaskStatus[];
  
  /** 优先级筛选 */
  priority?: TaskPriority | TaskPriority[];
  
  /** 分类筛选 */
  category?: TaskCategory | TaskCategory[];
  
  /** 标签筛选 */
  tags?: string[];
  
  /** 搜索关键词 */
  search?: string;
  
  /** 截止日期筛选 */
  dueDateRange?: {
    start?: Date;
    end?: Date;
  };
  
  /** 创建日期筛选 */
  createdDateRange?: {
    start?: Date;
    end?: Date;
  };
  
  /** 是否只显示重要任务 */
  importantOnly?: boolean;
  
  /** 是否只显示紧急任务 */
  urgentOnly?: boolean;
  
  /** 排序字段 */
  sortBy?: SortField;
  
  /** 排序方向 */
  sortOrder?: SortOrder;
  
  /** 分页信息 */
  limit?: number;
  offset?: number;
}

/**
 * 任务统计信息接口
 */
export interface TaskStats {
  /** 总任务数 */
  total: number;
  
  /** 按状态分组的统计 */
  byStatus: Record<TaskStatus, number>;
  
  /** 按优先级分组的统计 */
  byPriority: Record<TaskPriority, number>;
  
  /** 按分类分组的统计 */
  byCategory: Record<TaskCategory, number>;
  
  /** 今日到期任务数 */
  dueToday: number;
  
  /** 逾期任务数 */
  overdue: number;
  
  /** 本周完成任务数 */
  completedThisWeek: number;
  
  /** 平均完成时间（分钟） */
  averageCompletionTime: number;
}

/**
 * 任务趋势数据接口
 */
export interface TaskTrend {
  /** 日期 */
  date: string;
  
  /** 创建的任务数 */
  created: number;
  
  /** 完成的任务数 */
  completed: number;
  
  /** 累计未完成任务数 */
  pending: number;
}

/**
 * 任务分组接口
 * 用于按不同维度对任务进行分组
 */
export interface TaskGroup {
  /** 分组键 */
  key: string;
  
  /** 分组标签 */
  label: string;
  
  /** 分组中的任务列表 */
  tasks: Task[];
  
  /** 分组任务数量 */
  count: number;
}

/**
 * 任务操作历史接口
 */
export interface TaskHistory {
  /** 历史记录ID */
  id: string;
  
  /** 关联的任务ID */
  taskId: string;
  
  /** 操作类型 */
  action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'completed';
  
  /** 操作时间 */
  timestamp: Date;
  
  /** 变更的字段 */
  changedFields?: string[];
  
  /** 变更前的值 */
  oldValues?: Record<string, any>;
  
  /** 变更后的值 */
  newValues?: Record<string, any>;
  
  /** 操作备注 */
  notes?: string;
}

/**
 * 任务模板接口
 * 用于快速创建相似的任务
 */
export interface TaskTemplate {
  /** 模板ID */
  id: string;
  
  /** 模板名称 */
  name: string;
  
  /** 模板描述 */
  description?: string;
  
  /** 模板分类 */
  category: TaskCategory;
  
  /** 任务数据模板 */
  template: Omit<CreateTaskInput, 'title'> & {
    titleTemplate?: string;
    descriptionTemplate?: string;
  };
  
  /** 创建时间 */
  createdAt: Date;
  
  /** 使用次数 */
  usageCount: number;
}

/**
 * AI建议接口
 */
export interface TaskSuggestion {
  /** 建议ID */
  id: string;
  
  /** 建议类型 */
  type: 'priority' | 'category' | 'due_date' | 'break_down' | 'merge';
  
  /** 目标任务ID */
  taskId: string;
  
  /** 建议标题 */
  title: string;
  
  /** 建议描述 */
  description: string;
  
  /** 建议的具体操作 */
  action: {
    type: string;
    data: Record<string, any>;
  };
  
  /** 置信度 (0-1) */
  confidence: number;
  
  /** 建议原因 */
  reasoning: string;
  
  /** 创建时间 */
  createdAt: Date;
  
  /** 是否已应用 */
  applied: boolean;
  
  /** 是否被拒绝 */
  rejected: boolean;
}

/**
 * 工作模式分析接口
 */
export interface WorkPattern {
  /** 分析时间范围 */
  dateRange: {
    start: Date;
    end: Date;
  };
  
  /** 生产力得分 (0-100) */
  productivityScore: number;
  
  /** 最高效时间段 */
  peakHours: number[];
  
  /** 平均任务完成时间 */
  averageTaskDuration: number;
  
  /** 任务完成率 */
  completionRate: number;
  
  /** 拖延指数 (0-1) */
  procrastinationIndex: number;
  
  /** 工作模式描述 */
  patterns: string[];
  
  /** 改进建议 */
  recommendations: string[];
}

/**
 * 导出/导入格式接口
 */
export interface TaskExport {
  /** 导出格式版本 */
  version: string;
  
  /** 导出时间 */
  exportedAt: Date;
  
  /** 任务数据 */
  tasks: Task[];
  
  /** 任务模板 */
  templates?: TaskTemplate[];
  
  /** 统计信息 */
  stats?: TaskStats;
}

/**
 * API响应包装接口
 */
export interface ApiResponse<T> {
  /** 响应数据 */
  data: T;
  
  /** 响应状态码 */
  status: number;
  
  /** 响应消息 */
  message: string;
  
  /** 是否成功 */
  success: boolean;
  
  /** 错误信息 */
  error?: string;
  
  /** 分页信息 */
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * 错误类型定义
 */
export interface TaskError {
  /** 错误代码 */
  code: string;
  
  /** 错误消息 */
  message: string;
  
  /** 错误详情 */
  details?: Record<string, any>;
  
  /** 错误时间 */
  timestamp: Date;
}