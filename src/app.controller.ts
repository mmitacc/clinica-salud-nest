import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator.js';

@Public()
@Controller()
@ApiTags('Testing')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
