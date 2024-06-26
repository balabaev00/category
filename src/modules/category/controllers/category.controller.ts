import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestExceptionDto, NotFoundExceptionDto } from 'src/common/dto';

import { CategoryDto, CategoryFilterDto } from '../dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryService } from '../services/category.service';

@ApiTags('Категории')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @ApiCreatedResponse({ type: CategoryDto })
  @ApiBadRequestResponse({ type: BadRequestExceptionDto })
  create(@Body() dto: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoryService.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: CategoryDto })
  @ApiBadRequestResponse({ type: BadRequestExceptionDto })
  find(@Query() query: CategoryFilterDto): Promise<CategoryDto[]> {
    return this.categoryService.find(query);
  }

  @Get(':idOrSlug')
  @ApiOkResponse({ type: CategoryDto })
  @ApiNotFoundResponse({ type: NotFoundExceptionDto })
  findOne(@Param('idOrSlug') idOrSlug: string): Promise<CategoryDto> {
    return this.categoryService.findOneByIdOrSlug(idOrSlug);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse({ type: BadRequestExceptionDto })
  @ApiNotFoundResponse({ type: NotFoundExceptionDto })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<void> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: NotFoundExceptionDto })
  delete(@Param('id') id: string): Promise<void> {
    return this.categoryService.delete(id);
  }
}
