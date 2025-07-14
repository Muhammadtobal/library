import { Book } from 'src/book/entities/book.entity';
import { MyLibrary } from 'src/my-library/entities/my-library.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('save-books')
export class SaveBook {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  book: Book;
  @ManyToOne(() => MyLibrary, { onDelete: 'CASCADE' })
  myLibrary: MyLibrary | null;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
