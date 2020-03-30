import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EbookController } from './ebook.controller';
import { Ebook } from './ebook.entity';
import { EbookService } from './ebook.service';
@Module({
  imports: [TypeOrmModule.forFeature([Ebook])],
  providers: [EbookService],
  controllers: [EbookController],
  exports: [EbookService],
})
export class EbookModule {}
