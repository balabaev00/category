import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../entities/category.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryFilterDto, CreateCategoryDto, UpdateCategoryDto } from '../dto';

@Injectable()
export class CategoryRepository {
    constructor(
        @InjectModel(Category.name)
        private readonly categoryModel: Model<CategoryDocument>,
    ) { }

    create(dto: CreateCategoryDto): Promise<CategoryDocument> {
        return this.categoryModel.create(dto);
    }

    update(id: string, dto: UpdateCategoryDto) {
        return this.categoryModel.updateOne({ id }, dto, { upsert: false });
    }

    delete(id: string) {
        return this.categoryModel.deleteOne({ id })
    }

    async findOneByIdOrSlug(idOrSlug: string) {
        let category = await this.categoryModel.findOne({ id: idOrSlug });

        if (!category) {
            category = await this.categoryModel.findOne({ slug: idOrSlug });
        }

        return category;
    }

    async find(filterDto: CategoryFilterDto): Promise<CategoryDocument[]> {
        const { name, description, active, search, pageSize, page, sort } = filterDto;

        let filter: any = {};
        if (name) filter['name'] = { $regex: this.prepareStringToSearch(name), $options: 'i' };

        if (description) filter['description'] = {
            $regex: this.prepareStringToSearch(description),
            $options: 'i'
        };

        if (active !== undefined) filter['active'] = active;
        if (search) {
            const preparedSearch = this.prepareStringToSearch(search);

            filter = {
                $or: [
                    { 'name': { $regex: preparedSearch, $options: 'i' } },
                    { 'description': { $regex: preparedSearch, $options: 'i' } },
                ],
            }
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
