import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "../types/api-response.type";

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data) => this.wrapResponse(data, request))
    );
  }

  private wrapResponse<T>(data: T, request?: Request): ApiResponse<T> {
    if (this.isApiResponse<T>(data)) {
      return data;
    }

    return {
      success: true,
      data,
      path: request?.originalUrl ?? "",
      timestamp: new Date().toISOString()
    };
  }

  private isApiResponse<T>(payload: unknown): payload is ApiResponse<T> {
    if (typeof payload !== "object" || payload === null) {
      return false;
    }

    const candidate = payload as Partial<ApiResponse<T>>;

    return typeof candidate.success === "boolean" && typeof candidate.timestamp === "string";
  }
}
