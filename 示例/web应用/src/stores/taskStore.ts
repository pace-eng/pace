/**
 * 任务状态管理Store
 * 
 * 这是一个Level 2任务的典型示例：
 * - 人机协作：人类设计状态架构，AI实现具体逻辑
 * - 使用Zustand进行状态管理
 * - 集成本地存储持久化
 * - 完整的类型安全
 * - 复杂的业务逻辑处理
 */

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskCategory,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  TaskStats,
  SortField,
  SortOrder,
} from '@/types/task';
import { generateId } from '@/utils/id';
import { isOverdue, calculateDaysBetween } from '@/utils/date';

/**
 * 任务存储状态接口
 */
interface TaskState {
  // 基础数据
  tasks: Task[];
  selectedTaskId: string | null;
  
  // UI状态
  filters: TaskFilters;
  searchQuery: string;
  viewMode: 'list' | 'board' | 'calendar';
  sortBy: SortField;
  sortOrder: SortOrder;
  
  // 加载状态
  loading: boolean;
  error: string | null;
  
  // 批量操作
  selectedTaskIds: Set<string>;
  bulkOperationInProgress: boolean;
}

/**
 * 任务存储操作接口
 */
interface TaskActions {
  // 任务CRUD操作
  addTask: (taskInput: CreateTaskInput) => Task;
  updateTask: (id: string, updates: UpdateTaskInput) => boolean;
  deleteTask: (id: string) => boolean;
  duplicateTask: (id: string) => Task | null;
  
  // 状态变更操作
  setTaskStatus: (id: string, status: TaskStatus) => boolean;
  toggleTaskCompletion: (id: string) => boolean;
  
  // 批量操作
  bulkUpdateTasks: (ids: string[], updates: UpdateTaskInput) => number;
  bulkDeleteTasks: (ids: string[]) => number;
  bulkSetStatus: (ids: string[], status: TaskStatus) => number;
  
  // 选择操作
  selectTask: (id: string | null) => void;
  toggleTaskSelection: (id: string) => void;
  selectAllTasks: () => void;
  clearTaskSelection: () => void;
  
  // 筛选和排序
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSearchQuery: (query: string) => void;
  setSorting: (sortBy: SortField, sortOrder?: SortOrder) => void;
  clearFilters: () => void;
  
  // 视图操作
  setViewMode: (mode: 'list' | 'board' | 'calendar') => void;
  
  // 数据查询
  getTask: (id: string) => Task | undefined;
  getFilteredTasks: () => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByCategory: (category: TaskCategory) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  getOverdueTasks: () => Task[];
  getDueTodayTasks: () => Task[];
  getTaskStats: () => TaskStats;
  
  // 工具方法
  reorderTasks: (taskId: string, newIndex: number) => void;
  archiveCompletedTasks: () => number;
  restoreTask: (id: string) => boolean;
  
  // 状态重置
  reset: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type TaskStore = TaskState & TaskActions;

/**
 * 默认筛选器配置
 */
const defaultFilters: TaskFilters = {
  status: undefined,
  priority: undefined,
  category: undefined,
  tags: [],
  search: '',
  dueDateRange: undefined,
  createdDateRange: undefined,
  importantOnly: false,
  urgentOnly: false,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  limit: 100,
  offset: 0,
};

/**
 * 创建任务存储
 * 使用多个中间件来增强功能：
 * - immer: 不可变状态更新
 * - persist: 本地存储持久化
 * - devtools: Redux DevTools支持
 * - subscribeWithSelector: 选择性订阅
 */
export const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // 初始状态
          tasks: [],
          selectedTaskId: null,
          filters: defaultFilters,
          searchQuery: '',
          viewMode: 'list',
          sortBy: 'createdAt',
          sortOrder: 'desc',
          loading: false,
          error: null,
          selectedTaskIds: new Set(),
          bulkOperationInProgress: false,

          // 任务CRUD操作
          addTask: (taskInput: CreateTaskInput) => {
            const newTask: Task = {
              id: generateId(),
              createdAt: new Date(),
              updatedAt: new Date(),
              status: 'todo',
              priority: 'medium',
              category: 'other',
              tags: [],
              attachments: [],
              isImportant: false,
              isUrgent: false,
              sortOrder: 0,
              ...taskInput,
            };

            set((state) => {
              state.tasks.unshift(newTask);
              state.error = null;
            });

            return newTask;
          },

