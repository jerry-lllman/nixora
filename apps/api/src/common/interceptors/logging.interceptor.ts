import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request) {
      return next.handle();
    }

    const { method, originalUrl } = request;
    const startedAt = Date.now();

    this.logger.log(`Incoming request ${method} ${originalUrl}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const elapsed = Date.now() - startedAt;
          this.logger.log(`Completed ${method} ${originalUrl} in ${elapsed}ms`);
        },
        error: (err) => {
          const elapsed = Date.now() - startedAt;
          this.logger.error(
            `Failed ${method} ${originalUrl} after ${elapsed}ms`,
            err instanceof Error ? err.stack : undefined
          );
        }
      })
    );
  }
}
