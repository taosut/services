import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassInvokeService } from '../../services/invokes/class.service';
import { ContentInvokeService } from '../../services/invokes/content.service';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService, ContentInvokeService, ClassInvokeService],
  controllers: [CategoryController],
  exports: [CategoryService, ContentInvokeService, ClassInvokeService],
})
export class CategoryModule {}
