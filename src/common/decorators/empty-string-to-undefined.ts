import { Type as ConstructorType } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { TypeHelpOptions } from 'class-transformer/types/interfaces';


type TypeProp = typeof String | typeof Number | typeof Boolean | ConstructorType;

export type EmptyStringToUndefinedParams = {
    name?: string;
    type: TypeProp;
}

export const EmptyStringToUndefined = ({ name, type }: EmptyStringToUndefinedParams): PropertyDecorator => applyPropertyDecorators(
    // @ts-expect-error @Type не ожидает получить undefined как тип (если получает undefined, значение возвращается как есть без изменений)
    (...[, propertyKey]) => Type(emptyStringToUndefined(name ?? propertyKey, type)),
    () => Transform(({ value }) => value === '' ? undefined : value),
);

const emptyStringToUndefined = (name: string, type: TypeProp) =>
    // eslint-disable-next-line @typescript-eslint/ban-types
    ({ object }: TypeHelpOptions): Function | undefined => {
        // eslint-disable-next-line no-prototype-builtins
        if (object?.hasOwnProperty(name)) {
            return object[name] === ''
                ? undefined
                : type;
        }
        return;
    };

const applyPropertyDecorators = (...decorators: ((...args: Parameters<PropertyDecorator>) => PropertyDecorator)[]): PropertyDecorator => {
    return (target, propertyKey): void => {
        for (const decorator of decorators) {
            decorator(target, propertyKey)(target, propertyKey);
        }
    };
};
