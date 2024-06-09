import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, HttpStatus } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryDto, CategoryFilterDto } from '../dto';
import { BadRequestExceptionDto, NotFoundExceptionDto } from 'src/common/dto';

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
  find(@Query() query: CategoryFilterDto) {
    return this.categoryService.find(query);
  }

  @Get(':idOrSlug')
  @ApiOkResponse({ type: CategoryDto })
  @ApiNotFoundResponse({ type: NotFoundExceptionDto })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.categoryService.findOneByIdOrSlug(idOrSlug);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse({ type: BadRequestExceptionDto })
  @ApiNotFoundResponse({ type: NotFoundExceptionDto })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: NotFoundExceptionDto })
  delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
