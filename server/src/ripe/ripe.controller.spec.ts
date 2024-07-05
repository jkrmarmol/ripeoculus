import { Test, TestingModule } from '@nestjs/testing';
import { RipeController } from './ripe.controller';

describe('RipeController', () => {
  let controller: RipeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RipeController],
    }).compile();

    controller = module.get<RipeController>(RipeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
