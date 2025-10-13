import { registerAs } from "@nestjs/config";

export interface AppConfig {
  name: string;
  description: string;
  env: string;
  version: string;
  port: number;
  globalPrefix: string;
  requestTimeoutMs: number;
}

export default registerAs<AppConfig>("app", () => ({
  name: process.env.APP_NAME ?? "Nixora Marketing API",
  description:
    process.env.APP_DESCRIPTION ?? "Backend services for the Nixora marketing platform.",
  env: process.env.NODE_ENV ?? "development",
  version: process.env.APP_VERSION ?? "0.1.0",
  port: Number(process.env.PORT ?? 3333),
  globalPrefix: process.env.GLOBAL_PREFIX ?? "api",
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS ?? 10000)
}));
