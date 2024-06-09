import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaTypes } from 'mongoose';

@Schema({ collection: 'category' })
export class Category {
    @Prop({ required: true })
    id!: string;

    @Prop({ required: true, unique: true })
    slug!: string;

    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    description?: string;

    @Prop({ type: SchemaTypes.Types.Date, required: true, default: new Date() })
    createdDate!: Date;

    @Prop({ required: true })
    active!: boolean;
}

export type CategoryDocument = HydratedDocument<Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.clearIndexes()
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ id: 1 }, { unique: true });

export const CategoryEntity = { name: Category.name, schema: CategorySchema };
