import { registerAs } from "@nestjs/config";

export interface DatabaseConfig {
  url: string;
  synchronize: boolean;
}

export default registerAs<DatabaseConfig>("database", () => ({
  url:
    process.env.DATABASE_URL ??
    "postgres://postgres:postgres@localhost:5432/nixora",
  synchronize:
    process.env.DB_SYNCHRONIZE !== undefined
      ? process.env.DB_SYNCHRONIZE === "true"
      : process.env.NODE_ENV !== "production"
}));
