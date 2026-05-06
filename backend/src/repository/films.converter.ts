import { FilmDto, FilmScheduleDto } from '../films/dto/films.dto';
import { FilmEntity, FilmScheduleEntity } from '../films/schemas/film.schema';

export function filmEntityToDto(film: FilmEntity): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: film.tags,
    image: film.image,
    cover: film.cover,
    title: film.title,
    about: film.about,
    description: film.description,
  };
}

export function filmScheduleEntityToDto(
  schedule: FilmScheduleEntity,
): FilmScheduleDto {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: schedule.taken,
  };
}
