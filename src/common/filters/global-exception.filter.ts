import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from '../../shared/interfaces/api-response.interface';

interface HttpExceptionResponseBody {
  message?: string | string[];
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const message = this.extractHttpMessage(exceptionResponse, exception.message);
      const body: ApiErrorResponse = {
        success: false,
        code: statusCode,
        message,
      };

      response.status(statusCode).json(body);
      return;
    }

    const body: ApiErrorResponse = {
      success: false,
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }

  private extractHttpMessage(
    response: string | HttpExceptionResponseBody,
    fallback: string,
  ): string {
    if (typeof response === 'string') {
      return response;
    }

    const message = response?.message;
    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }

    return fallback;
  }
}
