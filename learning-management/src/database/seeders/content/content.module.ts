import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContentSeederService } from './content.service';
import { Content } from '../../../models/content/content.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  providers: [ContentSeederService],
  exports: [ContentSeederService],
})
export class ContentSeederModule {}
