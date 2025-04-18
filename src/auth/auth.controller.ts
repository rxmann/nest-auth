import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleLogin() {
    console.log('Redirecting to Google OAuth...');
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    console.log(req);
    const response = await this.authService.login(req.user.id);
    res.redirect(`http://locahost:3001/token=${response.accessToken}`);
  }
}
