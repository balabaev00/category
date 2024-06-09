import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { MONGOOSE_MODULE_OPTIONS } from '@nestjs/mongoose/dist/mongoose.constants';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { validatorConfig } from 'src/configs/validator.config';
import { AppModule } from 'src/modules/app.module';

import * as request from 'supertest';

export class TestContext {

    private _app?: NestApplication;

    private _inMemoryMongo?: MongoMemoryServer;

    get request() {
        return request(this.app.getHttpServer());
    }


    get app(): NestApplication {
        if (!this._app) {
            throw new RuntimeException('Application context was not initialized');
        }
        return this._app;
    }

    getModel<T>(model: string): Model<T> {
        return this.app.get(getModelToken(model));
    }

    async initInMemoryMongo(): Promise<string> {
        this._inMemoryMongo = await MongoMemoryServer.create();
        return this._inMemoryMongo.getUri();
    }

    async init(): Promise<void> {
        const mongoUri = await this.initInMemoryMongo();

        const module = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(MONGOOSE_MODULE_OPTIONS)
            .useValue({ uri: mongoUri })
            .compile();

        const app = module.createNestApplication<NestApplication>();

        app.useGlobalPipes(new ValidationPipe(validatorConfig));

        await app.init();
        this._app = app;
    }

    async close(): Promise<void> {
        await this._inMemoryMongo?.stop({ doCleanup: true, force: true });
        await this.app.close();
    }

    async clearDatabase(): Promise<void> {
        try {
            const collections = await this.app.get(getConnectionToken()).db.collections();

            for (const collection of collections) {
                await collection.deleteMany({});
            }

        } catch (err) {
            throw err;
        }
    }

}


