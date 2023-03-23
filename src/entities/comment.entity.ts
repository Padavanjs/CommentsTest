import { ApiProperty } from '@nestjs/swagger';

export class CommentEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  file?: { type: string; path: string };

  constructor(object: Omit<CommentEntity, 'setFile'>) {
    Object.assign(this, object);
  }

  setFile(file: { type: string; path: string }) {
    this.file = file;
  }
}
