import { Author } from 'src/author/entities/author.entity';
import { Category } from 'src/category/entities/category.entity';
import { Review } from 'src/review/entities/review.entity';
import { DisplayType } from 'src/utils/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Author, (author) => author.books, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  author: Author;
  @Column()
  size: string;
  @Column()
  language: string;
  @Column()
  Number_pages: number;
  @Column({ type: 'text', nullable: true })
  bio?: string;
  @Column({
    type: 'enum',
    enum: DisplayType,
    default: DisplayType.TO_DOWNLOAD_AND_READ,
  })
  displayType: DisplayType;
  @OneToMany(() => Review, (review) => review.book)
  reviews: Review;
  @Column({ type: 'varchar', nullable: true })
  image?: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
