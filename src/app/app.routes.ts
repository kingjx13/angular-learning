/**
 * 应用路由配置
 *
 * 路由定义了URL路径与组件之间的映射关系
 * 当用户访问某个URL时，Angular Router会自动加载对应的组件
 */
import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

/**
 * Routes 数组 - 定义所有路由规则
 * 每个路由对象包含：
 *   path: URL路径
 *   component: 对应的组件
 */
export const routes: Routes = [
  /**
   * 空路径 '' - 默认显示用户列表
   * 这是应用的首页
   */
  { path: '', component: UserListComponent },

  /**
   * 动态路由 '/user/:id'
   * :id 是路由参数，表示用户ID
   * 访问 /user/1 会加载ID为1的用户详情
   */
  { path: 'user/:id', component: UserDetailComponent },

  /**
   * 通配符路由 '**'
   * 匹配所有未定义的路径
   * 重定向到首页
   */
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
