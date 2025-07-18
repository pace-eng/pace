/**
 * 分析页面
 * 
 * 这是一个Level 2任务的典型示例：
 * - 需要人机协作设计数据可视化
 * - 复杂的数据分析和图表展示
 * - 交互式的报表功能
 */

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageContainer, ContentCard, ResponsiveGrid } from '@/components/layout/Layout';
import { useTaskStore } from '@/stores/taskStore';
import { formatDate, getStartOfWeek, getEndOfWeek, getStartOfMonth, getEndOfMonth } from '@/utils/date';
import { cn } from '@/utils/cn';

/**
 * 分析页面
 * 
 * 功能特性：
 * - 任务完成趋势分析
 * - 工作效率统计
 * - 分类和优先级分布
 * - 时间分析报告
 * - 个人工作模式分析
 */
export function Analytics() {
  const { tasks, getTaskStats } = useTaskStore();
  const [timeRange, setTimeRange] = React.useState<'week' | 'month' | 'year'>('month');
  const [refreshing, setRefreshing] = React.useState(false);

  const stats = getTaskStats();

  // 模拟刷新数据
  const handleRefresh = async () => {
    setRefreshing(true);
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // 导出报告
  const handleExport = () => {
    console.log('导出分析报告');
  };

  const pageActions = (
    <div className=\"flex items-center space-x-2\">
      <Button
        variant=\"outline\"
        size=\"sm\"
        onClick={handleRefresh}
        loading={refreshing}
        leftIcon={<RefreshCw className=\"w-4 h-4\" />}
      >
        刷新
      </Button>
      
      <Button
        variant=\"outline\"
        size=\"sm\"
        leftIcon={<Download className=\"w-4 h-4\" />}
        onClick={handleExport}
      >
        导出报告
      </Button>
    </div>
  );

  return (
    <PageContainer
      title=\"数据分析\"
      description=\"深入了解你的工作效率和任务模式\"
      actions={pageActions}
    >
      {/* 时间范围选择 */}
      <div className=\"flex items-center justify-between\">
        <div className=\"flex items-center space-x-2\">
          <span className=\"text-sm font-medium text-gray-700 dark:text-gray-300\">
            时间范围：
          </span>
          <div className=\"flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden\">
            {['week', 'month', 'year'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size=\"sm\"
                onClick={() => setTimeRange(range as any)}
                className=\"rounded-none border-0\"
              >
                {range === 'week' ? '本周' : range === 'month' ? '本月' : '今年'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 关键指标概览 */}
      <ResponsiveGrid cols={{ default: 1, md: 2, lg: 4 }}>
        <MetricCard
          title=\"总任务数\"
          value={stats.total}
          change=\"+12%\"
          trend=\"up\"
          icon={<Target className=\"w-5 h-5\" />}
          color=\"blue\"
        />
        
        <MetricCard
          title=\"完成率\"
          value={`${stats.total > 0 ? Math.round((stats.byStatus.completed / stats.total) * 100) : 0}%`}
          change=\"+5%\"
          trend=\"up\"
          icon={<TrendingUp className=\"w-5 h-5\" />}
          color=\"green\"
        />
        
        <MetricCard
          title=\"平均完成时间\"
          value={`${stats.averageCompletionTime || 0}分钟`}
          change=\"-15%\"
          trend=\"down\"
          icon={<Clock className=\"w-5 h-5\" />}
          color=\"orange\"
        />
        
        <MetricCard
          title=\"本周完成\"
          value={stats.completedThisWeek}
          change=\"+23%\"
          trend=\"up\"
          icon={<Calendar className=\"w-5 h-5\" />}
          color=\"purple\"
        />
      </ResponsiveGrid>

      {/* 图表区域 */}
      <ResponsiveGrid cols={{ default: 1, lg: 2 }}>
        {/* 任务完成趋势 */}
        <ContentCard title=\"任务完成趋势\" description=\"过去30天的任务完成情况\">
          <TaskCompletionChart timeRange={timeRange} />
        </ContentCard>

        {/* 优先级分布 */}
        <ContentCard title=\"优先级分布\" description=\"任务优先级的分布情况\">
          <PriorityDistributionChart stats={stats} />
        </ContentCard>

        {/* 分类分析 */}
        <ContentCard title=\"分类分析\" description=\"不同分类任务的完成情况\">
          <CategoryAnalysisChart stats={stats} />
        </ContentCard>

        {/* 工作模式分析 */}
        <ContentCard title=\"工作模式\" description=\"你的工作时间分布和效率分析\">
          <WorkPatternAnalysis />
        </ContentCard>
      </ResponsiveGrid>

      {/* 详细统计表格 */}
      <ContentCard title=\"详细统计\" description=\"任务数据的详细分析\">
        <DetailedStatsTable stats={stats} />
      </ContentCard>
    </PageContainer>
  );
}

/**
 * 指标卡片组件
 */
interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

function MetricCard({ title, value, change, trend, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  };

  const trendClasses = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <ContentCard>
      <div className=\"flex items-center justify-between\">
        <div>
          <p className=\"text-sm font-medium text-gray-600 dark:text-gray-300\">
            {title}
          </p>
          <p className=\"text-2xl font-bold text-gray-900 dark:text-white mt-1\">
            {value}
          </p>
          <p className={cn('text-sm mt-1', trendClasses[trend])}>
            {change} 较上期
          </p>
        </div>
        
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          {icon}
        </div>
      </div>
    </ContentCard>
  );
}

/**
 * 任务完成趋势图表
 */
function TaskCompletionChart({ timeRange }: { timeRange: string }) {
  // 模拟图表数据
  const chartData = [
    { date: '1/1', completed: 5, created: 8 },
    { date: '1/2', completed: 3, created: 6 },
    { date: '1/3', completed: 8, created: 10 },
    { date: '1/4', completed: 6, created: 7 },
    { date: '1/5', completed: 12, created: 15 },
    { date: '1/6', completed: 9, created: 11 },
    { date: '1/7', completed: 7, created: 9 },
  ];

  return (
    <div className=\"h-64 flex items-center justify-center\">
      <div className=\"text-center\">
        <BarChart3 className=\"w-16 h-16 text-gray-400 mx-auto mb-4\" />
        <p className=\"text-gray-600 dark:text-gray-300\">
          任务完成趋势图表
        </p>
        <p className=\"text-sm text-gray-500 dark:text-gray-400 mt-2\">
          图表组件开发中...
        </p>
      </div>
    </div>
  );
}

/**
 * 优先级分布图表
 */
function PriorityDistributionChart({ stats }: { stats: any }) {
  const priorities = [
    { name: '紧急', value: stats.byPriority.urgent, color: 'bg-red-500' },
    { name: '高', value: stats.byPriority.high, color: 'bg-orange-500' },
    { name: '中', value: stats.byPriority.medium, color: 'bg-blue-500' },
    { name: '低', value: stats.byPriority.low, color: 'bg-gray-400' },
  ];

  const total = priorities.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className=\"space-y-4\">
      {priorities.map((priority) => {
        const percentage = total > 0 ? (priority.value / total) * 100 : 0;
        
        return (
          <div key={priority.name} className=\"flex items-center space-x-3\">
            <div className={`w-3 h-3 rounded-full ${priority.color}`} />
            <div className=\"flex-1\">
              <div className=\"flex items-center justify-between text-sm mb-1\">
                <span className=\"text-gray-900 dark:text-white\">{priority.name}</span>
                <span className=\"text-gray-500 dark:text-gray-400\">
                  {priority.value} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className=\"w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2\">
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
  );
}

/**
 * 分类分析图表
 */
function CategoryAnalysisChart({ stats }: { stats: any }) {
  const categories = [
    { name: '工作', value: stats.byCategory.work, color: 'bg-blue-500' },
    { name: '个人', value: stats.byCategory.personal, color: 'bg-green-500' },
    { name: '学习', value: stats.byCategory.study, color: 'bg-purple-500' },
    { name: '健康', value: stats.byCategory.health, color: 'bg-red-500' },
    { name: '其他', value: stats.byCategory.other, color: 'bg-gray-500' },
  ];

  return (
    <div className=\"space-y-3\">
      {categories.map((category) => (
        <div key={category.name} className=\"flex items-center justify-between\">
          <div className=\"flex items-center space-x-3\">
            <div className={`w-3 h-3 rounded-full ${category.color}`} />
            <span className=\"text-sm text-gray-900 dark:text-white\">{category.name}</span>
          </div>
          <span className=\"text-sm font-medium text-gray-600 dark:text-gray-300\">
            {category.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * 工作模式分析
 */
function WorkPatternAnalysis() {
  const workPatterns = [
    { time: '早晨 (6-12)', efficiency: 85, tasks: 12 },
    { time: '下午 (12-18)', efficiency: 92, tasks: 18 },
    { time: '晚上 (18-24)', efficiency: 67, tasks: 8 },
  ];

  return (
    <div className=\"space-y-4\">
      <div className=\"grid grid-cols-3 gap-4 text-center\">
        <div>
          <div className=\"text-lg font-semibold text-gray-900 dark:text-white\">85%</div>
          <div className=\"text-sm text-gray-600 dark:text-gray-300\">平均效率</div>
        </div>
        <div>
          <div className=\"text-lg font-semibold text-gray-900 dark:text-white\">38</div>
          <div className=\"text-sm text-gray-600 dark:text-gray-300\">总任务数</div>
        </div>
        <div>
          <div className=\"text-lg font-semibold text-gray-900 dark:text-white\">14:00</div>
          <div className=\"text-sm text-gray-600 dark:text-gray-300\">最佳时段</div>
        </div>
      </div>

      <div className=\"space-y-3\">
        {workPatterns.map((pattern) => (
          <div key={pattern.time} className=\"space-y-2\">
            <div className=\"flex items-center justify-between text-sm\">
              <span className=\"text-gray-900 dark:text-white\">{pattern.time}</span>
              <span className=\"text-gray-600 dark:text-gray-300\">
                {pattern.efficiency}% 效率, {pattern.tasks} 任务
              </span>
            </div>
            <div className=\"w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2\">
              <div
                className=\"bg-blue-600 h-2 rounded-full\"
                style={{ width: `${pattern.efficiency}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 详细统计表格
 */
function DetailedStatsTable({ stats }: { stats: any }) {
  const tableData = [
    { category: '状态统计', metric: '待办任务', value: stats.byStatus.todo },
    { category: '状态统计', metric: '进行中', value: stats.byStatus.in_progress },
    { category: '状态统计', metric: '已完成', value: stats.byStatus.completed },
    { category: '状态统计', metric: '已取消', value: stats.byStatus.cancelled },
    { category: '时间统计', metric: '今日到期', value: stats.dueToday },
    { category: '时间统计', metric: '逾期任务', value: stats.overdue },
    { category: '时间统计', metric: '本周完成', value: stats.completedThisWeek },
    { category: '效率统计', metric: '平均完成时间', value: `${stats.averageCompletionTime || 0}分钟` },
  ];

  return (
    <div className=\"overflow-x-auto\">
      <table className=\"min-w-full divide-y divide-gray-200 dark:divide-gray-700\">
        <thead className=\"bg-gray-50 dark:bg-gray-700\">
          <tr>
            <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider\">
              分类
            </th>
            <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider\">
              指标
            </th>
            <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider\">
              数值
            </th>
          </tr>
        </thead>
        <tbody className=\"bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700\">
          {tableData.map((row, index) => (
            <tr key={index} className=\"hover:bg-gray-50 dark:hover:bg-gray-700/50\">
              <td className=\"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white\">
                {row.category}
              </td>
              <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300\">
                {row.metric}
              </td>
              <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white\">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}