          updateTask: (id: string, updates: UpdateTaskInput) => {
            let updated = false;
            
            set((state) => {
              const index = state.tasks.findIndex((task) => task.id === id);
              if (index !== -1) {
                const oldTask = state.tasks[index];
                
                // 处理状态变更的特殊逻辑
                if (updates.status && updates.status !== oldTask.status) {
                  if (updates.status === 'completed' && !updates.completedAt) {
                    updates.completedAt = new Date();
                  } else if (updates.status !== 'completed') {
                    updates.completedAt = undefined;
                  }
                }
                
                Object.assign(state.tasks[index], updates, {
                  updatedAt: new Date(),
                });
                
                updated = true;
                state.error = null;
              }
            });

            return updated;
          },

          deleteTask: (id: string) => {
            let deleted = false;
            
            set((state) => {
              const index = state.tasks.findIndex((task) => task.id === id);
              if (index !== -1) {
                state.tasks.splice(index, 1);
                
                // 清理选择状态
                if (state.selectedTaskId === id) {
                  state.selectedTaskId = null;
                }
                state.selectedTaskIds.delete(id);
                
                deleted = true;
                state.error = null;
              }
            });

            return deleted;
          },

          duplicateTask: (id: string) => {
            const originalTask = get().getTask(id);
            if (!originalTask) return null;

            const duplicatedTask = get().addTask({
              ...originalTask,
              title: `${originalTask.title} (副本)`,
              status: 'todo',
              completedAt: undefined,
            });

            return duplicatedTask;
          },

          // 状态变更操作
          setTaskStatus: (id: string, status: TaskStatus) => {
            return get().updateTask(id, { status });
          },

          toggleTaskCompletion: (id: string) => {
            const task = get().getTask(id);
            if (!task) return false;

            const newStatus = task.status === 'completed' ? 'todo' : 'completed';
            return get().setTaskStatus(id, newStatus);
          },

          // 批量操作
          bulkUpdateTasks: (ids: string[], updates: UpdateTaskInput) => {
            let updatedCount = 0;
            
            set((state) => {
              state.bulkOperationInProgress = true;
            });

            for (const id of ids) {
              if (get().updateTask(id, updates)) {
                updatedCount++;
              }
            }

            set((state) => {
              state.bulkOperationInProgress = false;
            });

            return updatedCount;
          },

          bulkDeleteTasks: (ids: string[]) => {
            let deletedCount = 0;
            
            set((state) => {
              state.bulkOperationInProgress = true;
            });

            for (const id of ids) {
              if (get().deleteTask(id)) {
                deletedCount++;
              }
            }

            set((state) => {
              state.bulkOperationInProgress = false;
              state.selectedTaskIds.clear();
            });

            return deletedCount;
          },

          bulkSetStatus: (ids: string[], status: TaskStatus) => {
            return get().bulkUpdateTasks(ids, { status });
          },

          // 选择操作
          selectTask: (id: string | null) => {
            set((state) => {
              state.selectedTaskId = id;
            });
          },

          toggleTaskSelection: (id: string) => {
            set((state) => {
              if (state.selectedTaskIds.has(id)) {
                state.selectedTaskIds.delete(id);
              } else {
                state.selectedTaskIds.add(id);
              }
            });
          },

          selectAllTasks: () => {
            const visibleTasks = get().getFilteredTasks();
            set((state) => {
              state.selectedTaskIds = new Set(visibleTasks.map((task) => task.id));
            });
          },

          clearTaskSelection: () => {
            set((state) => {
              state.selectedTaskIds.clear();
            });
          },

          // 筛选和排序
          setFilters: (filters: Partial<TaskFilters>) => {
            set((state) => {
              Object.assign(state.filters, filters);
            });
          },

          setSearchQuery: (query: string) => {
            set((state) => {
              state.searchQuery = query;
              state.filters.search = query;
            });
          },

          setSorting: (sortBy: SortField, sortOrder?: SortOrder) => {
            set((state) => {
              state.sortBy = sortBy;
              state.sortOrder = sortOrder || (state.sortBy === sortBy ? 
                (state.sortOrder === 'asc' ? 'desc' : 'asc') : 'desc');
              state.filters.sortBy = state.sortBy;
              state.filters.sortOrder = state.sortOrder;
            });
          },

