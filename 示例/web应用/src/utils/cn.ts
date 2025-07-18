/**
 * CSS类名合并工具
 * 
 * 这是一个Level 1任务的典型示例：
 * - 简单的工具函数实现
 * - 重复性的逻辑抽象
 * - AI可以独立完成
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 智能合并Tailwind CSS类名
 * 自动处理冲突的样式类，优先保留后面的类
 * 
 * @param inputs - 类名字符串、对象或数组
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 条件类名辅助函数
 * 
 * @param condition - 条件表达式
 * @param trueClass - 条件为真时的类名
 * @param falseClass - 条件为假时的类名
 * @returns 条件类名字符串
 */
export function conditionalClass(
  condition: boolean,
  trueClass: string,
  falseClass: string = ''
): string {
  return condition ? trueClass : falseClass;
}

/**
 * 变体类名生成器
 * 用于创建组件的不同变体样式
 */
export function createVariantClasses<T extends Record<string, Record<string, string>>>(
  variants: T
) {
  return function getVariantClass<K extends keyof T>(
    variant: K,
    value: keyof T[K]
  ): string {
    return variants[variant][value] || '';
  };
}

/**
 * 响应式类名工具
 * 简化响应式样式的编写
 */
export const responsive = {
  /** 移动端优先的响应式类名 */
  mobile: (className: string) => className,
  tablet: (className: string) => `md:${className}`,
  desktop: (className: string) => `lg:${className}`,
  wide: (className: string) => `xl:${className}`,
  
  /** 生成完整的响应式类名 */
  all: (mobile: string, tablet?: string, desktop?: string, wide?: string) => {
    const classes = [mobile];
    if (tablet) classes.push(`md:${tablet}`);
    if (desktop) classes.push(`lg:${desktop}`);
    if (wide) classes.push(`xl:${wide}`);
    return cn(...classes);
  },
};

/**
 * 状态类名工具
 * 用于处理组件的不同状态样式
 */
export const state = {
  hover: (className: string) => `hover:${className}`,
  focus: (className: string) => `focus:${className}`,
  active: (className: string) => `active:${className}`,
  disabled: (className: string) => `disabled:${className}`,
  
  /** 生成交互状态类名 */
  interactive: (base: string, hover?: string, focus?: string, active?: string) => {
    const classes = [base];
    if (hover) classes.push(`hover:${hover}`);
    if (focus) classes.push(`focus:${focus}`);
    if (active) classes.push(`active:${active}`);
    return cn(...classes);
  },
};