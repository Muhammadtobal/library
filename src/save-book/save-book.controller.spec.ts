import { Test, TestingModule } from '@nestjs/testing';
import { SaveBookController } from './save-book.controller';
import { SaveBookService } from './save-book.service';

describe('SaveBookController', () => {
  let controller: SaveBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaveBookController],
      providers: [SaveBookService],
    }).compile();

    controller = module.get<SaveBookController>(SaveBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
