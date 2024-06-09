import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongoConfig } from 'src/configs';

import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: createMongoConfig,
      inject: [ConfigService],
    }),
    CategoryModule,
  ],
})
export class AppModule { }
