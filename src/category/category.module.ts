import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { BookModule } from 'src/book/book.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), forwardRef(() => BookModule)],
  exports: [CategoryService],

  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
