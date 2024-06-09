import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { CategoryRepository } from './repositories/category.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryEntity } from './entities/category.entity';

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
