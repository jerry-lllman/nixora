import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { ResponseTransformInterceptor } from "./common/interceptors/response-transform.interceptor";
import { TimeoutInterceptor } from "./common/interceptors/timeout.interceptor";
import { AppConfig } from "./config/app.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger("Bootstrap");
  app.useLogger(logger);
  app.enableCors();
  app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  const config = configService.getOrThrow<AppConfig>("app");

  app.setGlobalPrefix(config.globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseTransformInterceptor(),
    new TimeoutInterceptor(config.requestTimeoutMs)
  );

  await app.listen(config.port);
  logger.log(`🚀 Nixora API is running on http://localhost:${config.port}/${config.globalPrefix}`);
}

void bootstrap();
