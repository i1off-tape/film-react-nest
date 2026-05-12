import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { AppRepository } from '../repository/app.repository';

describe('OrderService', () => {
  let service: OrderService;
  const appRepository = {
    reserveTickets: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: AppRepository,
          useValue: appRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
