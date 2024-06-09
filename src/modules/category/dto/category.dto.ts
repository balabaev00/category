import { Expose } from 'class-transformer';

export class CategoryDto {
    /**
     * Идентификатор категории
     * @example '1'
     */
    @Expose()
    id!: string;

    /**
    * Уникальное название на англ. в системе
    * @example 'alias'
    */
    @Expose()
    slug!: string;

    /**
     * Название категории. Англ., кириллица
     * @example 'category-name'
     */
    @Expose()
    name!: string;

    /**
     * Описание категории. Англ., кириллица
     * @example 'Описание категории'
     */
    @Expose()
    description?: string;

    /**
     * Дата создания
     * @example '2024-06-09T06:16:00.427Z'
     */
    @Expose()
    createdDate!: Date;

    /**
    * Уникальное название на англ. в системе
    * @example true
    */
    @Expose()
    active!: boolean;
}
