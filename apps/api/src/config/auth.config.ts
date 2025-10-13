import { registerAs } from "@nestjs/config";
import type { SignOptions } from "jsonwebtoken";

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: SignOptions["expiresIn"];
  bcryptSaltRounds: number;
}

const resolveJwtExpiresIn = (): SignOptions["expiresIn"] => {
  const raw = process.env.JWT_EXPIRES_IN;

  if (!raw || raw.trim().length === 0) {
    return 3600;
  }

  const trimmed = raw.trim();
  const numeric = Number(trimmed);

  if (!Number.isNaN(numeric)) {
    return numeric;
  }

  return trimmed as SignOptions["expiresIn"];
};

export default registerAs<AuthConfig>("auth", () => ({
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  jwtExpiresIn: resolveJwtExpiresIn(),
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 12)
}));
