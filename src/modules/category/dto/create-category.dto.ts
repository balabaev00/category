import { Expose } from 'class-transformer';
import { IsBoolean, IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
    /**
     * Идентификатор категории
     * @example '1'
     */
    @Expose()
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    id!: string;

    /**
     * Уникальное название на англ. в системе
     * @example 'alias'
     */
    @Expose()
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    slug!: string;

    /**
     * Название категории. Англ., кириллица
     * @example 'category-name'
     */
    @Expose()
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name!: string;

    /**
     * Описание категории. Англ., кириллица
     * @example 'Описание категории'
     */
    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    /**
     * Уникальное название на англ. в системе
     * @example true
     */
    @Expose()
    @IsDefined()
    @IsBoolean()
    active!: boolean;
}
