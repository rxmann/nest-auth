import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwt-payload.type';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
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
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const currentUser = { id: user.id, email };
    return currentUser;
  }

  async validateGoogleUser(googleUser: CreateUserInput) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.create(googleUser);
  }
}
