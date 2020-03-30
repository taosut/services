import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentController } from './content.controller';
import { Content } from './content.entity';
import { ContentService } from './content.service';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  providers: [ContentService, FileService],
  controllers: [ContentController],
  exports: [ContentService, FileService],
})
export class ContentModule {}
