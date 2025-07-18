/**
 * ID生成工具
 * 
 * Level 1任务：简单工具函数实现
 * - 唯一标识符生成
 * - 短ID生成
 * - 时间戳ID生成
 */

/**
 * 生成UUID v4
 * 使用加密安全的随机数生成器
 */
export function generateId(): string {
  // 如果环境支持crypto API，使用crypto.randomUUID()
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // 降级方案：使用数学随机数
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 生成短ID
 * 适用于非关键场景，如临时标识
 */
export function generateShortId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * 生成时间戳ID
 * 基于当前时间戳和随机数
 */
export function generateTimestampId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomPart}`;
}

/**
 * 生成递增ID
 * 适用于需要有序ID的场景
 */
let incrementalCounter = 0;

export function generateIncrementalId(prefix: string = 'item'): string {
  incrementalCounter++;
  return `${prefix}-${incrementalCounter.toString().padStart(6, '0')}`;
}

/**
 * 重置递增计数器
 */
export function resetIncrementalCounter(): void {
  incrementalCounter = 0;
}

/**
 * 验证ID格式
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * 从字符串生成一致的ID
 * 用于需要从内容生成固定ID的场景
 */
export function generateConsistentId(input: string): string {
  // 简单的哈希函数
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  
  // 将哈希值转换为正数并生成ID
  const positiveHash = Math.abs(hash);
  return `gen-${positiveHash.toString(36)}-${Date.now().toString(36)}`;
}