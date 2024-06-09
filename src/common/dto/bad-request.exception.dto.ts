import { HttpStatus } from '@nestjs/common';

export class BadRequestExceptionDto {
    statusCode: number = HttpStatus.BAD_REQUEST;

    message!: string;

    messages!: object;

    error = 'Bad Request';
}
