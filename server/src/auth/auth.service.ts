import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string) {
    const checkUserExist = await this.prismaService.users.findFirst({
      where: { email },
    });
    if (checkUserExist) throw new ConflictException('User Already Existing');
    const hashPassword = await hash(password, 12);
    return this.prismaService.users.create({
      data: { email, password: hashPassword },
    });
  }

  async signIn(email: string, password: string, res) {
    const user = await this.prismaService.users.findFirst({
      where: { email },
    });
    if (!user) throw new NotFoundException('User Not Found');
    const unHashPassword = await compare(password, user.password);
    if (!unHashPassword)
      throw new ForbiddenException('Username & Password Incorrect');
    const payload = {
      sub: user.id,
      username: user.email,
    };
    const token = await this.jwtService.signAsync(payload);
    res.cookie('token', token, {
      secure: true,
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });
    return {
      accessToken: token,
    };
  }
}
