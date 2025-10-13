import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import type { SignOptions } from "jsonwebtoken";
import type { SafeUser } from "../users/users.service";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

export interface AuthTokenResponse {
  accessToken: string;
  expiresIn: string;
  tokenType: "Bearer";
  user: SafeUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto): Promise<SafeUser> {
    const existing = await this.usersService.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException("Email address already in use.");
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      this.configService.getOrThrow<number>("auth.bcryptSaltRounds")
    );

    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name
    });

    return this.usersService.toSafeUser(user);
  }

  async validateUser(email: string, password: string): Promise<SafeUser> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    return this.usersService.toSafeUser(user);
  }

  async login(user: SafeUser): Promise<AuthTokenResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      expiresIn: String(
        this.configService.getOrThrow<SignOptions["expiresIn"]>("auth.jwtExpiresIn")
      ),
      tokenType: "Bearer" as const,
      user
    };
  }
}
