import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { MyLibraryService } from './my-library.service';
import { CreateMyLibraryDto } from './dto/create-my-library.dto';
import { UpdateMyLibraryDto } from './dto/update-my-library.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/utils/types';

@Controller('my-library')
export class MyLibraryController {
  constructor(private readonly myLibraryService: MyLibraryService) {}

  // @Post()
  // async create(@Body() createMyLibraryDto: CreateMyLibraryDto) {
  //   return await this.myLibraryService.create(createMyLibraryDto);
  // }
  @Get()
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Param() queryParam,
  ) {
    const { limit, order, allData, sortBy, ...filters } = queryParam;

    const { data, pagination } = await this.myLibraryService.findAll(
      paginationQueryDto,
      filters,
    );
    return {
      message: 'MyLibrary fetched successfully',
      success: true,
      data: data,
      pagination: pagination,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findOne(@Param('id') id: number) {
    // const role = req.user?.role;
    // console.log(role);
    // const userId = role === 'user' ? req.user.userId : id;
    const data = await this.myLibraryService.findOne(id);
    return {
      message: 'MyLibrary fetched successfully',
      success: true,
      data: data,
    };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async update(
    @Param('id') id: number,
    @Body() updateMyLibraryDto: UpdateMyLibraryDto,
  ) {
    const data = await this.myLibraryService.update(id, updateMyLibraryDto);
    return {
      message: 'MyLibrary updated successfully',
      success: true,
      data: data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async remove(@Param('id') id: number) {
    await this.myLibraryService.remove(id);
    return {
      message: 'MyLibrary deleted successfully',
      success: true,
    };
  }
}
