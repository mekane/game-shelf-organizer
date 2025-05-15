import { Test, TestingModule } from '@nestjs/testing';
import { AnylistService } from './anylist.service';

describe('AnylistService', () => {
  let service: AnylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnylistService],
    }).compile();

    service = module.get<AnylistService>(AnylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
