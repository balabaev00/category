import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const createMongoConfig = (
    configService: ConfigService
): MongooseModuleOptions => {
    const host = configService.getOrThrow('MONGODB_HOST');
    const database = configService.getOrThrow('MONGODB_DATABASE');
    return {
        uri: `mongodb://${host}/${database}`,
        user: configService.getOrThrow('MONGODB_USER'),
        pass: configService.getOrThrow('MONGODB_PASSWORD'),
    };
};
