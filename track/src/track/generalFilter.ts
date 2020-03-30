import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class GeneralFilter {
    @ApiModelPropertyOptional()
    track_id: string;
}

// tslint:disable-next-line: max-classes-per-file
export class MyTrackFilter extends GeneralFilter {
    @ApiModelPropertyOptional()
    has_joined: boolean;
}
