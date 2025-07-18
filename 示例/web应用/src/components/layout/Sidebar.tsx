/**
 * 侧边栏导航组件
 * 
 * 这是一个Level 2任务的典型示例：
 * - 需要人机协作设计导航结构
 * - 复杂的状态管理和交互
 * - 响应式设计考虑
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Tag,
  Calendar,
  Archive,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { useTaskStore } from '@/stores/taskStore';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
}

/**
 * 侧边栏导航组件
 * 
 * 功能特性：
 * - 主要导航菜单
 * - 折叠/展开功能
 * - 任务分类导航
 * - 标签管理
 * - 快速统计显示
 */
export function Sidebar({ isOpen, isCollapsed, onToggleCollapse, onClose }: SidebarProps) {
  const location = useLocation();
  const { getTaskStats, getTasksByCategory } = useTaskStore();

  const stats = getTaskStats();

  // 主要导航菜单
  const navigationItems = [
    {
      name: '仪表板',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: '任务',
      href: '/tasks',
      icon: CheckSquare,
      badge: stats.byStatus.todo + stats.byStatus.in_progress,
    },
    {
      name: '分析',
      href: '/analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      name: '设置',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  // 任务分类
  const categoryItems = [
    {
      name: '工作',
      key: 'work',
      count: stats.byCategory.work,
      color: 'bg-blue-500',
    },
    {
      name: '个人',
      key: 'personal',
      count: stats.byCategory.personal,
      color: 'bg-green-500',
    },
    {
      name: '学习',
      key: 'study',
      count: stats.byCategory.study,
      color: 'bg-purple-500',
    },
    {
      name: '健康',
      key: 'health',
      count: stats.byCategory.health,
      color: 'bg-red-500',
    },
    {
      name: '其他',
      key: 'other',
      count: stats.byCategory.other,
      color: 'bg-gray-500',
    },
  ];

  // 快速链接
  const quickLinks = [
    {
      name: '今日任务',
      href: '/tasks?filter=today',
      icon: Calendar,
      count: stats.dueToday,
    },
    {
      name: '逾期任务',
      href: '/tasks?filter=overdue',
      icon: Archive,
      count: stats.overdue,
    },
    {
      name: '已完成',
      href: '/tasks?filter=completed',
      icon: CheckSquare,
      count: stats.byStatus.completed,
    },
  ];

  return (
    <>
      {/* 侧边栏容器 */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col',
          'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
          'transition-all duration-300 ease-in-out',
          // 移动端样式
          'lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // 桌面端宽度
          isCollapsed ? 'lg:w-16' : 'lg:w-64',
          // 移动端宽度
          'w-64'
        )}
      >
        {/* 侧边栏头部 */}
        <div className=\"flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700\">
          {!isCollapsed && (
            <div className=\"flex items-center space-x-2\">
              <div className=\"w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center\">
                <CheckSquare className=\"w-5 h-5 text-white\" />
              </div>
              <h1 className=\"text-lg font-semibold text-gray-900 dark:text-white\">
                TaskFlow
              </h1>
            </div>
          )}

          {/* 折叠按钮 */}
          <Button
            variant=\"ghost\"
            size=\"icon\"
            onClick={onToggleCollapse}
            className=\"hidden lg:flex\"
            aria-label={isCollapsed ? '展开侧边栏' : '折叠侧边栏'}
          >
            {isCollapsed ? (
              <ChevronRight className=\"w-4 h-4\" />
            ) : (
              <ChevronLeft className=\"w-4 h-4\" />
            )}
          </Button>
        </div>

        {/* 侧边栏内容 */}
        <div className=\"flex-1 overflow-y-auto p-4 space-y-6\">
          {/* 主要导航 */}
          <nav className=\"space-y-2\">
            {navigationItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isActive={location.pathname === item.href}
                isCollapsed={isCollapsed}
                onClick={onClose}
              />
            ))}
          </nav>

          {/* 快速链接 */}
          {!isCollapsed && (
            <div>
              <h3 className=\"text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3\">
                快速链接
              </h3>
              <div className=\"space-y-2\">
                {quickLinks.map((link) => (
                  <SidebarQuickLink
                    key={link.href}
                    link={link}
                    onClick={onClose}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 任务分类 */}
          {!isCollapsed && (
            <div>
              <h3 className=\"text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3\">
                分类
              </h3>
              <div className=\"space-y-2\">
                {categoryItems.map((category) => (
                  <SidebarCategoryItem
                    key={category.key}
                    category={category}
                    onClick={onClose}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 侧边栏底部 */}
        {!isCollapsed && (
          <div className=\"p-4 border-t border-gray-200 dark:border-gray-700\">
            <div className=\"bg-gray-50 dark:bg-gray-700 rounded-lg p-3\">
              <div className=\"flex items-center justify-between text-sm\">
                <span className=\"text-gray-600 dark:text-gray-300\">
                  任务完成率
                </span>
                <span className=\"font-medium text-gray-900 dark:text-white\">
                  {stats.total > 0 ? Math.round((stats.byStatus.completed / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className=\"w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2\">
                <div
                  className=\"bg-blue-600 h-2 rounded-full transition-all duration-300\"
                  style={{
                    width: `${stats.total > 0 ? (stats.byStatus.completed / stats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * 侧边栏导航项组件
 */
interface SidebarNavItemProps {
  item: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | null;
  };
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

function SidebarNavItem({ item, isActive, isCollapsed, onClick }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
        isCollapsed && 'justify-center'
      )}
      title={isCollapsed ? item.name : undefined}
    >
      <Icon className=\"w-5 h-5 flex-shrink-0\" />
      {!isCollapsed && (
        <>
          <span className=\"flex-1\">{item.name}</span>
          {item.badge && item.badge > 0 && (
            <span className=\"bg-blue-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center\">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

/**
 * 侧边栏快速链接组件
 */
interface SidebarQuickLinkProps {
  link: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    count: number;
  };
  onClick: () => void;
}

function SidebarQuickLink({ link, onClick }: SidebarQuickLinkProps) {
  const Icon = link.icon;

  return (
    <Link
      to={link.href}
      onClick={onClick}
      className=\"flex items-center justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors\"
    >
      <div className=\"flex items-center space-x-3\">
        <Icon className=\"w-4 h-4\" />
        <span>{link.name}</span>
      </div>
      {link.count > 0 && (
        <span className=\"text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full\">
          {link.count}
        </span>
      )}
    </Link>
  );
}

/**
 * 侧边栏分类项组件
 */
interface SidebarCategoryItemProps {
  category: {
    name: string;
    key: string;
    count: number;
    color: string;
  };
  onClick: () => void;
}

function SidebarCategoryItem({ category, onClick }: SidebarCategoryItemProps) {
  return (
    <Link
      to={`/tasks?category=${category.key}`}
      onClick={onClick}
      className=\"flex items-center justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors\"
    >
      <div className=\"flex items-center space-x-3\">
        <div className={`w-3 h-3 rounded-full ${category.color}`} />
        <span>{category.name}</span>
      </div>
      {category.count > 0 && (
        <span className=\"text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full\">
          {category.count}
        </span>
      )}
    </Link>
  );
}