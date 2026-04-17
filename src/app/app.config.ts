/**
 * 应用配置
 *
 * appConfig 定义了应用的全局配置和提供商(Providers)
 * 提供商是Angular依赖注入系统的核心部分
 */
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * provideZoneChangeDetection - 区域变化检测配置
     * eventCoalescing: true 优化性能，合并事件
     *
     * Zone.js 是一个用于检测异步操作完成 的库
     * Angular使用它来自动检测何时需要更新视图
     */

    /**
     * provideRouter - 配置路由功能
     * withComponentInputBinding() 允许将路由参数绑定到组件输入属性
     */
    provideRouter(routes),

    /**
     * provideHttpClient - 配置HTTP客户端
     * 允许组件和服务发送HTTP请求
     * 这是调用REST API所必需的
     */
    provideHttpClient()
  ]
};
