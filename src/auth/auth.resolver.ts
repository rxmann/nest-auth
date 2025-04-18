import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { AuthPayload } from './entities/auth-payload.entity';
import { AuthService } from './auth.service';
import { GqlLocalAuthGuard } from './guards/gql-local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { SignInInput } from './dto/signin.input';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Mutation(() => AuthPayload)
  @UseGuards(GqlLocalAuthGuard)
  async loginUser(
    @Args('signInInput') signInInput: SignInInput,
    @CurrentUser() user: User,
  ) {
    console.log(user);
    return this.authService.login(user);
  }
}
