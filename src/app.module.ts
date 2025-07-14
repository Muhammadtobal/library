import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';

import { ReviewModule } from './review/review.module';
import { AuthorModule } from './author/author.module';

import AppDataSource from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MyLibraryModule } from './my-library/my-library.module';

import { SaveBookModule } from './save-book/save-book.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(AppDataSource.options),

    CategoryModule,
    BookModule,
    UserModule,

    ReviewModule,
    AuthorModule,
    AuthModule,
    MyLibraryModule,

    SaveBookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
