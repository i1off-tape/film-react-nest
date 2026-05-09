import { FilmDto, FilmScheduleDto } from '../films/dto/films.dto';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

export function filmEntityToDto(film: Film): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: film.tags ? [film.tags] : [],
    image: film.image,
    cover: film.cover,
    title: film.title,
    about: film.about,
    description: film.description,
  };
}

export function scheduleEntityToDto(schedule: Schedule): FilmScheduleDto {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: schedule.taken ? schedule.taken.split(',').filter(Boolean) : [],
  };
}
