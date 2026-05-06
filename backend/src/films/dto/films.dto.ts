//TODO описать DTO для запросов к /films
export class FilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
}

export class FilmsResponseDto {
  total: number;
  items: FilmDto[];
}

export class FilmScheduleDto {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class FilmScheduleResponseDto {
  total: number;
  items: FilmScheduleDto[];
}
