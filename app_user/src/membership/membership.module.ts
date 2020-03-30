import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { MembershipController } from './membership.controller';
import { Membership } from './membership.entity';
import { MembershipService } from './membership.service';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]), UserModule],
  providers: [MembershipService, ProductService],
  controllers: [MembershipController],
  exports: [MembershipService, ProductService],
})
export class MembershipModule {}
