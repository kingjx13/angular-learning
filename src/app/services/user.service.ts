/**
 * UserService - 用户服务
 *
 * 服务是Angular中用于组织共享代码的核心概念
 * 使用@Injectable装饰器标记为可注入的服务
 * providedIn: 'root' 表示这是一个单例服务，整个应用共享一个实例
 */
import { Injectable } from '@angular/core';
/** HttpClient - Angular的HTTP客户端，用于发送HTTP请求 */
import { HttpClient } from '@angular/common/http';
/** Observable - RxJS observables，用于处理异步数据流 */
import { Observable } from 'rxjs';
/** 引入User模型，获得类型检查支持 */
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /** API基础URL，jsonplaceholder是一个免费的REST API */
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  /**
   * 依赖注入 HttpClient
   * Angular会自动注入HttpClient实例
   * 这是依赖注入(DI)设计模式的典型应用
   */
  constructor(private http: HttpClient) { }

  /**
   * 获取所有用户列表
   * @returns Observable<User[]> - 返回用户数组的可观察对象
   *
   * 使用泛型 <User[]> 告诉TypeScript返回的是User数组
   * 调用时使用: this.userService.getUsers().subscribe(users => ...)
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * 获取单个用户详情
   * @param id - 用户ID
   * @returns Observable<User> - 返回单个用户的可观察对象
   *
   * 使用模板字符串 ` ${id}` 动态插入用户ID到URL中
   */
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * 创建新用户
   * @param user - 用户对象
   * @returns Observable<User> - 返回创建的用户对象
   *
   * POST请求用于向服务器提交新数据
   * jsonplaceholder API会返回创建成功的用户对象（带ID）
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   * 更新现有用户
   * @param user - 用户对象（必须包含id）
   * @returns Observable<User> - 返回更新后的用户对象
   *
   * PUT请求用于完整更新资源
   * 会替换服务器上的整个用户对象
   */
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  /**
   * 删除用户
   * @param id - 要删除的用户ID
   * @returns Observable<void> - 返回空的可观察对象
   *
   * DELETE请求用于删除资源
   * void表示服务器不返回具体数据
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
