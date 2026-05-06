export class TicketDto {
  film: string;
  session: string;
  daytime: string;
  day: string;
  time: string;
  row: number;
  seat: number;
  price: number;
}

export class CreateOrderDto {
  tickets: TicketDto[];
}

export class OrderResponseDto {
  total: number;
  items: TicketDto[];
}
