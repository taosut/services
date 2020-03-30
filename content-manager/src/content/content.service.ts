import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Content } from './content.entity';
import { FileService } from './file.service';
import { IContent } from './interfaces/content.interface';

@Injectable()
export class ContentService extends TypeOrmCrudService<Content> {
  constructor(
    @InjectRepository(Content)
    protected readonly repository: Repository<Content>,
    private readonly fileService: FileService
  ) {
    super(repository);
  }

  async create(dto: IContent): Promise<Content> {
    const entity = await this.repository.create(dto);
    const response = await this.repository.save(entity);

    return response;
  }

  async deleteOne(req: CrudRequest): Promise<void | Content> {
    if (req.parsed.paramsFilter && req.parsed.paramsFilter[0].field === 'id') {
      const content = await this.repository.findOne(
        req.parsed.paramsFilter[0].value
      );

      if (content.path) {
        await this.fileService.delete(content.path);
      }
    }

    super.deleteOne(req);
  }

  async update(id: string, dto: IContent): Promise<Content> {
    const entity = await this.repository.create(dto);

    entity.id = id;

    const response = await this.repository.save(entity);

    return response;
  }
}
