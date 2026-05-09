import { Injectable } from '@nestjs/common';
import { FilmsResponseDto, FilmScheduleResponseDto } from './dto/films.dto';
import { AppRepository } from '../repository/app.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: AppRepository) {}

  async findAll(): Promise<FilmsResponseDto> {
    const films = await this.filmsRepository.findAll();

    return {
      total: films.length,
      items: films,
    };
  }

  async findScheduleById(id: string): Promise<FilmScheduleResponseDto> {
    const schedule = await this.filmsRepository.findScheduleByFilmId(id);

    return {
      total: schedule.length,
      items: schedule,
    };
  }
}
