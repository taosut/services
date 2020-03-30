import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountInvokeService } from '../../services/account.service';
import { CertificateInvokeService } from '../../services/certificate.service';
import { ClassInvokeService } from '../../services/class.service';
import { ExamInvokeService } from '../../services/exam.service';
import { ExamQuestionInvokeService } from '../../services/examQuestion.service';
import { MembershipInvokeService } from '../../services/membership.service';
import { CompletionController } from './completion.controller';
import { Completion } from './completion.entity';
import { CompletionService } from './completion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Completion])],
  providers: [
    CompletionService,
    ClassInvokeService,
    MembershipInvokeService,
    AccountInvokeService,
    ExamInvokeService,
    ExamQuestionInvokeService,
    CertificateInvokeService,
  ],
  controllers: [CompletionController],
  exports: [CompletionService],
})
export class CompletionModule {}
