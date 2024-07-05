import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Put('password')
  async updatePassword(
    @Body() data: { currentPassword: string; newPassword: string },
    @Req() req: any,
  ) {
    return this.profileService.updatePassword(
      req.user.sub,
      data.currentPassword,
      data.newPassword,
    );
  }

  @UseGuards(AuthGuard)
  @Put('name')
  async updateName(@Body() data: { name: string }, @Req() req: any) {
    return this.profileService.updateName(req.user.sub, data.name);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findEmail(@Req() req: any) {
    return await this.profileService.findEmail(req.user.sub);
  }
}
