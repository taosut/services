import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { AudioTrack } from './audioTrack.entity';

@Injectable()
export class AudioTrackService extends TypeOrmCrudService<AudioTrack> {
  constructor(
    @InjectRepository(AudioTrack)
    protected readonly repository: Repository<AudioTrack>
  ) {
    super(repository);
  }
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
