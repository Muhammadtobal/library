import {
  Post,
  UseGuards,
  Request,
  Body,
  Controller,
  UsePipes,
  ValidationPipe,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto);

    return {
      success: true,
      message: 'User register successfully',
      data: result,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const result = await this.authService.login(req.user);
    return {
      success: true,
      message: 'success',
      data: result,
    };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin() {
    // Google redirect will happen here
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callBack')
  async googleCallBack(@Req() req, @Res() res) {
    const respons = await this.authService.login(req.user);
    res.json({
      token: respons.access_token,
    });
  }
}
