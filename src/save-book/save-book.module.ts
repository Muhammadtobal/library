import { Module } from '@nestjs/common';
import { SaveBookService } from './save-book.service';
import { SaveBookController } from './save-book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaveBook } from './entities/save-book.entity';
import { MyLibraryModule } from 'src/my-library/my-library.module';
import { BookModule } from 'src/book/book.module';

@Module({
  imports: [TypeOrmModule.forFeature([SaveBook]), MyLibraryModule, BookModule],
  controllers: [SaveBookController],
  providers: [SaveBookService],
})
export class SaveBookModule {}