          clearFilters: () => {
            set((state) => {
              state.filters = { ...defaultFilters };
              state.searchQuery = '';
            });
          },

          // 视图操作
          setViewMode: (mode: 'list' | 'board' | 'calendar') => {
            set((state) => {
              state.viewMode = mode;
            });
          },

          // 数据查询方法
          getTask: (id: string) => {
            return get().tasks.find((task) => task.id === id);
          },

          getFilteredTasks: () => {
            const { tasks, filters, searchQuery } = get();
            let filtered = [...tasks];

            // 状态筛选
            if (filters.status) {
              const statusArray = Array.isArray(filters.status) ? filters.status : [filters.status];
              filtered = filtered.filter((task) => statusArray.includes(task.status));
            }

            // 优先级筛选
            if (filters.priority) {
              const priorityArray = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
              filtered = filtered.filter((task) => priorityArray.includes(task.priority));
            }

            // 分类筛选
            if (filters.category) {
              const categoryArray = Array.isArray(filters.category) ? filters.category : [filters.category];
              filtered = filtered.filter((task) => categoryArray.includes(task.category));
            }

            // 标签筛选
            if (filters.tags && filters.tags.length > 0) {
              filtered = filtered.filter((task) =>
                filters.tags!.some((tag) => task.tags.includes(tag))
              );
            }

            // 搜索筛选
            if (searchQuery) {
              const query = searchQuery.toLowerCase();
              filtered = filtered.filter(
                (task) =>
                  task.title.toLowerCase().includes(query) ||
                  task.description?.toLowerCase().includes(query) ||
                  task.tags.some((tag) => tag.toLowerCase().includes(query))
              );
            }

            // 重要任务筛选
            if (filters.importantOnly) {
              filtered = filtered.filter((task) => task.isImportant);
            }

            // 紧急任务筛选
            if (filters.urgentOnly) {
              filtered = filtered.filter((task) => task.isUrgent);
            }

            // 截止日期筛选
            if (filters.dueDateRange) {
              filtered = filtered.filter((task) => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                const { start, end } = filters.dueDateRange!;
                
                if (start && dueDate < start) return false;
                if (end && dueDate > end) return false;
                return true;
              });
            }

            // 排序
            const { sortBy, sortOrder } = get();
            filtered.sort((a, b) => {
              let aValue: any = a[sortBy];
              let bValue: any = b[sortBy];

              // 处理日期类型
              if (aValue instanceof Date && bValue instanceof Date) {
                aValue = aValue.getTime();
                bValue = bValue.getTime();
              }

              // 处理字符串类型
              if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                  ? aValue.localeCompare(bValue)
                  : bValue.localeCompare(aValue);
              }

              // 处理数值类型
              if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
              }

              // 处理优先级排序
              if (sortBy === 'priority') {
                const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                const aPriority = priorityOrder[a.priority];
                const bPriority = priorityOrder[b.priority];
                return sortOrder === 'asc' ? aPriority - bPriority : bPriority - aPriority;
              }

