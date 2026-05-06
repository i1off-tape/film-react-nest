import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FilmEntity, FilmSchema } from '../films/schemas/film.schema';
import { MongoFilmsRepository } from './mongo-films.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FilmEntity.name,
        schema: FilmSchema,
      },
    ]),
  ],
  providers: [MongoFilmsRepository],
  exports: [MongoFilmsRepository],
})
export class RepositoryModule {}
