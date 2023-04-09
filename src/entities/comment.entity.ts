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
  parentId?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  file?: { type: string; path: string };

  @ApiProperty({ required: false })
  children?: Array<CommentEntity>;

  constructor(object: Omit<CommentEntity, 'setFile' | 'setChildren'>) {
    Object.assign(this, object);
  }

  setFile(file: { type: string; path: string }) {
    this.file = file;
  }

  setChildren(children: Array<CommentEntity>): void {
    this.children = children;
  }
}
