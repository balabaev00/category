import type { ClassTransformOptions } from 'class-transformer';

/**
 * Дефолтный конфиг для преобразования объекта в инстанс класса
 */
export const plainToInstanceConfig: ClassTransformOptions = {
    strategy: 'excludeAll',
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
};
