import { ApiProperty } from '@nestjs/swagger';
import { CommentEntity } from './comment.entity';

export class CommentsParentEntity {
  @ApiProperty()
  count: number;

  @ApiProperty()
  rows: CommentEntity[];
  constructor(count, rows) {
    this.count = count;
    this.rows = rows;
  }
}
