import { Book } from 'src/book/entities/book.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'date', nullable: true })
  birth_date?: Date;

  @Column({ type: 'date', nullable: true })
  death_date?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality?: string;

  @Column('simple-array', { nullable: true })
  genres?: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  language?: string;

  @Column('simple-array', { nullable: true })
  awards?: string[];
  @OneToMany(() => Book, (book) => book.author)
  books: Book;
  @Column({ type: 'varchar', nullable: true })
  image?: string;
  @Column()
  created_at: Date;
  @Column()
  updated_at: Date;
}
