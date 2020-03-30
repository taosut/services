import { ApiModelProperty } from '@nestjs/swagger';

export class LearningMembershipDto {
    @ApiModelProperty({type: 'string', isArray: true})
    add_ids: string[];

    @ApiModelProperty({type: 'string', isArray: true})
    remove_ids: string[];
}

// tslint:disable-next-line: max-classes-per-file
export class LearningMembershipStatusDto {
    @ApiModelProperty({type: 'boolean'})
    has_joined: boolean;
}
