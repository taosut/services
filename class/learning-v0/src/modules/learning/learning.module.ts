import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentManagerService } from '../../services/invokes/contentManager.service';
import { SubCategoryService } from '../../services/invokes/subCategory.service';
import { TrackService } from '../../services/invokes/track.service';
import { PlaylistModule } from '../playlist/playlist.module';
import { LearningController } from './learning.controller';
import { LearningDto } from './learning.dto';
import { Learning } from './learning.entity';
import { LearningService } from './learning.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Learning]),
    forwardRef(() => PlaylistModule),
  ],
  providers: [
    LearningDto,
    LearningService,
    SubCategoryService,
    TrackService,
    ContentManagerService,
  ],
  controllers: [LearningController],
  exports: [
    LearningService,
    SubCategoryService,
    TrackService,
    ContentManagerService,
  ],
})
export class LearningModule {}
