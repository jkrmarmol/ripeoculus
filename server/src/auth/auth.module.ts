import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/utils/constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1hr' },
    }),
  ],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
