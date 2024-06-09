import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoryFilterDto, CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { Category, CategoryDocument } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
    constructor(
        @InjectModel(Category.name)
        private readonly categoryModel: Model<CategoryDocument>,
    ) { }

    create(dto: CreateCategoryDto): Promise<CategoryDocument> {
        return this.categoryModel.create(dto);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    update(id: string, dto: UpdateCategoryDto) {
        return this.categoryModel.updateOne({ id }, dto, { upsert: false });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    delete(id: string) {
        return this.categoryModel.deleteOne({ id });
    }

    async findOneByIdOrSlug(idOrSlug: string): Promise<CategoryDocument | null> {
        let category = await this.categoryModel.findOne({ id: idOrSlug });

        if (!category) {
            category = await this.categoryModel.findOne({ slug: idOrSlug });
        }

        return category;
    }

    find(filterDto: CategoryFilterDto): Promise<CategoryDocument[]> {
        const { name, description, active, search, pageSize, page, sort } = filterDto;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let filter: any = {};
        if (name) {
            filter['name'] = { $regex: this.prepareStringToSearch(name), $options: 'i' };
        }

        if (description) {
            filter['description'] = {
                $regex: this.prepareStringToSearch(description),
                $options: 'i',
            };
        }

        if (active !== undefined) {
            filter['active'] = active;
        }
        if (search) {
            const preparedSearch = this.prepareStringToSearch(search);

            filter = {
                $or: [
                    { 'name': { $regex: preparedSearch, $options: 'i' } },
                    { 'description': { $regex: preparedSearch, $options: 'i' } },
                ],
            };
        }

        return this.categoryModel
            .find(filter)
            .sort(sort)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec();
    }

    prepareStringToSearch(str: string): string {
        return str
            .toLowerCase()
            .replace(/е/g, '[её]')
            .replace(/Е/g, '[ЕЁ]');
    }
}
