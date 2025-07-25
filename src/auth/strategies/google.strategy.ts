import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { VerifiedCallback } from 'passport-jwt';
import googleAouthConfig from 'src/config/google-aouth.config';
import { AuthService } from '../auth.service';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleAouthConfig.KEY)
    private googleConfig: ConfigType<typeof googleAouthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfig.clientID!,
      clientSecret: googleConfig.clientSecret!,
      callbackURL: googleConfig.callbackURL!,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifiedCallback,
  ) {
    const user = await this.authService.validateGoogle({
      email: profile.emails[0].value,
      name: profile.name.givenName,

      password: '',
    });
    done(null, user);
  }
}
