import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto, TicketDto } from './dto/order.dto';
import { MongoFilmsRepository } from '../repository/mongo-films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: MongoFilmsRepository) {}

  async create(order: CreateOrderDto): Promise<OrderResponseDto> {
    this.validateOrder(order);

    await this.filmsRepository.reserveTickets(order.tickets);

    return {
      total: order.tickets.length,
      items: order.tickets,
    };
  }

  private validateOrder(order: CreateOrderDto): void {
    if (!order.tickets?.length) {
      throw new BadRequestException('Отсутствуют билеты в заказе');
    }

    const places = new Set<string>();

    for (const ticket of order.tickets) {
      this.validateTicket(ticket);

      const placeKey = `${ticket.film}:${ticket.session}:${ticket.row}:${ticket.seat}`;

      if (places.has(placeKey)) {
        throw new BadRequestException('Дубликат мест в заказе');
      }

      places.add(placeKey);
    }
  }

  private validateTicket(ticket: TicketDto): void {
    if (!ticket.film || !ticket.session) {
      throw new BadRequestException(
        'Фильм и сессия обязательны для каждого билета',
      );
    }

    if (!Number.isInteger(ticket.row) || ticket.row < 1) {
      throw new BadRequestException(
        'Ряд должен быть положительным целым числом',
      );
    }

    if (!Number.isInteger(ticket.seat) || ticket.seat < 1) {
      throw new BadRequestException(
        'Место должно быть положительным целым числом',
      );
    }
  }
}
