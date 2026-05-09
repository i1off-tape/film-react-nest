import { RepositoryErrorCode, RepositoryError } from './repository.errors';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { filmEntityToDto, scheduleEntityToDto } from './films.converter';
import { TicketDto } from '../order/dto/order.dto';
import { IFilmsRepository } from './films.repository';
import { InjectRepository } from '@nestjs/typeorm';

type TicketGroup = {
  film: string;
  session: string;
  places: string[];
  maxRow: number;
  maxSeat: number;
};

@Injectable()
export class AppRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll() {
    const films = await this.filmRepository.find({
      order: { title: 'ASC' },
    });

    return films.map(filmEntityToDto);
  }

  async findScheduleByFilmId(id: string) {
    const schedules = await this.scheduleRepository.find({
      where: { filmId: id },
      order: { daytime: 'ASC' },
    });

    return schedules.map(scheduleEntityToDto);
  }

  async reserveTickets(tickets: TicketDto[]): Promise<void> {
    const groups = this.groupTicketsBySession(tickets);
    const queryRunner =
      this.scheduleRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const group of groups) {
        const schedule = await queryRunner.manager.findOne(Schedule, {
          where: {
            id: group.session,
            filmId: group.film,
          },
          lock: { mode: 'pessimistic_write' },
        });
        if (!schedule) {
          throw new RepositoryError(
            RepositoryErrorCode.SessionNotFound,
            'Сессия не существует',
          );
        }

        const alreadyTaken = group.places.some((place) =>
          schedule.taken.includes(place),
        );

        if (alreadyTaken) {
          throw new RepositoryError(
            RepositoryErrorCode.SeatAlreadyTaken,
            'Одно или несколько мест уже заняты',
          );
        }

        schedule.taken = [...schedule.taken, ...group.places];

        await queryRunner.manager.save(schedule);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
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
        throw new RepositoryError(
          RepositoryErrorCode.DuplicateSeatInOrder,
          'Дубликат мест в заказе',
        );
      }

      group.places.push(place);
      group.maxRow = Math.max(group.maxRow, ticket.row);
      group.maxSeat = Math.max(group.maxSeat, ticket.seat);
    }

    return [...groups.values()];
  }
}
