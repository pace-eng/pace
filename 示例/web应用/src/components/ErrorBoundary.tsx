/**
 * 错误边界组件
 * 
 * 这是一个Level 2任务的典型示例：
 * - 需要人机协作来设计错误处理策略
 * - AI实现具体的错误捕获逻辑
 * - 人类定义错误回退UI和用户体验
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// 错误边界状态接口
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId?: string;
}

// 错误边界属性接口
interface ErrorBoundaryProps {
  /** 子组件 */
  children: ReactNode;
  
  /** 自定义错误回退UI */
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
  
  /** 错误回调函数 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  
  /** 是否显示错误详情（仅开发环境） */
  showErrorDetails?: boolean;
  
  /** 组件标识符（用于错误追踪） */
  componentName?: string;
}

/**
 * 全局错误边界组件
 * 
 * 功能特性：
 * - 捕获React组件树中的JavaScript错误
 * - 显示友好的错误回退UI
 * - 提供错误重试机制
 * - 集成错误监控和上报
 * - 开发环境显示详细错误信息
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * 从错误中派生状态
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * 捕获错误详细信息
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      errorInfo,
      eventId: this.generateEventId(),
    });

    // 调用错误回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 上报错误到监控服务
    this.reportError(error, errorInfo);
  }

  /**
   * 生成错误事件ID
   */
  private generateEventId(): string {
    return `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * 上报错误到监控服务
   */
  private reportError(error: Error, errorInfo: ErrorInfo) {
    // 这里可以集成错误监控服务，如 Sentry、LogRocket 等
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      componentName: this.props.componentName,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // 发送到错误监控服务
    if (process.env.NODE_ENV === 'production') {
      // window.errorTracker?.captureException(error, { extra: errorReport });
      console.log('Error reported:', errorReport);
    }
  }

  /**
   * 重试机制
   */
  private handleRetry = () => {
    // 清除之前的重试定时器
    if (this.retryTimeoutId) {
      window.clearTimeout(this.retryTimeoutId);
    }

    // 延迟重置状态，避免立即重试
    this.retryTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        eventId: undefined,
      });
    }, 100);
  };

  /**
   * 刷新页面
   */
  private handleRefresh = () => {
    window.location.reload();
  };

  /**
   * 返回首页
   */
  private handleGoHome = () => {
    window.location.href = '/';
  };

  /**
   * 复制错误信息
   */
  private handleCopyError = () => {
    const { error, errorInfo, eventId } = this.state;
    const errorText = [
      `Event ID: ${eventId}`,
      `Error: ${error?.message}`,
      `Stack: ${error?.stack}`,
      `Component Stack: ${errorInfo?.componentStack}`,
      `Timestamp: ${new Date().toISOString()}`,
      `URL: ${window.location.href}`,
    ].join('\n\n');

    navigator.clipboard.writeText(errorText).then(() => {
      alert('错误信息已复制到剪贴板');
    });
  };

  /**
   * 组件卸载时清理
   */
  componentWillUnmount() {
    if (this.retryTimeoutId) {
      window.clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    const { hasError, error, errorInfo, eventId } = this.state;
    const { children, fallback, showErrorDetails = process.env.NODE_ENV === 'development' } = this.props;

    if (hasError && error) {
      // 如果提供了自定义回退UI，使用它
      if (fallback && errorInfo) {
        return fallback(error, errorInfo, this.handleRetry);
      }

      // 默认错误UI
      return (
        <div className=\"min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4\">
          <div className=\"max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center\">
            {/* 错误图标 */}
            <div className=\"flex justify-center mb-4\">
              <div className=\"w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center\">
                <AlertTriangle className=\"w-8 h-8 text-red-600 dark:text-red-400\" />
              </div>
            </div>

            {/* 错误标题 */}
            <h1 className=\"text-xl font-semibold text-gray-900 dark:text-white mb-2\">
              出错了
            </h1>

            {/* 错误描述 */}
            <p className=\"text-gray-600 dark:text-gray-300 mb-6\">
              应用程序遇到了意外错误。我们已经记录了这个问题，正在努力修复。
            </p>

            {/* 事件ID */}
            {eventId && (
              <div className=\"bg-gray-100 dark:bg-gray-700 rounded-md p-3 mb-6\">
                <p className=\"text-sm text-gray-600 dark:text-gray-300\">
                  错误事件ID: <code className=\"font-mono\">{eventId}</code>
                </p>
              </div>
            )}

            {/* 操作按钮 */}
            <div className=\"flex flex-col sm:flex-row gap-3 mb-6\">
              <Button
                onClick={this.handleRetry}
                className=\"flex-1\"
                leftIcon={<RefreshCw className=\"w-4 h-4\" />}
              >
                重试
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant=\"outline\"
                className=\"flex-1\"
                leftIcon={<Home className=\"w-4 h-4\" />}
              >
                返回首页
              </Button>
            </div>

            {/* 错误详情（仅开发环境） */}
            {showErrorDetails && (
              <details className=\"text-left\">
                <summary className=\"cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2\">
                  <Bug className=\"w-4 h-4\" />
                  查看错误详情
                </summary>
                
                <div className=\"bg-gray-100 dark:bg-gray-700 rounded-md p-3 text-xs font-mono text-left overflow-auto max-h-64\">
                  <div className=\"mb-3\">
                    <strong>错误信息:</strong>
                    <pre className=\"mt-1 text-red-600 dark:text-red-400\">{error.message}</pre>
                  </div>
                  
                  {error.stack && (
                    <div className=\"mb-3\">
                      <strong>错误堆栈:</strong>
                      <pre className=\"mt-1 text-gray-600 dark:text-gray-300 whitespace-pre-wrap\">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  
                  {errorInfo?.componentStack && (
                    <div>
                      <strong>组件堆栈:</strong>
                      <pre className=\"mt-1 text-gray-600 dark:text-gray-300 whitespace-pre-wrap\">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={this.handleCopyError}
                  variant=\"ghost\"
                  size=\"sm\"
                  className=\"mt-2\"
                >
                  复制错误信息
                </Button>
              </details>
            )}

            {/* 帮助信息 */}
            <div className=\"border-t pt-4 mt-4\">
              <p className=\"text-sm text-gray-500 dark:text-gray-400\">
                如果问题持续存在，请联系技术支持并提供错误事件ID。
              </p>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * 高阶组件：为组件添加错误边界
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook：在函数组件中处理错误
 */
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: string) => {
    console.error('Error caught by error handler:', error);
    
    // 可以在这里添加错误上报逻辑
    if (process.env.NODE_ENV === 'production') {
      // window.errorTracker?.captureException(error, { extra: { errorInfo } });
    }
    
    // 抛出错误让最近的错误边界捕获
    throw error;
  }, []);
}