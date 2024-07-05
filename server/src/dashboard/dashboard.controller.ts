import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('dashboard')
export class DashboardController {
  @UseGuards(AuthGuard)
  @Get()
  findOne() {
    return 'test';
  }
}
