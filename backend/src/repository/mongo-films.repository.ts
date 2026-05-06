import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FilmDocument, FilmEntity } from '../films/schemas/film.schema';
import { filmEntityToDto, filmScheduleEntityToDto } from './films.converter';
import { TicketDto } from '../order/dto/order.dto';
import { IFilmsRepository } from './films.repository';

type TicketGroup = {
  film: string;
  session: string;
  places: string[];
  maxRow: number;
  maxSeat: number;
};

@Injectable()
export class MongoFilmsRepository implements IFilmsRepository {
  constructor(
    @InjectModel(FilmEntity.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll() {
    const films = await this.filmModel.find().lean<FilmEntity[]>().exec();

    return films.map(filmEntityToDto);
  }

  async findScheduleByFilmId(id: string) {
    const film = await this.filmModel.findOne({ id }).lean<FilmEntity>().exec();

    if (!film) {
      return [];
    }

    return film.schedule.map(filmScheduleEntityToDto);
  }

  async reserveTickets(tickets: TicketDto[]): Promise<void> {
    const groups = this.groupTicketsBySession(tickets);

    for (const group of groups) {
      const result = await this.filmModel
        .updateOne(
          {
            id: group.film,
            schedule: {
              $elemMatch: {
                id: group.session,
                rows: { $gte: group.maxRow },
                seats: { $gte: group.maxSeat },
                taken: { $nin: group.places },
              },
            },
          },
          {
            $addToSet: {
              'schedule.$.taken': {
                $each: group.places,
              },
            },
          },
        )
        .exec();

      if (result.modifiedCount !== 1) {
        throw new ConflictException(
          'Место уже занято или сессия не существует',
        );
      }
    }
  }

  private groupTicketsBySession(tickets: TicketDto[]): TicketGroup[] {
    const groups = new Map<string, TicketGroup>();

    for (const ticket of tickets) {
      const key = `${ticket.film}:${ticket.session}`;
      const place = `${ticket.row}:${ticket.seat}`;
      const group = groups.get(key);

      if (!group) {
        groups.set(key, {
          film: ticket.film,
          session: ticket.session,
          places: [place],
          maxRow: ticket.row,
          maxSeat: ticket.seat,
        });
        continue;
      }

      if (group.places.includes(place)) {
        throw new BadRequestException('Дубликат мест в заказе');
      }

      group.places.push(place);
      group.maxRow = Math.max(group.maxRow, ticket.row);
      group.maxSeat = Math.max(group.maxSeat, ticket.seat);
    }

    return [...groups.values()];
  }
}
