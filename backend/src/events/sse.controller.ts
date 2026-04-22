import { Controller, Sse, Get } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * SSE 控制器
 * 用于向后端发送后端服务状态通知
 * 使用 Server-Sent Events 实现单向实时通信
 */
@Controller('events')
export class SseController {
  /**
   * SSE 流端点
   * 当前端连接时，发送后端启动通知
   */
  @Get('stream')
  @Sse()
  stream(): Observable<MessageEvent> {
    return new Observable(observer => {
      // 发送后端启动通知
      observer.next({
        data: JSON.stringify({
          message: 'Backend service started',
          timestamp: new Date().toISOString(),
        }),
      } as MessageEvent);

      console.log('已发送 SSE 后端启动通知');

      // 发送完成后关闭连接
      setTimeout(() => {
        observer.complete();
      }, 500);
    });
  }
}
