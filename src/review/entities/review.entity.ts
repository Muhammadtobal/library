import { Book } from 'src/book/entities/book.entity';
import { MyLibrary } from 'src/my-library/entities/my-library.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => MyLibrary, (myLibrary) => myLibrary.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  myLibrary: MyLibrary;
  @ManyToOne(() => Book, (book) => book.reviews, { onDelete: 'CASCADE' })
  @JoinColumn()
  book: Book;
  @Column()
  description: string;
  @Column()
  star: number;
}
