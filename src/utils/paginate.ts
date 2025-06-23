import { BadRequestException } from '@nestjs/common';
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
  filter: FindOptionsWhere<T> = {},
  sort: any = {},
  message: string = 'Request successful',
): Promise<ApiListResponse<T>> {
  try {
    const limitNumber = Math.max(Number(limit) || 10, 1);
    const pageNumber = Math.max(Number(page) || 1, 1);
    const skip = (pageNumber - 1) * limitNumber;
    console.log(
      `TypeORM Query Params: skip=${skip}, limit=${limitNumber}, allData=${allData}`,
    );
    const totalItems = await repository.count({ where: filter });
    const findOptions: FindManyOptions<T> = {
      where: filter,
      relations: relations,
      order: sort,
    };
    if (!allData) {
      findOptions.skip = skip;
      findOptions.take = limitNumber;
    }
    const data = await repository.find(findOptions);

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
