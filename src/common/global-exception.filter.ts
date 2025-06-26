import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    // NestJS error
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    }

    // TypeORM: Not Found
    else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;

      const id =
        request.params?.id ||
        request.query?.id ||
        request.body?.id ||
        'unknown';

      message = `The requested entity was not found. ID: ${id}`;
    }

    // TypeORM: Query Errors (MySQL)
    else if (exception instanceof QueryFailedError) {
      const err = exception as any;

      switch (err.errno) {
        case 1062:
          status = HttpStatus.BAD_REQUEST;
          message = 'Duplicate entry';
          break;
        case 1451:
          status = HttpStatus.BAD_REQUEST;
          message = 'Cannot delete: foreign key constraint';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = err.message;
      }
    }

    // Final response
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
