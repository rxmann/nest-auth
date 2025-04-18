import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    if (password === '')
      throw new UnauthorizedException('Please provide a valid password.');
    try {
      const user = await this.userService.verifyUser(email, password);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Could not verify the user.');
    }
  }
}
