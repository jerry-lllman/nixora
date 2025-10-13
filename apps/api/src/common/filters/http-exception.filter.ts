import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger
} from "@nestjs/common";
import { Request, Response } from "express";
import { ApiResponse } from "../types/api-response.type";

interface ErrorResponse extends ApiResponse<null> {
  statusCode: number;
  errors?: unknown;
}

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);

    this.logger.error(
      `Request ${request.method} ${request.originalUrl} failed with status ${errorResponse.statusCode}`,
      exception instanceof Error ? exception.stack : undefined
    );

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(exception: unknown, request: Request): ErrorResponse {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message = this.extractMessage(response);

      return {
        success: false,
        data: null,
        statusCode: status,
        message,
        errors: typeof response === "string" ? undefined : response,
        path: request.originalUrl,
        timestamp: new Date().toISOString()
      };
    }

    return {
      success: false,
      data: null,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception instanceof Error ? exception.message : "Internal server error",
      path: request.originalUrl,
      timestamp: new Date().toISOString()
    };
  }

  private extractMessage(response: unknown): string {
    if (typeof response === "string") {
      return response;
    }

    if (typeof response === "object" && response !== null) {
      const payload = response as Record<string, unknown>;
      const message = payload["message"];

      if (Array.isArray(message)) {
        return message.join(" | ");
      }

      if (typeof message === "string") {
        return message;
      }
    }

    return "Unexpected error";
  }
}
