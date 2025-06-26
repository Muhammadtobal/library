import { Test, TestingModule } from '@nestjs/testing';
import { MyLibraryController } from './my-library.controller';
import { MyLibraryService } from './my-library.service';

describe('MyLibraryController', () => {
  let controller: MyLibraryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyLibraryController],
      providers: [MyLibraryService],
    }).compile();

    controller = module.get<MyLibraryController>(MyLibraryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
