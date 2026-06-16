import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponse } from '../../shared/interfaces/api-response.interface';

interface ResponseMessageBody<T> {
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T | ResponseMessageBody<T>, ApiSuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T | ResponseMessageBody<T>>,
  ): Observable<ApiSuccessResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((value: T | ResponseMessageBody<T>) => {
        const statusCode = response.statusCode;

        if (this.hasMessageBody(value)) {
          return {
            success: true,
            code: statusCode,
            message: value.message,
            data: value.data,
          };
        }

        return {
          success: true,
          code: statusCode,
          message: this.getDefaultMessage(context),
          data: value,
        };
      }),
    );
  }

  private hasMessageBody(value: unknown): value is ResponseMessageBody<T> {
    return (
      typeof value === 'object' &&
      value !== null &&
      'message' in value &&
      'data' in value
    );
  }

  private getDefaultMessage(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest<Request & { method?: string }>();
    const method = request?.method ?? 'REQUEST';

    if (method === 'GET') {
      return 'Request completed successfully';
    }

    if (method === 'POST') {
      return 'Resource created successfully';
    }

    if (method === 'PATCH' || method === 'PUT') {
      return 'Resource updated successfully';
    }

    if (method === 'DELETE') {
      return 'Resource deleted successfully';
    }

    return 'Operation completed successfully';
  }
}
