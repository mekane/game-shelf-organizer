import { Test, TestingModule } from '@nestjs/testing';
import { AnylistController } from './anylist.controller';
import { AnylistService } from './anylist.service';

describe('AnylistController', () => {
  let controller: AnylistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnylistController],
      providers: [AnylistService],
    }).compile();

    controller = module.get<AnylistController>(AnylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
