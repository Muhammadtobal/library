import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class MyLibrary {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User, (user) => user.myLibrary)
  @JoinColumn()
  user: User;
  @OneToMany(() => Review, (review) => review.myLibrary)
  reviews: Review;
}
