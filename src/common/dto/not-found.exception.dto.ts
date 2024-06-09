import { HttpStatus } from '@nestjs/common';

export class NotFoundExceptionDto {
    statusCode: number = HttpStatus.NOT_FOUND;

    message!: string;

    error = 'Not Found';
}
