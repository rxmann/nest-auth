import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwt-payload.type';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async generateAccessToken(user: User) {
    const payload: AuthJwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async login(user: User) {
    const { accessToken } = await this.generateAccessToken(user);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken,
    };
  }

  async validateJwtUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const currentUser = { id: user.id };
    return currentUser;
  }
}
