/**
 * Input组件
 * 
 * 这是一个Level 1任务的典型示例：
 * - AI主导实现，人类负责需求定义和质量审查
 * - 遵循设计系统规范
 * - 完整的TypeScript类型支持
 * - 可访问性最佳实践
 * - 支持多种输入类型和状态
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Search, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

// 使用CVA定义输入框变体
const inputVariants = cva(
  // 基础样式
  'w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      // 输入框状态变体
      variant: {
        default: 'border-input hover:border-accent-foreground',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
      },
      // 输入框尺寸
      size: {
        sm: 'h-8 px-2 py-1 text-xs',
        default: 'h-10 px-3 py-2 text-sm',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Input组件的Props接口
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** 输入框标签 */
  label?: string;
  
  /** 错误信息 */
  error?: string;
  
  /** 成功信息 */
  success?: string;
  
  /** 帮助文本 */
  helperText?: string;
  
  /** 左侧图标 */
  leftIcon?: React.ReactNode;
  
  /** 右侧图标 */
  rightIcon?: React.ReactNode;
  
  /** 是否显示密码可见性切换（仅当type为password时有效） */
  showPasswordToggle?: boolean;
  
  /** 是否显示清除按钮 */
  showClearButton?: boolean;
  
  /** 清除按钮点击事件 */
  onClear?: () => void;
  
  /** 容器的额外类名 */
  containerClassName?: string;
}

/**
 * 通用输入框组件
 * 
 * 使用示例：
 * ```tsx
 * <Input
 *   label="邮箱地址"
 *   type="email"
 *   placeholder="请输入邮箱"
 *   error={errors.email}
 * />
 * 
 * <Input
 *   type="password"
 *   showPasswordToggle
 *   placeholder="请输入密码"
 * />
 * 
 * <Input
 *   leftIcon={<Search className="w-4 h-4" />}
 *   placeholder="搜索..."
 *   showClearButton
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      type = 'text',
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      showClearButton = false,
      onClear,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(props.value || props.defaultValue || '');
    
    // 自动生成ID
    const inputId = id || React.useId();
    
    // 处理密码显示切换
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    
    // 处理清除操作
    const handleClear = () => {
      setInputValue('');
      if (onClear) {
        onClear();
      }
      // 触发onChange事件
      if (props.onChange) {
        const event = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(event);
      }
    };
    
    // 处理输入值变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (props.onChange) {
        props.onChange(e);
      }
    };
    
    // 确定当前输入框类型
    const inputType = type === 'password' && showPassword ? 'text' : type;
    
    // 确定当前变体（基于验证状态）
    const currentVariant = error ? 'error' : success ? 'success' : variant;
    
    // 计算是否显示右侧图标区域
    const hasRightContent = rightIcon || 
      (type === 'password' && showPasswordToggle) || 
      (showClearButton && inputValue);
    
    return (
      <div className={cn('space-y-2', containerClassName)}>
        {/* 标签 */}
        {label && (
          <label
            htmlFor={inputId}
            className=\"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70\"
          >
            {label}
          </label>
        )}
        
        {/* 输入框容器 */}
        <div className=\"relative\">
          {/* 左侧图标 */}
          {leftIcon && (
            <div className=\"absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground\">
              {leftIcon}
            </div>
          )}
          
          {/* 输入框 */}
          <input
            id={inputId}
            type={inputType}
            className={cn(
              inputVariants({ variant: currentVariant, size }),
              leftIcon && 'pl-10',
              hasRightContent && 'pr-10',
              className
            )}
            ref={ref}
            value={inputValue}
            onChange={handleChange}
            {...props}
          />
          
          {/* 右侧内容 */}
          {hasRightContent && (
            <div className=\"absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1\">
              {/* 清除按钮 */}
              {showClearButton && inputValue && (
                <button
                  type=\"button\"
                  onClick={handleClear}
                  className=\"text-muted-foreground hover:text-foreground transition-colors\"
                  aria-label=\"清除内容\"
                >
                  ×
                </button>
              )}
              
              {/* 密码可见性切换 */}
              {type === 'password' && showPasswordToggle && (
                <button
                  type=\"button\"
                  onClick={togglePasswordVisibility}
                  className=\"text-muted-foreground hover:text-foreground transition-colors\"
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? (
                    <EyeOff className=\"w-4 h-4\" />
                  ) : (
                    <Eye className=\"w-4 h-4\" />
                  )}
                </button>
              )}
              
              {/* 自定义右侧图标 */}
              {rightIcon && (
                <div className=\"text-muted-foreground\">
                  {rightIcon}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* 帮助文本和错误信息 */}
        {(error || success || helperText) && (
          <div className=\"flex items-start space-x-1 text-xs\">
            {error && (
              <>
                <AlertCircle className=\"w-4 h-4 text-destructive mt-0.5 flex-shrink-0\" />
                <span className=\"text-destructive\">{error}</span>
              </>
            )}
            
            {success && !error && (
              <>
                <CheckCircle className=\"w-4 h-4 text-green-600 mt-0.5 flex-shrink-0\" />
                <span className=\"text-green-600\">{success}</span>
              </>
            )}
            
            {helperText && !error && !success && (
              <span className=\"text-muted-foreground\">{helperText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * 搜索输入框组件
 * 预配置的搜索输入框
 */
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  /** 搜索回调 */
  onSearch?: (value: string) => void;
  
  /** 搜索延迟（毫秒） */
  searchDelay?: number;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, searchDelay = 300, showClearButton = true, ...props }, ref) => {
    const [searchTimeout, setSearchTimeout] = React.useState<NodeJS.Timeout>();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      // 清除之前的搜索延迟
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      // 设置新的搜索延迟
      if (onSearch) {
        const timeout = setTimeout(() => {
          onSearch(value);
        }, searchDelay);
        setSearchTimeout(timeout);
      }
      
      if (props.onChange) {
        props.onChange(e);
      }
    };
    
    // 清理定时器
    React.useEffect(() => {
      return () => {
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }
      };
    }, [searchTimeout]);
    
    return (
      <Input
        ref={ref}
        type=\"text\"
        leftIcon={<Search className=\"w-4 h-4\" />}
        showClearButton={showClearButton}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

/**
 * 文本域组件
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 标签 */
  label?: string;
  
  /** 错误信息 */
  error?: string;
  
  /** 帮助文本 */
  helperText?: string;
  
  /** 是否可调整大小 */
  resize?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, resize = true, id, ...props }, ref) => {
    const textareaId = id || React.useId();
    
    return (
      <div className=\"space-y-2\">
        {label && (
          <label
            htmlFor={textareaId}
            className=\"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70\"
          >
            {label}
          </label>
        )}
        
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            !resize && 'resize-none',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        
        {(error || helperText) && (
          <div className=\"flex items-start space-x-1 text-xs\">
            {error ? (
              <>
                <AlertCircle className=\"w-4 h-4 text-destructive mt-0.5 flex-shrink-0\" />
                <span className=\"text-destructive\">{error}</span>
              </>
            ) : (
              helperText && (
                <span className=\"text-muted-foreground\">{helperText}</span>
              )
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';