import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwtstrategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { MyLibrary } from 'src/my-library/entities/my-library.entity';
import { MyLibraryModule } from 'src/my-library/my-library.module';
import { ConfigModule } from '@nestjs/config';
import googleAouthConfig from 'src/config/google-aouth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule.forFeature(googleAouthConfig),
    TypeOrmModule.forFeature([User]),
    MyLibraryModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'superSecretKey',
      signOptions: { expiresIn: '15' },
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
