import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';
@Entity({ name: 'films' })
export class Film {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  rating: number;

  @Column()
  director: string;

  @Column('text')
  tags: string;

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column('varchar')
  about: string;

  @Column('varchar')
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[];
}
