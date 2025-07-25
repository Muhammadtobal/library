import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/user/entities/user.entity';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    if ((password = '')) {
      throw new BadRequestException('pleas provide password');
    }
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    return user;
  }
}
