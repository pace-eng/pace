/**
 * 任务页面
 * 
 * 这是一个Level 3任务的典型示例：
 * - 需要人类主导的复杂页面架构设计
 * - 多种视图模式的切换逻辑
 * - 高级筛选和排序功能
 * - 批量操作和用户体验优化
 */

import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Calendar,
  MoreHorizontal,
  CheckSquare,
  Square,
  Edit,
  Trash2,
  Star,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/Input';
import { PageContainer, ContentCard, EmptyState, ResponsiveGrid } from '@/components/layout/Layout';
import { useTaskStore } from '@/stores/taskStore';
import { formatDate, getRelativeTime, isOverdue, isToday } from '@/utils/date';
import { cn } from '@/utils/cn';
import type { Task, TaskStatus, TaskPriority } from '@/types/task';

/**
 * 任务管理页面
 * 
 * 功能特性：
 * - 多种视图模式（列表、网格、看板）
 * - 高级搜索和筛选
 * - 批量操作
 * - 拖拽排序
 * - 快速编辑
 * - 实时统计
 */
export function Tasks() {
  const {
    tasks,
    viewMode,
    setViewMode,
    getFilteredTasks,
    searchQuery,
    setSearchQuery,
    selectedTaskIds,
    toggleTaskSelection,
    clearTaskSelection,
    selectAllTasks,
    bulkDeleteTasks,
    bulkSetStatus,
    addTask,
  } = useTaskStore();

  const [showFilters, setShowFilters] = React.useState(false);
  const [showNewTaskForm, setShowNewTaskForm] = React.useState(false);

  const filteredTasks = getFilteredTasks();
  const selectedCount = selectedTaskIds.size;
  const hasSelected = selectedCount > 0;

  // 处理新建任务
  const handleCreateTask = () => {
    setShowNewTaskForm(true);
  };

  // 处理批量删除
  const handleBulkDelete = () => {
    if (window.confirm(`确定要删除 ${selectedCount} 个任务吗？`)) {
      bulkDeleteTasks(Array.from(selectedTaskIds));
      clearTaskSelection();
    }
  };

  // 处理批量状态更新
  const handleBulkStatusUpdate = (status: TaskStatus) => {
    bulkSetStatus(Array.from(selectedTaskIds), status);
    clearTaskSelection();
  };

  // 获取页面头部操作
  const pageActions = (
    <div className=\"flex items-center space-x-2\">
      {/* 视图切换 */}
      <div className=\"flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden\">
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size=\"sm\"
          onClick={() => setViewMode('list')}
          className=\"rounded-none border-0\"
        >
          <List className=\"w-4 h-4\" />
        </Button>
        <Button
          variant={viewMode === 'board' ? 'default' : 'ghost'}
          size=\"sm\"
          onClick={() => setViewMode('board')}
          className=\"rounded-none border-0 border-l border-gray-200 dark:border-gray-600\"
        >
          <Grid3X3 className=\"w-4 h-4\" />
        </Button>
        <Button
          variant={viewMode === 'calendar' ? 'default' : 'ghost'}
          size=\"sm\"
          onClick={() => setViewMode('calendar')}
          className=\"rounded-none border-0 border-l border-gray-200 dark:border-gray-600\"
        >
          <Calendar className=\"w-4 h-4\" />
        </Button>
      </div>

      {/* 筛选按钮 */}
      <Button
        variant=\"outline\"
        size=\"sm\"
        onClick={() => setShowFilters(!showFilters)}
        leftIcon={<Filter className=\"w-4 h-4\" />}
      >
        筛选
      </Button>

      {/* 新建任务 */}
      <Button
        onClick={handleCreateTask}
        leftIcon={<Plus className=\"w-4 h-4\" />}
      >
        新建任务
      </Button>
    </div>
  );

  return (
    <PageContainer
      title=\"任务管理\"
      description={`共 ${filteredTasks.length} 个任务`}
      actions={pageActions}
    >
      {/* 搜索和筛选区域 */}
      <div className=\"space-y-4\">
        {/* 搜索框 */}
        <div className=\"flex flex-col sm:flex-row gap-4\">
          <div className=\"flex-1\">
            <SearchInput
              placeholder=\"搜索任务标题、描述或标签...\"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 高级筛选面板 */}
        {showFilters && (
          <TaskFiltersPanel onClose={() => setShowFilters(false)} />
        )}

        {/* 批量操作栏 */}
        {hasSelected && (
          <BatchActionsBar
            selectedCount={selectedCount}
            onSelectAll={selectAllTasks}
            onClearSelection={clearTaskSelection}
            onBulkDelete={handleBulkDelete}
            onBulkStatusUpdate={handleBulkStatusUpdate}
          />
        )}
      </div>

      {/* 任务内容区域 */}
      <ContentCard padding=\"none\">
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={<CheckSquare className=\"w-12 h-12\" />}
            title=\"暂无任务\"
            description=\"创建你的第一个任务开始高效工作吧！\"
            action={
              <Button onClick={handleCreateTask} leftIcon={<Plus className=\"w-4 h-4\" />}>
                新建任务
              </Button>
            }
          />
        ) : (
          <TasksContent
            tasks={filteredTasks}
            viewMode={viewMode}
            selectedTaskIds={selectedTaskIds}
            onToggleSelection={toggleTaskSelection}
          />
        )}
      </ContentCard>

      {/* 新建任务模态框 */}
      {showNewTaskForm && (
        <NewTaskModal onClose={() => setShowNewTaskForm(false)} />
      )}
    </PageContainer>
  );
}

/**
 * 任务筛选面板组件
 */
interface TaskFiltersPanelProps {
  onClose: () => void;
}

function TaskFiltersPanel({ onClose }: TaskFiltersPanelProps) {
  const { filters, setFilters } = useTaskStore();

  const statusOptions = [
    { value: 'todo', label: '待办' },
    { value: 'in_progress', label: '进行中' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' },
  ];

  const priorityOptions = [
    { value: 'low', label: '低' },
    { value: 'medium', label: '中' },
    { value: 'high', label: '高' },
    { value: 'urgent', label: '紧急' },
  ];

  const categoryOptions = [
    { value: 'work', label: '工作' },
    { value: 'personal', label: '个人' },
    { value: 'study', label: '学习' },
    { value: 'health', label: '健康' },
    { value: 'other', label: '其他' },
  ];

  return (
    <ContentCard title=\"筛选条件\" className=\"border-blue-200 dark:border-blue-700\">
      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
        {/* 状态筛选 */}
        <div>
          <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
            状态
          </label>
          <div className=\"space-y-2\">
            {statusOptions.map((option) => (
              <label key={option.value} className=\"flex items-center\">
                <input
                  type=\"checkbox\"
                  checked={filters.status === option.value}
                  onChange={(e) => setFilters({ 
                    status: e.target.checked ? option.value as TaskStatus : undefined 
                  })}
                  className=\"rounded border-gray-300 text-blue-600 focus:ring-blue-500\"
                />
                <span className=\"ml-2 text-sm text-gray-700 dark:text-gray-300\">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 优先级筛选 */}
        <div>
          <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
            优先级
          </label>
          <div className=\"space-y-2\">
            {priorityOptions.map((option) => (
              <label key={option.value} className=\"flex items-center\">
                <input
                  type=\"checkbox\"
                  checked={filters.priority === option.value}
                  onChange={(e) => setFilters({ 
                    priority: e.target.checked ? option.value as TaskPriority : undefined 
                  })}
                  className=\"rounded border-gray-300 text-blue-600 focus:ring-blue-500\"
                />
                <span className=\"ml-2 text-sm text-gray-700 dark:text-gray-300\">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 分类筛选 */}
        <div>
          <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
            分类
          </label>
          <div className=\"space-y-2\">
            {categoryOptions.map((option) => (
              <label key={option.value} className=\"flex items-center\">
                <input
                  type=\"checkbox\"
                  checked={filters.category === option.value}
                  onChange={(e) => setFilters({ 
                    category: e.target.checked ? option.value as any : undefined 
                  })}
                  className=\"rounded border-gray-300 text-blue-600 focus:ring-blue-500\"
                />
                <span className=\"ml-2 text-sm text-gray-700 dark:text-gray-300\">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className=\"flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700\">
        <Button variant=\"outline\" onClick={() => setFilters({})}>
          清除筛选
        </Button>
        <Button onClick={onClose}>
          应用筛选
        </Button>
      </div>
    </ContentCard>
  );
}

/**
 * 批量操作栏组件
 */
interface BatchActionsBarProps {
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkStatusUpdate: (status: TaskStatus) => void;
}

function BatchActionsBar({
  selectedCount,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkStatusUpdate,
}: BatchActionsBarProps) {
  return (
    <div className=\"bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4\">
      <div className=\"flex items-center justify-between\">
        <div className=\"flex items-center space-x-4\">
          <span className=\"text-sm font-medium text-blue-900 dark:text-blue-100\">
            已选择 {selectedCount} 个任务
          </span>
          <div className=\"flex items-center space-x-2\">
            <Button variant=\"ghost\" size=\"sm\" onClick={onSelectAll}>
              全选
            </Button>
            <Button variant=\"ghost\" size=\"sm\" onClick={onClearSelection}>
              取消选择
            </Button>
          </div>
        </div>

        <div className=\"flex items-center space-x-2\">
          <Button
            variant=\"outline\"
            size=\"sm\"
            onClick={() => onBulkStatusUpdate('completed')}
          >
            标记完成
          </Button>
          <Button
            variant=\"outline\"
            size=\"sm\"
            onClick={() => onBulkStatusUpdate('in_progress')}
          >
            标记进行中
          </Button>
          <Button
            variant=\"destructive\"
            size=\"sm\"
            onClick={onBulkDelete}
          >
            删除
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * 任务内容组件
 */
interface TasksContentProps {
  tasks: Task[];
  viewMode: 'list' | 'board' | 'calendar';
  selectedTaskIds: Set<string>;
  onToggleSelection: (id: string) => void;
}

function TasksContent({ tasks, viewMode, selectedTaskIds, onToggleSelection }: TasksContentProps) {
  switch (viewMode) {
    case 'list':
      return <TaskListView tasks={tasks} selectedTaskIds={selectedTaskIds} onToggleSelection={onToggleSelection} />;
    case 'board':
      return <TaskBoardView tasks={tasks} selectedTaskIds={selectedTaskIds} onToggleSelection={onToggleSelection} />;
    case 'calendar':
      return <TaskCalendarView tasks={tasks} selectedTaskIds={selectedTaskIds} onToggleSelection={onToggleSelection} />;
    default:
      return <TaskListView tasks={tasks} selectedTaskIds={selectedTaskIds} onToggleSelection={onToggleSelection} />;
  }
}

/**
 * 任务列表视图
 */
function TaskListView({ tasks, selectedTaskIds, onToggleSelection }: Omit<TasksContentProps, 'viewMode'>) {
  return (
    <div className=\"divide-y divide-gray-200 dark:divide-gray-700\">
      {tasks.map((task) => (
        <TaskListItem
          key={task.id}
          task={task}
          isSelected={selectedTaskIds.has(task.id)}
          onToggleSelection={() => onToggleSelection(task.id)}
        />
      ))}
    </div>
  );
}

/**
 * 任务列表项组件
 */
interface TaskListItemProps {
  task: Task;
  isSelected: boolean;
  onToggleSelection: () => void;
}

function TaskListItem({ task, isSelected, onToggleSelection }: TaskListItemProps) {
  const { setTaskStatus, updateTask, deleteTask } = useTaskStore();

  const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-blue-500',
    high: 'text-orange-500',
    urgent: 'text-red-500',
  };

  const statusIcons = {
    todo: Square,
    in_progress: Clock,
    completed: CheckSquare,
    cancelled: AlertCircle,
  };

  const StatusIcon = statusIcons[task.status];
  const isTaskOverdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'completed';
  const isDueToday = task.dueDate && isToday(task.dueDate);

  return (
    <div className={cn(
      'flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
      isSelected && 'bg-blue-50 dark:bg-blue-900/20'
    )}>
      {/* 选择复选框 */}
      <input
        type=\"checkbox\"
        checked={isSelected}
        onChange={onToggleSelection}
        className=\"rounded border-gray-300 text-blue-600 focus:ring-blue-500\"
      />

      {/* 任务状态 */}
      <button
        onClick={() => setTaskStatus(task.id, task.status === 'completed' ? 'todo' : 'completed')}
        className={cn(
          'p-1 rounded transition-colors',
          task.status === 'completed' 
            ? 'text-green-600 hover:text-green-700' 
            : 'text-gray-400 hover:text-green-600'
        )}
      >
        <StatusIcon className=\"w-5 h-5\" />
      </button>

      {/* 任务信息 */}
      <div className=\"flex-1 min-w-0\">
        <div className=\"flex items-center space-x-2 mb-1\">
          <h3 className={cn(
            'font-medium truncate',
            task.status === 'completed' 
              ? 'line-through text-gray-500 dark:text-gray-400'
              : 'text-gray-900 dark:text-white'
          )}>
            {task.title}
          </h3>
          
          {task.isImportant && (
            <Star className=\"w-4 h-4 text-yellow-500 fill-current\" />
          )}
          
          {isTaskOverdue && (
            <span className=\"text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full\">
              逾期
            </span>
          )}
          
          {isDueToday && !isTaskOverdue && (
            <span className=\"text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 px-2 py-1 rounded-full\">
              今日到期
            </span>
          )}
        </div>

        {task.description && (
          <p className=\"text-sm text-gray-600 dark:text-gray-300 truncate mb-2\">
            {task.description}
          </p>
        )}

        <div className=\"flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400\">
          <span className={priorityColors[task.priority]}>
            {task.priority === 'urgent' ? '紧急' : 
             task.priority === 'high' ? '高' :
             task.priority === 'medium' ? '中' : '低'}优先级
          </span>
          
          {task.dueDate && (
            <span>
              <Clock className=\"w-3 h-3 inline mr-1\" />
              {formatDate(task.dueDate)}
            </span>
          )}
          
          <span>
            {getRelativeTime(task.updatedAt)}更新
          </span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className=\"flex items-center space-x-1\">
        <Button variant=\"ghost\" size=\"icon\" onClick={() => {}}>
          <Edit className=\"w-4 h-4\" />
        </Button>
        <Button 
          variant=\"ghost\" 
          size=\"icon\" 
          onClick={() => deleteTask(task.id)}
          className=\"text-red-600 hover:text-red-700\"
        >
          <Trash2 className=\"w-4 h-4\" />
        </Button>
        <Button variant=\"ghost\" size=\"icon\">
          <MoreHorizontal className=\"w-4 h-4\" />
        </Button>
      </div>
    </div>
  );
}

/**
 * 任务看板视图（占位符）
 */
function TaskBoardView({ tasks }: Omit<TasksContentProps, 'viewMode'>) {
  return (
    <div className=\"p-8 text-center\">
      <Grid3X3 className=\"w-12 h-12 text-gray-400 mx-auto mb-4\" />
      <h3 className=\"text-lg font-medium text-gray-900 dark:text-white mb-2\">
        看板视图
      </h3>
      <p className=\"text-gray-600 dark:text-gray-300\">
        看板视图功能正在开发中...
      </p>
    </div>
  );
}

/**
 * 任务日历视图（占位符）
 */
function TaskCalendarView({ tasks }: Omit<TasksContentProps, 'viewMode'>) {
  return (
    <div className=\"p-8 text-center\">
      <Calendar className=\"w-12 h-12 text-gray-400 mx-auto mb-4\" />
      <h3 className=\"text-lg font-medium text-gray-900 dark:text-white mb-2\">
        日历视图
      </h3>
      <p className=\"text-gray-600 dark:text-gray-300\">
        日历视图功能正在开发中...
      </p>
    </div>
  );
}

/**
 * 新建任务模态框（占位符）
 */
function NewTaskModal({ onClose }: { onClose: () => void }) {
  return (
    <div className=\"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50\">
      <div className=\"bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md\">
        <h2 className=\"text-lg font-semibold text-gray-900 dark:text-white mb-4\">
          新建任务
        </h2>
        <p className=\"text-gray-600 dark:text-gray-300 mb-6\">
          新建任务功能正在开发中...
        </p>
        <div className=\"flex justify-end space-x-2\">
          <Button variant=\"outline\" onClick={onClose}>
            取消
          </Button>
          <Button onClick={onClose}>
            确定
          </Button>
        </div>
      </div>
    </div>
  );
}