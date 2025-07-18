/**
 * 应用布局组件
 * 
 * 这是一个Level 3任务的典型示例：
 * - 需要人类主导的整体架构设计
 * - 复杂的导航和布局逻辑
 * - 响应式设计决策
 * - 用户体验优化
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/utils/cn';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * 主布局组件
 * 
 * 功能特性：
 * - 响应式侧边栏
 * - 顶部导航栏
 * - 自适应内容区域
 * - 移动端友好设计
 * - 主题切换支持
 */
export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const location = useLocation();

  // 监听路由变化，在移动端自动关闭侧边栏
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // 处理侧边栏切换
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 处理侧边栏折叠
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // 关闭侧边栏
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className=\"h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900\">
      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className=\"fixed inset-0 z-40 lg:hidden\"
          onClick={closeSidebar}
        >
          <div className=\"absolute inset-0 bg-gray-600 opacity-75\" />
        </div>
      )}

      {/* 侧边栏 */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        onClose={closeSidebar}
      />

      {/* 主内容区域 */}
      <div className=\"flex-1 flex flex-col overflow-hidden\">
        {/* 顶部导航栏 */}
        <Header
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* 页面内容 */}
        <main 
          className={cn(
            'flex-1 overflow-auto',
            'transition-all duration-200 ease-in-out',
            'p-4 md:p-6 lg:p-8'
          )}
        >
          <div className=\"max-w-7xl mx-auto\">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * 页面容器组件
 * 为页面提供一致的布局和间距
 */
interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageContainer({ 
  children, 
  title, 
  description, 
  actions, 
  className 
}: PageContainerProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* 页面头部 */}
      {(title || description || actions) && (
        <div className=\"flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0\">
          <div className=\"min-w-0 flex-1\">
            {title && (
              <h1 className=\"text-2xl font-bold text-gray-900 dark:text-white truncate\">
                {title}
              </h1>
            )}
            {description && (
              <p className=\"mt-1 text-sm text-gray-600 dark:text-gray-300\">
                {description}
              </p>
            )}
          </div>
          
          {actions && (
            <div className=\"flex-shrink-0\">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* 页面内容 */}
      {children}
    </div>
  );
}

/**
 * 内容卡片组件
 * 为内容区域提供一致的卡片样式
 */
interface ContentCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function ContentCard({ 
  children, 
  title, 
  description, 
  actions, 
  className,
  padding = 'md'
}: ContentCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
      paddingClasses[padding],
      className
    )}>
      {/* 卡片头部 */}
      {(title || description || actions) && (
        <div className={cn(
          'flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0',
          padding !== 'none' && 'mb-6'
        )}>
          <div className=\"min-w-0 flex-1\">
            {title && (
              <h2 className=\"text-lg font-semibold text-gray-900 dark:text-white truncate\">
                {title}
              </h2>
            )}
            {description && (
              <p className=\"mt-1 text-sm text-gray-600 dark:text-gray-300\">
                {description}
              </p>
            )}
          </div>
          
          {actions && (
            <div className=\"flex-shrink-0\">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* 卡片内容 */}
      {children}
    </div>
  );
}

/**
 * 空状态组件
 * 用于显示空数据状态
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      'text-center py-12',
      className
    )}>
      {icon && (
        <div className=\"flex justify-center mb-4\">
          <div className=\"w-12 h-12 text-gray-400 dark:text-gray-500\">
            {icon}
          </div>
        </div>
      )}
      
      <h3 className=\"text-lg font-medium text-gray-900 dark:text-white mb-2\">
        {title}
      </h3>
      
      {description && (
        <p className=\"text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto\">
          {description}
        </p>
      )}
      
      {action && action}
    </div>
  );
}

/**
 * 加载状态组件
 * 用于显示内容加载状态
 */
interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingState({ 
  title = '加载中...', 
  description, 
  className 
}: LoadingStateProps) {
  return (
    <div className={cn(
      'text-center py-12',
      className
    )}>
      <div className=\"flex justify-center mb-4\">
        <div className=\"w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin\" />
      </div>
      
      <h3 className=\"text-lg font-medium text-gray-900 dark:text-white mb-2\">
        {title}
      </h3>
      
      {description && (
        <p className=\"text-gray-600 dark:text-gray-300\">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * 响应式网格容器
 * 提供响应式的网格布局
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { default: 1, md: 2, lg: 3 },
  gap = 6,
  className 
}: ResponsiveGridProps) {
  const gridClasses = [
    `grid`,
    `gap-${gap}`,
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  );
}