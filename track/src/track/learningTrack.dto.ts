import { ApiModelProperty } from '@nestjs/swagger';

export class LearningTrackDto {
    @ApiModelProperty({type: 'string', isArray: true})
    add_ids: string[];

    @ApiModelProperty({type: 'string', isArray: true})
    remove_ids: string[];
}
