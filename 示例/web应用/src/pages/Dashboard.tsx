/**
 * 仪表板页面
 * 
 * 这是一个Level 2任务的典型示例：
 * - 需要人机协作整合多个组件
 * - 复杂的数据聚合和显示逻辑
 * - 用户体验设计需要人类主导
 */

import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Plus,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTaskStore } from '@/stores/taskStore';
import type { TaskStatus, TaskPriority } from '@/types/task';

/**
 * 仪表板主页面
 * 
 * 功能特性：
 * - 任务统计概览
 * - 今日任务快览
 * - 最近活动列表
 * - 快速操作入口
 * - 工作效率分析
 */
export function Dashboard() {
  const {
    tasks,
    getTaskStats,
    getDueTodayTasks,
    getOverdueTasks,
    getTasksByStatus,
  } = useTaskStore();

  const stats = getTaskStats();
  const todayTasks = getDueTodayTasks();
  const overdueTasks = getOverdueTasks();
  const inProgressTasks = getTasksByStatus('in_progress');

  // 计算完成率
  const completionRate = stats.total > 0 
    ? Math.round((stats.byStatus.completed / stats.total) * 100)
    : 0;

  // 最近任务（按更新时间排序）
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className=\"space-y-6\">
      {/* 页面标题 */}
      <div className=\"flex items-center justify-between\">
        <div>
          <h1 className=\"text-2xl font-bold text-gray-900 dark:text-white\">
            仪表板
          </h1>
          <p className=\"text-gray-600 dark:text-gray-300 mt-1\">
            查看你的任务概览和工作进度
          </p>
        </div>
        
        <Button leftIcon={<Plus className=\"w-4 h-4\" />}>
          新建任务
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
        {/* 总任务数 */}
        <StatCard
          title=\"总任务\"
          value={stats.total}
          icon={<Target className=\"w-5 h-5\" />}
          color=\"blue\"
          trend=\"+12% 较上周\"
        />

        {/* 已完成任务 */}
        <StatCard
          title=\"已完成\"
          value={stats.byStatus.completed}
          icon={<CheckCircle className=\"w-5 h-5\" />}
          color=\"green\"
          trend={`${completionRate}% 完成率`}
        />

        {/* 进行中任务 */}
        <StatCard
          title=\"进行中\"
          value={stats.byStatus.in_progress}
          icon={<Activity className=\"w-5 h-5\" />}
          color=\"orange\"
          trend={`${inProgressTasks.length} 个活跃`}
        />

        {/* 逾期任务 */}
        <StatCard
          title=\"逾期任务\"
          value={stats.overdue}
          icon={<AlertCircle className=\"w-5 h-5\" />}
          color=\"red\"
          trend={stats.overdue > 0 ? \"需要关注\" : \"状态良好\"}
        />
      </div>

      {/* 主要内容区域 */}
      <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">
        {/* 今日任务 */}
        <div className=\"lg:col-span-2\">
          <TodayTasksSection 
            todayTasks={todayTasks} 
            overdueTasks={overdueTasks} 
          />
        </div>

        {/* 侧边栏 */}
        <div className=\"space-y-6\">
          {/* 最近活动 */}
          <RecentActivitySection recentTasks={recentTasks} />
          
          {/* 优先级分布 */}
          <PriorityDistribution stats={stats} />
        </div>
      </div>
    </div>
  );
}

/**
 * 统计卡片组件
 */
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'red';
  trend: string;
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <div className=\"bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700\">
      <div className=\"flex items-center justify-between\">
        <div>
          <p className=\"text-sm font-medium text-gray-600 dark:text-gray-300\">
            {title}
          </p>
          <p className=\"text-2xl font-bold text-gray-900 dark:text-white mt-1\">
            {value}
          </p>
          <p className=\"text-sm text-gray-500 dark:text-gray-400 mt-1\">
            {trend}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/**
 * 今日任务区域
 */
interface TodayTasksSectionProps {
  todayTasks: any[];
  overdueTasks: any[];
}

function TodayTasksSection({ todayTasks, overdueTasks }: TodayTasksSectionProps) {
  const allTasks = [...overdueTasks, ...todayTasks];

  return (
    <div className=\"bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700\">
      <div className=\"flex items-center justify-between mb-4\">
        <div className=\"flex items-center space-x-2\">
          <Calendar className=\"w-5 h-5 text-gray-600 dark:text-gray-300\" />
          <h2 className=\"text-lg font-semibold text-gray-900 dark:text-white\">
            今日任务
          </h2>
          <span className=\"bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs px-2 py-1 rounded-full\">
            {allTasks.length}
          </span>
        </div>
        
        <Button variant=\"ghost\" size=\"sm\">
          查看全部
        </Button>
      </div>

      {allTasks.length === 0 ? (
        <div className=\"text-center py-8\">
          <CheckCircle className=\"w-12 h-12 text-green-500 mx-auto mb-3\" />
          <p className=\"text-gray-600 dark:text-gray-300\">
            太棒了！今日暂无待办任务
          </p>
        </div>
      ) : (
        <div className=\"space-y-3\">
          {allTasks.slice(0, 5).map((task) => (
            <TaskQuickView key={task.id} task={task} />
          ))}
          
          {allTasks.length > 5 && (
            <div className=\"text-center pt-4 border-t border-gray-200 dark:border-gray-700\">
              <Button variant=\"ghost\" size=\"sm\">
                查看更多 ({allTasks.length - 5} 个)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 任务快速预览组件
 */
function TaskQuickView({ task }: { task: any }) {
  const { setTaskStatus } = useTaskStore();
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  
  const priorityColors = {
    low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    high: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    urgent: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };

  const statusColors = {
    todo: 'text-gray-500',
    in_progress: 'text-blue-500',
    completed: 'text-green-500',
    cancelled: 'text-red-500',
  };

  return (
    <div className=\"flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors\">
      {/* 任务状态复选框 */}
      <button
        onClick={() => setTaskStatus(task.id, task.status === 'completed' ? 'todo' : 'completed')}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
          task.status === 'completed'
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-500'
        }`}
      >
        {task.status === 'completed' && (
          <CheckCircle className=\"w-3 h-3\" />
        )}
      </button>

      {/* 任务信息 */}
      <div className=\"flex-1 min-w-0\">
        <div className=\"flex items-center space-x-2\">
          <p className={`font-medium truncate ${
            task.status === 'completed' 
              ? 'line-through text-gray-500 dark:text-gray-400'
              : 'text-gray-900 dark:text-white'
          }`}>
            {task.title}
          </p>
          
          {isOverdue && (
            <span className=\"text-xs text-red-600 dark:text-red-400 font-medium\">
              逾期
            </span>
          )}
        </div>
        
        <div className=\"flex items-center space-x-2 mt-1\">
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
            {task.priority === 'urgent' ? '紧急' : 
             task.priority === 'high' ? '高' :
             task.priority === 'medium' ? '中' : '低'}
          </span>
          
          {task.dueDate && (
            <span className=\"text-xs text-gray-500 dark:text-gray-400\">
              <Clock className=\"w-3 h-3 inline mr-1\" />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 最近活动区域
 */
function RecentActivitySection({ recentTasks }: { recentTasks: any[] }) {
  return (
    <div className=\"bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700\">
      <div className=\"flex items-center space-x-2 mb-4\">
        <Activity className=\"w-5 h-5 text-gray-600 dark:text-gray-300\" />
        <h2 className=\"text-lg font-semibold text-gray-900 dark:text-white\">
          最近活动
        </h2>
      </div>

      {recentTasks.length === 0 ? (
        <p className=\"text-gray-500 dark:text-gray-400 text-sm\">
          暂无最近活动
        </p>
      ) : (
        <div className=\"space-y-3\">
          {recentTasks.map((task) => (
            <div key={task.id} className=\"flex items-center space-x-3\">
              <div className={`w-2 h-2 rounded-full ${
                task.status === 'completed' ? 'bg-green-500' :
                task.status === 'in_progress' ? 'bg-blue-500' :
                'bg-gray-400'
              }`} />
              
              <div className=\"flex-1 min-w-0\">
                <p className=\"text-sm font-medium text-gray-900 dark:text-white truncate\">
                  {task.title}
                </p>
                <p className=\"text-xs text-gray-500 dark:text-gray-400\">
                  {new Date(task.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 优先级分布组件
 */
function PriorityDistribution({ stats }: { stats: any }) {
  const total = stats.total;
  
  const priorities = [
    { key: 'urgent', label: '紧急', color: 'bg-red-500', count: stats.byPriority.urgent },
    { key: 'high', label: '高', color: 'bg-orange-500', count: stats.byPriority.high },
    { key: 'medium', label: '中', color: 'bg-blue-500', count: stats.byPriority.medium },
    { key: 'low', label: '低', color: 'bg-gray-400', count: stats.byPriority.low },
  ];

  return (
    <div className=\"bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700\">
      <div className=\"flex items-center space-x-2 mb-4\">
        <TrendingUp className=\"w-5 h-5 text-gray-600 dark:text-gray-300\" />
        <h2 className=\"text-lg font-semibold text-gray-900 dark:text-white\">
          优先级分布
        </h2>
      </div>

      <div className=\"space-y-3\">
        {priorities.map((priority) => {
          const percentage = total > 0 ? (priority.count / total) * 100 : 0;
          
          return (
            <div key={priority.key} className=\"flex items-center space-x-3\">
              <div className={`w-3 h-3 rounded-full ${priority.color}`} />
              <div className=\"flex-1\">
                <div className=\"flex items-center justify-between text-sm\">
                  <span className=\"text-gray-900 dark:text-white\">{priority.label}</span>
                  <span className=\"text-gray-500 dark:text-gray-400\">{priority.count}</span>
                </div>
                <div className=\"w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1\">
                  <div
                    className={`h-2 rounded-full ${priority.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}