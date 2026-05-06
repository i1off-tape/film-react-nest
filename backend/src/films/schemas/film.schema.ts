import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FilmDocument = HydratedDocument<FilmEntity>;

@Schema({ _id: false })
export class FilmScheduleEntity {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  daytime: string;
  @Prop({ required: true })
  hall: number;
  @Prop({ required: true })
  rows: number;
  @Prop({ required: true })
  seats: number;
  @Prop({ required: true })
  price: number;
  @Prop({ type: [String], default: [] })
  taken: string[];
}

export const FilmScheduleSchema =
  SchemaFactory.createForClass(FilmScheduleEntity);

@Schema({
  collection: 'films',
  versionKey: false,
})
export class FilmEntity {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  cover: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  about: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [FilmScheduleSchema], default: [] })
  schedule: FilmScheduleEntity[];
}

export const FilmSchema = SchemaFactory.createForClass(FilmEntity);
