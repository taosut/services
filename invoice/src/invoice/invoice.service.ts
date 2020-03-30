import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoiceService extends TypeOrmCrudService<Invoice> {
  constructor(
    @InjectRepository(Invoice)
    protected readonly repository: Repository<Invoice>,
  ) {
    super(repository);
  }
}
