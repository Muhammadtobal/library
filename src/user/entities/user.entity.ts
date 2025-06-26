import { MyLibrary } from 'src/my-library/entities/my-library.entity';
import { UserRole } from 'src/utils/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;
  @OneToOne(() => MyLibrary, (myLibrary) => myLibrary.user, {
    onDelete: 'CASCADE',
  })
  myLibrary: MyLibrary;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
