import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    googleConfig: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
  ) {
    const clientID = googleConfig.clientId;
    const clientSecret = googleConfig.clientSecret;
    const callbackURL = googleConfig.callbackURL;
    if (!clientID || !clientSecret || !callbackURL) {
      throw new UnauthorizedException('Google credentials are required.');
    }
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    console.log({ profile });
    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      username: profile.name.givenName,
      password: '',
    });
    done(null, user);
  }
}
