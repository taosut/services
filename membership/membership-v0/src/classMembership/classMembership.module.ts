import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassMembershipController } from './classMembership.controller';
import { ClassMembership } from './classMembership.entity';
import { ClassMembershipService } from './classMembership.service';
@Module({
  imports: [TypeOrmModule.forFeature([ClassMembership])],
  providers: [ClassMembershipService],
  controllers: [ClassMembershipController],
  exports: [ClassMembershipService],
})
export class ClassMembershipModule {}
