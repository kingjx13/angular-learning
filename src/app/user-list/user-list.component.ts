/**
 * UserListComponent - 用户列表组件
 *
 * 组件是Angular应用的核心构建块
 * 每个组件包含：HTML模板、TypeScript逻辑、CSS样式
 *
 * standalone: true - 表示这是一个独立组件（Angular 14+新特性）
 * 不需要像传统方式那样在Module中声明
 */
import { Component, OnInit } from '@angular/core';
/** FormsModule 提供双向数据绑定 [(ngModel)] */
import { FormsModule } from '@angular/forms';
/** RouterLink 用于在模板中实现声明式路由导航 */
import { Router, RouterLink } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  /** 新控制流语法不需要CommonModule */
  imports: [FormsModule, RouterLink],
  template: `
    <!-- 新增用户表单 -->
    <div class="card add-user-form">
      <h3>新增用户</h3>
      <!-- [(ngModel)] 实现双向数据绑定 -->
      <div class="form-group">
        <label>姓名</label>
        <input [(ngModel)]="newUser.name" placeholder="请输入姓名">
      </div>
      <div class="form-group">
        <label>用户名</label>
        <input [(ngModel)]="newUser.username" placeholder="请输入用户名">
      </div>
      <div class="form-group">
        <label>邮箱</label>
        <input [(ngModel)]="newUser.email" placeholder="请输入邮箱">
      </div>
      <button class="btn btn-success" (click)="addUser()">新增用户</button>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="card">
      <div class="filters">
        <div class="search-box">
          <!-- (input) 事件监听用户输入，实现实时搜索 -->
          <input type="text" [(ngModel)]="searchTerm" (input)="searchUsers()" placeholder="搜索姓名或用户名...">
        </div>
        <div class="filter-buttons">
          <!-- 条件渲染使用三元表达式 -->
          <button class="btn btn-secondary" (click)="toggleSortByUsername()">
            {{ sortByUsername ? '取消排序' : '按用户名排序' }}
          </button>
          <button class="btn btn-secondary" (click)="toggleEmailFilter()">
            {{ emailFilterActive ? '取消邮箱筛选' : '邮箱S开头筛选' }}
          </button>
          <button class="btn btn-secondary" (click)="resetFilters()">重置</button>
        </div>
      </div>
    </div>

    <!--
      @for 控制流指令（Angular 17+新语法）
      语法：@for (item of items; track item.id) { ... }
      track 关键字用于性能优化，必须指定
    -->
    <div class="user-grid">
      @for (user of filteredUsers; track user.id) {
        <div class="user-card">
          <!--
            @if 控制流指令（Angular 17+新语法）
            语法：@if (condition) { ... } @else if (...) { ... } @else { ... }
            更简洁，不需要 *ngIf 指令
          -->
          @if (!editingUser || editingUser.id !== user.id) {
            <h3>{{ user.name }}</h3>
            <p><strong>用户名:</strong> {{ user.username }}</p>
            <p><strong>邮箱:</strong> {{ user.email }}</p>
            <div class="actions">
              <!-- [routerLink] 声明式路由跳转 -->
              <button class="btn btn-primary" [routerLink]="['/user', user.id]">查看详情</button>
              <button class="btn btn-secondary" (click)="startEdit(user)">编辑</button>
              <button class="btn btn-danger" (click)="confirmDelete(user)">删除</button>
            </div>
          } @else {
            <!-- 编辑模式 -->
            <div class="form-group">
              <label>姓名</label>
              <input [(ngModel)]="editingUser.name" placeholder="姓名">
            </div>
            <div class="form-group">
              <label>用户名</label>
              <input [(ngModel)]="editingUser.username" placeholder="用户名">
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input [(ngModel)]="editingUser.email" placeholder="邮箱">
            </div>
            <div class="actions">
              <button class="btn btn-success" (click)="saveEdit()">保存</button>
              <button class="btn btn-secondary" (click)="cancelEdit()">取消</button>
            </div>
          }
        </div>
      }
    </div>

    <!--
      删除确认模态框
      @if 新语法替代 *ngIf
    -->
    @if (showDeleteModal) {
      <div class="modal-overlay" (click)="closeDeleteModal($event)">
        <!-- (click)="$event.stopPropagation()" 阻止事件冒泡 -->
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>确认删除</h3>
          <!-- ?. 是可选链操作符，防止userToDelete为null时报错 -->
          <p>确定要删除用户 {{ userToDelete?.name }} 吗？</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="showDeleteModal = false">取消</button>
            <button class="btn btn-danger" (click)="deleteUser()">确认删除</button>
          </div>
        </div>
      </div>
    }
  `
})
export class UserListComponent implements OnInit {
  /** 用户列表 */
  users: User[] = [];
  /** 筛选后的用户列表（用于显示） */
  filteredUsers: User[] = [];
  /** 搜索关键词 */
  searchTerm = '';
  /** 当前编辑的用户（null表示未在编辑模式） */
  editingUser: User | null = null;
  /** 新用户表单数据 */
  newUser: Partial<User> = { name: '', username: '', email: '' };
  /** 是否显示删除确认框 */
  showDeleteModal = false;
  /** 要删除的用户对象 */
  userToDelete: User | null = null;
  /** 是否按用户名排序 */
  sortByUsername = false;
  /** 是否启用邮箱筛选 */
  emailFilterActive = false;

