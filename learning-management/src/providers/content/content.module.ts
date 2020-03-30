import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { Content } from '../../models/content/content.entity';
import { ContentController } from '../../controllers/content/content.controller';
import { ContentAttachmentModule } from '../contentattachment/contentattachment.module';
import { LessonModule } from '../lesson/lesson.module';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Content]), ContentAttachmentModule, LessonModule],
  providers: [ContentService],
  controllers: [ContentController],
  exports: [ContentService],
})
export class ContentModule {}