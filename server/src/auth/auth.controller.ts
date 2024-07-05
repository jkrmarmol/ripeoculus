import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signIn')
  signIn(
    @Res({ passthrough: true }) res,
    @Body() data: Prisma.UsersCreateInput,
  ) {
    return this.authService.signIn(data.email, data.password, res);
  }

  @Post('signUp')
  signUp(@Body() data: Prisma.UsersCreateInput) {
    return this.authService.signUp(data.email, data.password);
  }

  @Delete('logout')
  logout(@Res({ passthrough: true }) res) {
    res.clearCookie('token');
    return { message: 'Logout Successfully' };
  }

  @UseGuards(AuthGuard)
  @Get('protected')
  protected() {
    return { message: 'Authenticated' };
  }
}
