import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { AppRepository } from '../repository/app.repository';

describe('FilmsService', () => {
  let service: FilmsService;
  const appRepository = {
    findAll: jest.fn(),
    findScheduleByFilmId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: AppRepository,
          useValue: appRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
