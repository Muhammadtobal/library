import { forwardRef, Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MyLibraryModule } from 'src/my-library/my-library.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';

import { BookModule } from 'src/book/book.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    forwardRef(() => BookModule),
    MyLibraryModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
