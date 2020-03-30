import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptDetailController } from './attemptDetail.controller';
import { AttemptDetail } from './attemptDetail.entity';
import { AttemptDetailService } from './attemptDetail.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttemptDetail])],
  providers: [AttemptDetailService],
  exports: [AttemptDetailService],
  controllers: [AttemptDetailController],
})
export class AttemptDetailModule {}
