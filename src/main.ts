/**
 * main.ts - 应用入口文件
 *
 * 这个文件是Angular应用的起点
 * 负责引导(bootstrap)整个应用程序
 */
import { bootstrapApplication } from '@angular/platform-browser';
/** 引入应用配置 */
import { appConfig } from './app/app.config';
/** 引入根组件 */
import { AppComponent } from './app/app.component';

/**
 * bootstrapApplication - 引导Angular应用
 *
 * 参数：
 *   AppComponent - 根组件
 *   appConfig - 应用配置（提供商、路由等）
 *
 * 这个函数会：
 * 1. 创建根组件实例
 * 2. 配置依赖注入
 * 3. 启动Angular框架
 * 4. 将根组件挂载到DOM中
 */
bootstrapApplication(AppComponent, appConfig)
  /** catch 处理引导过程中的错误 */
  .catch((err) => console.error(err));
