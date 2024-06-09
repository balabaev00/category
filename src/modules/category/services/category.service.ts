import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryRepository } from '../repositories/category.repository';
import { plainToInstance } from 'class-transformer';
import { CategoryDto, CategoryFilterDto } from '../dto';
import { plainToInstanceConfig } from 'src/configs';
import { CATEGORY_NOT_FOUND_TEXT, MONGO_DUBLICATE_VALUE_CODE } from '../constants';
import { MongoServerError } from 'mongodb';

@Injectable()
export class CategoryService {

  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) { }

  async create(dto: CreateCategoryDto) {
    try {
      const result = await this.categoryRepository.create(dto);

      return plainToInstance(
        CategoryDto,
        result,
        plainToInstanceConfig,
      )
    } catch (error) {
      if (error instanceof MongoServerError && error.errorResponse.code === MONGO_DUBLICATE_VALUE_CODE) {
        throw new BadRequestException('Необходимо соблюдать уникальность полей');
      }
      throw error;
    }

  }

  async find(filterDto: CategoryFilterDto) {
    const categories = await this.categoryRepository.find(filterDto);

    return plainToInstance(
      CategoryDto,
      categories,
      plainToInstanceConfig,
    )
  }

  async findOneByIdOrSlug(idOrSlug: string) {
    const result = await this.categoryRepository.findOneByIdOrSlug(idOrSlug);

    if (!result) {
      throw new NotFoundException(CATEGORY_NOT_FOUND_TEXT);
    }

    return plainToInstance(
      CategoryDto,
      result,
      plainToInstanceConfig,
    )
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const updateResult = await this.categoryRepository.update(id, dto);

    if (!updateResult.modifiedCount) {
      throw new NotFoundException(CATEGORY_NOT_FOUND_TEXT);
    }
  }

  async delete(id: string) {
    const deletedResult = await this.categoryRepository.delete(id);

    if (!deletedResult.deletedCount) {
      throw new NotFoundException(CATEGORY_NOT_FOUND_TEXT);
    }
  }
}
