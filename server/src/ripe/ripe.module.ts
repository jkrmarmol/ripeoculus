import { Module } from '@nestjs/common';
import { RipeController } from './ripe.controller';
import { RipeService } from './ripe.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [RipeService, PrismaService],
  controllers: [RipeController],
})
export class RipeModule {}
