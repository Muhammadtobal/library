import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRole } from 'src/utils/types';
import { MyLibraryService } from 'src/my-library/my-library.service';
import { CreateMyLibraryDto } from 'src/my-library/dto/create-my-library.dto';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly myLibraryService: MyLibraryService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role || UserRole.User,
    });

    const savedUser = await this.userRepository.save(newUser);
    if (savedUser.role !== 'admin')
      await this.myLibraryService.create(savedUser.id);

    const { password, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }
  async validateGoogle(googleUser: CreateUserDto) {
    const getUser = await this.userRepository.findOne({
      where: { email: googleUser.email },
    });
    if (getUser) return getUser;
    return this.register(googleUser);
  }
}
