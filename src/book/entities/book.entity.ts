import { Author } from 'src/author/entities/author.entity';
import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Category, (category) => category.books, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @ManyToOne(() => Author, (author) => author.books, {
    onDelete: 'CASCADE',
  })
  author: Author;
  @Column()
  size: string;
  @Column()
  language: string;
  @Column()
  Number_pages: number;
  @Column({ type: 'text', nullable: true })
  bio?: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
