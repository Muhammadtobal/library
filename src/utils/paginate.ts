import { BadRequestException } from '@nestjs/common';
import { Book } from 'src/book/entities/book.entity';

import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export interface ApiListResponse<T> {
  [x: string]: any;
  message: string;
  success: boolean;
  data: T[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    current_page_items_count: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
}

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  relations: string[] = [],
  page: number = 1,
  limit: number = 10,
  allData: boolean = false,
  filters: any = {},
  sort: any = {},
  message: string = 'Request successful',
): Promise<ApiListResponse<T>> {
  try {
    const limitNumber = Math.max(Number(limit) || 10, 1);
    const pageNumber = Math.max(Number(page) || 1, 1);
    const skip = (pageNumber - 1) * limitNumber;

    const alias = 'book'; // اسم الـ alias في الـ QueryBuilder

    const queryBuilder = repository.createQueryBuilder(alias);

    // join العلاقات
    relations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`${alias}.${relation}`, relation);
    });

    // بناء شروط البحث (فلتر search عام على عدة حقول)
    if (filters.search) {
      const search = `%${filters.search.toLowerCase()}%`;
      queryBuilder.andWhere(
        `(LOWER(${alias}.title) LIKE :search OR LOWER(author.name) LIKE :search OR LOWER(category.name) LIKE :search)`,
        { search },
      );
    }

    // فلاتر أخرى (مثال: category, author)
    if (filters.category) {
      queryBuilder.andWhere('LOWER(category.name) LIKE :category', {
        category: `%${filters.category()}%`,
      });
    }

    if (filters.pageNumber) {
      if (
        filters.pageNumber.gte !== undefined &&
        filters.pageNumber.lte !== undefined
      ) {
        queryBuilder.andWhere(`${alias}.pageNumber BETWEEN :gte AND :lte`, {
          gte: filters.pageNumber.gte,
          lte: filters.pageNumber.lte,
        });
      } else if (filters.pageNumber.lt !== undefined) {
        queryBuilder.andWhere(`${alias}.pageNumber < :lt`, {
          lt: filters.pageNumber.lt,
        });
      } else if (filters.pageNumber.gt !== undefined) {
        queryBuilder.andWhere(`${alias}.pageNumber > :gt`, {
          gt: filters.pageNumber.gt,
        });
      }
    }
    if (filters.language) {
      queryBuilder.andWhere('LOWER(book.language) LIKE :language', {
        language: `%${filters.language.toLowerCase()}%`,
      });
    }
    if (filters.displayType) {
      queryBuilder.andWhere('LOWER(book.displayType) LIKE :displayType', {
        displayType: `%${filters.displayType.toLowerCase()}%`,
      });
    }
    // ترتيب النتائج
    if (Object.keys(sort).length) {
      for (const [field, order] of Object.entries(sort)) {
        // مثلا: orderBy('entity.title', 'ASC')
        queryBuilder.addOrderBy(`${alias}.${field}`, order as 'ASC' | 'DESC');
      }
    } else {
      // ترتيب افتراضي
      queryBuilder.addOrderBy(`${alias}.id`, 'ASC');
    }

    // إجمالي عدد النتائج
    const totalItems = await queryBuilder.getCount();

    // Pagination
    if (!allData) {
      queryBuilder.skip(skip).take(limitNumber);
    }

    // تنفيذ الاستعلام لجلب البيانات
    const data = await queryBuilder.getMany();

    const totalPages = Math.ceil(totalItems / limitNumber);

    return {
      success: true,
      message,
      data,
      pagination: allData
        ? undefined
        : {
            current_page: pageNumber,
            total_pages: totalPages,
            total_items: totalItems,
            items_per_page: limitNumber,
            current_page_items_count: data.length,
            has_next_page: pageNumber * limitNumber < totalItems,
            has_previous_page: pageNumber > 1,
          },
    };
  } catch (error) {
    console.error(error.message);
    throw new BadRequestException(error.message);
  }
}
