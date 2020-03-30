import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContentAttachmentSeederService } from './contentattachment.service';
import { ContentAttachment } from '../../../models/contentattachment/contentattachment.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([ContentAttachment])],
  providers: [ContentAttachmentSeederService],
  exports: [ContentAttachmentSeederService],
})
export class ContentAttachmentSeederModule {}
