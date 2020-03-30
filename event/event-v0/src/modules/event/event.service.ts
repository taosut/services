import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
@Injectable()
export class EventService extends TypeOrmCrudService<Event> {
  constructor(
    @InjectRepository(Event)
    protected readonly repository: Repository<Event>
  ) {
    super(repository);
  }
}
