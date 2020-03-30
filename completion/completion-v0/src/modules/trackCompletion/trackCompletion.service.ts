import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TrackCompletion } from './trackCompletion.entity';

@Injectable()
export class TrackCompletionService extends TypeOrmCrudService<
  TrackCompletion
> {
  constructor(
    @InjectRepository(TrackCompletion)
    protected readonly repository: Repository<TrackCompletion>
  ) {
    super(repository);
  }
}
