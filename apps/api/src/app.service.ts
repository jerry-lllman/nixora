import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: "Nixora Marketing API",
      status: "ok"
    };
  }
}
