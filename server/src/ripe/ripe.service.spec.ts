import { Test, TestingModule } from '@nestjs/testing';
import { RipeService } from './ripe.service';

describe('RipeService', () => {
  let service: RipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RipeService],
    }).compile();

    service = module.get<RipeService>(RipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
