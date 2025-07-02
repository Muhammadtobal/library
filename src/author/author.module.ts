import { forwardRef, Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { BookModule } from 'src/book/book.module';

@Module({
  imports: [TypeOrmModule.forFeature([Author]), forwardRef(() => BookModule)],

  exports: [AuthorService],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
