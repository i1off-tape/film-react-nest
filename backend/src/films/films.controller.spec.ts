import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  const filmsService = {
    findAll: jest.fn(),
    findScheduleById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsService,
        },
      ],
    }).compile();

    controller = module.get(FilmsController);
    jest.clearAllMocks();
  });

  it('returns films list', async () => {
    const response = {
      total: 0,
      items: [],
    };

    filmsService.findAll.mockResolvedValue(response);

    await expect(controller.findAll()).resolves.toBe(response);
    expect(filmsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('returns film schedule', async () => {
    const response = {
      total: 0,
      items: [],
    };

    filmsService.findScheduleById.mockResolvedValue(response);

    await expect(
      controller.findScheduleById('0e33c7f6-27a7-4aa0-8e61-65d7e5effecf'),
    ).resolves.toBe(response);
    expect(filmsService.findScheduleById).toHaveBeenCalledWith(
      '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
    );
  });
});
