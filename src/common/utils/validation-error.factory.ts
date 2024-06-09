import { BadRequestException, HttpStatus, ValidationError } from '@nestjs/common';

type ErrorMessages = { [key: string]: string | ErrorMessages };

const getMessage = (error: ValidationError): string => {
    const [res] = Object.values(error?.constraints || {});
    return res || '';
};

const processError = (errors: ValidationError[]): ErrorMessages => {
    return errors.reduce((acc, err) => {
        return {
            [err.property]: Array.isArray(err.children) && err.children.length
                ? processError(err.children)
                : getMessage(err),
            ...acc,
        };
    }, {});
};

export const validationErrorFactory = (errors: ValidationError[]): BadRequestException => {
    const messages = processError(errors);
    return new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: getMessage(errors[0]) || '',
        messages,
        error: 'Bad Request',
    });
};

