import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RipeService } from './ripe.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ripe')
export class RipeController {
  constructor(private ripeService: RipeService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    return await this.ripeService.create(req.user.sub, file);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    return await this.ripeService.findAll(req.user.sub);
  }
}
