import { FilmDto, FilmScheduleDto } from '../films/dto/films.dto';
import { TicketDto } from '../order/dto/order.dto';

export interface IFilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findScheduleByFilmId(id: string): Promise<FilmScheduleDto[]>;
  reserveTickets(tickets: TicketDto[]): Promise<void>;
}
