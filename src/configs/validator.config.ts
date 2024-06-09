import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
import { validationErrorFactory } from 'src/common/utils/validation-error.factory';

export const validatorConfig: ValidationPipeOptions = {
    exceptionFactory: validationErrorFactory,
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: true,
    transformOptions: {
        exposeDefaultValues: true,
        enableImplicitConversion: true,
    },
};
