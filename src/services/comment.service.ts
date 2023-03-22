import { Inject, Injectable } from '@nestjs/common';
import { CommentModel } from 'src/models/comment.model';
import { FileModel } from 'src/models/file.model';
import { UserModel } from 'src/models/user.model';

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
    fileId: number,
  ): Promise<CommentModel> {
    const createdAt = new Date();
    return this.commentRepository.create({
      userId,
      text,
      createdAt,
      parentId,
      fileId,
    });
  }

  async getParentComments(): Promise<Array<CommentModel>> {
    return await this.commentRepository.findAll({
      where: { parentId: null },
      include: [
        {
          model: FileModel,
        },
        {
          model: UserModel,
        },
      ],
    });
  }

  async getOneComment(id: number) {
    return await this.commentRepository.findAll({
      where: { id: id },
      include: [
        {
          model: CommentModel,
          include: [
            {
              model: FileModel,
            },
            {
              model: UserModel,
            },
          ],
        },
        {
          model: FileModel,
        },
        {
          model: UserModel,
        },
      ],
    });
  }
}
