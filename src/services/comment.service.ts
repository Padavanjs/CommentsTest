import { Inject, Injectable } from '@nestjs/common';
import { OrderItem } from 'sequelize';
import { CommentModel } from 'src/models/comment.model';
import { FileModel } from 'src/models/file.model';
import { UserModel } from 'src/models/user.model';
import { cleaningText } from 'src/utils/customValidator';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: typeof CommentModel,
  ) {}
  async createComment(
    filthyText: string,
    userId: number,
    parentId: number,
    fileId?: number,
  ): Promise<CommentModel> {
    const text = cleaningText(filthyText);
    return this.commentRepository.create({
      userId,
      text,
      parentId,
      fileId,
      createdAt: new Date(),
    });
  }

  async getParentComments(
    page = 1,
    sortKey?: string,
    sortDir?: string,
  ): Promise<{ rows: CommentModel[]; count: number }> {
    const limit = 25;
    const offset = page * limit - limit;

    let orderCondition: OrderItem =
      sortKey && sortDir ? [sortKey, sortDir] : undefined;

    if (sortKey === 'username' || sortKey === 'email') {
      orderCondition.unshift('user');
    }

    return this.commentRepository.findAndCountAll({
      limit,
      offset,
      where: { parentId: null },
      include: [
        {
          model: FileModel,
          as: 'file',
        },
        {
          model: UserModel,
          as: 'user',
        },
      ],
      order: orderCondition ? [orderCondition] : [],
    });
  }

  async getCommentByIdWithChildren(id: number): Promise<CommentModel[]> {
    return this.commentRepository.findAll({
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
