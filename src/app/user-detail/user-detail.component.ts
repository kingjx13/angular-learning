/**
 * UserDetailComponent - 用户详情组件
 *
 * 这个组件负责显示单个用户的完整信息
 * 通过路由参数获取用户ID，然后从API加载数据
 */
import { Component, OnInit } from '@angular/core';
/** RouterLink 用于声明式路由导航 */
import { RouterLink } from '@angular/router';
/**
 * ActivatedRoute - 路由服务，用于获取当前路由的参数
 * Router - 编程式导航服务
 */
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  /** 新控制流语法不需要CommonModule */
  imports: [RouterLink],
  template: `
    <!--
      @if 控制流指令（Angular 17+新语法）
      替代旧的 *ngIf="user"
    -->
    @if (user) {
      <div class="card">
        <h2>{{ user.name }} 的详细信息</h2>
        <div class="detail-info">
          <!-- 基本信息 -->
          <p><span>ID:</span> {{ user.id }}</p>
          <p><span>姓名:</span> {{ user.name }}</p>
          <p><span>用户名:</span> {{ user.username }}</p>
          <p><span>邮箱:</span> {{ user.email }}</p>

          <!-- 可选字段使用 @if 检查是否存在 -->
          @if (user.phone) {
            <p><span>电话:</span> {{ user.phone }}</p>
          }
          @if (user.website) {
            <p><span>网站:</span> {{ user.website }}</p>
          }

          <!-- 地址信息 -->
          @if (user.address) {
            <div>
              <h3>地址</h3>
              <p><span>街道:</span> {{ user.address.street }}</p>
              <p><span>套房:</span> {{ user.address.suite }}</p>
              <p><span>城市:</span> {{ user.address.city }}</p>
              <p><span>邮编:</span> {{ user.address.zipcode }}</p>
            </div>
          }

          <!-- 公司信息 -->
          @if (user.company) {
            <div>
              <h3>公司</h3>
              <p><span>公司名称:</span> {{ user.company.name }}</p>
              <p><span>标语:</span> {{ user.company.catchPhrase }}</p>
              <p><span>业务:</span> {{ user.company.bs }}</p>
            </div>
          }
        </div>

        <!-- 返回按钮 - 使用routerLink导航回列表 -->
        <div style="margin-top: 20px;">
          <button class="btn btn-primary" routerLink="/">返回列表</button>
        </div>
      </div>
    }

    <!-- 用户不存在时显示 -->
    @if (!user && !loading) {
      <div class="card">
        <p>未找到该用户</p>
        <button class="btn btn-primary" routerLink="/">返回列表</button>
      </div>
    }

    <!-- 加载状态 -->
    @if (loading) {
      <div class="card">
        <p>加载中...</p>
      </div>
    }
  `
})
export class UserDetailComponent implements OnInit {
  /** 当前用户对象 */
  user: User | null = null;
  /** 加载状态标志 */
  loading = true;

  /**
   * 注入路由服务
   * ActivatedRoute 提供当前路由的信息和参数
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  /**
   * ngOnInit - 组件生命周期钩子
   * 在组件初始化时自动调用
   */
  ngOnInit(): void {
    /** snapshot.paramMap.get('id') 获取路由中的id参数 */
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      /** +id 将字符串转换为数字 */
      this.userService.getUser(+id).subscribe({
        next: (user) => {
          this.user = user;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}
