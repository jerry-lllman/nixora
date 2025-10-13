import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import type { SignOptions } from "jsonwebtoken";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.getOrThrow<SignOptions["expiresIn"]>("auth.jwtExpiresIn");

        return {
          secret: configService.getOrThrow<string>("auth.jwtSecret"),
          signOptions: { expiresIn: expiresIn as SignOptions["expiresIn"] }
        };
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthGuard, JwtAuthGuard, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
