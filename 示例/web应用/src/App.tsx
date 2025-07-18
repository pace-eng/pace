import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

// 布局组件
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// 页面组件
import { Dashboard } from '@/pages/Dashboard';
import { Tasks } from '@/pages/Tasks';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';

// 全局样式和主题
import './index.css';

// 创建React Query客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      cacheTime: 10 * 60 * 1000, // 10分钟
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * TaskFlow应用主组件
 * 
 * 这个组件展示了PACE方法论中的应用架构设计：
 * - Level 3任务：整体应用架构和路由设计
 * - 清晰的关注点分离
 * - 错误边界和全局状态管理
 * - 性能优化的查询客户端配置
 */
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Layout>
              <Routes>
                {/* 默认重定向到仪表板 */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* 主要页面路由 */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* 404页面 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            
            {/* 全局通知组件 */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--color-success)',
                    secondary: 'var(--color-background)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'var(--color-error)',
                    secondary: 'var(--color-background)',
                  },
                },
              }}
            />
          </div>
        </Router>
        
        {/* React Query开发工具 - 仅在开发环境显示 */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

/**
 * 404页面组件
 * Level 1任务：简单的错误页面实现
 */
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 text-center">
      <div className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">
        404
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        页面未找到
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        抱歉，您访问的页面不存在。
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        返回上页
      </button>
    </div>
  );
}

export default App;