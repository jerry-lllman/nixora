import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import appConfig from "./config/app.config";

@Injectable()
export class AppService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>
  ) {}

  getStatus() {
    return {
      name: this.config.name,
      description: this.config.description,
      version: this.config.version,
      environment: this.config.env,
      status: "ok"
    };
  }
}
