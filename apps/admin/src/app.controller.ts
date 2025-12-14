import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly adminService: AppService) {}

  @Get()
  getHello(): string {
    return this.adminService.getHello();
  }
}
