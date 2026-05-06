import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsResponseDto, FilmScheduleResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll(): Promise<FilmsResponseDto> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  findScheduleById(@Param('id') id: string): Promise<FilmScheduleResponseDto> {
    return this.filmsService.findScheduleById(id);
  }
}
