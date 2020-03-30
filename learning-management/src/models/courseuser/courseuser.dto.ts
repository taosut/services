import { ApiModelProperty } from "@nestjs/swagger";

export class CreateCourseUserDto {
  @ApiModelProperty({required: false, type: 'string'})
  readonly id: string;
  @ApiModelProperty({required: true, type: 'string'})
  readonly course_id: string;
  @ApiModelProperty({required: true, type: 'string'})
  readonly user_id: string;
  @ApiModelProperty({required: true, type: 'boolean'})
  readonly has_joined: boolean;
}

export class UpdateCourseUserDto {
  @ApiModelProperty({required: false, type: [String], isArray: true, description: 'The UserId list that will be added', example: ['7463ed58-285a-420e-a1a2-5db0668d2116', '9723b0a6-d649-48cb-af07-f1eb85301b1f']})
  readonly add_member: String[];
  @ApiModelProperty({required: false, type: [String], isArray: true, description: 'The UserId list that will be removed', example: ['4fa7b91e-9986-4397-970b-59eb1672e04b', '20459f79-da02-42d4-8518-fc3419a1f892']})
  readonly remove_member: String[];
}