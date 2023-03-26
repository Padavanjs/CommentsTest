import { ApiProperty } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';

export class FileUploadDto extends CreateCommentDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: any;
}
