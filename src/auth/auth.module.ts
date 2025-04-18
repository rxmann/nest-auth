import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import googleOauthConfig from './config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    ConfigModule.forFeature(googleOauthConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_SECRET_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    AuthResolver,
  ],
})
export class AuthModule {}
