import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  const orderService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderService,
        },
      ],
    }).compile();

    controller = module.get(OrderController);
    jest.clearAllMocks();
  });

  it('creates order', async () => {
    const dto = {
      tickets: [
        {
          film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
          session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
          row: 1,
          seat: 1,
        },
      ],
    };
    const response = {
      total: 1,
      items: dto.tickets,
    };

    orderService.create.mockResolvedValue(response);

    await expect(controller.create(dto)).resolves.toBe(response);
    expect(orderService.create).toHaveBeenCalledWith(dto);
  });
});
