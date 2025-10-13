import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RequestWithUser } from "../common/types/request-with-user.type";
import type { AuthTokenResponse } from "./auth.service";
import type { SafeUser } from "../users/users.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto): Promise<SafeUser> {
    return this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Req() req: RequestWithUser): Promise<AuthTokenResponse> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Req() req: RequestWithUser): SafeUser {
    return req.user;
  }
}