  /**
   * 依赖注入 UserService 和 Router
   * TypeScript的访问修饰符(private/public)会自动创建类属性
   */
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * ngOnInit - 组件生命周期钩子
   * 在组件初始化时自动调用
   * 适合在这里发送初始数据请求
   */
  ngOnInit(): void {
    this.loadUsers();
  }

  /** 加载所有用户 */
  loadUsers(): void {
    /** subscribe - 订阅Observable，接收数据 */
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  /** 搜索用户（按姓名或用户名） */
  searchUsers(): void {
    this.applyFilters();
  }

  /** 切换排序状态 */
  toggleSortByUsername(): void {
    this.sortByUsername = !this.sortByUsername;
    this.applyFilters();
  }

  /** 切换邮箱筛选状态 */
  toggleEmailFilter(): void {
    this.emailFilterActive = !this.emailFilterActive;
    this.applyFilters();
  }

  /** 重置所有筛选条件 */
  resetFilters(): void {
    this.searchTerm = '';
    this.sortByUsername = false;
    this.emailFilterActive = false;
    this.filteredUsers = [...this.users];  // 创建新数组，避免修改原数组
  }

  /**
   * 应用所有筛选条件
   * 使用管道式处理：先搜索，再筛选邮箱，最后排序
   */
  applyFilters(): void {
    let result = [...this.users];

    // 搜索过滤
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term)
      );
    }

    // 邮箱前缀过滤（筛选S开头的邮箱）
    if (this.emailFilterActive) {
      result = result.filter(user => user.email.toLowerCase().startsWith('s'));
    }

    // 用户名排序
    if (this.sortByUsername) {
      result.sort((a, b) => a.username.localeCompare(b.username));
    }

    this.filteredUsers = result;
  }

  /** 添加新用户 */
  addUser(): void {
    // 表单验证
    if (!this.newUser.name || !this.newUser.username || !this.newUser.email) {
      alert('请填写所有字段');
      return;
    }

    // 创建用户对象（使用时间戳作为临时ID）
    const user: User = {
      id: Date.now(),
      name: this.newUser.name!,
      username: this.newUser.username!,
      email: this.newUser.email!
    };

    // 调用服务创建用户
    this.userService.createUser(user).subscribe({
      next: () => {
        // 成功后将新用户添加到列表开头
        this.users.unshift(user);
        this.applyFilters();
        // 重置表单
        this.newUser = { name: '', username: '', email: '' };
        alert('用户新增成功！');
      },
      error: (err) => {
        console.error('创建用户失败', err);
        alert('创建用户失败，请重试');
      }
    });
  }

  /** 开始编辑用户 */
  startEdit(user: User): void {
    // 使用展开运算符创建用户副本，避免直接修改原对象
    this.editingUser = { ...user };
  }

  /** 保存编辑 */
  saveEdit(): void {
    if (!this.editingUser) return;

    this.userService.updateUser(this.editingUser).subscribe({
      next: () => {
        // 更新列表中的用户数据
        const index = this.users.findIndex(u => u.id === this.editingUser!.id);
        if (index !== -1) {
          this.users[index] = { ...this.editingUser! };
          this.applyFilters();
        }
        this.editingUser = null;
        alert('用户更新成功！');
      },
      error: (err) => {
        console.error('更新用户失败', err);
        alert('更新用户失败，请重试');
      }
    });
  }

  /** 取消编辑 */
  cancelEdit(): void {
    this.editingUser = null;
  }

  /** 显示删除确认框 */
  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  /** 关闭删除确认框 */
  closeDeleteModal(event: Event): void {
    // 点击遮罩层时关闭
    if ((event.target as Element).classList.contains('modal-overlay')) {
      this.showDeleteModal = false;
    }
  }

  /** 确认删除用户 */
  deleteUser(): void {
    if (!this.userToDelete) return;

    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        // 从列表中移除用户
        this.users = this.users.filter(u => u.id !== this.userToDelete!.id);
        this.applyFilters();
        this.showDeleteModal = false;
        this.userToDelete = null;
        alert('用户删除成功！');
      },
      error: (err) => {
        console.error('删除用户失败', err);
        alert('删除用户失败，请重试');
      }
    });
  }
}
