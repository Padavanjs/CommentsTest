import { Inject, Injectable } from '@nestjs/common';
import { CommentModel } from 'src/models/comment.model';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: typeof CommentModel,
  ) {}
  async createComment(
    text: string,
    userId: number,
    parentId: number,
  ): Promise<CommentModel> {
    const createdAt = new Date();
    return this.commentRepository.create({
      userId,
      text,
      createdAt,
      parentId,
    });
  }
}