              return 0;
            });

            return filtered;
          },

          getTasksByStatus: (status: TaskStatus) => {
            return get().tasks.filter((task) => task.status === status);
          },

          getTasksByCategory: (category: TaskCategory) => {
            return get().tasks.filter((task) => task.category === category);
          },

          getTasksByPriority: (priority: TaskPriority) => {
            return get().tasks.filter((task) => task.priority === priority);
          },

          getOverdueTasks: () => {
            return get().tasks.filter((task) => 
              task.dueDate && 
              task.status !== 'completed' && 
              isOverdue(task.dueDate)
            );
          },

          getDueTodayTasks: () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            return get().tasks.filter((task) => {
              if (!task.dueDate || task.status === 'completed') return false;
              const dueDate = new Date(task.dueDate);
              return dueDate >= today && dueDate < tomorrow;
            });
          },

          getTaskStats: (): TaskStats => {
            const tasks = get().tasks;
            const now = new Date();
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            weekStart.setHours(0, 0, 0, 0);

            const stats: TaskStats = {
              total: tasks.length,
              byStatus: {
                todo: 0,
                in_progress: 0,
                completed: 0,
                cancelled: 0,
              },
              byPriority: {
                low: 0,
                medium: 0,
                high: 0,
                urgent: 0,
              },
              byCategory: {
                work: 0,
                personal: 0,
                study: 0,
                health: 0,
                other: 0,
              },
              dueToday: 0,
              overdue: 0,
              completedThisWeek: 0,
              averageCompletionTime: 0,
            };

            let totalCompletionTime = 0;
            let completedTasksWithTime = 0;

            tasks.forEach((task) => {
              // 按状态统计
              stats.byStatus[task.status]++;

              // 按优先级统计
              stats.byPriority[task.priority]++;

              // 按分类统计
              stats.byCategory[task.category]++;

              // 今日到期
              if (task.dueDate && !isOverdue(task.dueDate)) {
                const daysDiff = calculateDaysBetween(new Date(), task.dueDate);
                if (daysDiff === 0) {
                  stats.dueToday++;
                }
              }

              // 逾期任务
              if (task.dueDate && task.status !== 'completed' && isOverdue(task.dueDate)) {
                stats.overdue++;
              }

              // 本周完成的任务
              if (task.status === 'completed' && task.completedAt && task.completedAt >= weekStart) {
                stats.completedThisWeek++;
              }

              // 计算平均完成时间
              if (task.status === 'completed' && task.completedAt && task.actualMinutes) {
                totalCompletionTime += task.actualMinutes;
                completedTasksWithTime++;
              }
            });

            // 计算平均完成时间
            if (completedTasksWithTime > 0) {
              stats.averageCompletionTime = Math.round(totalCompletionTime / completedTasksWithTime);
            }

            return stats;
          },

          // 工具方法
          reorderTasks: (taskId: string, newIndex: number) => {
            set((state) => {
              const filteredTasks = get().getFilteredTasks();
              const currentIndex = filteredTasks.findIndex((task) => task.id === taskId);
              
              if (currentIndex === -1) return;
              
              // 重新排序逻辑
              const [movedTask] = filteredTasks.splice(currentIndex, 1);
              filteredTasks.splice(newIndex, 0, movedTask);
              
              // 更新排序权重
              filteredTasks.forEach((task, index) => {
                const originalTask = state.tasks.find((t) => t.id === task.id);
                if (originalTask) {
                  originalTask.sortOrder = index;
                }
              });
            });
          },

          archiveCompletedTasks: () => {
            const completedTasks = get().getTasksByStatus('completed');
            const archivedCount = completedTasks.length;

            // 这里可以实现归档逻辑，比如移动到归档存储
            // 目前只是删除已完成的任务
            completedTasks.forEach((task) => {
              get().deleteTask(task.id);
            });

            return archivedCount;
          },

          restoreTask: (id: string) => {
            // 从归档中恢复任务的逻辑
            // 这里需要根据具体的归档实现来编写
            return false;
          },

          // 状态重置
          reset: () => {
            set((state) => {
              state.tasks = [];
              state.selectedTaskId = null;
              state.filters = { ...defaultFilters };
              state.searchQuery = '';
              state.viewMode = 'list';
              state.sortBy = 'createdAt';
              state.sortOrder = 'desc';
              state.loading = false;
              state.error = null;
              state.selectedTaskIds.clear();
              state.bulkOperationInProgress = false;
            });
          },

          setLoading: (loading: boolean) => {
            set((state) => {
              state.loading = loading;
            });
          },

          setError: (error: string | null) => {
            set((state) => {
              state.error = error;
            });
          },
        }))
      ),
      {
        name: 'taskflow-store',
        // 只持久化核心数据，不持久化UI状态
        partialize: (state) => ({
          tasks: state.tasks,
          filters: state.filters,
          viewMode: state.viewMode,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        }),
        // 版本管理，用于数据迁移
        version: 1,
      }
    ),
    {
      name: 'TaskStore',
    }
  )
);

// 选择器函数，用于性能优化
export const selectTasks = (state: TaskStore) => state.tasks;
export const selectSelectedTask = (state: TaskStore) => 
  state.selectedTaskId ? state.getTask(state.selectedTaskId) : null;
export const selectFilteredTasks = (state: TaskStore) => state.getFilteredTasks();
export const selectTaskStats = (state: TaskStore) => state.getTaskStats();
export const selectLoading = (state: TaskStore) => state.loading;
export const selectError = (state: TaskStore) => state.error;