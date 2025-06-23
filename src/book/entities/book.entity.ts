import { Author } from 'src/author/entities/author.entity';
import { Category } from 'src/category/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
  @ManyToOne(() => Category, (category) => category.books, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @ManyToOne(() => Author, (author) => author.books, {
    onDelete: 'CASCADE',
  })
  author: Author;
}
