import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const checkAccount = await this.prismaService.users.findFirst({
      where: { id },
    });
    if (!checkAccount) throw new NotFoundException();
    const encryptPassword = await compare(
      currentPassword,
      checkAccount.password,
    );
    if (encryptPassword) {
      const hashedPassword = await hash(newPassword, 12);
      return await this.prismaService.users.update({
        where: { id },
        data: { password: hashedPassword },
      });
    }
    throw new ConflictException('Incorrect Current Password');
  }

  async updateName(id: any, name: string) {
    const checkExisting = await this.prismaService.profile.findFirst({
      where: { usersId: id },
    });
    if (checkExisting === null) {
      return await this.prismaService.profile.create({
        data: { usersId: id, name },
      });
    }

    return await this.prismaService.profile.update({
      where: { usersId: id },
      data: { name },
    });
  }

  async findEmail(id: string) {
    return await this.prismaService.users.findFirst({
      where: { id },
      select: { id: true, email: true },
    });
  }
}
