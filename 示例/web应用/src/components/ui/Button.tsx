/**
 * Button组件
 * 
 * 这是一个Level 1任务的典型示例：
 * - AI主导实现，人类负责需求定义和质量审查
 * - 遵循设计系统规范
 * - 完整的TypeScript类型支持
 * - 可访问性最佳实践
 * - 可复用和可扩展的设计
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

// 使用CVA (Class Variance Authority) 定义按钮变体
const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      // 按钮变体样式
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
        success: 'bg-green-600 text-white hover:bg-green-700',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
      },
      // 按钮尺寸样式
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        xl: 'h-12 px-10 text-base rounded-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Button组件的Props接口
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 是否显示加载状态 */
  loading?: boolean;
  
  /** 加载状态时的文本 */
  loadingText?: string;
  
  /** 左侧图标 */
  leftIcon?: React.ReactNode;
  
  /** 右侧图标 */
  rightIcon?: React.ReactNode;
  
  /** 是否为块级按钮（占满父容器宽度） */
  fullWidth?: boolean;
  
  /** 是否使用Compound组件模式 */
  asChild?: boolean;
}

/**
 * 通用按钮组件
 * 
 * 使用示例：
 * ```tsx
 * <Button variant="default" size="md" onClick={handleClick}>
 *   点击我
 * </Button>
 * 
 * <Button variant="outline" loading={isLoading} loadingText="提交中...">
 *   提交
 * </Button>
 * 
 * <Button variant="ghost" size="icon" leftIcon={<Plus />}>
 *   <span className="sr-only">添加</span>
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // 当loading为true时，禁用按钮
    const isDisabled = disabled || loading;
    
    // 处理图标显示逻辑
    const iconElement = loading ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : leftIcon ? (
      leftIcon
    ) : null;
    
    // 处理按钮文本
    const buttonText = loading && loadingText ? loadingText : children;
    
    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {/* 左侧图标或加载图标 */}
        {iconElement && (
          <span className={cn('flex items-center', buttonText && 'mr-2')}>
            {iconElement}
          </span>
        )}
        
        {/* 按钮文本 */}
        {buttonText && <span>{buttonText}</span>}
        
        {/* 右侧图标（仅在非加载状态显示） */}
        {!loading && rightIcon && (
          <span className={cn('flex items-center', buttonText && 'ml-2')}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * 按钮组组件
 * 用于将多个相关按钮组合在一起
 */
export interface ButtonGroupProps {
  /** 子按钮组件 */
  children: React.ReactNode;
  
  /** 按钮组方向 */
  orientation?: 'horizontal' | 'vertical';
  
  /** 按钮组尺寸（会应用到所有子按钮） */
  size?: ButtonProps['size'];
  
  /** 按钮组变体（会应用到所有子按钮） */
  variant?: ButtonProps['variant'];
  
  /** 额外的CSS类名 */
  className?: string;
  
  /** 是否等宽分布 */
  isAttached?: boolean;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  size,
  variant,
  className,
  isAttached = false,
}) => {
  const isHorizontal = orientation === 'horizontal';
  
  return (
    <div
      className={cn(
        'inline-flex',
        isHorizontal ? 'flex-row' : 'flex-col',
        isAttached && 'divide-x divide-gray-200 dark:divide-gray-700',
        className
      )}
      role="group"
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        // 克隆子组件并应用组级别的props
        return React.cloneElement(child as React.ReactElement<ButtonProps>, {
          size: size || child.props.size,
          variant: variant || child.props.variant,
          className: cn(
            child.props.className,
            isAttached && [
              // 第一个按钮
              index === 0 && (isHorizontal ? 'rounded-r-none' : 'rounded-b-none'),
              // 中间按钮
              index > 0 && index < React.Children.count(children) - 1 && 'rounded-none',
              // 最后一个按钮
              index === React.Children.count(children) - 1 && index > 0 && 
                (isHorizontal ? 'rounded-l-none' : 'rounded-t-none'),
            ]
          ),
        });
      })}
    </div>
  );
};

/**
 * 图标按钮组件
 * 专门用于只包含图标的按钮
 */
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon'> {
  /** 图标元素 */
  icon: React.ReactNode;
  
  /** 无障碍标签 */
  'aria-label': string;
  
  /** 工具提示文本 */
  tooltip?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, loading, className, size = 'icon', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        className={className}
        loading={loading}
        {...props}
      >
        {!loading && icon}
        <span className="sr-only">{props['aria-label']}</span>
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

/**
 * 浮动操作按钮组件
 * 用于主要操作的突出显示
 */
export interface FABProps extends Omit<ButtonProps, 'variant' | 'size'> {
  /** FAB图标 */
  icon?: React.ReactNode;
  
  /** FAB尺寸 */
  size?: 'default' | 'lg';
  
  /** 位置 */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FAB: React.FC<FABProps> = ({
  icon,
  size = 'default',
  position = 'bottom-right',
  className,
  children,
  ...props
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'top-right': 'fixed top-4 right-4',
    'top-left': 'fixed top-4 left-4',
  };
  
  const sizeClasses = {
    default: 'h-14 w-14',
    lg: 'h-16 w-16',
  };
  
  return (
    <Button
      variant="default"
      className={cn(
        'rounded-full shadow-lg hover:shadow-xl z-50',
        positionClasses[position],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Button>
  );
};

// 导出按钮相关的类型和变体
export { buttonVariants };
export type { VariantProps };