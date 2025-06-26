import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { CategoryModule } from 'src/category/category.module';

import { AuthorModule } from 'src/author/author.module';
import { Category } from 'src/category/entities/category.entity';
import { Author } from 'src/author/entities/author.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Category, Author]),
    CategoryModule,
    AuthorModule,
  ],
  controllers: [BookController],
  exports: [BookService],
  providers: [BookService],
})
export class BookModule {}
