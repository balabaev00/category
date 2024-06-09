import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryController } from './controllers/category.controller';
import { CategoryEntity } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/category.service';

@Module({
  imports: [
    MongooseModule.forFeature([CategoryEntity]),
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
  ],
})
export class CategoryModule { }
