import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { RipeController } from './ripe/ripe.controller';
import { RipeService } from './ripe/ripe.service';
import { RipeModule } from './ripe/ripe.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [PrismaModule, AuthModule, RipeModule, ProfileModule],
  controllers: [AppController, DashboardController, RipeController],
  providers: [AppService, RipeService],
})
export class AppModule {}
