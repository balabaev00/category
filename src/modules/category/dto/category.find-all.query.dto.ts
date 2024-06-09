// category-filter.dto.ts

import { Expose, Transform, Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { EmptyStringToUndefined } from 'src/common/decorators/empty-string-to-undefined';

export class CategoryFilterDto {
    @EmptyStringToUndefined({ type: String })
    @IsOptional()
    @IsString()
    @Expose()
    name?: string;

    @EmptyStringToUndefined({ type: String })
    @IsOptional()
    @IsString()
    @Expose()
    description?: string;

    @Transform(({ obj }) => {
        const { active } = obj;
        if (active === '0' || active === 'false') return false;
        if (active === '1' || active === 'true') return true;
        return Boolean(active);
    })
    @IsOptional()
    @IsIn(['0', '1', 'false', 'true', false, true])
    @Expose()
    active?: boolean;

    @EmptyStringToUndefined({ type: String })
    @IsOptional()
    @IsString()
    @Expose()
    search?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Expose()
    @ApiProperty({ required: false })
    pageSize: number = 2;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Expose()
    @ApiProperty({ required: false })
    page: number = 1;

    @EmptyStringToUndefined({ type: String })
    @IsOptional()
    @IsString()
    @Expose()
    @ApiProperty({ required: false })
    sort: string = '-createdDate';
}
