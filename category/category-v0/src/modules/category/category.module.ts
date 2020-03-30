import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentInvokeService } from '../../services/invokes/content.service';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService, ContentInvokeService],
  controllers: [CategoryController],
  exports: [CategoryService, ContentInvokeService],
})
export class CategoryModule {}
