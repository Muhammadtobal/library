import { config } from 'dotenv';
import { Author } from 'src/author/entities/author.entity';
import { Book } from 'src/book/entities/book.entity';
import { Category } from 'src/category/entities/category.entity';
import { MyLibrary } from 'src/my-library/entities/my-library.entity';
import { Review } from 'src/review/entities/review.entity';
import { SaveBook } from 'src/save-book/entities/save-book.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
config();

const isCompiled = __dirname.includes('dist');
const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Category, Author, Book, User, MyLibrary, Review, SaveBook],
  migrations: [isCompiled ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],

  synchronize: false,
  logging: false,
});

export default AppDataSource;
