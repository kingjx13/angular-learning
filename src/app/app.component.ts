/**
 * AppComponent - 应用根组件
 *
 * 根组件是Angular应用的入口点
 * 整个应用只有一个根组件，它包含所有其他组件
 */
import { Component } from '@angular/core';
/** RouterOutlet 是一个指令，标记路由内容显示的位置 */
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  /** 导入RouterOutlet使模板中的 <router-outlet> 标签可用 */
  imports: [RouterOutlet],
  template: `
    <!-- 页面容器 -->
    <div class="container">
      <!-- 页面标题头部 -->
      <div class="header">
        <h1>用户管理系统</h1>
      </div>

      <!--
        <router-outlet> 是路由出口
        Angular Router会根据当前URL在这里渲染对应的组件
        例如：
          /          -> UserListComponent
          /user/1    -> UserDetailComponent
      -->
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  /** 应用标题 */
  title = 'user-management';
}
