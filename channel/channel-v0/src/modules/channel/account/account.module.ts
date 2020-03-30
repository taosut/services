import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountInvokeService } from '../../../../src/services/invokes/account.service';
import { AccountController } from './Account.controller';
import { Account } from './account.entity';
import { AccountService } from './account.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountService, AccountInvokeService],
  controllers: [AccountController],
  exports: [AccountService, AccountInvokeService],
})
export class AccountModule {}
