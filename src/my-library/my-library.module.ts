import { Module } from '@nestjs/common';
import { MyLibraryService } from './my-library.service';
import { MyLibraryController } from './my-library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyLibrary } from './entities/my-library.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([MyLibrary]), UserModule],
  controllers: [MyLibraryController],
  exports: [MyLibraryService],
  providers: [MyLibraryService],
})
export class MyLibraryModule {}
