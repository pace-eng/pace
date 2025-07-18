export { TaskCardGenerator } from './generator';
export { TaskClassifier } from './classifier';
export * from './types';

// 提供便捷的API
import { TaskCardGenerator } from './generator';
import { GeneratorConfig } from './types';

/**
 * 创建任务卡生成器实例
 */
export function createGenerator(config: GeneratorConfig): TaskCardGenerator {
  return new TaskCardGenerator(config);
}

/**
 * 默认配置
 */
export const defaultConfig: GeneratorConfig = {
  projectName: 'PACE项目',
  projectPrefix: 'PACE',
  outputDir: 'specs',
  templateDir: '模板/任务卡',
  teamMembers: ['开发者A', '开发者B', '开发者C'],
  defaultSettings: {
    priority: 'P1',
    estimationUnit: 'hours'
  }
};